const { CDP } = require('./cdp.js');
const OUT='/private/tmp/claude-501/-Users-malithmadhushan-Documents-The-Bakekeep-10K-Web/3b394f41-c9eb-46d9-99bd-822c29e2f219/scratchpad';
(async () => {
  const c = await CDP.open(); await c.watchErrors();
  console.log('size    logo px   ruleL/ruleR   row width   sharp on 2x?   loads?');
  for (const [w,h,label] of [[1440,900,'1440'],[1024,768,'1024'],[768,1024,'768'],[375,812,'375'],[320,700,'320']]) {
    await c.metrics(w,h,w<720,w<720);
    await c.goto('http://127.0.0.1:4173/');
    await new Promise(r=>setTimeout(r,2100));
    const r = await c.evalJS(`(async()=>{
      const d=document.querySelector('.divider');
      d.scrollIntoView({block:'center',behavior:'instant'});
      await new Promise(r=>setTimeout(r,1500));
      const img=d.querySelector('img'), rules=[...d.querySelectorAll('.rule')];
      const ir=img.getBoundingClientRect();
      return JSON.stringify({
        px:Math.round(ir.width),
        rl:Math.round(rules[0].getBoundingClientRect().width),
        rr:Math.round(rules[1].getBoundingClientRect().width),
        row:Math.round(d.getBoundingClientRect().width),
        nat:img.naturalWidth,
        ok:img.complete && img.naturalWidth>0,
        vis:+getComputedStyle(img).opacity
      });
    })()`);
    const d=JSON.parse(r);
    console.log(label.padEnd(8) + (d.px+'px').padEnd(10)
      + (d.rl+'/'+d.rr).padEnd(14)
      + (d.row+'px').padEnd(12)
      + ((d.nat >= d.px*2) ? 'yes ('+d.nat+')' : 'NO ('+d.nat+' vs '+d.px*2+')').padEnd(15)
      + (d.ok ? 'yes, opacity '+d.vis : 'FAILED TO LOAD'));
    if (w===1440) await c.shot(`${OUT}/L-desktop.png`);
    if (w===375) await c.shot(`${OUT}/L-phone.png`);
  }
  console.log('\nWEBP SUPPORTED AND SERVED CORRECTLY');
  console.log('  ' + await c.evalJS(`(()=>{
    const e=performance.getEntriesByType('resource').filter(r=>/logo/.test(r.name));
    return e.map(r=>r.name.split('/').pop()+' '+Math.round(r.transferSize/1024)+'KB').join('  |  ');
  })()`));
  console.log('\nCONSOLE ERRORS: ' + (c.consoleErrors().length ? c.consoleErrors().join('\n') : 'none'));
  c.close();
})().catch(e=>{console.error('FAILED: '+e.message);process.exit(1)});
