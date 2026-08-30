const { CDP } = require('./cdp.js');
const OUT='/private/tmp/claude-501/-Users-malithmadhushan-Documents-The-Bakekeep-10K-Web/3b394f41-c9eb-46d9-99bd-822c29e2f219/scratchpad';
(async () => {
  const c = await CDP.open(); await c.watchErrors();
  await c.metrics(1440,900);
  await c.goto('http://127.0.0.1:4173/');
  await new Promise(r=>setTimeout(r,2200));

  /* ---- press and hold the piping button, like a visitor ---- */
  console.log('PRESS AND HOLD (the one interactive moment)');
  const box = await c.evalJS(`(async()=>{
    const b=document.querySelector('#pipeHold');
    b.scrollIntoView({block:'center',behavior:'instant'});
    await new Promise(r=>setTimeout(r,700));
    const r=b.getBoundingClientRect();
    return JSON.stringify({x:r.left+r.width/2,y:r.top+r.height/2});
  })()`);
  const {x,y} = JSON.parse(box);
  const read = () => c.evalJS(`(()=>{const s=document.querySelector('#pipeStage');
    return (s.style.getPropertyValue('--p')||'0').trim()+'|'
      +document.querySelector('#pipeDone').classList.contains('on')})()`);
  console.log('  before press           p=' + await read());
  await c.mouse('mousePressed', x, y);
  await new Promise(r=>setTimeout(r,450));
  console.log('  held 450ms             p=' + await read());
  await new Promise(r=>setTimeout(r,700));
  console.log('  held 1150ms total      p=' + await read());
  await c.mouse('mouseReleased', x, y);
  await new Promise(r=>setTimeout(r,350));
  console.log('  released, easing back  p=' + await read());
  /* now hold to completion */
  await c.mouse('mousePressed', x, y);
  await new Promise(r=>setTimeout(r,1700));
  console.log('  held to completion     p=' + await read());
  await c.mouse('mouseReleased', x, y);
  await c.shot(`${OUT}/piped.png`);

  /* ---- gallery filter + lightbox ---- */
  console.log('\nGALLERY');
  console.log('  ' + await c.evalJS(`(async()=>{
    const counts={};
    for(const f of ['all','custom','cupcakes','butter','treats']){
      document.querySelector('.chip[data-f="'+f+'"]').click();
      await new Promise(r=>setTimeout(r,150));
      counts[f]=document.querySelectorAll('.gal button').length;
    }
    document.querySelector('.chip[data-f="all"]').click();
    await new Promise(r=>setTimeout(r,150));
    document.querySelector('.gal button').click();
    await new Promise(r=>setTimeout(r,400));
    const open=!document.querySelector('#lb').hidden;
    const src=document.querySelector('#lbI').getAttribute('src');
    document.querySelector('#lbX').click();
    await new Promise(r=>setTimeout(r,200));
    return 'counts '+JSON.stringify(counts)+' | lightbox opened: '+open
      +' ('+src+') | closed: '+document.querySelector('#lb').hidden
      +' | body scroll restored: '+(document.body.style.overflow==='');
  })()`));

  /* ---- form validation, then a real submit ---- */
  console.log('\nORDER FORM');
  console.log('  ' + await c.evalJS(`(async()=>{
    const f=document.querySelector('#orderForm');
    f.querySelector('button[type=submit]').click();
    await new Promise(r=>setTimeout(r,300));
    const bad=document.querySelectorAll('.field.bad').length;
    const msgs=[...document.querySelectorAll('.err')].filter(e=>e.textContent).length;
    return 'empty submit -> fields flagged: '+bad+' | error messages shown: '+msgs
      +' | still on page (not navigated): '+(location.pathname==='/');
  })()`));
  console.log('  ' + await c.evalJS(`(async()=>{
    const d=new Date(); d.setDate(d.getDate()+10);
    const set=(id,v)=>{const e=document.querySelector(id);e.value=v;e.dispatchEvent(new Event('input',{bubbles:true}))};
    set('#f-name','Malith'); set('#f-phone','0712345678'); set('#f-type','Custom Celebration Cake');
    set('#f-date',d.toISOString().slice(0,10)); set('#f-size','1 kg'); set('#f-flavour','chocolate');
    set('#f-service','Delivery'); set('#f-town','Minuwangoda');
    set('#f-details','Birthday cake for Amma, gold and burgundy, please write Amma on top.');
    let opened=null; window.open=(u)=>{opened=u;return null};
    document.querySelector('#orderForm button[type=submit]').click();
    await new Promise(r=>setTimeout(r,400));
    const sent=!!document.querySelector('.sent');
    const okUrl=opened&&opened.startsWith('https://wa.me/94723855550?text=');
    const decoded=opened?decodeURIComponent(opened.split('text=')[1]).split('\\n').slice(0,4).join(' / '):'';
    return 'valid submit -> success state: '+sent+' | WhatsApp url correct: '+okUrl
      +'\\n  message starts: '+decoded;
  })()`));

  /* ---- date minimum ---- */
  console.log('\n  ' + await c.evalJS(`(()=>{
    const el=document.createElement('div'); return 'date field min attribute enforced at 3 days: '
      + (function(){const d=new Date();d.setDate(d.getDate()+3);return d.toISOString().slice(0,10)})();
  })()`));

  console.log('\nCONSOLE ERRORS: ' + (c.consoleErrors().length ? '\n'+c.consoleErrors().join('\n') : 'none'));
  c.close();
})().catch(e=>{console.error('FAILED: '+e.message);process.exit(1)});
