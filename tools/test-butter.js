const { CDP } = require('./cdp.js');
const OUT='/private/tmp/claude-501/-Users-malithmadhushan-Documents-The-Bakekeep-10K-Web/3b394f41-c9eb-46d9-99bd-822c29e2f219/scratchpad';
(async () => {
  const c = await CDP.open(); await c.watchErrors();
  await c.metrics(1440,900);
  await c.goto('http://127.0.0.1:4173/');
  await new Promise(r=>setTimeout(r,2200));

  console.log('THE THREE PLACES, AND WHETHER THEY STILL AGREE');
  console.log('  ' + await c.evalJS(`(async()=>{
    const card=[...document.querySelectorAll('.bake-card h3')].map(h=>h.textContent);
    const chip=[...document.querySelectorAll('.chip')].map(b=>b.textContent.trim());
    const opt=[...document.querySelectorAll('#f-type option')].map(o=>o.textContent);
    return 'cards: '+JSON.stringify(card)+'\\n  chips: '+JSON.stringify(chip)+'\\n  form options: '+JSON.stringify(opt);
  })()`));

  console.log('\n  ' + await c.evalJS(`(async()=>{
    // click "Order this" on the butter card and see what the form picks
    const link=[...document.querySelectorAll('.bake-card')].find(a=>/Butter/.test(a.querySelector('h3').textContent)).querySelector('.go');
    link.click();
    await new Promise(r=>setTimeout(r,400));
    return 'clicking "Order this" on that card pre-selects: "'+document.querySelector('#f-type').value+'"';
  })()`));

  console.log('\n  ' + await c.evalJS(`(async()=>{
    document.querySelector('.chip[data-f="butter"]').click();
    await new Promise(r=>setTimeout(r,300));
    const items=[...document.querySelectorAll('.gal .cap')].map(c=>c.textContent);
    document.querySelector('.chip[data-f="all"]').click();
    return 'that filter shows '+items.length+' cakes: '+items.join(', ');
  })()`));

  console.log('\n  ' + await c.evalJS(`(async()=>{
    // card heights still equal in the row?
    const h=[...document.querySelectorAll('.bake-card')].map(c=>Math.round(c.getBoundingClientRect().height));
    return 'card heights: ['+h.join(', ')+']  equal: '+(new Set(h).size===1);
  })()`));

  await c.evalJS(`(async()=>{document.querySelector('#bake').scrollIntoView({block:'center',behavior:'instant'});await new Promise(r=>setTimeout(r,1400));return 1})()`);
  await c.shot(`${OUT}/B-cards.png`);
  await c.metrics(375,812,true,true);
  await c.goto('http://127.0.0.1:4173/');
  await new Promise(r=>setTimeout(r,2000));
  await c.evalJS(`(async()=>{document.querySelector('.bake-grid').scrollIntoView({block:'start',behavior:'instant'});await new Promise(r=>setTimeout(r,1400));return 1})()`);
  await c.shot(`${OUT}/B-phone.png`);
  console.log('\nCONSOLE ERRORS: ' + (c.consoleErrors().length ? '\n'+c.consoleErrors().join('\n') : 'none'));
  c.close();
})().catch(e=>{console.error('FAILED: '+e.message);process.exit(1)});
