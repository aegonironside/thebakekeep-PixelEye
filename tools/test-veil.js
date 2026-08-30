const { CDP } = require('./cdp.js');
const OUT='/private/tmp/claude-501/-Users-malithmadhushan-Documents-The-Bakekeep-10K-Web/3b394f41-c9eb-46d9-99bd-822c29e2f219/scratchpad';
(async () => {
  const c = await CDP.open(); await c.watchErrors();
  await c.metrics(1440,900);
  await c.goto('http://127.0.0.1:4173/');
  await new Promise(r=>setTimeout(r,2500));

  console.log('CAPTION');
  console.log('  ' + await c.evalJS(`(()=>{
    const f=document.querySelector('.reveal figcaption');
    return 'text: "'+f.textContent+'"\\n  renders as: "'+f.textContent.toUpperCase()
      +'" (the style uppercases it, so the capital D never shows)';
  })()`));

  console.log('\nSLIDE OPACITY (the slide itself must be 1, so nothing shows through)');
  console.log(await c.evalJS(`(async()=>{
    document.querySelector('#artCar').scrollIntoView({block:'center',behavior:'instant'});
    await new Promise(r=>setTimeout(r,1200));
    const on=[...document.querySelectorAll('.car-slide')].findIndex(s=>s.classList.contains('is-on'));
    const N=document.querySelectorAll('.car-slide').length;
    return [...document.querySelectorAll('.car-slide')].map((s,i)=>{
      let d=i-on; if(d>N/2)d-=N; if(d<-N/2)d+=N;
      const ad=Math.abs(d);
      if(ad>2) return null;
      const so=+getComputedStyle(s).opacity;
      const vo=+getComputedStyle(s.querySelector('.veil')).opacity;
      const slot=ad===0?1:d===-1?2:d===1?3:d===-2?4:5;
      return '  slot '+slot+'  slide opacity '+so.toFixed(2)
        +(so===1?' (opaque)':'  <-- STILL SEE-THROUGH')
        +'   veil '+vo.toFixed(2);
    }).filter(Boolean).join('\\n');
  })()`));

  console.log('\nCAN YOU SEE THROUGH A NEIGHBOUR? (sample a pixel where two slides overlap)');
  console.log('  ' + await c.evalJS(`(()=>{
    const on=document.querySelector('.car-slide.is-on');
    const r=on.getBoundingClientRect();
    // a point just outside the centre slide, over the right neighbour
    const x=Math.round(r.right+18), y=Math.round(r.top+r.height/2);
    const el=document.elementFromPoint(x,y);
    const slide=el&&el.closest?el.closest('.car-slide'):null;
    return slide ? 'the point right of centre belongs to slide '+slide.dataset.i
      +', whose own opacity is '+getComputedStyle(slide).opacity
      +' so nothing behind it can bleed through'
      : 'no slide at that point';
  })()`));

  await c.shot(`${OUT}/VEIL-d.png`);
  console.log('\nCONSOLE ERRORS: ' + (c.consoleErrors().length ? c.consoleErrors().join('\n') : 'none'));
  c.close();
})().catch(e=>{console.error('FAILED: '+e.message);process.exit(1)});
