const { CDP } = require('./cdp.js');
const OUT='/private/tmp/claude-501/-Users-malithmadhushan-Documents-The-Bakekeep-10K-Web/3b394f41-c9eb-46d9-99bd-822c29e2f219/scratchpad';
const CASES=[[375,812,'end','phone 375x812, field low'],[375,667,'end','phone 375x667, field low'],
             [375,812,'center','phone 375x812, field centred'],[375,667,'start','phone 375x667, field high'],
             [1440,900,'end','desktop, field low'],[1440,520,'center','shallow desktop 1440x520']];
(async () => {
  const c = await CDP.open(); await c.watchErrors();
  console.log('case                            flips  fully on screen?  tap target');
  for (const [w,h,blk,label] of CASES) {
    await c.metrics(w,h,w<720,w<720);
    await c.goto('http://127.0.0.1:4173/');
    await new Promise(r=>setTimeout(r,1900));
    const r = await c.evalJS(`(async()=>{
      const i=document.querySelector('#f-date');
      i.scrollIntoView({block:'${blk}',behavior:'instant'});
      await new Promise(r=>setTimeout(r,450));
      i.click();
      await new Promise(r=>setTimeout(r,1100));   // let the nudge settle
      const cal=document.querySelector('#cal'), cr=cal.getBoundingClientRect();
      const head=70;
      return JSON.stringify({
        up:cal.classList.contains('up'),
        top:Math.round(cr.top), bottom:Math.round(cr.bottom),
        vh:innerHeight,
        fits:(cr.top>=head-2 && cr.bottom<=innerHeight+2),
        offTop:Math.round(head-cr.top), offBottom:Math.round(cr.bottom-innerHeight),
        cell:Math.round(document.querySelector('#calGrid button').getBoundingClientRect().height),
        hScroll:document.documentElement.scrollWidth>innerWidth+1
      });
    })()`);
    const d=JSON.parse(r);
    console.log(label.padEnd(32)
      + String(d.up?'up':'down').padEnd(7)
      + (d.fits ? 'YES' : 'NO  top ' + d.offTop + ' bottom ' + d.offBottom).padEnd(18)
      + d.cell + 'px' + (d.hScroll ? '  SIDEWAYS SCROLL' : ''));
    if (w===375 && h===812 && blk==='end') await c.shot(`${OUT}/C-phone2.png`);
  }
  console.log('\nCONSOLE ERRORS: ' + (c.consoleErrors().length ? c.consoleErrors().join('\n') : 'none'));
  c.close();
})().catch(e=>{console.error('FAILED: '+e.message);process.exit(1)});
