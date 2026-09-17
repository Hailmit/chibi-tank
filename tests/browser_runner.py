"""Run real Chrome with CDP. Requires Python's websocket-client package.
Use --soak for a 600-second simulation stress test (accelerated, not a real-time benchmark).
Artifacts are local, excluded from source distribution. Serves only on loopback.
"""
import base64
import functools
import http.server
import json
import os
from pathlib import Path
import subprocess
import sys
import threading
import time
import urllib.request
import websocket

ROOT = Path(__file__).resolve().parents[1]
ART = ROOT / 'artifacts'
ART.mkdir(exist_ok=True)
CDP_PORT = int(os.environ.get('CHIBI_CDP_PORT', '9229'))
PROFILE = ART / os.environ.get('CHIBI_CHROME_PROFILE', 'chrome-profile')

class Handler(http.server.SimpleHTTPRequestHandler):
    def translate_path(self, path):
        if path.startswith('/repository-name/'):
            path = path[len('/repository-name'):]
        return super().translate_path(path)
    def log_message(self, *_):
        pass

server = http.server.ThreadingHTTPServer(('127.0.0.1', 8765), functools.partial(Handler, directory=str(ROOT)))
threading.Thread(target=server.serve_forever, daemon=True).start()
chrome = Path(os.environ.get('PROGRAMFILES', r'C:\Program Files')) / 'Google/Chrome/Application/chrome.exe'
process = subprocess.Popen([str(chrome), '--headless=new', '--no-sandbox', '--disable-gpu-sandbox', '--disable-extensions', '--disable-background-networking', '--disable-component-update', '--disable-sync', '--no-first-run', '--no-default-browser-check', f'--remote-debugging-port={CDP_PORT}', '--remote-allow-origins=*', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--window-size=1440,1000', '--user-data-dir='+str(PROFILE), 'about:blank'], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, creationflags=getattr(subprocess, 'CREATE_NO_WINDOW', 0))
ws = None
events = []
counter = 0
session_id = None

def call(method, params=None, timeout=120):
    global counter
    counter += 1
    request_id = counter
    payload = {'id': request_id, 'method': method, 'params': params or {}}
    if session_id and not method.startswith(('Browser.', 'Target.')):
        payload['sessionId'] = session_id
    ws.send(json.dumps(payload))
    ws.settimeout(timeout)
    while True:
        message = json.loads(ws.recv())
        if message.get('id') == request_id:
            if 'error' in message:
                raise RuntimeError(message['error'])
            return message.get('result', {})
        events.append(message)

def evaluate(code, timeout=120):
    result = call('Runtime.evaluate', {'expression': code, 'awaitPromise': True, 'returnByValue': True}, timeout)
    if 'exceptionDetails' in result:
        raise RuntimeError(result['exceptionDetails'])
    return result.get('result', {}).get('value')

def screenshot(name):
    data = call('Page.captureScreenshot', {'format': 'png'})['data']
    (ART / name).write_bytes(base64.b64decode(data))

try:
    for _ in range(100):
        try:
            version = json.load(urllib.request.urlopen(f'http://127.0.0.1:{CDP_PORT}/json/version', timeout=1))
            break
        except Exception:
            time.sleep(.1)
    else:
        raise RuntimeError('Chrome remote debugging did not start')
    ws = websocket.create_connection(version['webSocketDebuggerUrl'], origin=f'http://localhost:{CDP_PORT}')
    target_id = call('Target.createTarget', {'url':'http://127.0.0.1:8765/repository-name/?debug&seed=2026'})['targetId']
    session_id = call('Target.attachToTarget', {'targetId':target_id,'flatten':True})['sessionId']
    call('Runtime.enable')
    call('Page.enable')
    call('Network.enable')
    call('Network.setCacheDisabled', {'cacheDisabled': True})
    call('Emulation.setDeviceMetricsOverride', {'width':1440,'height':1000,'deviceScaleFactor':1,'mobile':False})
    call('Page.navigate', {'url':'http://127.0.0.1:8765/repository-name/?debug&seed=2026'})
    for _ in range(300):
        ready = evaluate('Boolean(window.__game)')
        if ready:
            break
        time.sleep(.1)
    if not ready:
        print(json.dumps(events[-30:]), flush=True)
        screenshot('startup-error.png')
        raise RuntimeError(evaluate('JSON.stringify({url:location.href,state:document.readyState,html:document.documentElement.outerHTML})'))
    time.sleep(2)
    screenshot('menu.png')
    fullscreen_rect = evaluate("(()=>{const r=document.getElementById('fullscreen-button').getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2};})()")
    call('Input.dispatchMouseEvent', {'type':'mousePressed','x':fullscreen_rect['x'],'y':fullscreen_rect['y'],'button':'left','clickCount':1})
    call('Input.dispatchMouseEvent', {'type':'mouseReleased','x':fullscreen_rect['x'],'y':fullscreen_rect['y'],'button':'left','clickCount':1})
    time.sleep(.25)
    entered_fullscreen = evaluate("Boolean(document.fullscreenElement||document.webkitFullscreenElement)")
    if entered_fullscreen:
        evaluate("(document.exitFullscreen||document.webkitExitFullscreen).call(document)")
        time.sleep(.15)
    fullscreen_result = {'name':'Fullscreen button enters and exits browser fullscreen','pass':bool(entered_fullscreen and not evaluate("Boolean(document.fullscreenElement||document.webkitFullscreenElement)"))}
    core = evaluate("import('./tests/core-suite.js').then(m=>m.runCoreTests())")
    print(json.dumps(core, ensure_ascii=False), flush=True)
    (ART / 'core-results.json').write_text(json.dumps(core, indent=2, ensure_ascii=False), encoding='utf-8')
    smoke = evaluate("""(async()=>{
      const g=window.__game,results=[];cancelAnimationFrame(g.frameId);
      const check=(name,condition,data)=>results.push({name,pass:!!condition,...(data?{data}: {})});
      document.getElementById('play').click();cancelAnimationFrame(g.frameId);
      check('Start button enters live game',g.state==='playing');
      check('No automatic fire',g.combat.bullets.every(b=>!b.active));
      const controls=await import('./src/core.js');
      const down=code=>document.body.dispatchEvent(new KeyboardEvent('keydown',{code,bubbles:true}));
      const up=code=>document.body.dispatchEvent(new KeyboardEvent('keyup',{code,bubbles:true}));
      down('KeyW');const wasd=g.input.movement();up('KeyW');down('ArrowUp');const arrow=g.input.movement();up('ArrowUp');check('W and up arrow equivalent',wasd.x===arrow.x&&wasd.z===arrow.z);
      down('KeyW');down('KeyD');check('Diagonal normalized',Math.abs(Math.hypot(g.input.movement().x,g.input.movement().z)-1)<1e-8);g.input.clear();
      down('Space');g.step(1/60);up('Space');check('Dash consumes stamina, grants invulnerability',g.player.stamina===70&&g.player.invulnerable>0);for(let i=0;i<20;i++)g.step(1/60);check('Dash stays outside solids',g.world.grid.free(g.player.x,g.player.z,g.player.radius));
      const oldTime=g.time,oldSpawn=g.enemies.spawnTimer,oldShift=g.world.nextShift;down('Escape');up('Escape');g.step(10);check('Pause freezes simulation',g.time===oldTime&&g.enemies.spawnTimer===oldSpawn&&g.world.nextShift===oldShift);down('Escape');up('Escape');
      down('KeyW');g.input.firing=true;window.dispatchEvent(new Event('blur'));check('Blur pauses and clears held input',g.state==='paused'&&!g.input.keys.size&&!g.input.firing);g.togglePause();
      g.player.x=0;g.player.z=0;g.player.sync(0);g.updateCamera(1);g.input.clientX=innerWidth*.61;g.input.clientY=innerHeight*.45;g.input.pointerKnown=true;
      const target=g.input.aim(g.camera).clone().project(g.camera);check('Raycast maps cursor to ground',Math.abs(target.x-(.61*2-1))<1e-6&&Math.abs(target.y-(-.45*2+1))<1e-6);
      g.input.firing=true;g.player.fire=0;g.step(1/60);g.input.firing=false;const bullet=g.combat.bullets.find(b=>b.active);check('Player firing uses muzzle direction',bullet&&Math.abs(Math.atan2(bullet.vx,bullet.vz)-g.player.aim)<1e-6);
      const hp=g.player.hp;g.player.invulnerable=0;g.player.hurt(10,g);g.player.hurt(10,g);check('Damage grace prevents stacked hits',g.player.hp===hp-10);
      g.enemies.spawn({type:'scout',x:12,z:0});let e=g.enemies.list.at(-1);const kills=g.kills,score=g.score;g.enemies.hurt(e,999);g.enemies.hurt(e,999);check('Kill rewarded exactly once',g.kills===kills+1&&g.score===score+100);
      g.player.invulnerable=0;g.player.hurt(999,g);check('Game over captures run stats',g.state==='over'&&!document.getElementById('results').hidden);down('KeyR');up('KeyR');check('R starts clean new run',g.state==='playing'&&g.time===0&&g.kills===0&&g.player.hp===100&&g.combat.bullets.every(b=>!b.active));
      for(let i=0;i<5;i++){g.start();cancelAnimationFrame(g.frameId);}check('Repeated restart clears entities',g.enemies.list.length===0&&g.enemies.pending.length===0&&g.combat.pickups.length===0&&g.effects.popups.length===16);
      check('Fixed pool caps',g.combat.bullets.length===180&&g.combat.shells.length===12&&g.effects.particles.length===96&&g.effects.popups.length===16);
      const statusPanel=document.querySelector('.status-panel').getBoundingClientRect(),scorePanel=document.querySelector('.score-panel').getBoundingClientRect();check('Minimal HUD removes minimap, game header, audio and settings controls',!document.getElementById('minimap')&&!document.querySelector('.topbar')&&!document.getElementById('mute')&&!document.getElementById('pause-button')&&!document.getElementById('volume')&&!document.getElementById('shake')&&!document.getElementById('best')&&statusPanel.width<=160&&scorePanel.width<=190&&scorePanel.height<=60);
      const fullscreen=document.getElementById('fullscreen-button'),fullscreenRect=fullscreen.getBoundingClientRect();check('Fullscreen control is available on desktop and mobile',typeof g.ui.toggleFullscreen==='function'&&fullscreenRect.width>=44&&fullscreenRect.height>=44&&fullscreen.getAttribute('aria-label')==='Bật toàn màn hình');
      g.ui.update(0);g.updateCamera(1);g.world.fadeOccluders(g.player);g.world.updateGroundEffects(g.player,g.enemies.list,g.isNight);g.renderer.render(g.scene,g.camera);check('Lightweight contact shadows render without shadow maps',g.world.structureShadows.count>0&&g.world.vehicleShadows.count>=1&&!g.renderer.shadowMap.enabled);return results;
    })()""")
    smoke.append(fullscreen_result)
    print(json.dumps(smoke, ensure_ascii=False), flush=True)
    (ART / 'smoke-results.json').write_text(json.dumps(smoke, indent=2, ensure_ascii=False), encoding='utf-8')
    integration = evaluate("import('./tests/integration-suite.js').then(m=>m.runIntegrationTests(window.__game))")
    print('Integration: '+json.dumps(integration, ensure_ascii=False), flush=True)
    (ART / 'integration-results.json').write_text(json.dumps(integration, indent=2, ensure_ascii=False), encoding='utf-8')
    performance_result = evaluate("""(async()=>{const g=__game,{CONFIG}=await import('./src/config.js');g.start();cancelAnimationFrame(g.frameId);g.setQuality();for(let i=0;i<16;i++)g.enemies.spawn({type:['scout','gunner','heavy','mortar'][i%4],x:-24+(i%6)*4.8,z:-24+Math.floor(i/6)*4.8});g.updateCamera(1);g.world.fadeOccluders(g.player);g.renderer.render(g.scene,g.camera);const dayCalls=g.renderer.info.render.calls;g.setNight(true,true,true);g.renderer.render(g.scene,g.camera);const nightCalls=g.renderer.info.render.calls,pixelRatio=g.renderer.getPixelRatio(),expectedRatio=g.softwareRenderer?1:Math.min(devicePixelRatio,1.25);let enemyMeshes=0;for(const e of g.enemies.list)e.model.root.traverse(o=>{if(o.isMesh&&o.visible)enemyMeshes++;});const uiOptionRemoved=!document.getElementById('quality'),fixedHighScale=!('adjustRenderScale' in g)&&Math.abs(pixelRatio-expectedRatio)<1e-6,circularHUD=['hp-ring','stamina-ring','heat-ring'].every(id=>document.getElementById(id)),simulationFPS=Math.round(1/CONFIG.step);return {pass:dayCalls<110&&nightCalls<125&&!g.renderer.shadowMap.enabled&&g.effects.mesh.count===96&&enemyMeshes<=64&&g.settings.quality==='high'&&uiOptionRemoved&&fixedHighScale&&circularHUD&&simulationFPS===30,dayCalls,nightCalls,enemyMeshes,particleInstances:g.effects.mesh.count,quality:g.settings.quality,uiOptionRemoved,fixedHighScale,circularHUD,pixelRatio,expectedRatio,hardwareFPS:CONFIG.performance.highFPS,softwareFPS:CONFIG.performance.softwareFPS,simulationFPS,idleFPS:CONFIG.performance.idleFPS,shadows:g.renderer.shadowMap.enabled,softwareRenderer:g.softwareRenderer};})()""")
    print('Performance budget: '+json.dumps(performance_result), flush=True)
    (ART / 'performance-results.json').write_text(json.dumps(performance_result, indent=2), encoding='utf-8')
    visual = evaluate("""(()=>{const g=__game,i=g.world.grid.index(13,12);g.world.grid.tiles[i]=3;g.world.grid.hp[i]=Infinity;g.world.rebuild(i);g.player.x=0;g.player.z=0;g.player.sync(0);g.updateCamera(1);g.world.fadeOccluders(g.player);g.renderer.render(g.scene,g.camera);return {ghosts:g.world.ghosts.size,fullHeight:g.world.tiles[i].scale.y===1};})()""")
    print('Visual occlusion: '+json.dumps(visual), flush=True)
    screenshot('house-fade.png')
    evaluate("""(()=>{const g=__game;g.start();cancelAnimationFrame(g.frameId);g.updateCamera(1);g.world.fadeOccluders(g.player);g.renderer.render(g.scene,g.camera);})()""")
    screenshot('gameplay.png')
    call('Emulation.setDeviceMetricsOverride', {'width':1024,'height':768,'deviceScaleFactor':1,'mobile':False})
    resize = evaluate("""(()=>{const g=__game;g.resize();g.input.clientX=620;g.input.clientY=350;g.input.pointerKnown=true;const p=g.input.aim(g.camera).clone().project(g.camera);g.renderer.render(g.scene,g.camera);return {pass:Math.abs(p.x-(620/innerWidth*2-1))<1e-6&&Math.abs(p.y-(-350/innerHeight*2+1))<1e-6,width:innerWidth,height:innerHeight};})()""")
    print('Resize: '+json.dumps(resize), flush=True)
    screenshot('gameplay-1024.png')
    if '--soak' in sys.argv:
        # Leave every gameplay subsystem active. An invulnerable test driver keeps the
        # session alive and teleports nowhere; survival mechanics are covered above.
        soak = evaluate("""(async()=>{
          const g=__game;g.start();cancelAnimationFrame(g.frameId);g.setQuality();
          const updateUI=g.ui.update.bind(g.ui);g.ui.update=()=>{};const samples=[],started=performance.now();let maxEnemies=0,maxBullets=0,maxParticles=0,invalid=0,eliteSeen=false;
          for(let second=0;second<600;second++){
            for(let f=0;f<30;f++){g.player.invulnerable=2;g.step(1/30);maxEnemies=Math.max(maxEnemies,g.enemies.list.length+g.enemies.pending.length);maxBullets=Math.max(maxBullets,g.combat.activeBullets.size);maxParticles=Math.max(maxParticles,g.effects.active.size);}
            if(!g.world.grid.connected()||!g.world.grid.free(g.player.x,g.player.z,g.player.radius)||g.enemies.list.some(e=>!g.world.grid.free(e.x,e.z,e.radius)))invalid++;if(g.enemies.list.some(e=>e.type==='elite'))eliteSeen=true;
            if(second%60===59){g.updateCamera(1);g.world.fadeOccluders(g.player);g.renderer.render(g.scene,g.camera);samples.push({second:second+1,geometries:g.renderer.info.memory.geometries,textures:g.renderer.info.memory.textures,drawCalls:g.renderer.info.render.calls,enemies:g.enemies.list.length,shifts:g.world.shifts,heap:performance.memory?.usedJSHeapSize});await new Promise(r=>setTimeout(r,0));}
          }
          g.ui.update=updateUI;g.ui.update(0);g.renderer.render(g.scene,g.camera);
          return {pass:invalid===0&&eliteSeen&&g.world.shifts>=10&&maxEnemies<=16&&maxBullets<=180&&maxParticles<=96,time:g.time,elapsedMs:performance.now()-started,shifts:g.world.shifts,skipped:g.world.skipped,maxEnemies,maxBullets,maxParticles,eliteSeen,invalid,samples};
        })()""", timeout=300)
        print('Soak: '+json.dumps(soak), flush=True)
        (ART / 'soak-results.json').write_text(json.dumps(soak, indent=2), encoding='utf-8')
        screenshot('soak.png')
    evaluate("localStorage.removeItem('chibi-settings')")
    call('Emulation.setDeviceMetricsOverride', {'width':844,'height':390,'deviceScaleFactor':2,'mobile':True,'screenOrientation':{'type':'landscapePrimary','angle':90}})
    call('Emulation.setTouchEmulationEnabled', {'enabled':True,'maxTouchPoints':5})
    call('Page.navigate', {'url':'http://127.0.0.1:8765/repository-name/?debug&seed=2026'})
    for _ in range(300):
        if evaluate('Boolean(window.__game && document.body.classList.contains("touch"))'):
            break
        time.sleep(.1)
    screenshot('mobile-menu.png')
    mobile = evaluate("""(()=>{
      const g=__game;g.start();cancelAnimationFrame(g.frameId);g.ui.update(0);g.updateCamera(1);
      const controls=document.getElementById('touch-controls'),move=document.getElementById('move-stick'),aim=document.getElementById('aim-stick'),dash=document.getElementById('dash-button');
      const fire=(el,type,x,y,id)=>el.dispatchEvent(new PointerEvent(type,{bubbles:true,cancelable:true,pointerType:'touch',pointerId:id,clientX:x,clientY:y,button:0,buttons:type==='pointerup'?0:1}));
      const mr=move.getBoundingClientRect();fire(move,'pointerdown',mr.left+mr.width*.78,mr.top+mr.height*.5,11);const movement=g.input.movement();fire(move,'pointerup',mr.left+mr.width*.78,mr.top+mr.height*.5,11);
      const ar=aim.getBoundingClientRect();fire(aim,'pointerdown',ar.left+ar.width*.75,ar.top+ar.height*.3,12);const aiming=g.input.firing;g.player.fire=0;g.step(1/60);const shot=g.combat.bullets.some(b=>b.active);fire(aim,'pointerup',ar.left+ar.width*.75,ar.top+ar.height*.3,12);
      const dr=dash.getBoundingClientRect(),visible=getComputedStyle(controls).display!=='none';g.renderer.render(g.scene,g.camera);
      return {pass:visible&&Math.hypot(movement.x,movement.z)>.5&&aiming&&shot&&g.settings.quality==='high'&&mr.width>=44&&ar.width>=44&&dr.width>=44&&dr.right<=innerWidth&&mr.left>=0,visible,movement,aiming,shot,quality:g.settings.quality,viewport:[innerWidth,innerHeight],move:[mr.left,mr.top,mr.width,mr.height],aim:[ar.left,ar.top,ar.width,ar.height],dash:[dr.left,dr.top,dr.width,dr.height]};
    })()""")
    print('Mobile: '+json.dumps(mobile), flush=True)
    (ART / 'mobile-results.json').write_text(json.dumps(mobile, indent=2), encoding='utf-8')
    screenshot('mobile-landscape.png')
    night = evaluate("""(()=>{const g=__game;g.enemies.spawn({type:'scout',x:5,z:0});g.enemies.spawn({type:'heavy',x:-5,z:2.4});g.setNight(true,true,true);g.ui.update(0);g.updateCamera(1);g.world.fadeOccluders(g.player);g.renderer.render(g.scene,g.camera);const zombies=g.enemies.list.filter(e=>e.zombie);return {pass:document.body.classList.contains('night')&&zombies.length===2&&zombies.every(e=>e.maxHP===e.baseMaxHP*2&&e.model.zombie.visible)&&document.getElementById('day-label').textContent==='ĐÊM ZOMBIE',zombies:zombies.length,exposure:g.renderer.toneMappingExposure,sky:g.scene.background.getHexString()};})()""")
    print('Night visual: '+json.dumps(night, ensure_ascii=False), flush=True)
    (ART / 'night-results.json').write_text(json.dumps(night, indent=2, ensure_ascii=False), encoding='utf-8')
    screenshot('mobile-night.png')
    call('Emulation.setDeviceMetricsOverride', {'width':667,'height':375,'deviceScaleFactor':2,'mobile':True,'screenOrientation':{'type':'landscapePrimary','angle':90}})
    compact = evaluate("""(()=>{const g=__game;g.setNight(false,true,true);g.resize();g.ui.update(0);g.renderer.render(g.scene,g.camera);
      const rect=id=>{const r=document.getElementById(id).getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height,right:r.right,bottom:r.bottom}};
      const overlap=(a,b)=>a.x<b.right&&a.right>b.x&&a.y<b.bottom&&a.bottom>b.y;
      const status=rect('hp-ring'),panel=document.querySelector('.status-panel').getBoundingClientRect(),score=document.querySelector('.score-panel').getBoundingClientRect(),day=rect('day-cycle'),world=document.querySelector('.world-status').getBoundingClientRect(),full=rect('fullscreen-button'),toast=rect('toast'),move=rect('move-stick'),aim=rect('aim-stick'),dash=rect('dash-button');
      const inside=r=>r.x>=0&&r.y>=0&&r.right<=innerWidth&&r.bottom<=innerHeight;
      const topRects=[panel,score,day,world,full,toast],controls=[move,aim,dash];
      const aligned=[panel.top,score.top,day.y,world.top].every(y=>Math.abs(y-panel.top)<=2);
      return {pass:status.w>=40&&Math.abs(status.w-status.h)<=3&&panel.width<=145&&aligned&&topRects.every(inside)&&full.w>=44&&full.h>=44&&controls.every(inside)&&controls.every(r=>r.w>=44&&r.h>=44)&&!overlap(panel,day)&&!overlap(panel,world)&&!overlap(score,day)&&!overlap(score,world)&&!overlap(day,world)&&!overlap(full,panel)&&!overlap(full,score)&&!overlap(full,day)&&!overlap(full,world)&&!overlap(panel,toast)&&!overlap(score,toast)&&!overlap(world,toast)&&!controls.some(r=>overlap(r,toast)),viewport:[innerWidth,innerHeight],aligned,status,panel,score,day,world,full,toast,move,aim,dash};})()""")
    print('Mobile compact: '+json.dumps(compact), flush=True)
    (ART / 'mobile-compact-results.json').write_text(json.dumps(compact, indent=2), encoding='utf-8')
    screenshot('mobile-compact.png')
    overheat = evaluate("""(()=>{const g=__game,p=g.player;p.heat=100;p.overheated=true;g.ui.update(0);const panel=document.querySelector('.status-panel'),ring=document.getElementById('heat-ring'),aim=document.getElementById('aim-stick'),label=document.getElementById('aim-label');const r=panel.getBoundingClientRect();return {pass:panel.classList.contains('is-overheated')&&ring.style.getPropertyValue('--angle')==='360deg'&&document.getElementById('heat-value').textContent==='KHÓA'&&aim.classList.contains('overheated')&&label.textContent==='ĐANG HẠ NHIỆT'&&r.left>=0&&r.right<=innerWidth&&r.bottom<=innerHeight,panel:[r.x,r.y,r.width,r.height],heat:ring.style.getPropertyValue('--angle'),aimLabel:label.textContent};})()""")
    print('Mobile overheat: '+json.dumps(overheat), flush=True)
    (ART / 'mobile-overheat-results.json').write_text(json.dumps(overheat, indent=2, ensure_ascii=False), encoding='utf-8')
    screenshot('mobile-overheat.png')
    evaluate("__game.player.heat=0;__game.player.overheated=false;__game.ui.update(0)")
    pause = evaluate("""(()=>{const g=__game;g.togglePause(),el=document.querySelector('.dialog'),dialog=el.getBoundingClientRect(),resume=document.getElementById('resume').getBoundingClientRect(),home=document.getElementById('home').getBoundingClientRect(),labels=[...document.querySelectorAll('#settings label')].map(e=>e.getBoundingClientRect()),inside=r=>r.top>=dialog.top&&r.bottom<=dialog.bottom;return {pass:g.state==='paused'&&document.getElementById('touch-controls').hidden&&dialog.x>=0&&dialog.y>=0&&dialog.right<=innerWidth&&dialog.bottom<=innerHeight&&el.scrollHeight<=el.clientHeight&&el.scrollTop===0&&resume.height>=44&&home.height>=44&&inside(resume)&&inside(home)&&labels.every(r=>r.height>=44&&inside(r)),dialog,clientHeight:el.clientHeight,scrollHeight:el.scrollHeight,scrollTop:el.scrollTop,resumeHeight:resume.height,homeHeight:home.height,labelHeights:labels.map(r=>r.height)};})()""")
    print('Mobile pause: '+json.dumps(pause), flush=True)
    (ART / 'mobile-pause-results.json').write_text(json.dumps(pause, indent=2), encoding='utf-8')
    screenshot('mobile-pause.png')
    gameover = evaluate("""(()=>{const g=__game;g.togglePause();g.player.invulnerable=0;g.player.hurt(999,g);const el=document.querySelector('.dialog'),dialog=el.getBoundingClientRect(),title=document.getElementById('dialog-title').getBoundingClientRect(),restart=document.getElementById('restart').getBoundingClientRect(),home=document.getElementById('home').getBoundingClientRect(),inside=r=>r.top>=dialog.top&&r.bottom<=dialog.bottom;return {pass:g.state==='over'&&dialog.x>=0&&dialog.y>=0&&dialog.right<=innerWidth&&dialog.bottom<=innerHeight&&el.scrollHeight<=el.clientHeight&&el.scrollTop===0&&inside(title)&&inside(restart)&&inside(home)&&restart.height>=44&&home.height>=44,dialog,clientHeight:el.clientHeight,scrollHeight:el.scrollHeight,scrollTop:el.scrollTop,restartHeight:restart.height,homeHeight:home.height};})()""")
    print('Mobile game over: '+json.dumps(gameover), flush=True)
    (ART / 'mobile-gameover-results.json').write_text(json.dumps(gameover, indent=2), encoding='utf-8')
    screenshot('mobile-gameover.png')
    call('Emulation.setDeviceMetricsOverride', {'width':390,'height':844,'deviceScaleFactor':2,'mobile':True,'screenOrientation':{'type':'portraitPrimary','angle':0}})
    portrait = evaluate("""(()=>{const g=__game;g.start();g.resize();const notice=document.querySelector('.rotate-notice'),r=notice.getBoundingClientRect();return {pass:getComputedStyle(notice).display==='flex'&&r.x===0&&r.y===0&&r.width===innerWidth&&r.height===innerHeight,viewport:[innerWidth,innerHeight],notice:[r.x,r.y,r.width,r.height]};})()""")
    print('Mobile portrait play: '+json.dumps(portrait), flush=True)
    (ART / 'mobile-portrait-results.json').write_text(json.dumps(portrait, indent=2), encoding='utf-8')
    screenshot('mobile-portrait.png')
    menuPortrait = evaluate("""(()=>{const g=__game;g.home();g.resize();const play=document.getElementById('play').getBoundingClientRect(),intro=document.querySelector('.intro').getBoundingClientRect(),notice=document.querySelector('.rotate-notice');return {pass:getComputedStyle(notice).display==='none'&&play.height>=44&&intro.x>=0&&intro.right<=innerWidth&&intro.y>=0&&intro.bottom<=innerHeight,viewport:[innerWidth,innerHeight],play:[play.x,play.y,play.width,play.height],intro:[intro.x,intro.y,intro.width,intro.height]};})()""")
    print('Mobile portrait menu: '+json.dumps(menuPortrait), flush=True)
    (ART / 'mobile-menu-results.json').write_text(json.dumps(menuPortrait, indent=2), encoding='utf-8')
    screenshot('mobile-menu-portrait.png')
    errors = [e for e in events if e.get('method')=='Runtime.exceptionThrown' or (e.get('method')=='Network.responseReceived' and e['params']['response']['status']>=400)]
    print('Browser errors: '+json.dumps(errors), flush=True)
    (ART / 'browser-errors.json').write_text(json.dumps(errors, indent=2), encoding='utf-8')
    if errors or not all(r['pass'] for r in core+smoke+integration) or not performance_result['pass'] or not visual['fullHeight'] or not resize['pass'] or not mobile['pass'] or not night['pass'] or not all(result['pass'] for result in [compact,overheat,pause,gameover,portrait,menuPortrait]) or ('--soak' in sys.argv and not soak['pass']):
        sys.exit(1)
finally:
    if ws:
        try:
            call('Browser.close', timeout=3)
        except Exception:
            pass
        ws.close()
    process.terminate()
    server.shutdown()
