const { CDP } = require('./cdp.js');
const { execFileSync } = require('child_process');
const fs = require('fs');
const FF = __dirname + '/bin/ffmpeg';
const OUT = '/private/tmp/claude-501/-Users-malithmadhushan-Documents-The-Bakekeep-10K-Web/3b394f41-c9eb-46d9-99bd-822c29e2f219/scratchpad';

const srgb = v => { v /= 255; return v <= 0.03928 ? v/12.92 : Math.pow((v+0.055)/1.055, 2.4) };
const lum = (r,g,b) => 0.2126*srgb(r) + 0.7152*srgb(g) + 0.0722*srgb(b);
const TEXT = lum(0xF6, 0xEC, 0xD8);   // --text-primary

function worstPixel(png, box) {
  const w = Math.max(2, Math.round(box.w)), h = Math.max(2, Math.round(box.h));
  const x = Math.max(0, Math.round(box.x)), y = Math.max(0, Math.round(box.y));
  const raw = execFileSync(FF, ['-v','error','-i',png,'-vf',`crop=${w}:${h}:${x}:${y}`,
    '-f','rawvideo','-pix_fmt','rgb24','-'], { maxBuffer: 1 << 28 });
  let worst = 0, wpx = null;
  for (let i = 0; i + 2 < raw.length; i += 3) {
    const L = lum(raw[i], raw[i+1], raw[i+2]);
    if (L > worst) { worst = L; wpx = [raw[i], raw[i+1], raw[i+2]] }
  }
  return { worst, wpx };
}

(async () => {
  const c = await CDP.open();
  await c.metrics(1440, 900);
  await c.goto('http://127.0.0.1:4173/');
  await new Promise(r => setTimeout(r, 2500));

  // sample several scroll positions across each band, not just the midpoint
  const plan = await c.evalJS(`(()=>{
    const h=document.querySelector('#hero'), range=h.offsetHeight-innerHeight;
    return JSON.stringify([...document.querySelectorAll('.band')].map((b,i)=>{
      const a=+b.dataset.a, z=+b.dataset.b;
      const mid=(a+z)/2, span=z-a;
      return {i, tops:[a+span*0.30, mid, a+span*0.72].map(p=>Math.round(range*p))};
    }));
  })()`);
  const bands = JSON.parse(plan);

  console.log('band  sample   worst pixel        contrast   verdict');
  let allPass = true;
  for (const bd of bands) {
    let bandWorst = 0, bandPx = null;
    for (let s = 0; s < bd.tops.length; s++) {
      const box = await c.evalJS(`(async()=>{
        window.scrollTo({top:${bd.tops[s]},behavior:'instant'});
        await new Promise(r=>setTimeout(r,700));
        const b=document.querySelectorAll('.band')[${bd.i}];
        const els=[...b.querySelectorAll('h2,.sub')];
        const rs=els.map(e=>e.getBoundingClientRect());
        const x=Math.min(...rs.map(r=>r.left)), y=Math.min(...rs.map(r=>r.top));
        const x2=Math.max(...rs.map(r=>r.right)), y2=Math.max(...rs.map(r=>r.bottom));
        els.forEach(e=>e.style.visibility='hidden');
        await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));
        return JSON.stringify({x, y, w:x2-x, h:y2-y});
      })()`);
      const png = `${OUT}/leg-b${bd.i}-s${s}.png`;
      await c.shot(png);
      await c.evalJS(`(()=>{document.querySelectorAll('.band')[${bd.i}]
        .querySelectorAll('h2,.sub').forEach(e=>e.style.visibility='');return 1})()`);
      const { worst, wpx } = worstPixel(png, JSON.parse(box));
      if (worst > bandWorst) { bandWorst = worst; bandPx = wpx }
      fs.unlinkSync(png);
    }
    const ratio = (Math.max(TEXT, bandWorst) + 0.05) / (Math.min(TEXT, bandWorst) + 0.05);
    const pass = ratio >= 3.5;
    if (!pass) allPass = false;
    console.log(`  ${bd.i+1}   worst   rgb(${String(bandPx).padEnd(11)})   ${ratio.toFixed(2)}:1    ${pass ? 'PASS' : 'FAIL (needs >= 3.5)'}`);
  }
  console.log('\n' + (allPass ? 'ALL BANDS PASS the 3.5:1 worst-pixel floor.' : 'SOME BANDS FAIL.'));
  c.close();
})().catch(e => { console.error('FAILED: ' + e.message); process.exit(1) });
