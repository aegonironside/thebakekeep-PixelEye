const { CDP } = require('./cdp.js');
const OUT='/private/tmp/claude-501/-Users-malithmadhushan-Documents-The-Bakekeep-10K-Web/3b394f41-c9eb-46d9-99bd-822c29e2f219/scratchpad';
(async () => {
  const c = await CDP.open(); await c.watchErrors();
  await c.metrics(1440,900);
  await c.goto('http://127.0.0.1:4173/');
  await new Promise(r=>setTimeout(r,2500));

  console.log('COUNTS AND POSITION');
  console.log('  ' + await c.evalJS(`(async()=>{
    document.querySelector('#gallery').scrollIntoView({block:'start',behavior:'instant'});
    await new Promise(r=>setTimeout(r,900));
    const b=[...document.querySelectorAll('.gal button')];
    const last4=b.slice(-4).map(x=>x.querySelector('.cap').textContent);
    return 'gallery now has '+b.length+' cakes (was 36)'
      +'\\n  the last four are:\\n    '+last4.join('\\n    ');
  })()`));

  console.log('\nFILTERS');
  console.log('  ' + await c.evalJS(`(async()=>{
    const out={};
    for(const f of ['all','custom','cupcakes','butter','treats']){
      document.querySelector('.chip[data-f="'+f+'"]').click();
      await new Promise(r=>setTimeout(r,180));
      out[f]=document.querySelectorAll('.gal button').length;
    }
    document.querySelector('.chip[data-f="all"]').click();
    return JSON.stringify(out);
  })()`));

  console.log('\n  ' + await c.evalJS(`(async()=>{
    document.querySelector('.chip[data-f="butter"]').click();
    await new Promise(r=>setTimeout(r,250));
    const names=[...document.querySelectorAll('.gal .cap')].map(c=>c.textContent);
    document.querySelector('.chip[data-f="all"]').click();
    return 'butter filter shows '+names.length+': '+names.join(', ');
  })()`));

  console.log('\nLOADING AND LIGHTBOX');
  console.log('  ' + await c.evalJS(`(async()=>{
    await new Promise(r=>setTimeout(r,400));
    const imgs=[...document.querySelectorAll('.gal img')];
    imgs.forEach(i=>i.loading='eager');
    document.querySelector('.gal button:last-child').scrollIntoView({block:'center',behavior:'instant'});
    await new Promise(r=>setTimeout(r,1400));
    const broken=imgs.filter(i=>i.complete&&i.naturalWidth===0).map(i=>i.src.split('/').pop());
    const last=document.querySelector('.gal button:last-child');
    last.click(); await new Promise(r=>setTimeout(r,500));
    const open=!document.querySelector('#lb').hidden;
    const src=document.querySelector('#lbI').getAttribute('src');
    const cap=document.querySelector('#lbC').textContent;
    document.querySelector('#lbX').click();
    return 'broken thumbs: '+(broken.length?broken.join(','):'none')
      +'\\n  tapping the last one opens: '+open+' -> '+src+' ("'+cap+'")';
  })()`));

  await c.evalJS(`(async()=>{document.querySelector('.gal button:last-child').scrollIntoView({block:'center',behavior:'instant'});await new Promise(r=>setTimeout(r,1200));return 1})()`);
  await c.shot(`${OUT}/NEWCAKES.png`);
  console.log('\nCONSOLE ERRORS: ' + (c.consoleErrors().length ? c.consoleErrors().join('\n') : 'none'));
  c.close();
})().catch(e=>{console.error('FAILED: '+e.message);process.exit(1)});
