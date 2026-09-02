const { CDP } = require('./cdp.js');
(async () => {
  const c = await CDP.open();
  await c.metrics(375,812,true,true);
  await c.goto('http://127.0.0.1:4173/');
  await new Promise(r=>setTimeout(r,2600));
  const range = await c.evalJS(`(()=>{const h=document.querySelector('#hero');return h.offsetHeight-innerHeight})()`);
  console.log('phone hero scroll range: ' + range + 'px  (a phone flick is ~250 to 500px)\n');
  for (const step of [250, 400, 600]) {
    const count = Math.ceil(range/step)+2;
    const res = await c.evalJS(`(async()=>{
      window.scrollTo({top:0,behavior:'instant'}); await new Promise(r=>setTimeout(r,600));
      const out=[];
      for(let i=0;i<${count};i++){
        window.scrollBy({top:${step},behavior:'instant'});
        await new Promise(r=>setTimeout(r,320));
        out.push([...document.querySelectorAll('.band')].map(b=>+(+getComputedStyle(b).opacity).toFixed(2)));
      }
      return JSON.stringify(out);
    })()`);
    const rows=JSON.parse(res);
    const runs=[0,1,2,3].map(b=>{let best=0,cur=0;rows.forEach(r=>{if(r[b]>0.97){cur++;best=Math.max(best,cur)}else cur=0});return best});
    const peaks=[0,1,2,3].map(b=>Math.max(...rows.map(r=>r[b])));
    const verdict=[0,1,2,3].map(b=>peaks[b]<0.97?'SKIPPABLE':(step===250&&runs[b]<3?'short':'ok'));
    console.log('flick of '+step+'px over '+count+' swipes');
    console.log('  full-opacity run : ['+runs.join(', ')+']');
    console.log('  peak opacity     : ['+peaks.map(p=>p.toFixed(2)).join(', ')+']');
    console.log('  verdict          : ['+verdict.join(', ')+']\n');
  }
  c.close();
})().catch(e=>{console.error('FAILED: '+e.message);process.exit(1)});
