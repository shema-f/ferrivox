/* Newsletter verification: footer form presence + interaction + FAB clearance. */
const fs = require("fs")
const path = require("path")
const os = require("os")
const { spawn, execSync } = require("child_process")

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
const BASE = "http://localhost:8443"
const OUT_DIR = path.join(__dirname, "..", "verify-shots")
const PROFILE_DIR = path.join(os.tmpdir(), "ferrivox-verify-profile")
const SEND_TIMEOUT_MS = 10000

class CDP {
  constructor(ws) {
    this.ws = ws
    this.id = 0
    this.pending = new Map()
    this.events = []
    ws.addEventListener("message", (ev) => {
      const msg = JSON.parse(ev.data)
      if (msg.id && this.pending.has(msg.id)) {
        const { resolve, reject } = this.pending.get(msg.id)
        this.pending.delete(msg.id)
        if (msg.error) reject(new Error(JSON.stringify(msg.error)))
        else resolve(msg.result)
      } else if (msg.method) {
        this.events.push(msg)
      }
    })
    ws.addEventListener("close", () => {
      for (const { reject } of this.pending.values()) {
        reject(new Error("ws closed"))
      }
      this.pending.clear()
    })
  }
  send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(
        () => reject(new Error("send timeout: " + method)),
        SEND_TIMEOUT_MS
      )
      const id = ++this.id
      this.pending.set(id, {
        resolve: (v) => {
          clearTimeout(timer)
          resolve(v)
        },
        reject: (e) => {
          clearTimeout(timer)
          reject(e)
        },
      })
      this.ws.send(JSON.stringify({ id, method, params }))
    })
  }
  close() {
    try {
      this.ws.close()
    } catch {}
  }
}

function connectDebugger(url) {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(url)
    const timer = setTimeout(() => {
      try {
        ws.close()
      } catch {}
      reject(new Error("ws connect timeout"))
    }, 5000)
    ws.addEventListener("open", () => {
      clearTimeout(timer)
      resolve(new CDP(ws))
    })
    ws.addEventListener("error", () => {
      clearTimeout(timer)
      reject(new Error("ws connect error"))
    })
  })
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function evalSafe(cdp, expression, timeoutMs = 15000) {
  try {
    return await Promise.race([
      cdp.send("Runtime.evaluate", { expression, returnByValue: true }),
      sleep(timeoutMs).then(() => null),
    ])
  } catch {
    return null
  }
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true })

  const chrome = spawn(CHROME, [
    "--headless=new",
    "--remote-debugging-port=9224",
    "--no-first-run",
    "--no-default-browser-check",
    "--disable-gpu",
    "--window-size=1280,800",
    "--user-data-dir=" + PROFILE_DIR,
    "about:blank",
  ])
  chrome.on("error", (e) => {
    console.error("CHROME_SPAWN_ERROR", e.message)
    process.exit(2)
  })
  const killChromeTree = () => {
    try {
      if (process.platform === "win32" && chrome.pid) {
        execSync(`taskkill /F /T /PID ${chrome.pid}`, { stdio: "ignore" })
      } else {
        chrome.kill("SIGKILL")
      }
    } catch {}
  }

  let up = false
  for (let i = 0; i < 30; i++) {
    try {
      await fetch("http://127.0.0.1:9224/json/version")
      up = true
      break
    } catch {
      await sleep(500)
    }
  }
  if (!up) {
    console.error("DEVTOOLS_ENDPOINT_NEVER_OPENED")
    killChromeTree()
    process.exit(2)
  }

  let cdp = null
  let targetId = null
  let failures = 0

  try {
    const target = await fetch("http://127.0.0.1:9224/json/new?about:blank", {
      method: "PUT",
    }).then((r) => r.json())
    targetId = target.id
    cdp = await connectDebugger(target.webSocketDebuggerUrl)

    await cdp.send("Runtime.enable")
    await cdp.send("Page.enable")
    await cdp.send("Page.addScriptToEvaluateOnNewDocument", {
      source: `
        window.__vf = { errors: [], rejections: [] };
        window.addEventListener("error", (e) => window.__vf.errors.push(e.message));
        window.addEventListener("unhandledrejection", (e) =>
          window.__vf.rejections.push(String(e.reason && e.reason.message || e.reason)));
      `,
    })

    await cdp.send("Page.navigate", { url: `${BASE}/?scene=hq` })

    // Wait for React mount
    for (let i = 0; i < 60; i++) {
      await sleep(500)
      const r = await evalSafe(
        cdp,
        `document.getElementById("root")?.children.length || 0`
      )
      if (r && r.result.value > 0) break
    }
    await sleep(3500)

    // 1. Structure checks
    const check = await evalSafe(
      cdp,
      `(() => {
        const text = document.body.innerText || "";
        const input = document.querySelector('footer input[type="email"]');
        const btns = [...document.querySelectorAll("footer button")];
        const subBtn = btns.find((b) => /subscribe/i.test(b.textContent || ""));
        const fab = document.querySelector(".fixed.bottom-\\\\48 button, .fixed[class*='bottom-'] button");
        const fabRect = fab ? fab.getBoundingClientRect() : null;
        const footer = document.querySelector("footer");
        const footTop = footer ? footer.getBoundingClientRect().top : null;
        return JSON.stringify({
          hasDispatch: text.includes("Ferrivox Dispatch"),
          hasBlurb: text.includes("Engineering notes"),
          hasInput: !!input,
          hasSubscribeBtn: !!subBtn,
          fabAboveFooter: fabRect && footTop ? fabRect.bottom <= footTop : null,
          fabBottom: fabRect ? Math.round(fabRect.bottom) : null,
          footTop: footTop ? Math.round(footTop) : null,
          errors: window.__vf.errors,
          rejections: window.__vf.rejections,
        });
      })()`
    )
    const c = JSON.parse(check.result.value)
    const cPass =
      c.hasDispatch && c.hasBlurb && c.hasInput && c.hasSubscribeBtn &&
      c.fabAboveFooter && c.errors.length === 0 && c.rejections.length === 0
    console.log(
      `${cPass ? "PASS" : "FAIL"}  structure   dispatch=${c.hasDispatch} blurb=${c.hasBlurb} input=${c.hasInput} btn=${c.hasSubscribeBtn} fabClearsFooter=${c.fabAboveFooter} (fabBottom=${c.fabBottom}, footerTop=${c.footTop}) errors=${c.errors.length + c.rejections.length}`
    )
    if (!cPass) failures++

    // 2. Interaction: type an email and click Subscribe
    await evalSafe(
      cdp,
      `(() => {
        const input = document.querySelector('footer input[type="email"]');
        const setter = Object.getOwnPropertyDescriptor(
          window.HTMLInputElement.prototype, "value"
        ).set;
        setter.call(input, "reader@example.com");
        input.dispatchEvent(new Event("input", { bubbles: true }));
        return true;
      })()`
    )
    await evalSafe(
      cdp,
      `(() => {
        const btns = [...document.querySelectorAll("footer button")];
        const subBtn = btns.find((b) => /subscribe/i.test(b.textContent || ""));
        if (subBtn) subBtn.click();
        return !!subBtn;
      })()`
    )
    await sleep(2500)

    const after = await evalSafe(
      cdp,
      `(() => {
        const text = document.body.innerText || "";
        return JSON.stringify({
          feedbackShown: text.includes("Welcome aboard") ||
            text.includes("already subscribed") ||
            text.includes("Something went wrong") ||
            text.includes("Network error") ||
            text.includes("Backend not configured"),
          inputVal: (document.querySelector('footer input[type="email"]') || {}).value || "",
          errors: window.__vf.errors,
          rejections: window.__vf.rejections,
        });
      })()`
    )
    const a = JSON.parse(after.result.value)
    // Any controlled feedback counts — the exact message depends on whether
    // Supabase is reachable from this environment.
    const aPass = a.feedbackShown && a.errors.length === 0 && a.rejections.length === 0
    console.log(
      `${aPass ? "PASS" : "FAIL"}  interaction feedback=${a.feedbackShown} inputKept="${a.inputVal}" errors=${a.errors.length + a.rejections.length}`
    )
    if (!aPass) failures++

    // Screenshot for eyeballing
    await evalSafe(
      cdp,
      `new Promise((res) => requestAnimationFrame(() =>
         requestAnimationFrame(() => res(true))))`,
      8000
    )
    const shot = await Promise.race([
      cdp.send("Page.captureScreenshot", { format: "png" }),
      sleep(8000).then(() => null),
    ])
    if (shot) {
      fs.writeFileSync(
        path.join(OUT_DIR, "footer-newsletter.png"),
        Buffer.from(shot.data, "base64")
      )
      console.log("shot: verify-shots/footer-newsletter.png")
    }
  } finally {
    if (cdp) cdp.close()
    if (targetId) {
      await fetch(`http://127.0.0.1:9224/json/close/${targetId}`).catch(() => {})
    }
    killChromeTree()
  }

  console.log("――――――――――――――――")
  console.log(failures === 0 ? "NEWSLETTER OK" : `${failures} check(s) FAILED`)
  process.exit(failures ? 1 : 0)
}

main().catch((e) => {
  console.error("FATAL", e)
  process.exit(2)
})
