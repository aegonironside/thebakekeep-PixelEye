const { CDP } = require('./cdp.js');
const OUT='/private/tmp/claude-501/-Users-malithmadhushan-Documents-The-Bakekeep-10K-Web/3b394f41-c9eb-46d9-99bd-822c29e2f219/scratchpad';
(async () => {
  const c = await CDP.open(); await c.watchErrors();
  for (const [w,h,label] of [[375,812,'phone 375x812'],[375,667,'phone 375x667']]) {
    await c.metrics(w,h,true,true);
    await c.goto('http://127.0.0.1:4173/');
    await new Promise(r=>setTimeout(r,2000));
    const r = await c.evalJS(`(async()=>{
      const i=document.querySelector('#f-date');
      i.scrollIntoView({block:'end',behavior:'instant'});     // worst case: field low on screen
      await new Promise(r=>setTimeout(r,500));
      i.click();
      await new Promise(r=>setTimeout(r,500));
      const cal=document.querySelector('#cal'), cr=cal.getBoundingClientRect();
      return JSON.stringify({
        open:cal.classList.contains('open'),
        top:Math.round(cr.top), bottom:Math.round(cr.bottom),
        left:Math.round(cr.left), right:Math.round(cr.right),
        vw:innerWidth, vh:innerHeight,
        offBottom:Math.round(cr.bottom-innerHeight),
        offRight:Math.round(cr.right-innerWidth),
        hScroll:document.documentElement.scrollWidth>innerWidth+1,
        cellH:Math.round(document.querySelector('#calGrid button').getBoundingClientRect().height)
      });
    })()`);
    const d=JSON.parse(r);
    console.log(label + '  open=' + d.open
      + '  box=' + d.left + '..' + d.right + ' x ' + d.top + '..' + d.bottom
      + '  viewport=' + d.vw + 'x' + d.vh);
    console.log('   hangs below fold by: ' + (d.offBottom>0?d.offBottom+'px  <-- PROBLEM':'none')
      + '  | off right edge: ' + (d.offRight>0?d.offRight+'px  <-- PROBLEM':'none')
      + '  | sideways scroll: ' + d.hScroll + '  | tap target: ' + d.cellH + 'px');
    if (h===812) await c.shot(`${OUT}/C-phone.png`);
  }
  console.log('\nCONSOLE ERRORS: ' + (c.consoleErrors().length ? c.consoleErrors().join('\n') : 'none'));
  c.close();
})().catch(e=>{console.error('FAILED: '+e.message);process.exit(1)});
