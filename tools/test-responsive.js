const { CDP } = require('./cdp.js');
const OUT = '/private/tmp/claude-501/-Users-malithmadhushan-Documents-The-Bakekeep-10K-Web/3b394f41-c9eb-46d9-99bd-822c29e2f219/scratchpad';

const CASES = [
  { n: 'desktop-1440x900', w:1440, h:900, touch:false },
  { n: 'laptop-1280x800',  w:1280, h:800, touch:false },
  { n: 'phone-375x812',    w:375,  h:812, touch:true  },
  { n: 'phone-375x667',    w:375,  h:667, touch:true  },
  { n: 'tabletP-768x1024', w:768,  h:1024, touch:true },
  { n: 'tabletL-1024x768', w:1024, h:768, touch:true  },
  { n: 'phoneLand-812x375',w:812,  h:375, touch:true  },
  { n: 'shallow-1440x520', w:1440, h:520, touch:false }
];

(async () => {
  const c = await CDP.open();
  await c.watchErrors();
  console.log('case                 gatedCSS  scrubJS  videoReq  hOverflow  errors');
  for (const t of CASES) {
    await c.metrics(t.w, t.h, t.touch, t.touch);
    await c.send('Network.enable');
    await c.goto('http://127.0.0.1:4173/');
    await new Promise(r => setTimeout(r, 2200));
    const r = await c.evalJS(`(()=>{
      const GATES=["(orientation: landscape) and (pointer: coarse) and (max-height: 560px)",
        "(prefers-reduced-motion: reduce)"];
      const gated=GATES.some(q=>matchMedia(q).matches);
      const st=document.querySelector('#stage');
      const staticVisible=getComputedStyle(document.querySelector('.static-hero')).display!=='none';
      const scrubVisible=getComputedStyle(document.querySelector('.scrub-only')).display!=='none';
      const v=document.querySelector('#vid');
      const over=document.documentElement.scrollWidth>innerWidth+1;
      return JSON.stringify({gated,staticVisible,scrubVisible,vsrc:!!v.src,
        over, sw:document.documentElement.scrollWidth, iw:innerWidth});
    })()`);
    const d = JSON.parse(r);
    const perf = await c.evalJS(`JSON.stringify(performance.getEntriesByType('resource')
      .filter(e=>/hero-scrub|hero-poster/.test(e.name)).map(e=>e.name.split('/').pop()))`);
    const errs = c.consoleErrors();
    const agree = (d.gated === d.staticVisible) && (d.gated === !d.scrubVisible);
    console.log(
      t.n.padEnd(20) +
      String(d.gated).padEnd(10) +
      String(!d.gated).padEnd(9) +
      JSON.parse(perf).join(',').padEnd(30).slice(0,30) +
      String(d.over ? 'YES ' + d.sw + '>' + d.iw : 'no').padEnd(11) +
      (errs.length || 0) + (agree ? '' : '   <-- CSS/JS GATES DISAGREE'));
    if (['phone-375x812','desktop-1440x900'].includes(t.n)) {
      await c.evalJS(`window.scrollTo({top:0,behavior:'instant'})`);
      await new Promise(r=>setTimeout(r,400));
      await c.shot(`${OUT}/resp-${t.n}.png`);
    }
  }
  c.close();
})().catch(e => { console.error('FAILED: ' + e.message); process.exit(1) });
