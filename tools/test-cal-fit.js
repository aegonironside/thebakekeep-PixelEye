const { CDP } = require('./cdp.js');
const OUT='/private/tmp/claude-501/-Users-malithmadhushan-Documents-The-Bakekeep-10K-Web/3b394f41-c9eb-46d9-99bd-822c29e2f219/scratchpad';
const CASES=[[320,650,'end','narrow 320x650'],[375,812,'end','phone 375x812'],[375,667,'end','phone 375x667'],
             [412,915,'end','phone 412x915'],[768,1024,'end','tablet 768'],[1440,900,'end','desktop 1440'],
             [1440,520,'center','shallow 1440x520']];
(async () => {
  const c = await CDP.open(); await c.watchErrors();
  console.log('case               flip  onScreen  cell(WxH)   grid fits panel  page hScroll');
  for (const [w,h,blk,label] of CASES) {
    await c.metrics(w,h,w<720,w<720);
    await c.goto('http://127.0.0.1:4173/');
    await new Promise(r=>setTimeout(r,1900));
    const r = await c.evalJS(`(async()=>{
      const i=document.querySelector('#f-date');
      i.scrollIntoView({block:'${blk}',behavior:'instant'});
      await new Promise(r=>setTimeout(r,450));
      i.click(); await new Promise(r=>setTimeout(r,1100));
      const cal=document.querySelector('#cal'), cr=cal.getBoundingClientRect();
      const g=document.querySelector('#calGrid'), gr=g.getBoundingClientRect();
      const b=document.querySelector('#calGrid button').getBoundingClientRect();
      const last=[...document.querySelectorAll('#calGrid button')].pop().getBoundingClientRect();
      const cs=getComputedStyle(cal), padR=parseFloat(cs.paddingRight);
      return JSON.stringify({
        up:cal.classList.contains('up'),
        fits:(cr.top>=68 && cr.bottom<=innerHeight+2 && cr.left>=0 && cr.right<=innerWidth+1),
        cw:Math.round(b.width), chh:Math.round(b.height),
        gridOverflow: Math.round(g.scrollWidth - g.clientWidth),
        rightGap: Math.round(cr.right - padR - gr.right),
        hScroll:document.documentElement.scrollWidth>innerWidth+1,
        L:Math.round(cr.left), R:Math.round(cr.right), vw:innerWidth
      });
    })()`);
    const d=JSON.parse(r);
    console.log(label.padEnd(19)
      + String(d.up?'up':'down').padEnd(6)
      + (d.fits?'YES':'NO ('+d.L+'..'+d.R+' of '+d.vw+')').padEnd(10)
      + (d.cw+'x'+d.chh).padEnd(12)
      + (d.gridOverflow<=0 ? 'yes' : 'NO, over by '+d.gridOverflow+'px').padEnd(17)
      + (d.hScroll?'YES  <-- BAD':'no'));
    if (w===375 && h===812) await c.shot(`${OUT}/C-final-phone.png`);
    if (w===1440 && h===900) await c.shot(`${OUT}/C-final-desktop.png`);
  }
  console.log('\nCONSOLE ERRORS: ' + (c.consoleErrors().length ? c.consoleErrors().join('\n') : 'none'));
  c.close();
})().catch(e=>{console.error('FAILED: '+e.message);process.exit(1)});
