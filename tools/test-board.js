const { CDP } = require('./cdp.js');
const OUT='/private/tmp/claude-501/-Users-malithmadhushan-Documents-The-Bakekeep-10K-Web/3b394f41-c9eb-46d9-99bd-822c29e2f219/scratchpad';
(async () => {
  const c = await CDP.open(); await c.watchErrors();
  console.log('size          ways  columns  icons  no hScroll  text fits');
  for (const [w,h,label] of [[1440,900,'desktop 1440'],[820,1180,'tablet 820'],[375,812,'phone 375'],[320,700,'narrow 320']]) {
    await c.metrics(w,h,w<720,w<720);
    await c.goto('http://127.0.0.1:4173/');
    await new Promise(r=>setTimeout(r,2200));
    const r = await c.evalJS(`(async()=>{
      const b=document.querySelector('.board-ways');
      b.scrollIntoView({block:'center',behavior:'instant'});
      await new Promise(r=>setTimeout(r,900));
      const ways=[...b.querySelectorAll('.way')];
      const cols=getComputedStyle(b).gridTemplateColumns.split(' ').length;
      const over=ways.filter(w=>w.scrollHeight>w.clientHeight+2||w.scrollWidth>w.clientWidth+2).length;
      return JSON.stringify({
        n:ways.length, cols,
        icons:b.querySelectorAll('.way svg').length,
        hs:document.documentElement.scrollWidth>innerWidth+1,
        over,
        t:ways.map(w=>w.querySelector('b').textContent).join(' / ')
      });
    })()`);
    const d=JSON.parse(r);
    console.log(label.padEnd(14)+String(d.n).padEnd(6)+String(d.cols).padEnd(9)
      +String(d.icons).padEnd(7)+(d.hs?'NO':'yes').padEnd(12)+(d.over?'CLIPPED':'yes'));
    if (w===1440) { console.log('               "'+d.t+'"'); await c.shot(`${OUT}/BOARD-d.png`); }
    if (w===375) await c.shot(`${OUT}/BOARD-p.png`);
  }
  console.log('\nCONSOLE ERRORS: ' + (c.consoleErrors().length ? c.consoleErrors().join('\n') : 'none'));
  c.close();
})().catch(e=>{console.error('FAILED: '+e.message);process.exit(1)});
