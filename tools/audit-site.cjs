// Run with Node 22+ while the local preview server is listening on port 8000.
// Uses an isolated, hidden Edge/Chromium session; no npm dependencies are needed.
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const {spawn} = require('node:child_process');
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
const base = process.env.SHILAB_PREVIEW_URL || 'http://127.0.0.1:8000/';
const executable = process.env.SHILAB_BROWSER || 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'shilab-audit-'));
const browser = spawn(executable, ['--headless=new','--disable-gpu','--no-first-run','--disable-extensions','--disable-background-networking','--remote-debugging-address=127.0.0.1','--remote-debugging-port=0','--user-data-dir='+profile,'about:blank'], {windowsHide:true,stdio:'ignore'});

(async()=>{
  let socket;
  try {
    let port;
    for(let n=0;n<80;n++){const file=path.join(profile,'DevToolsActivePort');if(fs.existsSync(file)){port=fs.readFileSync(file,'utf8').split('\n')[0].trim();break;}await delay(100);}
    if(!port)throw new Error('Browser did not start. Set SHILAB_BROWSER to a Chromium executable.');
    const target=await(await fetch('http://127.0.0.1:'+port+'/json/new?about:blank',{method:'PUT'})).json();
    socket=new WebSocket(target.webSocketDebuggerUrl);
    await new Promise((r,j)=>{socket.addEventListener('open',r,{once:true});socket.addEventListener('error',j,{once:true});});
    let next=0;const pending=new Map();const errors=[];
    socket.addEventListener('message',event=>{
      const msg=JSON.parse(event.data);
      if(msg.method==='Runtime.exceptionThrown')errors.push(msg.params.exceptionDetails.text);
      if(msg.id&&pending.has(msg.id)){const task=pending.get(msg.id);pending.delete(msg.id);clearTimeout(task.timer);msg.error?task.reject(new Error(JSON.stringify(msg.error))):task.resolve(msg.result);}
    });
    const send=(method,params={})=>new Promise((resolve,reject)=>{const id=++next;const timer=setTimeout(()=>{pending.delete(id);reject(new Error('Timeout '+method));},12000);pending.set(id,{resolve,reject,timer});socket.send(JSON.stringify({id,method,params}));});
    const evaluate=async(expression)=>{const result=await send('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true});if(result.exceptionDetails)throw new Error(result.exceptionDetails.exception?.description||result.exceptionDetails.text);return result.result.value;};
    const screenshot=async(name,full=false)=>{
      const metrics=full?await send('Page.getLayoutMetrics'):null;
      const params={format:'png',captureBeyondViewport:full};
      if(full)params.clip={x:0,y:0,width:metrics.cssContentSize.width,height:metrics.cssContentSize.height,scale:1};
      const result=await send('Page.captureScreenshot',params);
      fs.writeFileSync(path.resolve(name+'-preview.png'),Buffer.from(result.data,'base64'));
    };
    await send('Page.enable');await send('Runtime.enable');
    await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'no-preference'}]});
    await send('Emulation.setDeviceMetricsOverride',{width:1440,height:1000,deviceScaleFactor:1,mobile:false});
    await send('Page.navigate',{url:new URL('index.html',base).href});
    for(let n=0;n<70;n++){if(await evaluate('document.querySelector("#home-title")?.getAnimations().length > 0'))break;await delay(50);}
    const entrance=await evaluate('(()=>{const title=document.querySelector("#home-title");const animation=title.getAnimations()[0];if(!animation)return null;animation.currentTime=120;const first=Number(getComputedStyle(title).opacity);animation.currentTime=560;const second=Number(getComputedStyle(title).opacity);return {first,second,duration:animation.effect.getTiming().duration,pending:document.querySelectorAll(".motion-pending").length}})()');
    if(!entrance||entrance.second<=entrance.first||entrance.duration<500||entrance.pending===0)throw new Error('Entrance reveal is not animating: '+JSON.stringify(entrance));
    await evaluate('document.querySelector(".home-more>a:last-child").scrollIntoView({behavior:"instant",block:"center"})');
    await delay(70);
    if(!await evaluate('document.querySelector(".home-more>a:last-child").getAnimations().length>0'))throw new Error('Scroll reveal did not start');
    await delay(950);
    await evaluate('window.scrollTo({top:0,behavior:"instant"})');await delay(50);
    await evaluate('document.querySelector(".home-more>a:last-child").scrollIntoView({behavior:"instant",block:"center"})');await delay(70);
    if(!await evaluate('document.querySelector(".home-more>a:last-child").getAnimations().length===0'))throw new Error('Scroll reveal repeats');
    await evaluate('window.scrollTo({top:0,behavior:"instant"})');await delay(100);
    const buttonPosition=await evaluate('(()=>{const r=document.querySelector(".hero-actions .primary").getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2}})()');
    await send('Input.dispatchMouseEvent',{type:'mouseMoved',...buttonPosition});await delay(160);
    if(!await evaluate('getComputedStyle(document.querySelector(".hero-actions .primary")).transform!=="none"'))throw new Error('Hover transition is missing');
    await send('Input.dispatchMouseEvent',{type:'mouseMoved',x:0,y:0});
    await send('Emulation.setDeviceMetricsOverride',{width:390,height:1000,deviceScaleFactor:1,mobile:true});await delay(70);
    await evaluate('document.querySelector(".menu-toggle").click()');await delay(60);
    const menuMotion=await evaluate('({opacity:Number(getComputedStyle(document.querySelector("#site-nav")).opacity),inert:document.querySelector("#site-nav").inert})');
    if(menuMotion.opacity<=0||menuMotion.opacity>=1||menuMotion.inert)throw new Error('Menu did not animate open: '+JSON.stringify(menuMotion));
    await delay(300);await evaluate('document.querySelector(".menu-toggle").click()');await delay(60);
    const closing=await evaluate('({opacity:Number(getComputedStyle(document.querySelector("#site-nav")).opacity),inert:document.querySelector("#site-nav").inert})');
    if(closing.opacity<=0||closing.opacity>=1||!closing.inert)throw new Error('Menu did not animate closed: '+JSON.stringify(closing));
    await delay(320);
    await send('Page.navigate',{url:new URL('data.html',base).href});await delay(1000);
    const filterMotion=await evaluate('document.querySelector("[data-specimen-filter=blood]").click();({height:document.querySelector(".dataset-results").getAnimations().length,fade:document.querySelector(".dataset-empty").getAnimations().length})');
    if(!filterMotion.height||!filterMotion.fade)throw new Error('Dataset filters do not animate: '+JSON.stringify(filterMotion));
    await evaluate('for(let n=0;n<8;n++){document.querySelector("[data-specimen-filter=balf]").click();document.querySelector("[data-specimen-filter=blood]").click()}document.querySelector("[data-specimen-filter=all]").click()');await delay(650);
    if(!await evaluate('!document.querySelector(".dataset-record").hidden && document.querySelector(".dataset-empty").hidden'))throw new Error('Rapid filter clicks left stale state');
    await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});await delay(80);
    if(!await evaluate('document.querySelectorAll(".motion-pending").length===0&&document.getAnimations().length===0'))throw new Error('Reduced motion left animations running');
    await evaluate('document.querySelector("[data-specimen-filter=blood]").click()');
    if(!await evaluate('document.getAnimations().length===0'))throw new Error('Filter ignored reduced-motion preference');
    await send('Page.navigate',{url:new URL('index.html',base).href});await delay(400);
    if(!await evaluate('document.querySelectorAll(".motion-pending").length===0'))throw new Error('Reduced motion hides content');
    await send('Emulation.setScriptExecutionDisabled',{value:true});
    await send('Page.navigate',{url:new URL('index.html',base).href});await delay(400);
    if(!await evaluate('!document.documentElement.classList.contains("has-js") && document.querySelectorAll(".motion-pending").length===0 && getComputedStyle(document.querySelector("#site-nav")).visibility==="visible"'))throw new Error('No-JavaScript fallback hides content or navigation');
    await send('Emulation.setScriptExecutionDisabled',{value:false});
    await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'no-preference'}]});
    await send('Page.navigate',{url:new URL('index.html',base).href});await delay(950);
    const supportsPageTransition=await evaluate('"onpageswap" in window && CSS.supports("view-transition-name","site-header")');
    if(supportsPageTransition){
      await evaluate('window.addEventListener("pageswap",event=>sessionStorage.setItem("shilab-motion-audit-transition",event.viewTransition?"yes":"no"),{once:true});document.querySelector(".sequencing-overview h2 a").click()');
      await delay(1000);
      if(!await evaluate('location.pathname.endsWith("/data.html") && sessionStorage.getItem("shilab-motion-audit-transition")==="yes"'))throw new Error('Native page transition did not start');
      await evaluate('sessionStorage.removeItem("shilab-motion-audit-transition")');
      console.log('PASS native cross-page transition on internal link navigation.');
    }
    console.log('PASS motion: entrance, once-only scroll, hover, menu open/close, filter height/fade, rapid clicks, reduced motion, no-JavaScript fallback.');
    // Exercise the main navigation as separate pages, including browser history.
    const expectPage=async(file,active)=>{
      for(let n=0;n<80;n++){
        if(await evaluate('location.pathname.endsWith('+JSON.stringify('/'+file)+') && document.readyState==="complete"'))break;
        await delay(60);
      }
      const state=await evaluate('({path:location.pathname,hash:location.hash,current:document.querySelector("#site-nav [aria-current]")?.getAttribute("href")})');
      if(!state.path.endsWith('/'+file)||state.hash||state.current!==active)throw new Error('Navigation destination mismatch: '+JSON.stringify(state));
    };
    const followNavigation=async(file)=>{
      const mobile=await evaluate('matchMedia("(max-width: 850px)").matches');
      if(mobile){await evaluate('document.querySelector(".menu-toggle").click()');await delay(320);}
      await evaluate('document.querySelector('+JSON.stringify('#site-nav a[href="'+file+'"]')+').click()');
      await expectPage(file,file);
    };
    for(const width of [1440,390]){
      await send('Emulation.setDeviceMetricsOverride',{width,height:1000,deviceScaleFactor:1,mobile:width<600});
      await send('Page.navigate',{url:new URL('index.html',base).href});
      await expectPage('index.html','index.html');
      await followNavigation('research.html');
      await followNavigation('atlas.html');
      await evaluate('document.querySelector(".atlas-card a[href=\\"data.html\\"]").click()');
      await expectPage('data.html','atlas.html');
      await evaluate('document.querySelector(".back").click()');
      await expectPage('atlas.html','atlas.html');
      for(const file of ['publications.html','lab.html','index.html'])await followNavigation(file);
      const history=await send('Page.getNavigationHistory');
      await send('Page.navigateToHistoryEntry',{entryId:history.entries[history.currentIndex-1].id});
      await expectPage('lab.html','lab.html');
      await send('Page.navigateToHistoryEntry',{entryId:history.entries[history.currentIndex].id});
      await expectPage('index.html','index.html');
      await evaluate('location.hash="research"');await delay(100);
      if(!await evaluate('document.querySelector("#site-nav [aria-current]").getAttribute("href")==="index.html"'))throw new Error('Home fragment changed the active page');
      console.log('PASS separate page navigation, atlas parent, back/forward @ '+width+'px');
    }
    const linkChecks=new Set();
    for(const width of [1440,390,320,768,1024,1920,2048,2560]){
      await send('Emulation.setDeviceMetricsOverride',{width,height:1000,deviceScaleFactor:1,mobile:width<600});
      for(const page of ['index','research','atlas','biology','data','gallery','publications','lab']){
        await send('Page.navigate',{url:new URL(page+'.html',base).href});
        await delay(220);
        for(let n=0;n<50;n++){if(await evaluate('document.readyState==="complete"'))break;await delay(100);}
        await evaluate('Promise.race([document.fonts.ready,new Promise(r=>setTimeout(r,3000))])');
        const details=await evaluate('({lang:document.documentElement.lang,chinese:/[\\u4e00-\\u9fff]/.test(document.body.innerText),width:innerWidth,scrollWidth:document.documentElement.scrollWidth,headings:document.querySelectorAll("h1").length,navigation:[...document.querySelectorAll("#site-nav a")].map(a=>a.textContent.trim()),current:document.querySelectorAll("#site-nav [aria-current]").length,broken:[...document.images].filter(i=>!i.complete||!i.naturalWidth).map(i=>i.src),rejected:!!document.querySelector(".cell-field,.hero-micrograph,.research-figure,.icon-seq,.cell-placeholder")})');
        if(details.scrollWidth>width||details.lang!=='en'||details.chinese||details.headings!==1||details.broken.length||details.rejected||details.current!==1)throw new Error(page+' '+width+': '+JSON.stringify(details));
        if(details.navigation.join('|')!=='Home|Research|CTC Atlas|Publication|The lab|GitHub ↗')throw new Error('Inconsistent navigation: '+page);
        const navLinks=await evaluate('[...document.querySelectorAll("#site-nav a")].slice(0,5).map(a=>a.getAttribute("href"))');
        if(navLinks.join('|')!=='index.html|research.html|atlas.html|publications.html|lab.html')throw new Error('Navigation links must open standalone pages: '+page);
        const expectedCurrent=['biology','data','gallery'].includes(page)?'atlas.html':page+'.html';
        if(!await evaluate('document.querySelector("#site-nav [aria-current]").getAttribute("href")==='+JSON.stringify(expectedCurrent)))throw new Error('Incorrect active navigation: '+page);
        if(page==='index'){
          const layout=await evaluate('(()=>{const hero=document.querySelector(".home-hero");const rect=hero.getBoundingClientRect();const style=getComputedStyle(hero);const resources=document.querySelector(".resources-inner");const resourceRect=resources.getBoundingClientRect();return {left:rect.left+parseFloat(style.paddingLeft),contentWidth:rect.width-parseFloat(style.paddingLeft)-parseFloat(style.paddingRight),headerLeft:parseFloat(getComputedStyle(document.querySelector(".site-header")).paddingLeft),resourceLeft:resourceRect.left+parseFloat(getComputedStyle(resources).paddingLeft),resourceBackground:getComputedStyle(document.querySelector(".home-resources")).backgroundColor}})()');
          if(Math.abs(layout.left-layout.headerLeft)>1||Math.abs(layout.left-layout.resourceLeft)>1)throw new Error('Content alignment regression @ '+width+': '+JSON.stringify(layout));
          if(layout.resourceBackground!=='rgba(0, 0, 0, 0)')throw new Error('Homepage background panels returned');
          if(width>=1920&&layout.contentWidth<Math.min(1640,width*.84)-1)throw new Error('Wide-screen content is too narrow: '+JSON.stringify(layout));
          const composition=await evaluate('(()=>{const hero=document.querySelector(".home-hero");const copy=document.querySelector(".hero-intro");const research=document.querySelector("#research");const themes=document.querySelector(".research-themes");const atlases=document.querySelector(".atlas-categories");return {copyColumns:getComputedStyle(copy).gridTemplateColumns.split(" ").length,themeColumns:getComputedStyle(themes).gridTemplateColumns.split(" ").length,researchSections:document.querySelectorAll(".home-research").length,directions:themes.querySelectorAll(":scope > article").length,researchInHero:research.parentElement===hero,researchBelow:research.getBoundingClientRect().top>=copy.getBoundingClientRect().bottom-1,researchDetails:research.querySelector(".research-heading a").getAttribute("href")==="research.html"?1:0,repeatedSections:!!document.querySelector(".hero-focus,.theme-topics,.home-publications,.home-lab,.specimen-strip"),atlases:atlases.querySelectorAll(".atlas-category").length,sequencingLink:document.querySelector(".sequencing-overview h2 a").getAttribute("href"),reservedRight:document.querySelectorAll(".research-themes>article:last-child .research-focus").length,more:[...document.querySelectorAll(".home-more>a")].map(a=>a.getAttribute("href")).join(",")}})()');
          if(composition.copyColumns!==(width>850?2:1)||composition.themeColumns!==(width>560?2:1)||composition.researchSections!==1||composition.directions!==2||!composition.researchInHero||!composition.researchBelow||composition.researchDetails!==1||composition.repeatedSections||composition.atlases!==3||composition.sequencingLink!=='data.html'||composition.reservedRight!==0||composition.more!=='publications.html,lab.html')throw new Error('Homepage information architecture regression @ '+width+': '+JSON.stringify(composition));
        }
        if(page==='publications'){
          const pubs=await evaluate('({numbers:[...document.querySelectorAll(".paper-list .paper-number")].map(e=>e.textContent),pubmed:[...document.querySelectorAll(".pubmed-link")].map(a=>a.href),authors:document.querySelectorAll(".paper-list .shi-author").length,era:document.querySelector(".paper-era-label")?.textContent.trim() || null,preprint:document.querySelector(".preprint-item").textContent})');
          if(pubs.numbers.join(',')!==Array.from({length:14},(_,i)=>i+1).join(',')||pubs.pubmed.length!==13||pubs.authors!==14||pubs.era!==null||!pubs.pubmed.every(link=>/^https:\/\/pubmed\.ncbi\.nlm\.nih\.gov\/\d+\/$/.test(link)))throw new Error('Publication regression: '+JSON.stringify(pubs));
        }
        if(page==='data'){
          const filtered=await evaluate('document.querySelector("[data-specimen-filter=blood]").click();({hidden:getComputedStyle(document.querySelector(".dataset-record")).display==="none",empty:!document.querySelector(".dataset-empty").hidden,summary:document.querySelector(".filter-summary").textContent})');
          if(!filtered.hidden||!filtered.empty||filtered.summary!=='0 published datasets')throw new Error('Blood filter failed');
          const available=await evaluate('document.querySelector("[data-specimen-filter=balf]").click();({shown:!document.querySelector(".dataset-record").hidden,empty:document.querySelector(".dataset-empty").hidden})');
          if(!available.shown||!available.empty)throw new Error('BALF filter failed');
          await evaluate('document.querySelector("[data-specimen-filter=all]").click()');
        }
        if(width<=850){
          if(!await evaluate('document.querySelector(".menu-toggle").click();document.querySelector("#site-nav").classList.contains("open")'))throw new Error('Mobile menu failed');
          await send('Input.dispatchKeyEvent',{type:'keyDown',key:'Escape',code:'Escape'});
          if(!await evaluate('!document.querySelector("#site-nav").classList.contains("open")&&document.activeElement===document.querySelector(".menu-toggle")'))throw new Error('Escape menu failed');
        }
        if(width===1440){
          const links=await evaluate('[...document.querySelectorAll("a[href],link[href],script[src]")].map(e=>e.href||e.src).filter(u=>u.startsWith(location.origin))');
          for(const link of links)linkChecks.add(link);
        }
        if(width===1440||width===390||(page==='index'&&width>=1920)){
          await delay(1000);
          if(page==='index')await screenshot(page+'-'+width+'-fold');
          // Reveal the page before taking a full-length image, without changing
          // the user-facing once-only scroll behavior.
          if(['index','research','atlas'].includes(page)){
            const height=await evaluate('document.documentElement.scrollHeight');
            for(let y=0;y<height;y+=650){await evaluate('window.scrollTo({top:'+y+',behavior:"instant"})');await delay(60);}
            await evaluate('window.scrollTo({top:0,behavior:"instant"})');await delay(1000);
          }
          await screenshot(page+'-'+width,['index','research','atlas'].includes(page));
        }
        console.log('PASS '+page+' @ '+width+'px');
      }
    }
    for(const link of linkChecks){
      const url=new URL(link);const response=await fetch(url);
      if(!response.ok)throw new Error('Broken local link '+link+' ('+response.status+')');
      if(url.hash&&url.pathname.endsWith('.html')){const html=await response.text();const id=decodeURIComponent(url.hash.slice(1));if(!html.includes('id="'+id+'"'))throw new Error('Missing anchor '+link);}
    }
    if(errors.length)throw new Error('Browser errors: '+errors.join(', '));
    console.log('PASS '+linkChecks.size+' local links / anchors; publications, menus and specimen filters intact.');
    await send('Browser.close');
  }finally{
    socket?.close();
    await delay(500);if(browser.exitCode===null)browser.kill();
    const resolved=path.resolve(profile);
    if(path.dirname(resolved)===path.resolve(os.tmpdir())&&path.basename(resolved).startsWith('shilab-audit-')){try{fs.rmSync(resolved,{recursive:true,force:true});}catch{}}
  }
})().catch(error=>{console.error(error.message);process.exitCode=1;});
