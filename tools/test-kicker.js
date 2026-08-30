const { CDP } = require('./cdp.js');
const OUT='/private/tmp/claude-501/-Users-malithmadhushan-Documents-The-Bakekeep-10K-Web/3b394f41-c9eb-46d9-99bd-822c29e2f219/scratchpad';
(async () => {
  const c = await CDP.open(); await c.watchErrors();
  for (const [w,h,touch,label] of [[1440,900,false,'desktop 1440'],[375,812,true,'phone 375'],[320,700,true,'narrow 320']]) {
    await c.metrics(w,h,touch,touch);
    await c.goto('http://127.0.0.1:4173/');
    await new Promise(r=>setTimeout(r,1900));
    const r = await c.evalJS(`(async()=>{
      document.querySelector('.names').scrollIntoView({block:'center',behavior:'instant'});
      await new Promise(r=>setTimeout(r,500));
      const k=document.querySelector('.names .kicker'), cs=getComputedStyle(k);
      const lh=parseFloat(cs.lineHeight)||parseFloat(cs.fontSize)*1.7;
      const lines=Math.round(k.getBoundingClientRect().height/lh);
      return JSON.stringify({text:k.textContent, shown:cs.textTransform,
        w:Math.round(k.getBoundingClientRect().width), lines,
        overflow:k.scrollWidth>k.clientWidth+1});
    })()`);
    const d = JSON.parse(r);
    console.log(label.padEnd(13) + ' lines=' + d.lines + '  width=' + d.w + 'px  overflowing=' + d.overflow);
    if (w === 375) await c.shot(`${OUT}/K-phone.png`);
    if (w === 1440) await c.shot(`${OUT}/K-desktop.png`);
  }
  console.log('\ntext: "' + (await c.evalJS(`document.querySelector('.names .kicker').textContent`)) + '"');
  console.log('CONSOLE ERRORS: ' + (c.consoleErrors().length ? c.consoleErrors().join('\n') : 'none'));
  c.close();
})().catch(e=>{console.error('FAILED: '+e.message);process.exit(1)});
