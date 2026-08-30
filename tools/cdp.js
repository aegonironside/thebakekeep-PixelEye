const fs = require('fs');
const EP = 'http://127.0.0.1:9222';

async function pick() {
  const list = await (await fetch(EP + '/json/list')).json();
  let t = list.find(x => x.type === 'page' && !x.url.startsWith('devtools'));
  if (!t) { t = await (await fetch(EP + '/json/new?about:blank')).json(); }
  return t.webSocketDebuggerUrl;
}

class CDP {
  constructor(ws) { this.ws = ws; this.id = 0; this.waits = new Map(); this.events = []; }
  static async open() {
    const url = await pick();
    const ws = new WebSocket(url);
    const c = new CDP(ws);
    await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });
    ws.onmessage = (m) => {
      const d = JSON.parse(m.data);
      if (d.id && c.waits.has(d.id)) { c.waits.get(d.id)(d); c.waits.delete(d.id); }
      else if (d.method) c.events.push(d);
    };
    return c;
  }
  send(method, params = {}) {
    const id = ++this.id;
    return new Promise((res, rej) => {
      this.waits.set(id, d => d.error ? rej(new Error(method + ': ' + JSON.stringify(d.error))) : res(d.result));
      this.ws.send(JSON.stringify({ id, method, params }));
      setTimeout(() => { if (this.waits.has(id)) { this.waits.delete(id); rej(new Error(method + ' timeout')); } }, 30000);
    });
  }
  async evalJS(expr) {
    const r = await this.send('Runtime.evaluate', {
      expression: expr, awaitPromise: true, returnByValue: true, allowUnsafeEvalBlockedByCSP: true });
    if (r.exceptionDetails) throw new Error('JS: ' + (r.exceptionDetails.exception?.description || r.exceptionDetails.text));
    return r.result.value;
  }
  async goto(url) {
    await this.send('Page.enable');
    await this.send('Page.navigate', { url });
    for (let i = 0; i < 100; i++) {
      await new Promise(r => setTimeout(r, 150));
      const st = await this.evalJS('document.readyState');
      if (st === 'complete') break;
    }
    await new Promise(r => setTimeout(r, 400));
  }
  async metrics(width, height, mobile = false, touch = false) {
    await this.send('Emulation.setDeviceMetricsOverride', {
      width, height, deviceScaleFactor: 1, mobile,
      screenWidth: width, screenHeight: height });
    await this.send('Emulation.setTouchEmulationEnabled', { enabled: touch, maxTouchPoints: 5 });
  }
  media(features) { return this.send('Emulation.setEmulatedMedia', { features }); }
  async shot(path, full = false) {
    const r = await this.send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: full });
    fs.writeFileSync(path, Buffer.from(r.data, 'base64'));
    return path;
  }
  async block(urls) { await this.send('Network.enable'); await this.send('Network.setBlockedURLs', { urls }); }
  async mouse(type, x, y, button = 'left') {
    await this.send('Input.dispatchMouseEvent', { type, x, y, button, clickCount: 1, buttons: type === 'mousePressed' ? 1 : 0 });
  }
  consoleErrors() {
    return this.events.filter(e => e.method === 'Runtime.exceptionThrown' ||
      (e.method === 'Log.entryAdded' && e.params.entry.level === 'error'))
      .map(e => e.method === 'Runtime.exceptionThrown'
        ? (e.params.exceptionDetails.exception?.description || e.params.exceptionDetails.text)
        : (e.params.entry.text + ' @ ' + (e.params.entry.url || '')));
  }
  async watchErrors() { await this.send('Runtime.enable'); await this.send('Log.enable'); }
  close() { this.ws.close(); }
}
module.exports = { CDP };
