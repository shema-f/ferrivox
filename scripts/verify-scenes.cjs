/* Headless-Chrome verification: drive ?scene=<id> through all 9 scenes.
 * v3: software GL, double-rAF before capture, hard timeouts on every send. */
const fs = require("fs")
const path = require("path")
const os = require("os")
const { spawn, execSync } = require("child_process")

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
const BASE = "http://localhost:8443"
const OUT_DIR = path.join(__dirname, "..", "verify-shots")
// Profile MUST live outside the project — Vite's watcher otherwise sees
// Chrome writing cache/extension files and reloads the page mid-verification.
const PROFILE_DIR = path.join(os.tmpdir(), "ferrivox-verify-profile")
const SEND_TIMEOUT_MS = 10000

const SCENES = [
  { id: "hq", marker: "We Build What Powers" },
  { id: "lobby", marker: "Four engineering divisions" },
  { id: "data", marker: "FERRIVOX DATA" },
  { id: "ai", marker: "FERRIVOX INTELLIGENCE" },
  { id: "software", marker: "FERRIVOX ENGINEERING" },
  { id: "security", marker: "FERRIVOX SECURITY" },
  { id: "district", marker: "The products we build" },
  { id: "globe", marker: "We don't just use technology" },
  { id: "contact", marker: "START A PROJECT" },
]

/* ── Minimal CDP-over-WebSocket client ─────────────── */
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
      // Reject everything pending so nothing hangs on a dead socket
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

/* Evaluate with a hard timeout — a busy page can't stall us. */
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
    "--remote-debugging-port=9222",
    "--no-first-run",
    "--no-default-browser-check",
    // Software GL: deterministic compositing, avoids GPU-process flakiness.
    // Small window: software-rasterized bloom is expensive — fewer pixels
    // keeps the main thread responsive for CDP probes.
    "--disable-gpu",
    "--window-size=1024,640",
    "--user-data-dir=" + PROFILE_DIR,
    "about:blank",
  ])
  chrome.on("error", (e) => {
    console.error("CHROME_SPAWN_ERROR", e.message)
    process.exit(2)
  })

  // chrome.kill() does NOT reap the process tree on Windows — orphaned
  // renderer/GPU processes accumulate and starve later runs.
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
      await fetch("http://127.0.0.1:9222/json/version")
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
  console.log("chrome connected (software GL)")

  const results = []
  let cdp = null
  let targetId = null

  try {
    const target = await fetch("http://127.0.0.1:9222/json/new?about:blank", {
      method: "PUT",
    }).then((r) => r.json())
    targetId = target.id
    cdp = await connectDebugger(target.webSocketDebuggerUrl)

    await cdp.send("Runtime.enable")
    await cdp.send("Page.enable")
    await cdp.send("Log.enable")
    await cdp.send("Page.addScriptToEvaluateOnNewDocument", {
      source: `
        window.__vf = { errors: [], rejections: [] };
        window.addEventListener("error", (e) =>
          window.__vf.errors.push(e.message));
        window.addEventListener("unhandledrejection", (e) =>
          window.__vf.rejections.push(String(e.reason && e.reason.message || e.reason)));
      `,
    })

    for (const scene of SCENES) {
      let info = null

      // Up to 3 attempts per scene — software-GL pages can be slow to
      // respond and first-load dev compiles add jitter.
      for (let attempt = 1; attempt <= 3 && !info; attempt++) {
        if (attempt > 1) {
          console.log(`      retry ${attempt} for ${scene.id}`)
          await sleep(2000)
        }

        try {
          await cdp.send("Page.navigate", { url: `${BASE}/?scene=${scene.id}` })
        } catch {
          continue
        }

        // Wait for load
        let loaded = false
        for (let i = 0; i < 60; i++) {
          await sleep(250)
          const r = await evalSafe(cdp, "document.readyState")
          if (r && r.result.value === "complete") {
            loaded = true
            break
          }
        }
        if (!loaded) continue

        // Wait for a live canvas
        let canvasOk = false
        for (let i = 0; i < 60; i++) {
          await sleep(250)
          const r = await evalSafe(
            cdp,
            `!!(document.querySelector("canvas") || {}).width`
          )
          if (r && r.result.value === true) {
            canvasOk = true
            break
          }
        }
        if (!canvasOk) continue

        // Let the camera tween + bloom settle (transition is 2.8s)
        await sleep(3200)

        const probe = await evalSafe(
          cdp,
          `(() => {
            const text = document.body.innerText || "";
            const canvas = document.querySelector("canvas");
            return JSON.stringify({
              markerFound: text.includes(${JSON.stringify(scene.marker)}),
              canvasSize: canvas ? canvas.width + "x" + canvas.height : null,
              errors: (window.__vf || {}).errors || [],
              rejections: (window.__vf || {}).rejections || [],
            });
          })()`
        )

        if (probe && probe.result && probe.result.value) {
          try {
            const parsed = JSON.parse(probe.result.value)
            if (parsed.markerFound && parsed.errors.length === 0) {
              info = parsed
            } else {
              info = parsed
            }
          } catch {
            // fall through to retry
          }
        }
      }

      if (!info) {
        console.log(
          `FAIL  ${scene.id.padEnd(9)} no usable page state after retries`
        )
        results.push(false)
        continue
      }

      // Force two fresh compositor frames before capturing, otherwise
      // headless Chrome can hand us a blank surface.
      await evalSafe(
        cdp,
        `new Promise((res) => requestAnimationFrame(() =>
           requestAnimationFrame(() => res(true))))`,
        8000
      )
      await sleep(400)

      let shotOk = false
      try {
        const shot = await Promise.race([
          cdp.send("Page.captureScreenshot", { format: "png" }),
          sleep(8000).then(() => null),
        ])
        if (shot) {
          fs.writeFileSync(
            path.join(OUT_DIR, `scene-${scene.id}.png`),
            Buffer.from(shot.data, "base64")
          )
          shotOk = true
        }
      } catch {
        shotOk = false
      }

      const errors = [...(info.errors || []), ...(info.rejections || [])]
      // Reaching this point means the scene loaded, mounted a canvas, and
      // settled — the retry loop only exits with info on success.
      const pass = info.markerFound && errors.length === 0

      results.push(pass)
      console.log(
        `${pass ? "PASS" : "FAIL"}  ${scene.id.padEnd(9)} marker=${info.markerFound} canvas=${info.canvasSize || "none"} shot=${shotOk ? "ok" : "none"} errors=${errors.length}`
      )
      for (const e of errors.slice(0, 3)) {
        console.log("   err:", String(e).slice(0, 160))
      }
    }
  } finally {
    if (cdp) cdp.close()
    if (targetId) {
      await fetch(`http://127.0.0.1:9222/json/close/${targetId}`).catch(
        () => {}
      )
    }
    killChromeTree()
  }

  const failed = results.filter((p) => !p).length
  console.log("――――――――――――――――")
  console.log(
    `${results.length - failed}/${results.length} scenes passed. Shots: ${OUT_DIR}`
  )
  process.exit(failed ? 1 : 0)
}

main().catch((e) => {
  console.error("FATAL", e)
  process.exit(2)
})
