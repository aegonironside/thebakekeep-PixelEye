const { CDP } = require('./cdp.js');
const OUT='/private/tmp/claude-501/-Users-malithmadhushan-Documents-The-Bakekeep-10K-Web/3b394f41-c9eb-46d9-99bd-822c29e2f219/scratchpad';
(async () => {
  const c = await CDP.open(); await c.watchErrors();
  await c.metrics(1440,900);
  await c.send('Network.enable');
  await c.goto('http://127.0.0.1:4173/');
  await new Promise(r=>setTimeout(r,2200));

  console.log('MARQUEE');
  console.log('  ' + await c.evalJS(`(()=>{
    const t=document.querySelector('#track');
    return 'logo copies: '+t.querySelectorAll('img').length
      +' | track width: '+Math.round(t.scrollWidth)+'px (half = '+Math.round(t.scrollWidth/2)+'px, must beat 2560)';
  })()`));

  console.log('\nEVERY LOGO ACTUALLY DECODED (after scrolling each into view)');
  console.log(await c.evalJS(`(async()=>{
    const spots=[['.divider img','divider'],['.pipe-crown','piping'],['footer .mark','footer'],['.brand img','header'],['.names-track img','marquee']];
    const rows=[];
    for(const [sel,label] of spots){
      const el=document.querySelector(sel);
      el.scrollIntoView({block:'center',behavior:'instant'});
      await new Promise(r=>setTimeout(r,900));
      const cs=getComputedStyle(el);
      rows.push('  '+label.padEnd(9)+' decoded='+(el.naturalWidth>0?'YES '+el.naturalWidth+'px':'NO')
        +'  shown='+cs.width+'  file='+el.getAttribute('src').split('/').pop());
    }
    return rows.join('\\n');
  })()`));

  const res = await c.evalJS(`JSON.stringify(performance.getEntriesByType('resource')
    .filter(e=>/brand\\/logo/.test(e.name)).map(e=>e.name.split('/').pop()+' '+Math.round(e.transferSize/1024)+'KB'))`);
  console.log('\nNETWORK: ' + JSON.parse(res).join('  |  '));

  await c.evalJS(`window.scrollTo({top:0,behavior:'instant'})`);
  await new Promise(r=>setTimeout(r,700));
  await c.shot(`${OUT}/L-header.png`);
  await c.evalJS(`(async()=>{document.querySelector('.names').scrollIntoView({block:'center',behavior:'instant'});await new Promise(r=>setTimeout(r,900));return 1})()`);
  await c.shot(`${OUT}/L-marquee.png`);
  await c.evalJS(`(async()=>{document.querySelector('#name').scrollIntoView({block:'start',behavior:'instant'});await new Promise(r=>setTimeout(r,1500));return 1})()`);
  await c.shot(`${OUT}/L-divider.png`);
  await c.evalJS(`(async()=>{document.querySelector('footer').scrollIntoView({block:'center',behavior:'instant'});await new Promise(r=>setTimeout(r,1200));return 1})()`);
  await c.shot(`${OUT}/L-footer.png`);
  console.log('\nCONSOLE ERRORS: ' + (c.consoleErrors().length ? '\n'+c.consoleErrors().join('\n') : 'none'));
  c.close();
})().catch(e=>{console.error('FAILED: '+e.message);process.exit(1)});
