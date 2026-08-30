const { CDP } = require('./cdp.js');
const OUT='/private/tmp/claude-501/-Users-malithmadhushan-Documents-The-Bakekeep-10K-Web/3b394f41-c9eb-46d9-99bd-822c29e2f219/scratchpad';
(async () => {
  const c = await CDP.open(); await c.watchErrors();
  console.log('size          drawn WxH    natural       ratio ok   sharp 2x   loads');
  for (const [w,h,label] of [[1440,900,'desktop 1440'],[820,1180,'tablet 820'],[375,812,'phone 375']]) {
    await c.metrics(w,h,w<720,w<720);
    await c.goto('http://127.0.0.1:4173/');
    await new Promise(r=>setTimeout(r,2200));
    const r = await c.evalJS(`(async()=>{
      const im=document.querySelector('.pick-board img');
      im.scrollIntoView({block:'center',behavior:'instant'});
      await new Promise(r=>setTimeout(r,900));
      const b=im.getBoundingClientRect();
      const dr=b.width/b.height, nr=im.naturalWidth/im.naturalHeight;
      return JSON.stringify({dw:Math.round(b.width),dh:Math.round(b.height),
        nw:im.naturalWidth,nh:im.naturalHeight,
        ratio:Math.abs(dr-nr)<0.02, sharp:im.naturalWidth>=b.width*2,
        ok:im.complete&&im.naturalWidth>0});
    })()`);
    const d=JSON.parse(r);
    console.log(label.padEnd(14)+(d.dw+'x'+d.dh).padEnd(13)+(d.nw+'x'+d.nh).padEnd(14)
      +(d.ratio?'yes':'NO SQUASH').padEnd(11)+(d.sharp?'yes':'no').padEnd(11)+(d.ok?'yes':'FAILED'));
    if (w===1440) await c.shot(`${OUT}/BOARDNEW.png`);
  }
  console.log('\nCONSOLE ERRORS: ' + (c.consoleErrors().length ? c.consoleErrors().join('\n') : 'none'));
  c.close();
})().catch(e=>{console.error('FAILED: '+e.message);process.exit(1)});
