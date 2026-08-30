const { CDP } = require('./cdp.js');
(async () => {
  const c = await CDP.open();
  await c.metrics(1440,900);
  await c.goto('http://127.0.0.1:4173/');
  await new Promise(r=>setTimeout(r,2000));
  console.log(await c.evalJS(`(async()=>{
    document.querySelector('#order').scrollIntoView({block:'center',behavior:'instant'});
    await new Promise(r=>setTimeout(r,600));
    return ['f-name','f-phone','f-size','f-flavour','f-town'].map(id=>{
      const e=document.querySelector('#'+id), s=getComputedStyle(e);
      let auto=false; try{auto=e.matches(':-webkit-autofill')}catch(err){}
      return id+'  bg='+s.backgroundColor+'  color='+s.color+'  autofill='+auto;
    }).join('\\n');
  })()`));
  c.close();
})().catch(e=>{console.error(e.message);process.exit(1)});
