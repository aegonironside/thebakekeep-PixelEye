const { CDP } = require('./cdp.js');
const OUT='/private/tmp/claude-501/-Users-malithmadhushan-Documents-The-Bakekeep-10K-Web/3b394f41-c9eb-46d9-99bd-822c29e2f219/scratchpad';
(async () => {
  const c = await CDP.open(); await c.watchErrors();
  console.log('size          visual box      cake         art          inside section  overlaps copy  hScroll');
  for (const [w,h,label] of [[1440,900,'desktop 1440'],[1100,900,'laptop 1100'],[820,1180,'tablet 820'],[375,812,'phone 375'],[320,700,'narrow 320']]) {
    await c.metrics(w,h,w<720,w<720);
    await c.goto('http://127.0.0.1:4173/');
    await new Promise(r=>setTimeout(r,2200));
    const r = await c.evalJS(`(async()=>{
      const s=document.querySelector('#both');
      s.scrollIntoView({block:'center',behavior:'instant'});
      await new Promise(r=>setTimeout(r,900));
      const v=document.querySelector('.pair-visual').getBoundingClientRect();
      const ck=document.querySelector('.pair-cake').getBoundingClientRect();
      const ar=document.querySelector('.pair-art').getBoundingClientRect();
      const sec=s.getBoundingClientRect();
      const copy=document.querySelector('.pair-copy').getBoundingClientRect();
      const lowest=Math.max(ck.bottom,ar.bottom), highest=Math.min(ck.top,ar.top);
      const overlapCopy=(Math.max(ck.right,ar.right) > copy.left+2) && (copy.top < lowest && copy.bottom > highest);
      return JSON.stringify({
        vw:Math.round(v.width),vh:Math.round(v.height),
        cw:Math.round(ck.width),chh:Math.round(ck.height),
        aw:Math.round(ar.width),ah:Math.round(ar.height),
        inside:(highest>=sec.top-1 && lowest<=sec.bottom+1),
        spillTop:Math.round(sec.top-highest), spillBot:Math.round(lowest-sec.bottom),
        overlapCopy,
        hs:document.documentElement.scrollWidth>innerWidth+1
      });
    })()`);
    const d=JSON.parse(r);
    console.log(label.padEnd(14)
      +(d.vw+'x'+d.vh).padEnd(16)
      +(d.cw+'x'+d.chh).padEnd(13)
      +(d.aw+'x'+d.ah).padEnd(13)
      +(d.inside?'yes':'NO (top '+d.spillTop+' bot '+d.spillBot+')').padEnd(16)
      +(d.overlapCopy?'YES  <-- BAD':'no').padEnd(15)
      +(d.hs?'YES':'no'));
    if (w===375) await c.shot(`${OUT}/PAIR-p.png`);
  }
  console.log('\nCONSOLE ERRORS: ' + (c.consoleErrors().length ? c.consoleErrors().join('\n') : 'none'));
  c.close();
})().catch(e=>{console.error('FAILED: '+e.message);process.exit(1)});
