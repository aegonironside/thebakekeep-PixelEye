const { CDP } = require('./cdp.js');
const OUT='/private/tmp/claude-501/-Users-malithmadhushan-Documents-The-Bakekeep-10K-Web/3b394f41-c9eb-46d9-99bd-822c29e2f219/scratchpad';
const WANT=["Sandaru","Malsha","Thanushi","Malith","Kavipriya","Sanju","Awanthi","Samindi",
            "Chapa","Thubishan","Udani","Nadeesha","Thilini","Maneka","Ayesha"];
const GONE=["Amma","Akka","Ayya"];
(async () => {
  const c = await CDP.open(); await c.watchErrors();
  await c.metrics(1440,900);
  await c.goto('http://127.0.0.1:4173/');
  await new Promise(r=>setTimeout(r,2200));

  const data = JSON.parse(await c.evalJS(`(()=>{
    const t=document.querySelector('#track');
    const names=[...new Set([...t.querySelectorAll('span')].map(s=>s.textContent))];
    return JSON.stringify({
      unique:names, count:names.length,
      logos:t.querySelectorAll('img').length,
      trackW:Math.round(t.scrollWidth), halfW:Math.round(t.scrollWidth/2),
      kicker:document.querySelector('.names .kicker').textContent,
      aria:document.querySelector('.names').getAttribute('aria-label'),
      sr:document.querySelector('#namesSr').textContent
    });
  })()`));

  console.log('KICKER : "' + data.kicker + '"');
  console.log('ARIA   : "' + data.aria + '"');
  console.log('\nNAMES ON THE STRIP (' + data.count + ' unique)');
  console.log('  ' + data.unique.join(', '));
  const missing = WANT.filter(n => !data.unique.includes(n));
  const lingering = GONE.filter(n => data.unique.some(u => u.includes(n)));
  console.log('\n  all 15 new names present : ' + (missing.length ? 'NO, missing ' + missing.join(', ') : 'YES'));
  console.log('  family words removed     : ' + (lingering.length ? 'NO, still there: ' + lingering.join(', ') : 'YES'));
  console.log('  screen-reader list       : ' + data.sr.slice(0,70) + '...');
  console.log('\nMARQUEE LOOP');
  console.log('  logo copies: ' + data.logos + ' | track ' + data.trackW + 'px | half ' + data.halfW + 'px (must beat 2560 for no gap)');

  console.log('\n  ' + await c.evalJS(`(async()=>{
    const t=document.querySelector('#track');
    document.querySelector('.names').scrollIntoView({block:'center',behavior:'instant'});
    await new Promise(r=>setTimeout(r,400));
    const a=getComputedStyle(t).transform;
    await new Promise(r=>setTimeout(r,1400));
    const b=getComputedStyle(t).transform;
    return 'marquee is moving: ' + (a!==b) + '  (' + a.slice(0,26) + ' -> ' + b.slice(0,26) + ')';
  })()`));

  await c.evalJS(`(async()=>{document.querySelector('.names').scrollIntoView({block:'center',behavior:'instant'});await new Promise(r=>setTimeout(r,700));return 1})()`);
  await c.shot(`${OUT}/N-strip.png`);
  await c.metrics(375,812,true,true);
  await c.goto('http://127.0.0.1:4173/');
  await new Promise(r=>setTimeout(r,2000));
  await c.evalJS(`(async()=>{document.querySelector('.names').scrollIntoView({block:'center',behavior:'instant'});await new Promise(r=>setTimeout(r,700));return 1})()`);
  await c.shot(`${OUT}/N-phone.png`);
  console.log('\nCONSOLE ERRORS: ' + (c.consoleErrors().length ? '\n'+c.consoleErrors().join('\n') : 'none'));
  c.close();
})().catch(e=>{console.error('FAILED: '+e.message);process.exit(1)});
