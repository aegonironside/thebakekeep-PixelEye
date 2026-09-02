const { CDP } = require('./cdp.js');
const OUT='/private/tmp/claude-501/-Users-malithmadhushan-Documents-The-Bakekeep-10K-Web/3b394f41-c9eb-46d9-99bd-822c29e2f219/scratchpad';
(async () => {
  const c = await CDP.open(); await c.watchErrors();
  console.log('case                     gatedCSS  scrubJS  agree  video  scrub tracks   hScroll');
  const CASES=[
    [375,812,true,'phone 375x812'],
    [390,844,true,'phone 390x844'],
    [768,1024,true,'tabletP 768'],
    [812,375,true,'phone sideways'],
    [1440,900,false,'desktop 1440']
  ];
  for (const [w,h,touch,label] of CASES) {
    await c.metrics(w,h,touch,touch);
    await c.goto('http://127.0.0.1:4173/');
    await new Promise(r=>setTimeout(r,2600));
    const r = await c.evalJS(`(async()=>{
      const G=["(orientation: landscape) and (pointer: coarse) and (max-height: 560px)",
               "(prefers-reduced-motion: reduce)"];
      const gated=G.some(q=>matchMedia(q).matches);
      const statVis=getComputedStyle(document.querySelector('.static-hero')).display!=='none';
      const scrubVis=getComputedStyle(document.querySelector('.scrub-only')).display!=='none';
      const v=document.querySelector('#vid');
      let t0=0,t1=0;
      if(!gated){
        const hero=document.querySelector('#hero'), range=hero.offsetHeight-innerHeight;
        window.scrollTo({top:Math.round(range*0.2),behavior:'instant'});
        await new Promise(r=>setTimeout(r,900)); t0=v.currentTime||0;
        window.scrollTo({top:Math.round(range*0.8),behavior:'instant'});
        await new Promise(r=>setTimeout(r,900)); t1=v.currentTime||0;
        window.scrollTo({top:0,behavior:'instant'});
      }
      return JSON.stringify({gated,statVis,scrubVis,src:!!v.src,
        t0:+t0.toFixed(2),t1:+t1.toFixed(2),
        hs:document.documentElement.scrollWidth>innerWidth+1});
    })()`);
    const d=JSON.parse(r);
    const agree=(d.gated===d.statVis)&&(d.gated===!d.scrubVis);
    console.log(label.padEnd(25)
      +String(d.gated).padEnd(10)
      +String(!d.gated).padEnd(9)
      +(agree?'yes':'NO!').padEnd(7)
      +(d.src?'loaded':'none  ').padEnd(7)
      +(d.gated?'n/a (static hero)':(d.t0+'s -> '+d.t1+'s'+(d.t1>d.t0?'  moves':'  STUCK'))).padEnd(15)
      +(d.hs?'YES':'no'));
    if (w===375&&h===812) await c.shot(`${OUT}/MOB-hero.png`);
  }
  console.log('\nCONSOLE ERRORS: ' + (c.consoleErrors().length ? c.consoleErrors().join('\n') : 'none'));
  c.close();
})().catch(e=>{console.error('FAILED: '+e.message);process.exit(1)});
