const { CDP } = require('./cdp.js');
const OUT='/private/tmp/claude-501/-Users-malithmadhushan-Documents-The-Bakekeep-10K-Web/3b394f41-c9eb-46d9-99bd-822c29e2f219/scratchpad';
(async () => {
  const c = await CDP.open(); await c.watchErrors();
  console.log('size          drawn WxH   natural WxH   ratio ok   fully in section   sharp 2x');
  for (const [w,h,label] of [[1440,900,'desktop 1440'],[768,1024,'tablet 768'],[375,812,'phone 375']]) {
    await c.metrics(w,h,w<720,w<720);
    await c.goto('http://127.0.0.1:4173/');
    await new Promise(r=>setTimeout(r,2200));
    const r = await c.evalJS(`(async()=>{
      const m=document.querySelector('.pe-mark');
      m.scrollIntoView({block:'center',behavior:'instant'});
      await new Promise(r=>setTimeout(r,1200));
      const b=m.getBoundingClientRect();
      const sec=document.querySelector('#art').getBoundingClientRect();
      const drawnRatio=b.width/b.height, natRatio=m.naturalWidth/m.naturalHeight;
      return JSON.stringify({
        dw:Math.round(b.width), dh:Math.round(b.height),
        nw:m.naturalWidth, nh:m.naturalHeight,
        ratioOk:Math.abs(drawnRatio-natRatio)<0.02,
        inside:(b.top>=sec.top-1 && b.bottom<=sec.bottom+1),
        sharp:m.naturalWidth>=b.width*2,
        loaded:m.complete&&m.naturalWidth>0
      });
    })()`);
    const d=JSON.parse(r);
    console.log(label.padEnd(14)
      + (d.dw+'x'+d.dh).padEnd(12)
      + (d.nw+'x'+d.nh).padEnd(14)
      + (d.ratioOk?'yes':'NO, SQUASHED').padEnd(11)
      + (d.inside?'yes':'NO').padEnd(19)
      + (d.sharp?'yes':'no'));
    if (w===1440) await c.shot(`${OUT}/PE-desktop.png`);
    if (w===375)  await c.shot(`${OUT}/PE-phone.png`);
  }
  console.log('\nCONSOLE ERRORS: ' + (c.consoleErrors().length ? c.consoleErrors().join('\n') : 'none'));
  c.close();
})().catch(e=>{console.error('FAILED: '+e.message);process.exit(1)});
