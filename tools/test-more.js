const { CDP } = require('./cdp.js');
const OUT='/private/tmp/claude-501/-Users-malithmadhushan-Documents-The-Bakekeep-10K-Web/3b394f41-c9eb-46d9-99bd-822c29e2f219/scratchpad';
(async () => {
  const c = await CDP.open(); await c.watchErrors();
  await c.metrics(1440,900);
  await c.goto('http://127.0.0.1:4173/');
  await new Promise(r=>setTimeout(r,2400));

  console.log('THE GALLERY CLOSER');
  console.log('  ' + await c.evalJS(`(async()=>{
    const m=document.querySelector('.more');
    m.scrollIntoView({block:'center',behavior:'instant'});
    await new Promise(r=>setTimeout(r,1800));
    const links=[...m.querySelectorAll('.social')];
    return 'headline: "'+m.querySelector('.more-h').textContent+'"'
      +'\\n  count injected from the real list: '+document.querySelector('#galCount').textContent
      +' (gallery has '+document.querySelectorAll('.gal button').length+')'
      +'\\n  entrance played: '+m.classList.contains('in')
      +' | gold rule drew to '+getComputedStyle(m.querySelector('.more-rule i')).width
      +'\\n  links: '+links.map(a=>a.textContent.trim()+' -> '+a.getAttribute('href')).join('  |  ')
      +'\\n  open in new tab safely: '+links.every(a=>a.target==='_blank'&&a.rel.indexOf('noopener')>-1);
  })()`));

  console.log('\n  ' + await c.evalJS(`(()=>{
    const g=document.querySelector('.gal').getBoundingClientRect();
    const m=document.querySelector('.more').getBoundingClientRect();
    const sec=document.querySelector('#gallery').getBoundingClientRect();
    return 'gap under the last photo row: '+Math.round(m.top-g.bottom)+'px'
      +' | space left under the block: '+Math.round(sec.bottom-m.bottom)+'px';
  })()`));

  await c.evalJS(`(async()=>{document.querySelector('.more').scrollIntoView({block:'center',behavior:'instant'});await new Promise(r=>setTimeout(r,1200));return 1})()`);
  await c.shot(`${OUT}/G-more.png`);

  for (const [w,h,name] of [[375,812,'G-more-phone'],[768,1024,'G-more-tablet']]) {
    await c.metrics(w,h,true,true);
    await c.goto('http://127.0.0.1:4173/');
    await new Promise(r=>setTimeout(r,2000));
    const r = await c.evalJS(`(async()=>{
      const m=document.querySelector('.more');
      m.scrollIntoView({block:'center',behavior:'instant'});
      await new Promise(r=>setTimeout(r,1300));
      const btns=[...m.querySelectorAll('.social')].map(a=>Math.round(a.getBoundingClientRect().height));
      return 'buttons '+btns.join('/')+'px tall | sideways scroll: '
        +(document.documentElement.scrollWidth>innerWidth+1);
    })()`);
    console.log('  ' + (w===375?'phone ':'tablet') + ': ' + r);
    await c.shot(`${OUT}/${name}.png`);
  }

  console.log('\nCONSOLE ERRORS: ' + (c.consoleErrors().length ? c.consoleErrors().join('\n') : 'none'));
  c.close();
})().catch(e=>{console.error('FAILED: '+e.message);process.exit(1)});
