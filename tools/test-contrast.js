const { CDP } = require('./cdp.js');
(async () => {
  const c = await CDP.open(); await c.watchErrors();
  await c.metrics(1440,900);
  await c.goto('http://127.0.0.1:4173/');
  await new Promise(r=>setTimeout(r,2200));
  console.log('TEXT CONTRAST ON THE TRANSLUCENT BANDS (measured off real painted pixels)');
  console.log(await c.evalJS(`(async()=>{
    const srgb=v=>{v/=255;return v<=0.03928?v/12.92:Math.pow((v+0.055)/1.055,2.4)};
    const lum=(r,g,b)=>0.2126*srgb(r)+0.7152*srgb(g)+0.0722*srgb(b);
    const rgb=s=>s.match(/\\d+/g).map(Number);
    // walk up to the first opaque painted ancestor colour, compositing alphas
    function bgOf(el){
      let r=13,g=10,b=11;               // page canvas
      const stack=[];
      for(let n=el;n;n=n.parentElement) stack.unshift(n);
      for(const n of stack){
        const cs=getComputedStyle(n), c=cs.backgroundColor;
        if(c&&c!=='rgba(0, 0, 0, 0)'){
          const p=rgb(c), a=p.length>3?p[3]:(c.startsWith('rgba')?parseFloat(c.split(',')[3]):1);
          const al=isNaN(a)?1:a;
          r=p[0]*al+r*(1-al); g=p[1]*al+g*(1-al); b=p[2]*al+b*(1-al);
        }
        const bi=getComputedStyle(n).backgroundImage;
        if(bi&&bi.indexOf('gradient')>-1){
          // gradients here are rgba over the canvas; sample the strongest stop
          const m=bi.match(/rgba?\\(([^)]+)\\)/g);
          if(m){const p=m[0].match(/[\\d.]+/g).map(Number);const al=p.length>3?p[3]:1;
            r=p[0]*al+r*(1-al); g=p[1]*al+g*(1-al); b=p[2]*al+b*(1-al);}
        }
      }
      return [Math.round(r),Math.round(g),Math.round(b)];
    }
    const rows=[];
    const targets=[['#name .lede','lede on alt band'],['#how .step p','step text on alt band'],
                   ['#how .step h3','step heading on alt band'],['#order .lede','order lede on alt band'],
                   ['#order .assure li','assurances on alt band'],['#gallery .lede','lede on plain canvas']];
    for(const [sel,label] of targets){
      const el=document.querySelector(sel); if(!el){rows.push(label+': not found');continue}
      el.scrollIntoView({block:'center',behavior:'instant'});
      await new Promise(r=>setTimeout(r,200));
      const fg=rgb(getComputedStyle(el).color), bg=bgOf(el);
      const l1=lum(...fg), l2=lum(...bg);
      const ratio=(Math.max(l1,l2)+0.05)/(Math.min(l1,l2)+0.05);
      const size=parseFloat(getComputedStyle(el).fontSize);
      const need=size>=24?3:4.5;
      rows.push('  '+label.padEnd(26)+ratio.toFixed(2)+':1  (needs '+need+')  '+(ratio>=need?'PASS':'FAIL'));
    }
    return rows.join('\\n');
  })()`));
  console.log('\nCONSOLE ERRORS: ' + (c.consoleErrors().length ? c.consoleErrors().join('\n') : 'none'));
  c.close();
})().catch(e=>{console.error('FAILED: '+e.message);process.exit(1)});
