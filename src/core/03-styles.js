/* ───────────── Stylesheet ───────────── */
const CSS = `
:host{display:block;--wh:255,255,255;--bg0:#060a16;--tx:#f4f7ff;--tx2:rgba(244,247,255,.64);--tx3:rgba(244,247,255,.38);--line:rgba(var(--wh),.1);
  --acc:#5eead4;--acc2:#818cf8;--warm:#fbbf24;--bad:#fb7185;--ok:#34d399;--r:28px;
  --b1:rgba(99,102,241,.55);--b2:rgba(20,184,166,.45);--b3:rgba(236,72,153,.28);--b4:rgba(56,189,248,.35);
  font-family:ui-sans-serif,"SF Pro Display","Inter","Segoe UI",Roboto,system-ui,sans-serif;color:var(--tx);min-height:calc(100vh - var(--header-height,0px));
  -webkit-font-smoothing:antialiased;text-align:left}
*{box-sizing:border-box;margin:0;padding:0}
button{font:inherit;color:inherit;background:none;border:0;cursor:pointer}
.app{position:relative;min-height:inherit;background:var(--bg0);overflow:hidden;isolation:isolate}
.app[data-tod=day]{--bg0:#0a1428;--b1:rgba(59,130,246,.55);--b2:rgba(45,212,191,.5);--b3:rgba(251,191,36,.3);--b4:rgba(56,189,248,.45)}
.app[data-tod=dusk]{--bg0:#120a24;--b1:rgba(168,85,247,.5);--b2:rgba(244,114,182,.4);--b3:rgba(251,146,60,.38);--b4:rgba(99,102,241,.45)}
/* Hintergrund */
.bg{position:absolute;inset:0;z-index:-1;overflow:hidden;pointer-events:none}
.blob{position:absolute;border-radius:50%;filter:blur(90px);will-change:transform;transition:background 2s}
.b1{width:55vmax;height:55vmax;left:-12vmax;top:-18vmax;background:radial-gradient(circle,var(--b1),transparent 65%);animation:d1 38s ease-in-out infinite alternate}
.b2{width:48vmax;height:48vmax;right:-14vmax;top:8vmax;background:radial-gradient(circle,var(--b2),transparent 65%);animation:d2 46s ease-in-out infinite alternate}
.b3{width:42vmax;height:42vmax;left:20vmax;bottom:-22vmax;background:radial-gradient(circle,var(--b3),transparent 65%);animation:d3 52s ease-in-out infinite alternate}
.b4{width:32vmax;height:32vmax;right:10vmax;bottom:-10vmax;background:radial-gradient(circle,var(--b4),transparent 65%);animation:d1 60s ease-in-out infinite alternate-reverse}
@keyframes d1{to{transform:translate(8vmax,6vmax) scale(1.15)}}@keyframes d2{to{transform:translate(-9vmax,10vmax) scale(.9)}}@keyframes d3{to{transform:translate(7vmax,-8vmax) scale(1.2)}}
.grain{position:absolute;inset:0;opacity:.07;mix-blend-mode:overlay;background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")}
canvas.fx{position:absolute;top:0;left:0;width:100%;height:min(100%,100vh,1400px)}
/* Layout */
.shell{display:grid;grid-template-columns:92px minmax(0,1fr);min-height:inherit}
nav{position:sticky;top:0;align-self:start;height:calc(100vh - var(--header-height,0px));display:flex;flex-direction:column;align-items:center;gap:8px;padding:22px 0}
.logo{width:46px;height:46px;border-radius:16px;margin-bottom:14px;background:conic-gradient(from 210deg,#5eead4,#818cf8,#f472b6,#fbbf24,#5eead4);filter:saturate(1.1);box-shadow:0 0 28px rgba(129,140,248,.55);position:relative;animation:spinslow 18s linear infinite}
.logo::after{content:"";position:absolute;inset:3px;border-radius:13px;background:#0b1226}
.logo::before{content:"";position:absolute;inset:11px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#fff,#5eead4 55%,#818cf8);z-index:2}
@keyframes spinslow{to{filter:hue-rotate(360deg) saturate(1.1)}}
.nb{position:relative;width:56px;height:56px;border-radius:19px;display:grid;place-items:center;color:var(--tx3);transition:all .3s cubic-bezier(.2,.8,.2,1)}
.nb:hover{color:var(--tx);background:rgba(var(--wh),.06)}
.nb.on{color:#fff;background:linear-gradient(145deg,rgba(94,234,212,.25),rgba(129,140,248,.25));box-shadow:inset 0 0 0 1px rgba(var(--wh),.14),0 8px 24px -8px rgba(94,234,212,.5)}
.nb .lab{position:absolute;left:66px;padding:5px 10px;border-radius:10px;background:#0b1226;border:1px solid var(--line);font-size:12px;opacity:0;pointer-events:none;transform:translateX(-4px);transition:.2s;white-space:nowrap;z-index:5}
.nb:hover .lab{opacity:1;transform:none}
.nb .bd{position:absolute;top:6px;right:6px;min-width:18px;height:18px;border-radius:9px;background:var(--warm);color:#1a1202;font-size:11px;font-weight:700;display:grid;place-items:center;padding:0 5px;box-shadow:0 0 12px rgba(251,191,36,.7)}
.sp{flex:1}
main{padding:26px 28px 40px 8px;max-width:1380px;width:100%}
.bento{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));gap:16px}
.s3{grid-column:span 3}.s4{grid-column:span 4}.s5{grid-column:span 5}.s6{grid-column:span 6}.s7{grid-column:span 7}.s8{grid-column:span 8}.s12{grid-column:span 12}
/* Karten */
.c{position:relative;border-radius:var(--r);padding:20px;overflow:hidden;background:linear-gradient(150deg,rgba(var(--wh),.1),rgba(var(--wh),.035));border:1px solid var(--line);
  backdrop-filter:blur(26px) saturate(150%);-webkit-backdrop-filter:blur(26px) saturate(150%);box-shadow:0 24px 50px -24px rgba(0,0,0,.7),inset 0 1px 0 rgba(var(--wh),.1)}
.c::before{content:"";position:absolute;inset:0;pointer-events:none;opacity:0;transition:opacity .35s;background:radial-gradient(360px circle at var(--mx,50%) var(--my,0%),rgba(var(--wh),.13),transparent 60%)}
.c:hover::before{opacity:1}
.tap{cursor:pointer;transition:transform .3s cubic-bezier(.2,.8,.2,1),border-color .3s,box-shadow .3s}
.tap:hover{transform:translateY(-3px);border-color:rgba(var(--wh),.22)}.tap:active{transform:scale(.985)}
.enter .c{animation:rise .7s cubic-bezier(.2,.8,.2,1) both;animation-delay:calc(var(--i,0)*50ms)}
@keyframes rise{from{opacity:0;transform:translateY(22px) scale(.98)}to{opacity:1;transform:none}}
.h{display:flex;align-items:center;gap:8px;font-size:11px;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:var(--tx3);margin-bottom:14px}
.h .i{opacity:.8}.h .r{margin-left:auto;letter-spacing:0;text-transform:none;font-weight:500;font-size:12px;color:var(--tx2)}
.big{font-weight:200;line-height:1;letter-spacing:-.03em}
small.u{font-size:.4em;font-weight:300;color:var(--tx2);letter-spacing:0;margin-left:3px}
/* Hero */
.hero{min-height:250px;display:flex;flex-direction:column;justify-content:space-between;background:radial-gradient(120% 140% at 0% 0%,rgba(94,234,212,.18),transparent 55%),radial-gradient(90% 120% at 100% 100%,rgba(129,140,248,.2),transparent 55%),linear-gradient(150deg,rgba(var(--wh),.09),rgba(var(--wh),.03))}
.hello{font-size:15px;color:var(--tx2);font-weight:500}
.clock{font-size:clamp(64px,9vw,112px)}
.clock span{opacity:.55;animation:blink 2s steps(2) infinite}@keyframes blink{50%{opacity:.1}}
.date{font-size:16px;color:var(--tx2);margin-top:6px}
.sum{margin-top:18px;font-size:15px;line-height:1.55;color:var(--tx);max-width:46ch}.sum b{font-weight:600;color:var(--acc)}.sum b.w{color:var(--warm)}.sum b.r{color:var(--bad)}
.pp{display:flex;gap:10px;flex-wrap:wrap}
.pc{display:flex;align-items:center;gap:10px;padding:6px 14px 6px 6px;border-radius:999px;background:rgba(var(--wh),.07);border:1px solid var(--line);font-size:13px}
.av{width:30px;height:30px;border-radius:50%;display:grid;place-items:center;font-weight:700;font-size:13px;background:linear-gradient(135deg,#5eead4,#818cf8);color:#08122a;position:relative;background-size:cover;background-position:center}
.av::after{content:"";position:absolute;right:-1px;bottom:-1px;width:10px;height:10px;border-radius:50%;background:var(--ok);border:2px solid #0b1226}
.pc.away .av::after{background:#64748b}.pc small{color:var(--tx3);display:block;font-size:11px}
/* Wetter-Hero */
.wxh{display:flex;flex-direction:column;justify-content:space-between;min-height:250px;background:radial-gradient(100% 90% at 80% 0%,var(--wglow,rgba(56,189,248,.3)),transparent 60%),linear-gradient(150deg,rgba(var(--wh),.09),rgba(var(--wh),.03))}
.wx{display:block;overflow:visible}.spin{animation:spin 24s linear infinite;transform-origin:0 0}@keyframes spin{to{transform:rotate(360deg)}}
.drift{animation:drift 7s ease-in-out infinite alternate}@keyframes drift{to{transform:translateX(3px)}}
.drop{animation:fall 1.1s linear infinite}@keyframes fall{0%{transform:translateY(-3px);opacity:0}30%{opacity:1}100%{transform:translateY(9px);opacity:0}}
.tw{animation:tw 3s ease-in-out infinite}@keyframes tw{50%{opacity:.15}}.flash{animation:fl 3s infinite}@keyframes fl{0%,88%,100%{opacity:1}90%{opacity:.1}93%{opacity:1}96%{opacity:.2}}
.wtop{display:flex;justify-content:space-between;align-items:flex-start}
.wtemp{font-size:76px}.wcond{font-size:15px;color:var(--tx2);margin-top:6px}
.chips{display:flex;gap:8px;flex-wrap:wrap}
.chip{display:inline-flex;align-items:center;gap:6px;padding:7px 12px;border-radius:999px;background:rgba(var(--wh),.07);border:1px solid var(--line);font-size:12.5px;color:var(--tx2)}
.chip b{color:var(--tx);font-weight:600}.chip .i{opacity:.8}
.mini{display:flex;gap:6px;margin-top:14px}
.mini div{flex:1;text-align:center;font-size:12px;color:var(--tx2);padding:8px 2px;border-radius:14px;background:rgba(var(--wh),.05)}
.mini .wx{margin:2px auto}.mini b{display:block;color:var(--tx);font-size:13px;font-weight:600}
/* Stat */
.st{display:flex;flex-direction:column;gap:12px;min-height:150px;justify-content:space-between}
.st .top{display:flex;align-items:center;justify-content:space-between}
.st .ico{width:42px;height:42px;border-radius:14px;display:grid;place-items:center;background:rgba(var(--wh),.08);color:var(--tx2);transition:.3s}
.st.hot .ico{background:rgba(251,191,36,.2);color:var(--warm);box-shadow:0 0 24px rgba(251,191,36,.4)}
.st.cool .ico{background:rgba(94,234,212,.18);color:var(--acc)}
.st.bad .ico{background:rgba(251,113,133,.2);color:var(--bad);box-shadow:0 0 24px rgba(251,113,133,.4)}
.st .v{font-size:46px}.st .l{font-size:13px;color:var(--tx2)}.st .sub{font-size:12px;color:var(--tx3);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
/* Räume */
.rg{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}
.rg.big{grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:16px}
.rm{padding:16px;display:flex;flex-direction:column;gap:12px;min-height:150px;transition:transform .3s cubic-bezier(.2,.8,.2,1),border-color .3s,box-shadow .5s,background .5s}
.rm.lit{border-color:rgba(var(--glow,251,191,36),.5);background:radial-gradient(130% 110% at 0% 0%,rgba(var(--glow,251,191,36),.26),transparent 62%),linear-gradient(150deg,rgba(var(--wh),.08),rgba(var(--wh),.03));box-shadow:0 20px 50px -22px rgba(var(--glow,251,191,36),.55),inset 0 1px 0 rgba(var(--wh),.1)}
.rt{display:flex;align-items:center;gap:8px;font-size:13.5px;font-weight:600}.rt .i{color:var(--tx2)}
.rt .wbd{margin-left:auto;color:#fb923c;display:grid;place-items:center;animation:pulse 1.8s ease-in-out infinite}
@keyframes pulse{50%{opacity:.35}}
.rmid{display:flex;align-items:center;gap:12px}
.ring{width:62px;height:62px;flex:none}.ring text{font-size:0}
.rv{font-size:34px}
.rb{display:flex;gap:10px;flex-wrap:wrap;font-size:12px;color:var(--tx2);margin-top:auto}.rb span{display:inline-flex;align-items:center;gap:4px}.rb .i{opacity:.8}
.rb .on{color:var(--warm)}.rb .heat{color:#fb923c}
.spark{width:100%;height:46px;display:block}
.sk{height:46px;border-radius:10px;background:linear-gradient(90deg,rgba(var(--wh),.04),rgba(var(--wh),.09),rgba(var(--wh),.04));background-size:200% 100%;animation:shim 1.4s infinite}@keyframes shim{to{background-position:-200% 0}}
/* Sonne */
.sunarc{width:100%;display:block}
.srow{display:flex;justify-content:space-between;font-size:12.5px;color:var(--tx2);margin-top:2px}.srow b{color:var(--tx);font-weight:600}
/* Extras */
.ex{display:flex;flex-direction:column;gap:6px}
.xr{display:flex;align-items:center;gap:12px;padding:12px;border-radius:18px;background:rgba(var(--wh),.05);border:1px solid transparent;transition:.25s;text-align:left;width:100%}
.xr:hover{background:rgba(var(--wh),.09)}.xr .ico{width:38px;height:38px;border-radius:13px;display:grid;place-items:center;background:rgba(var(--wh),.08);color:var(--tx2);flex:none}
.xr .t{font-size:13.5px;font-weight:600}.xr .s{font-size:12px;color:var(--tx3);margin-top:1px}
.sw{margin-left:auto;width:44px;height:26px;border-radius:13px;background:rgba(var(--wh),.14);position:relative;transition:.3s;flex:none}
.sw::after{content:"";position:absolute;left:3px;top:3px;width:20px;height:20px;border-radius:50%;background:#fff;transition:.3s;box-shadow:0 2px 6px rgba(0,0,0,.4)}
.sw.on{background:linear-gradient(90deg,#5eead4,#818cf8)}.sw.on::after{left:21px}
/* Klima-Dial */
.dials{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:16px}
.dial{display:flex;flex-direction:column;align-items:center;gap:6px;padding-bottom:16px}
.dial.heat{box-shadow:0 24px 60px -24px rgba(251,146,60,.55),inset 0 1px 0 rgba(var(--wh),.1);border-color:rgba(251,146,60,.35)}
.dn{align-self:stretch;display:flex;align-items:center;gap:8px;font-weight:600;font-size:14px}.dn .pw{margin-left:auto;width:34px;height:34px;border-radius:12px;display:grid;place-items:center;background:rgba(var(--wh),.08);color:var(--tx2);transition:.25s}
.dn .pw.on{background:rgba(251,146,60,.22);color:#fb923c}
.dsvg{width:100%;max-width:220px;overflow:visible}
.dctr{position:relative;width:100%;max-width:220px;margin-top:-6px}
.dctr .mid{position:absolute;left:0;right:0;top:50%;transform:translateY(-52%);text-align:center}
.dctr .cur{font-size:50px}.dctr .tg{font-size:12px;color:var(--tx2);margin-top:4px}
.dctr .tg b{color:var(--tx);font-weight:600}
.dst{font-size:12px;color:var(--tx3);display:flex;align-items:center;gap:6px;margin-top:-4px}.dst.heat{color:#fb923c}
.dbt{display:flex;gap:14px;margin-top:6px}
.rbn{width:52px;height:52px;border-radius:18px;display:grid;place-items:center;background:rgba(var(--wh),.08);border:1px solid var(--line);transition:.25s}
.rbn:hover{background:rgba(var(--wh),.15)}.rbn:active{transform:scale(.92)}
/* Chart */
.chart{width:100%;display:block}.chart text{fill:rgba(244,247,255,.42);font-size:11px;font-family:inherit}
.leg{display:flex;flex-wrap:wrap;gap:8px 14px;margin-top:12px;font-size:12px;color:var(--tx2)}.leg i{display:inline-block;width:9px;height:9px;border-radius:50%;margin-right:6px}
/* Bad */
.bstat{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px}
.bs{padding:14px;border-radius:20px;background:rgba(var(--wh),.05);border:1px solid var(--line)}.bs .v{font-size:32px}.bs .l{font-size:12px;color:var(--tx2);margin-top:6px}
.bstatus{min-height:220px;display:flex;flex-direction:column;justify-content:space-between}
.bstatus .v{font-size:56px;font-weight:200;letter-spacing:-.03em;line-height:1.05}
.pulse{width:14px;height:14px;border-radius:50%;background:var(--ok);box-shadow:0 0 0 0 rgba(52,211,153,.6);animation:ping 2s infinite}
.pulse.busy{background:var(--bad);box-shadow:0 0 0 0 rgba(251,113,133,.6)}@keyframes ping{70%{box-shadow:0 0 0 14px rgba(52,211,153,0)}100%{box-shadow:0 0 0 0 rgba(52,211,153,0)}}
.pulse.busy{animation-name:ping2}@keyframes ping2{70%{box-shadow:0 0 0 14px rgba(251,113,133,0)}100%{box-shadow:0 0 0 0 rgba(251,113,133,0)}}
/* Vorhersage */
.fc{display:grid;grid-template-columns:repeat(auto-fit,minmax(86px,1fr));gap:10px}
.fd{padding:14px 8px;border-radius:20px;background:rgba(var(--wh),.05);text-align:center;font-size:12.5px;color:var(--tx2);display:flex;flex-direction:column;align-items:center;gap:6px}
.fd b{color:var(--tx);font-size:14px;font-weight:600}.fd .lo{color:var(--tx3)}
.fd .bar{width:6px;height:56px;border-radius:3px;background:rgba(var(--wh),.1);position:relative;margin:2px 0}
.fd .bar i{position:absolute;left:0;right:0;border-radius:3px;background:linear-gradient(180deg,#fb923c,#38bdf8)}
.hr{display:flex;gap:8px;overflow-x:auto;padding-bottom:4px;scrollbar-width:none}.hr::-webkit-scrollbar{display:none}
.hh{flex:none;width:64px;padding:12px 4px;border-radius:18px;background:rgba(var(--wh),.05);text-align:center;font-size:12px;color:var(--tx2);display:flex;flex-direction:column;align-items:center;gap:4px}.hh b{color:var(--tx);font-size:14px}
.radar{width:100%;border-radius:20px;display:block;background:rgba(var(--wh),.04);min-height:120px;object-fit:cover}
/* Sheet */
.ov{position:fixed;inset:0;z-index:50;display:none;align-items:flex-end;justify-content:center;background:rgba(3,6,16,.55);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px)}
.ov.show{display:flex;animation:fade .25s both}@keyframes fade{from{opacity:0}}
.sheet{width:min(720px,100%);max-height:88vh;overflow:auto;border-radius:34px 34px 0 0;padding:22px 22px 30px;background:linear-gradient(160deg,rgba(24,32,64,.96),rgba(10,16,36,.97));border:1px solid var(--line);border-bottom:0;box-shadow:0 -30px 80px -20px rgba(0,0,0,.8);animation:up .45s cubic-bezier(.2,.9,.2,1) both;scrollbar-width:none}
.sheet::-webkit-scrollbar{display:none}@keyframes up{from{transform:translateY(60px);opacity:0}}
.grab{width:42px;height:4px;border-radius:2px;background:rgba(var(--wh),.2);margin:-8px auto 16px}
.sh{display:flex;align-items:center;gap:14px;margin-bottom:18px}
.sh .ico{width:48px;height:48px;border-radius:16px;display:grid;place-items:center;background:rgba(var(--wh),.08)}.sh h2{font-size:22px;font-weight:600}.sh p{font-size:13px;color:var(--tx2);margin-top:2px}
.x{margin-left:auto;width:42px;height:42px;border-radius:14px;display:grid;place-items:center;background:rgba(var(--wh),.08)}.x:hover{background:rgba(var(--wh),.15)}
.sum2{display:grid;grid-template-columns:1fr auto;gap:10px;margin-bottom:6px}
.sbig{padding:16px 18px;border-radius:22px;background:linear-gradient(150deg,rgba(251,191,36,.24),rgba(var(--wh),.04));border:1px solid var(--line);display:flex;align-items:baseline;gap:10px}.sbig .big{font-size:48px}.sbig span{font-size:14px;color:var(--tx2)}
.alloff{padding:0 20px;border-radius:22px;background:rgba(251,113,133,.14);border:1px solid rgba(251,113,133,.4);color:#fecdd3;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;font-size:12px;font-weight:500;transition:.25s}.alloff:hover{background:rgba(251,113,133,.25)}
.lab2{font-size:11px;font-weight:600;letter-spacing:.16em;color:var(--tx3);margin:20px 4px 10px}
.lg{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:10px}
.lt{position:relative;padding:14px;border-radius:22px;background:rgba(var(--wh),.04);border:1px solid rgba(var(--wh),.08);display:flex;flex-direction:column;gap:3px;min-height:92px;cursor:pointer;transition:all .3s;user-select:none;-webkit-user-select:none}
.lt:active{transform:scale(.97)}
.lt.on{min-height:122px;background:linear-gradient(150deg,rgba(var(--lc),.3),rgba(var(--wh),.05) 78%);border-color:rgba(var(--lc),.5);box-shadow:0 10px 30px -12px rgba(var(--lc),.55)}
.lt .bub{width:44px;height:44px;border-radius:50%;display:grid;place-items:center;background:rgba(var(--wh),.07);color:rgba(244,247,255,.55);margin-bottom:6px;transition:.3s}
.lt.on .bub{background:rgba(var(--lc),.3);color:rgb(var(--lc));box-shadow:0 0 26px rgba(var(--lc),.65)}
.lt .n{font-size:14px;font-weight:500;color:var(--tx2)}.lt.on .n{color:var(--tx)}.lt .s{font-size:12px;color:var(--tx3)}
input[type=range]{-webkit-appearance:none;appearance:none;width:100%;height:6px;border-radius:3px;margin-top:10px;outline:none;cursor:pointer;background:linear-gradient(90deg,rgb(var(--lc)) var(--v),rgba(var(--wh),.16) var(--v))}
input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:18px;height:18px;border-radius:50%;background:#fff;box-shadow:0 2px 8px rgba(0,0,0,.5)}
input[type=range]::-moz-range-thumb{width:18px;height:18px;border:0;border-radius:50%;background:#fff}
.sctl{display:flex;align-items:center;justify-content:space-between;padding:16px;border-radius:24px;background:rgba(var(--wh),.05);border:1px solid var(--line);margin-bottom:6px}
.sctl .big{font-size:44px}.sctl .l{font-size:12px;color:var(--tx2);margin-top:4px}
.toast{position:fixed;left:50%;bottom:90px;transform:translateX(-50%);z-index:60;padding:10px 16px;border-radius:14px;background:#0b1226;border:1px solid var(--line);font-size:13px;opacity:0;pointer-events:none;transition:.3s}.toast.show{opacity:1}
.empty{padding:22px;text-align:center;color:var(--tx3);font-size:14px;border-radius:20px;border:1px dashed var(--line)}.dpl{font-size:12px;color:var(--tx3);text-align:center;margin-top:4px;min-height:15px}.empty.sm{padding:10px 14px;font-size:13px;border-radius:14px}.nowv{margin:4px 0 10px}.nowv .cdot{width:8px;height:8px;border-radius:50%;display:inline-block;margin-right:2px}
/* Touch & Mobil */
button,.tap,.lt,.vc,.vr,.xr{-webkit-tap-highlight-color:transparent;touch-action:manipulation}
.rm,.st,.lt,.xr,.vc{-webkit-user-select:none;user-select:none;-webkit-touch-callout:none}
@media (hover:none){.tap:hover{transform:none;border-color:var(--line)}.c:hover::before{opacity:0}.nb:hover{background:none;color:var(--tx3)}.nb.on:hover{color:#fff}}
@supports (height:100dvh){:host{min-height:var(--hmin,calc(100dvh - var(--header-height,0px)))}nav{height:var(--hmin,calc(100dvh - var(--header-height,0px)))}.sheet{max-height:88dvh}}
@media (max-width:860px){
  .shell{grid-template-columns:minmax(0,1fr)}main{min-width:0}
  nav{position:fixed;z-index:20;left:10px;right:10px;bottom:calc(10px + env(safe-area-inset-bottom,0px));top:auto;height:auto;flex-direction:row;justify-content:space-between;gap:2px;padding:6px;border-radius:26px;background:rgba(14,20,44,.86);backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);border:1px solid var(--line);box-shadow:0 18px 40px -10px rgba(0,0,0,.7)}
  .logo,.sp{display:none}
  .nb{flex:1;min-width:0;width:auto;height:54px;border-radius:19px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px}
  .nb .i{width:22px;height:22px}
  .nb .lab{position:static;opacity:1;transform:none;background:none;border:0;padding:0;font-size:10px;font-weight:500;letter-spacing:.01em;pointer-events:none;color:inherit;max-width:100%;overflow:hidden;text-overflow:ellipsis}
  .nb .bd{top:3px;right:50%;margin-right:-22px;min-width:16px;height:16px;font-size:10px}
  main{padding:14px 14px calc(104px + env(safe-area-inset-bottom,0px))}
  .bento{gap:12px}.s3{grid-column:span 6}.s4,.s5,.s6,.s7,.s8,.s12{grid-column:span 12}
  .rg{grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.rg.big{grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
  .bstat{grid-template-columns:repeat(2,minmax(0,1fr))}
  .clock{font-size:76px}.wtemp{font-size:64px}.hero,.wxh{min-height:0;gap:20px}
  .c{padding:16px;border-radius:24px;backdrop-filter:blur(14px) saturate(140%);-webkit-backdrop-filter:blur(14px) saturate(140%)}
  .rm{padding:14px;min-height:0;gap:10px}.rv{font-size:30px}.rw,.ring{width:54px;height:54px}.rw{width:54px;height:54px}
  .st{min-height:132px}.st .v{font-size:40px}
  .blob{filter:blur(60px)}.b4,.grain{display:none}
  .ov{align-items:flex-end;backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px)}
  .sheet{width:100%;border-radius:30px 30px 0 0;max-height:92dvh;max-height:92vh;padding:18px 16px calc(28px + env(safe-area-inset-bottom,0px));overscroll-behavior:contain;-webkit-overflow-scrolling:touch}
  @supports (height:100dvh){.sheet{max-height:92dvh}}
  .grab{width:46px;height:5px;margin:-6px auto 14px}
  .sh h2{font-size:20px}.x{width:44px;height:44px}
  .qb{min-height:42px;padding:9px 14px;font-size:13px}.vbt{min-height:42px;padding:10px 14px;font-size:13px}
  .dn .pw{width:42px;height:42px}.rbn{width:56px;height:56px}
  .lt{min-height:88px}.lt.on{min-height:116px}
  input[type=range]{height:8px;margin-top:14px}
  input[type=range]::-webkit-slider-thumb{width:28px;height:28px}input[type=range]::-moz-range-thumb{width:28px;height:28px}
  .toast{bottom:calc(96px + env(safe-area-inset-bottom,0px));max-width:calc(100vw - 32px);text-align:center}
  .sum2{grid-template-columns:1fr auto}.alloff{min-width:96px}
  .vh h1{font-size:26px}
  .sky{min-height:280px}.sky .wtemp{font-size:84px}
  .hl{min-width:0}
}
@media (max-width:380px){
  main{padding-left:12px;padding-right:12px}.clock{font-size:66px}.rgsvg{width:132px;height:132px}.rl{min-width:0;font-size:12.5px}.s3{grid-column:span 12}.st{min-height:0}
  .nb .lab{font-size:9.500px}
}
@media (prefers-reduced-motion:reduce){*,*::before,*::after{animation:none!important;transition:none!important}}
`;

const CSS3 = `
/* v5: Ring-Legende nicht mehr abschneiden */
.rings > div:first-child{flex:none}
.rl span{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
@media (max-width:860px){.rings{gap:14px;min-width:0}.rl{flex:1;min-width:0;font-size:12.5px}.rl b{padding-left:6px;flex:none}}
@media (max-width:480px){.rgsvg{width:124px;height:124px}.rings{gap:10px}}
/* v5: Schnellaktionen */
.qa{display:flex;gap:8px;overflow-x:auto;scrollbar-width:none;margin:0 -14px 14px;padding:2px 14px}.qa::-webkit-scrollbar{display:none}
.qp{flex:none;display:inline-flex;align-items:center;gap:8px;padding:10px 15px;border-radius:999px;background:rgba(var(--wh),.07);border:1px solid var(--line);color:var(--tx);font-size:13.5px;font-weight:500;white-space:nowrap;transition:transform .15s,background .2s}
.qp:active{transform:scale(.94);background:rgba(var(--wh),.14)}.qp .i{color:var(--acc)}
.qp:first-child{background:linear-gradient(135deg,rgba(129,140,248,.28),rgba(94,234,212,.2))}
@media (min-width:861px){.qa{margin:0 0 16px;padding:2px 0;flex-wrap:wrap;overflow:visible}}
/* v5: Strom */
.pwr{display:flex;align-items:baseline;justify-content:space-between;gap:10px;margin:2px 0 12px}.pwk{font-size:12.5px;color:var(--tx2);text-align:right}.pwk b{color:var(--tx);font-weight:600;font-size:15px}
.dot{width:9px;height:9px;border-radius:50%;margin-left:auto;flex:none;box-shadow:0 0 10px currentColor}
/* v5: Heizungsplan / Radar */
.schedhost{display:block;margin-top:6px;border-radius:18px;overflow:hidden}.schedhost climate-scheduler-card{display:block}
.seg button{white-space:nowrap}.seg.sm{padding:3px}.seg.sm button{padding:5px 11px;font-size:12px}
.seg.wide{display:flex;width:100%}.seg.wide button{flex:1;justify-content:center}
.h .r .seg{margin:-4px -4px -4px 0}
/* v5: Ambient */
.amb{position:fixed;inset:0;z-index:80;display:none;background:radial-gradient(120% 100% at 50% 0%,#101a3a,#03050d 70%);color:#f4f7ff;overflow:hidden;cursor:pointer;--wh:255,255,255;--tx:#f4f7ff;--tx2:rgba(244,247,255,.66);--tx3:rgba(244,247,255,.4);--line:rgba(255,255,255,.12)}
.amb.show{display:grid;place-items:center;animation:fade .6s both}
.app.ambon>.bg,.app.ambon>.shell,.app.ambon>.ov{visibility:hidden}.app.ambon>.bg *,.app.ambon>.shell *{animation-play-state:paused!important}
.ambin{display:flex;flex-direction:column;align-items:center;gap:18px;padding:24px;text-align:center;transition:transform 4s ease-in-out;max-width:100%}
.ambc{font-size:min(26vw,220px);font-weight:200;line-height:1;letter-spacing:-.03em}.ambc span{opacity:.5;animation:blink 2s steps(2) infinite}@keyframes blink{50%{opacity:.15}}
.ambd{font-size:clamp(16px,3vw,26px);color:var(--tx2)}
.ambr{display:flex;gap:clamp(18px,5vw,56px);flex-wrap:wrap;justify-content:center;margin-top:8px}
.ambw{display:flex;align-items:center;gap:14px}.ambw .wx{width:64px;height:64px}
.ambt{font-size:clamp(34px,7vw,64px);font-weight:300;line-height:1}.ambt small{font-size:.45em;opacity:.6;margin-left:2px}.ambs{font-size:14px;color:var(--tx2);text-align:left}
.ambl{display:flex;flex-wrap:wrap;gap:8px 10px;justify-content:center;max-width:min(92vw,820px);margin-top:6px}
.ambx{display:flex;align-items:center;gap:12px;font-size:clamp(14px,2vw,18px);color:var(--tx2)}.ambx i{width:4px;height:4px;border-radius:50%;background:var(--tx3)}.ambx b{display:inline-flex;align-items:center;gap:6px;font-weight:500;color:#7dd3fc}
.ambn{display:inline-flex;align-items:center;gap:10px;padding:10px 18px;border-radius:999px;background:rgba(255,255,255,.07);font-size:clamp(14px,2vw,18px)}.ambn.warn{color:#fbbf24;background:rgba(251,191,36,.12)}.ambn small{color:var(--tx3);font-size:.85em;margin-left:4px}
.ambp{justify-content:center;margin-top:6px}.ambh{font-size:12px;color:var(--tx3);margin-top:10px}
/* v5: Heller Modus */
.app{color:var(--tx)}
.app.light .al.warn{color:#92400e;background:rgba(251,191,36,.22)}.app.light .al.bad{color:#9f1239;background:rgba(251,113,133,.18)}.app.light .al.info{color:#075985;background:rgba(56,189,248,.18)}.app.light .al.ok{color:#065f46}
.app.light .tag.ok,.app.light .okc span{color:#047857}.app.light .tag.warn{color:#b45309}.app.light .tag.bad{color:#be123c}.app.light .tag.live,.app.light .dp{color:#0369a1}
.app.light .alloff{color:#be123c}.app.light .seg button.on{color:var(--tx)}.app.light .nb.on:hover{color:var(--tx)}
.app.light .xr .ico,.app.light .vr .ico{background:rgba(15,23,42,.06)}
.app.light .sw{background:rgba(15,23,42,.18)}.app.light .sw.on{background:var(--acc)}
.app.light{--bg0:#e9eef8;--tx:#0f172a;--tx2:rgba(15,23,42,.68);--tx3:rgba(15,23,42,.45);--line:rgba(15,23,42,.1);--wh:15,23,42;--acc:#0d9488;--acc2:#4f46e5;--warm:#d97706;--bad:#e11d48;--ok:#059669;--b1:rgba(99,102,241,.22);--b2:rgba(20,184,166,.2);--b3:rgba(236,72,153,.12);--b4:rgba(56,189,248,.2)}
.app.light[data-tod=day]{--bg0:#e6f0fb}.app.light[data-tod=dusk]{--bg0:#efe9f8}.app.light[data-tod=night]{--bg0:#e7ebf5}
.app.light .grain{opacity:.03}
.app.light .c{background:linear-gradient(150deg,rgba(255,255,255,.86),rgba(255,255,255,.58));box-shadow:0 14px 34px -22px rgba(30,41,90,.45),inset 0 1px 0 rgba(255,255,255,.9);border-color:rgba(15,23,42,.07)}
.app.light .c.hero{background:radial-gradient(120% 140% at 0% 0%,rgba(94,234,212,.28),transparent 55%),radial-gradient(90% 120% at 100% 100%,rgba(129,140,248,.26),transparent 55%),linear-gradient(150deg,rgba(255,255,255,.9),rgba(255,255,255,.62))}
.app.light .c.wxh{background:radial-gradient(100% 90% at 80% 0%,var(--wglow,rgba(56,189,248,.3)),transparent 60%),linear-gradient(150deg,rgba(255,255,255,.9),rgba(255,255,255,.62))}
.app.light .c.sky{--tx:#f4f7ff;--tx2:rgba(244,247,255,.74);--tx3:rgba(244,247,255,.5);--wh:255,255,255;--line:rgba(255,255,255,.18);color:#f4f7ff;box-shadow:0 14px 34px -18px rgba(15,23,42,.5)}
.app.light .nb.on{color:var(--tx);background:linear-gradient(145deg,rgba(13,148,136,.2),rgba(79,70,229,.18));box-shadow:inset 0 0 0 1px rgba(15,23,42,.08),0 8px 24px -8px rgba(13,148,136,.35)}
.app.light .nb .lab,.app.light .toast{background:#fff;color:var(--tx);box-shadow:0 8px 24px -10px rgba(15,23,42,.35)}
.app.light .logo::after{background:#fff}.app.light .av::after{border-color:#fff}
.app.light .ov{background:rgba(30,41,59,.38)}
.app.light .sheet{background:linear-gradient(160deg,#ffffff,#eef2fb);box-shadow:0 -30px 80px -20px rgba(15,23,42,.35)}
.app.light .alerts .al,.app.light .qp{background:rgba(255,255,255,.75)}
.app.light .qp:first-child{background:linear-gradient(135deg,rgba(129,140,248,.25),rgba(94,234,212,.3))}
.app.light .mpb.main,.app.light .sw.on{color:var(--tx)}
@media (max-width:860px){.app.light nav{background:rgba(255,255,255,.88);box-shadow:0 18px 40px -14px rgba(15,23,42,.35)}}
@media (min-width:861px){.nb.gear{margin-top:0}}
@media (max-width:860px){.nb.gear{display:none}}

/* v5.2.4 Fenster-&-Türen-Sheet im Lichter-Stil */
.sbig.cs{background:linear-gradient(150deg,rgba(251,146,60,.28),rgba(var(--wh),.04))}.sbig.cs.ok{background:linear-gradient(150deg,rgba(52,211,153,.24),rgba(var(--wh),.04));align-items:center}
.sbig .okl{display:flex;align-items:center;gap:10px;font-size:16px;font-weight:600;color:#6ee7b7}
.cbox{padding:0 18px;border-radius:22px;background:rgba(var(--wh),.045);border:1px solid var(--line);display:flex;flex-direction:column;justify-content:center;gap:3px;font-size:13px;color:var(--tx2);min-width:104px}.cbox b{color:var(--tx);font-weight:600;font-size:15px}.cbox span{white-space:nowrap}.cbox small{font-size:11px;color:var(--tx3);margin-top:2px}
.ct{display:flex;align-items:center;gap:12px;padding:12px 14px;border-radius:20px;background:rgba(var(--wh),.04);border:1px solid rgba(var(--wh),.08);cursor:pointer;min-width:0;transition:all .25s}
.ct .bub{width:38px;height:38px;border-radius:50%;display:grid;place-items:center;flex:none;background:rgba(var(--wh),.07);color:var(--tx3)}
.ct .tx{min-width:0;flex:1}.ct .n{font-size:14px;font-weight:500;color:var(--tx2);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.ct .s{font-size:12px;color:var(--tx3);margin-top:1px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ct.open{flex-direction:column;align-items:flex-start;gap:4px;padding:14px;min-height:118px;background:linear-gradient(150deg,rgba(251,146,60,.3),rgba(var(--wh),.05) 78%);border-color:rgba(251,146,60,.5);box-shadow:0 10px 30px -12px rgba(251,146,60,.55)}
.ct.open .bub{width:44px;height:44px;margin-bottom:6px;background:rgba(251,146,60,.3);color:#fb923c;box-shadow:0 0 26px rgba(251,146,60,.6)}
.ct.open .tx{width:100%;margin-top:auto}.ct.open .n{color:var(--tx);white-space:normal}.ct.open .s{color:#fdba74;font-weight:500}
.ct:not(.open){gap:10px;padding:10px 12px}.ct:not(.open) .bub{width:34px;height:34px}.ct:not(.open) .n{white-space:normal;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;line-height:1.25;font-size:13.5px;text-overflow:clip}
.app.light .ct.open .bub,.app.light .ct.open .s{color:#c2410c}.app.light .sbig .okl{color:#047857}
@media (max-width:520px){.cbox{min-width:92px;padding:0 14px}}

/* v5.2.3 Ring und Icon deckungsgleich */
.rw .ring{width:100%;height:100%}.rw .ri svg{display:block}
@media (max-width:520px){.rm .rw{width:54px;height:54px}}

/* v5.2.2 kompakte Kennzahlen am Handy */
@media (max-width:520px){
  .st.s3{grid-column:span 6;display:grid;grid-template-columns:auto 1fr;grid-template-areas:"ico num" "lab lab" "sub sub";align-items:center;gap:0 10px;min-height:0;padding:14px 14px 12px}
  .st .top{grid-area:ico}.st .ico{width:36px;height:36px;border-radius:12px}.st .ico svg{width:19px;height:19px}
  .st>div:last-child{display:contents}
  .st .v{grid-area:num;justify-self:end;font-size:32px;line-height:1}.st .v[style]{font-size:21px!important}
  .st .l{grid-area:lab;margin-top:10px;font-size:12.5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .st .sub{grid-area:sub;margin-top:1px;font-size:11.5px}
  .st.hot .ico,.st.bad .ico{box-shadow:0 0 16px rgba(251,191,36,.3)}.st.bad .ico{box-shadow:0 0 16px rgba(251,113,133,.3)}
}
/* v5.2 */
.vr.qr .s{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.sh .ico{flex:none}.sh>div:nth-child(3),.sh>div:nth-child(2){min-width:0}.vkick{font-size:10.5px;font-weight:700;letter-spacing:.16em;color:var(--tx3);margin-bottom:3px}.vst.hot .vkick{color:#7dd3fc}.vst.live .vkick{color:#6ee7b7}.vst.warn .vkick{color:#fcd34d}.vst.ok .vkick{color:#6ee7b7}
.sh .bk{margin-left:0;flex:none;width:38px;height:38px}.sh .bk svg{transform:rotate(180deg)}
.sh .vtag{margin-left:auto;flex:none}.sh .vtag+.x{margin-left:0}
.vst{display:flex;align-items:center;gap:14px;padding:16px 18px;border-radius:24px;border:1px solid var(--line);background:rgba(var(--wh),.05)}
.vst .vsi{width:52px;height:52px;border-radius:18px;display:grid;place-items:center;flex:none;background:rgba(var(--wh),.08)}
.vst .vh1{font-size:17px;font-weight:600;line-height:1.25}.vh2{font-size:12.5px;color:var(--tx2);margin-top:3px;line-height:1.35}
.vst.hot{background:linear-gradient(150deg,rgba(56,189,248,.26),rgba(var(--wh),.04));border-color:rgba(56,189,248,.35)}.vst.hot .vsi{background:rgba(56,189,248,.22);color:#7dd3fc}
.vst.live{background:linear-gradient(150deg,rgba(52,211,153,.22),rgba(var(--wh),.04));border-color:rgba(52,211,153,.35)}.vst.live .vsi{background:rgba(52,211,153,.22);color:#6ee7b7}
.vst.warn{background:linear-gradient(150deg,rgba(251,191,36,.18),rgba(var(--wh),.04));border-color:rgba(251,191,36,.3)}.vst.warn .vsi{background:rgba(251,191,36,.2);color:#fcd34d}
.vst.ok .vsi{background:rgba(52,211,153,.16);color:#6ee7b7}
.vact{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px}.vact:empty{display:none}
.vbt.big{display:inline-flex;align-items:center;gap:7px;padding:10px 14px;font-size:13px;min-height:42px}.vbt.on{background:rgba(56,189,248,.2);border-color:rgba(56,189,248,.45);color:#7dd3fc}.vbt[disabled]{opacity:.3;pointer-events:none}
.vts3{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:14px}
.vt{padding:13px 14px;border-radius:20px;background:rgba(var(--wh),.05);border:1px solid var(--line);min-width:0}.vt.tap{cursor:pointer}
.vtl{display:flex;align-items:center;gap:6px;font-size:10.5px;font-weight:600;letter-spacing:.14em;color:var(--tx3)}
.vtv{font-size:26px;font-weight:300;margin-top:6px;white-space:nowrap}.vtv small{font-size:12px;color:var(--tx2);margin-left:3px}
.vts{font-size:11.5px;color:var(--tx2);margin-top:6px;display:flex;flex-direction:column;gap:5px;align-items:flex-start}
.wbar{position:relative;width:100%;height:5px;border-radius:3px;background:rgba(var(--wh),.14)}.wbar i{display:block;height:100%;border-radius:3px;background:linear-gradient(90deg,#34d399,#fbbf24 60%,#fb7185)}.wbar u{position:absolute;top:-2px;bottom:-2px;width:1px;background:rgba(var(--wh),.5)}
.vnote{display:flex;gap:12px;margin-top:12px;padding:14px 16px;border-radius:20px;background:rgba(var(--wh),.045);border:1px solid var(--line);font-size:13px;line-height:1.45}.vnote>svg{flex:none;margin-top:2px;color:var(--tx2)}.vnote span{color:var(--tx2);font-size:12.5px}
.vrbox{display:block}.vrhd{display:flex;align-items:center;gap:12px;font-size:12px;color:var(--tx2);margin-bottom:8px}.vleg{display:inline-flex;align-items:center;gap:6px}.vleg i{width:10px;height:10px;border-radius:50%;display:inline-block}.vago{margin-left:auto;color:var(--tx3)}
.vrs{display:flex;justify-content:space-between;align-items:baseline;gap:10px;flex-wrap:wrap;margin-bottom:6px;font-size:13px}.vrs small{color:var(--tx3)}.vrt{font-size:12px;color:var(--tx3)}.vrs .tag{margin-left:6px}
.vrplot{position:relative;height:104px}.vrch{width:100%;height:100%;display:block;overflow:visible}
.vrdot{position:absolute;width:10px;height:10px;margin:-5px 0 0 -5px;border-radius:50%;background:#38bdf8;box-shadow:0 0 0 4px rgba(56,189,248,.25)}
.vrx{display:flex;justify-content:space-between;font-size:11px;color:var(--tx3);margin-top:6px}
.vchips{display:flex;flex-wrap:wrap;gap:8px}.vchip{display:inline-flex;align-items:center;gap:6px;padding:7px 12px;border-radius:999px;background:rgba(var(--wh),.07);border:1px solid var(--line);font-size:12.5px;color:var(--tx2)}.vchip b{color:var(--tx);font-weight:600}.vchip.btn{cursor:pointer}.vchip.good{color:#6ee7b7;background:rgba(52,211,153,.14)}.vchip.bad{color:#fda4af;background:rgba(251,113,133,.15)}
.vchip .chev svg{transition:transform .2s}.vchip .chev.up svg{transform:rotate(-90deg)}.vchip .chev svg{transform:rotate(90deg)}.vchip .chev.up svg{transform:rotate(-90deg)}
.vstat{margin-top:10px}.vr .m small{display:block;color:var(--tx3);font-size:11px}
.tr.dense{gap:2px}.tr.dense i{max-width:none;border-radius:4px 4px 2px 2px}.tr.dense div{font-size:9.5px}
.av.big2{width:52px;height:52px;font-size:20px;flex:none}
.pc.tap{cursor:pointer}
.qbtns{margin-left:auto;display:flex;gap:6px;flex:none}.qbtns .vbt{min-width:36px;padding:8px}
.qnew{display:flex;gap:8px;flex-wrap:wrap}.qnew input{flex:1;min-width:150px;padding:11px 14px;border-radius:14px;border:1px solid var(--line);background:rgba(var(--wh),.06);color:var(--tx);font:inherit;font-size:14px;outline:none}.qnew input:focus{border-color:rgba(56,189,248,.6)}
.adev{padding:12px;border-radius:20px;background:rgba(var(--wh),.045);border:1px solid rgba(var(--wh),.07);margin-bottom:8px}.adev.off{opacity:.6}
.ahd{display:flex;align-items:center;gap:12px}.ahd>div:nth-child(2){min-width:0;flex:1}.ahd .ico{width:38px;height:38px;border-radius:13px;display:grid;place-items:center;background:rgba(var(--wh),.07);color:var(--tx2);flex:none}.ahd .t{font-weight:600;font-size:14px}.ahd .s{font-size:12px;color:var(--tx3);margin-top:2px}
.actl{display:flex;flex-wrap:wrap;gap:6px;margin-top:10px}
@media (max-width:520px){.vts3{grid-template-columns:1fr 1fr}.vtv{font-size:24px}}
.app.light .vst.hot .vsi{color:#0369a1}.app.light .vst.live .vsi,.app.light .vst.ok .vsi{color:#047857}.app.light .vst.warn .vsi{color:#b45309}.app.light .vbt.on{color:#0369a1}.app.light .vchip.good{color:#047857}.app.light .vchip.bad{color:#be123c}
.wl{display:flex;flex-direction:column;gap:10px}
.wc{display:flex;align-items:center;gap:14px;padding:14px 16px;border-radius:22px;background:linear-gradient(135deg,rgba(var(--c),.16),rgba(var(--wh),.035));border:1px solid rgba(var(--c),.3);box-shadow:0 10px 30px -16px rgba(var(--c),.6);min-width:0}
.wc.nx{border-color:rgba(var(--c),.62);box-shadow:0 12px 36px -12px rgba(var(--c),.85)}
.wc .bub{width:46px;height:46px;border-radius:15px;display:grid;place-items:center;flex:none;background:rgba(var(--c),.2);color:rgb(var(--c))}
.wc .tx{flex:1;min-width:0}.wc .n{font-size:17px;font-weight:600;color:var(--tx);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.wc .s{font-size:13px;color:var(--tx2);margin-top:2px}
.wc .bd{font-size:12px;font-weight:600;padding:5px 11px;border-radius:99px;background:rgba(var(--c),.22);color:rgb(var(--c));flex:none;white-space:nowrap}
.sbig.wh{background:linear-gradient(150deg,rgba(var(--c),.32),rgba(var(--wh),.04))}.sbig.wh .big.sm{font-size:32px;line-height:1.1}
.app.light .wc .bd,.app.light .wc .bub{color:var(--tx)}.app.light .wc{background:linear-gradient(135deg,rgba(var(--c),.2),rgba(255,255,255,.5))}
`;
