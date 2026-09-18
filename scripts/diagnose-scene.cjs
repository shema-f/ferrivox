/* Diagnostic: load one scene and dump what's actually in the page. */
const path = require("path")
const { spawn } = require("child_process")

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
const BASE = "http://localhost:8443"
const OUT_DIR = path.join(__dirname, "..", "verify-shots")

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
  }
  send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = ++this.id
      this.pending.set(id, { resolve, reject })
      this.ws.send(JSON.stringify({ id, method, params }))
    })
  }
  close() {
    this.ws.close()
  }
}

function connectDebugger(url) {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(url)
    ws.addEventListener("open", () => resolve(new CDP(ws)))
    ws.addEventListener("error", (e) => reject(new Error("ws error")))
  })
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function main() {
  const chrome = spawn(CHROME, [
    "--headless=new",
    "--remote-debugging-port=9223",
    "--no-first-run",
    "--no-default-browser-check",
    "--window-size=1440,900",
    "--user-data-dir=" + path.join(OUT_DIR, "profile-diag"),
    "about:blank",
  ])

  for (let i = 0; i < 30; i++) {
    try {
      await fetch("http://127.0.0.1:9223/json/version")
      break
    } catch {
      await sleep(500)
    }
  }

  const target = await fetch("http://127.0.0.1:9223/json/new?about:blank", {
    method: "PUT",
  }).then((r) => r.json())
  const cdp = await connectDebugger(target.webSocketDebuggerUrl)

  await cdp.send("Runtime.enable")
  await cdp.send("Page.enable")
  await cdp.send("Log.enable")
  await cdp.send("Network.enable")

  // Inject an error collector before any app code runs
  await cdp.send("Page.addScriptToEvaluateOnNewDocument", {
    source: `
      window.__vf = { errors: [], rejections: [] };
      window.addEventListener("error", (e) =>
        window.__vf.errors.push(e.message + " @ " + e.filename + ":" + e.lineno));
      window.addEventListener("unhandledrejection", (e) =>
        window.__vf.rejections.push(String(e.reason && e.reason.stack || e.reason)));
    `,
  })

  const sceneId = process.argv[2] || "hq"
  const waitMs = parseInt(process.argv[3] || "9000", 10)
  await cdp.send("Page.navigate", { url: `${BASE}/?scene=${sceneId}` })

  // Poll until React mounts or time runs out — dev-mode module graphs
  // (hundreds of unbundled ES module requests) can take a while cold.
  const pollStart = Date.now()
  while (Date.now() - pollStart < waitMs) {
    await sleep(1000)
    try {
      const r = await cdp.send("Runtime.evaluate", {
        expression: `document.getElementById("root")?.children.length || 0`,
        returnByValue: true,
      })
      if (r.result.value > 0) break
    } catch {
      break
    }
  }
  console.log("waited:", Date.now() - pollStart, "ms")

  // Target-level state: crashed renderers show up here, not in the page
  const targetInfo = await fetch("http://127.0.0.1:9223/json/list").then((r) =>
    r.json()
  )
  const me = targetInfo.find((t) => t.id === target.id)
  console.log(
    "TARGET:",
    JSON.stringify({ url: me?.url, title: me?.title, type: me?.type })
  )

  const diag = await cdp.send("Runtime.evaluate", {
    expression: `(() => {
      const root = document.getElementById("root");
      const canvas = document.querySelector("canvas");
      let webgl = "untested";
      try {
        const t = document.createElement("canvas");
        webgl = !!(t.getContext("webgl2") || t.getContext("webgl"))
          ? "supported" : "unsupported";
      } catch (e) { webgl = "error: " + e.message; }
      return JSON.stringify({
        readyState: document.readyState,
        rootChildren: root ? root.children.length : -1,
        rootHtmlLen: root ? root.innerHTML.length : -1,
        hasFallback: (document.body.innerText || "").toUpperCase().includes("INITIALIZING HQ"),
        hasHero: (document.body.innerText || "").includes("We Build What Powers"),
        hasCanvas: !!canvas,
        canvasSize: canvas ? canvas.width + "x" + canvas.height : null,
        webglSupport: webgl,
        collectedErrors: window.__vf ? window.__vf.errors : "collector missing",
        rejections: window.__vf ? window.__vf.rejections : "collector missing",
      });
    })()`,
    returnByValue: true,
  })
  console.log("DIAG:", diag.result.value)

  // Network failures seen by the page
  const netFails = cdp.events
    .filter((e) => e.method === "Network.loadingFailed")
    .map((e) => e.params.errorText + " " + e.params.type)
  console.log("NET_FAILS:", JSON.stringify(netFails.slice(0, 10)))

  // Log entries
  const logErrs = cdp.events
    .filter((e) => e.method === "Log.entryAdded" && e.params.entry.level === "error")
    .map((e) => e.params.entry.text)
  console.log("LOG_ERRORS:", JSON.stringify(logErrs.slice(0, 10)))

  const consoleErrs = cdp.events
    .filter((e) => e.method === "Runtime.consoleAPICalled" && e.params.type === "error")
    .map((e) => (e.params.args || []).map((a) => a.value ?? a.description ?? "").join(" "))
  console.log("CONSOLE_ERRORS:", JSON.stringify(consoleErrs.slice(0, 10)))

  const exceptions = cdp.events
    .filter((e) => e.method === "Runtime.exceptionThrown")
    .map((e) => e.params.exceptionDetails.exception?.description || e.params.exceptionDetails.text)
  console.log("EXCEPTIONS:", JSON.stringify(exceptions.slice(0, 10)))

  // Is the lazy Scene3D chunk being requested?
  const chunkReqs = cdp.events
    .filter((e) => e.method === "Network.responseReceived" && /Scene3D|Scene3D[\w-]*\.js/.test(e.params.response.url))
    .map((e) => e.params.response.status + " " + e.params.response.url.slice(-40))
  console.log("SCENE3D_CHUNK:", JSON.stringify(chunkReqs.slice(0, 5)))

  cdp.close()
  await fetch(`http://127.0.0.1:9223/json/close/${target.id}`).catch(() => {})
  chrome.kill()
  process.exit(0)
}

main().catch((e) => {
  console.error("FATAL", e)
  process.exit(2)
})
