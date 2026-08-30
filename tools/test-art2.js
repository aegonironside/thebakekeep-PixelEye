const { CDP } = require('./cdp.js');
const OUT='/private/tmp/claude-501/-Users-malithmadhushan-Documents-The-Bakekeep-10K-Web/3b394f41-c9eb-46d9-99bd-822c29e2f219/scratchpad';
(async () => {
  const c = await CDP.open(); await c.watchErrors();
  console.log('size          section  paintings  no hScroll  wipe works  images ok');
  for (const [w,h,label] of [[1440,900,'desktop 1440'],[1024,768,'laptop 1024'],[768,1024,'tablet 768'],[375,812,'phone 375']]) {
    await c.metrics(w,h,w<720,w<720);
    await c.goto('http://127.0.0.1:4173/');
    await new Promise(r=>setTimeout(r,2300));
    const r = await c.evalJS(`(async()=>{
      const f=document.querySelector('#reveal');
      const top=f.getBoundingClientRect().top+scrollY;
      window.scrollTo({top:Math.max(0,Math.round(top-innerHeight*0.5)),behavior:'instant'});
      await new Promise(r=>setTimeout(r,600));
      const mid=parseFloat(f.style.getPropertyValue('--rv')||'1');
      window.scrollTo({top:Math.round(top+120),behavior:'instant'});
      await new Promise(r=>setTimeout(r,600));
      const end=parseFloat(f.style.getPropertyValue('--rv')||'1');
      document.querySelector('.art-gal').scrollIntoView({block:'center',behavior:'instant'});
      await new Promise(r=>setTimeout(r,900));
      const imgs=[...document.querySelectorAll('#art img')];
      const broken=imgs.filter(i=>i.complete&&i.naturalWidth===0).map(i=>i.src.split('/').pop());
      return JSON.stringify({
        sec:!!document.querySelector('#art'),
        n:document.querySelectorAll('#artGal button').length,
        h:document.documentElement.scrollWidth>innerWidth+1,
        mid:mid.toFixed(2), end:end.toFixed(2),
        broken:broken
      });
    })()`);
    const d=JSON.parse(r);
    console.log(label.padEnd(14)
      + String(d.sec).padEnd(9)
      + String(d.n).padEnd(11)
      + (d.h?'NO':'yes').padEnd(12)
      + (d.mid+' -> '+d.end).padEnd(12)
      + (d.broken.length?'BROKEN: '+d.broken.join(','):'all load'));
    if (w===375) await c.shot(`${OUT}/A-phone.png`);
  }
  console.log('\nCONSOLE ERRORS: ' + (c.consoleErrors().length ? c.consoleErrors().join('\n') : 'none'));
  c.close();
})().catch(e=>{console.error('FAILED: '+e.message);process.exit(1)});
