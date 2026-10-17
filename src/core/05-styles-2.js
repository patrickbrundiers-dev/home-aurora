const CSS4 = `
.rdc .h .r{margin-left:auto}.rd-open{display:inline-flex;gap:6px;align-items:center;border:0;border-radius:999px;padding:6px 12px;background:rgba(var(--wh),.08);color:var(--tx);font:inherit;font-size:12px;font-weight:600;cursor:pointer}.rd-open:hover{background:rgba(var(--wh),.14)}
.rdslot{position:relative;height:clamp(390px,62vw,480px);border-radius:20px;overflow:hidden;background:#0b1020;isolation:isolate}
.rdslot.full{height:100vh;height:100dvh;border-radius:0}
.ov.rdfull{align-items:stretch;background:#000;backdrop-filter:none;-webkit-backdrop-filter:none}
.ov.rdfull .sheet{width:100%;max-width:none;max-height:none;height:100vh;height:100dvh;padding:0;border:0;border-radius:0;overflow:hidden;box-shadow:none;background:#0b1020;animation:fade .25s both}
.rdm{position:absolute;inset:0;overflow:hidden;color:#fff;font-family:inherit;-webkit-user-select:none;user-select:none}
.rd-map{position:absolute;inset:0;cursor:pointer;touch-action:auto}.rdm.full .rd-map{cursor:grab;touch-action:none}.rdm.full .rd-map:active{cursor:grabbing}
.rd-world{position:absolute;left:0;top:0;width:0;height:0;will-change:transform}
.rd-base,.rd-fr,.rd-bl,.rd-wn,.rd-rf,.rd-ov{position:absolute;left:0;top:0}.rd-rf{opacity:.9}
.rd-t{position:absolute;width:256px;height:256px;max-width:none;pointer-events:none;-webkit-user-drag:none}
.rd-f,.rd-bl img,.rd-wn img{position:absolute;max-width:none;pointer-events:none}.rd-f{opacity:0;transition:opacity .18s}.rd-f.on{opacity:.85}.rd-bl img{opacity:.8}.rd-wn img{opacity:.5}
.rd-ov>i{position:absolute;display:block;transform:translate(-50%,-50%);pointer-events:none}
.rd-home{width:14px;height:14px;border-radius:50%;background:#fff;border:4.5px solid var(--acc,#5eead4);width:18px;height:18px;box-shadow:0 0 0 7px rgba(94,234,212,.2),0 0 20px rgba(94,234,212,.75);animation:rdpulse 2.6s infinite}@keyframes rdpulse{50%{box-shadow:0 0 0 12px rgba(94,234,212,.06),0 0 24px rgba(94,234,212,.9)}}
.rd-ring{border:1.5px dashed rgba(250,204,21,.55);border-radius:50%}
.rd-s{color:#fde047;filter:drop-shadow(0 0 6px rgba(250,204,21,.9))}.rd-s.n{animation:rdflash 1.1s ease-in-out infinite}.rd-s.o{color:#fbbf24;opacity:.85}.rd-s.x{color:#94a3b8;opacity:.55;filter:none}@keyframes rdflash{50%{transform:translate(-50%,-50%) scale(1.35);filter:drop-shadow(0 0 14px #fff)}}
.rd-s .i{display:block;fill:currentColor}
.rd-wind{position:absolute;inset:0;width:100%;height:100%;pointer-events:none}
.rd-vig{position:absolute;inset:0;pointer-events:none;background:radial-gradient(130% 100% at 50% 45%,transparent 62%,rgba(5,8,20,.4)),linear-gradient(rgba(5,8,20,.45),transparent 22%,transparent 72%,rgba(5,8,20,.55))}
.rd-fx{position:absolute;inset:0;pointer-events:none;overflow:hidden;opacity:0;transition:opacity .6s;container-type:size}.rd-fx.on{opacity:1}
.rd-fx i{position:absolute;top:-24px;display:block}
.rd-fx.rain i{width:1.5px;height:16px;background:linear-gradient(transparent,rgba(147,197,253,.75));animation:rdfall linear infinite}@keyframes rdfall{to{transform:translateY(112cqh)}}
.rd-fx.snow i{width:5px;height:5px;border-radius:50%;background:#fff;opacity:.85;animation:rdsnow linear infinite}@keyframes rdsnow{0%{transform:translate(0,0)}50%{transform:translate(14px,56cqh)}100%{transform:translate(-6px,112cqh)}}
.rd-top{position:absolute;left:10px;right:10px;top:10px;display:flex;justify-content:space-between;gap:10px;pointer-events:none}
.rdm.full .rd-say{font-size:26px}.rdm.full .rd-top{top:calc(10px + env(safe-area-inset-top,0px));left:62px;right:12px}
.rd-top button{pointer-events:auto}
.rd-l{display:flex;flex-direction:column;gap:6px;align-items:flex-start;min-width:0;flex:0 0 auto;max-width:62%}.rd-r{display:flex;flex-direction:column;gap:6px;align-items:flex-end;text-align:right;min-width:0;flex:1 1 0}
.rd-k{font-size:10.5px;font-weight:700;letter-spacing:.16em;color:#cbd5e1;text-shadow:0 1px 6px rgba(0,0,0,.6)}.rdm:not(.full) .rd-k{display:none}
.rd-live{display:inline-flex;align-items:center;gap:6px;font-size:11px;font-weight:600;color:#e2e8f0;padding:4px 10px;border-radius:999px;background:rgba(8,12,28,.66);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px)}
.rd-live i{width:7px;height:7px;border-radius:50%;background:#22c55e;box-shadow:0 0 8px #22c55e;animation:rdblink 1.6s infinite}.rd-live.st i{background:#f59e0b;box-shadow:0 0 8px #f59e0b;animation:none}@keyframes rdblink{50%{opacity:.35}}
.rd-say{font-weight:800;font-size:22px;line-height:1.1;letter-spacing:-.01em;max-width:100%;text-wrap:balance;text-shadow:0 2px 14px rgba(0,0,0,.75)}
.rd-say.t-dry{color:#7dd3fc}.rd-say.t-soon{color:#fcd34d}.rd-say.t-now{color:#60a5fa}
.rd-sub{font-size:12px;color:#e2e8f0;text-shadow:0 1px 6px rgba(0,0,0,.7)}
.rd-leg{display:flex;align-items:center;gap:2px;font-size:9.5px;color:#cbd5e1;text-shadow:0 1px 4px rgba(0,0,0,.7)}.rd-leg span{display:flex;flex-direction:column;align-items:center;gap:2px;min-width:30px}.rd-leg i{display:block;width:100%;height:6px}.rd-leg span:first-child i{border-radius:3px 0 0 3px}.rd-leg span:last-child i{border-radius:0 3px 3px 0}.rdm:not(.full) .rd-leg span{min-width:22px;font-size:0}.rdm:not(.full) .rd-leg span:first-child,.rdm:not(.full) .rd-leg span:last-child{font-size:9px}.rdm:not(.full) .rd-leg span:first-child{align-items:flex-start}.rdm:not(.full) .rd-leg span:last-child{align-items:flex-end}
.rd-src{display:inline-flex;pointer-events:auto;padding:3px;gap:2px;border-radius:999px;background:rgba(var(--wh),.08)}.rd-src button{border:0;border-radius:999px;padding:5px 11px;background:none;color:var(--tx2,#cbd5e1);font:inherit;font-size:12px;font-weight:600;cursor:pointer}.rd-src button.on{background:var(--acc,#5eead4);color:#04121a}
.rdm .rd-src{background:rgba(8,12,28,.72);border:1px solid rgba(255,255,255,.14);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px)}.rdm .rd-src button{color:#e2e8f0}.rdm .rd-src button.on{color:#04121a}.rdm:not(.full) .rd-srcw{display:none}.rdc .h .r{display:flex;gap:8px;align-items:center}
.rd-emb{position:absolute;inset:0;display:none;background:#0b1020}.rd-emb iframe{width:100%;height:100%;border:0;display:block}.rdm.emb .rd-emb{display:block}.rdm.full.emb .rd-emb{top:calc(68px + env(safe-area-inset-top,0px))}
.rdm.emb .rd-map,.rdm.emb .rd-wind,.rdm.emb .rd-fx,.rdm.emb .rd-vig,.rdm.emb .rd-r,.rdm.emb .rd-live,.rdm.emb .rd-k,.rdm.emb .rd-warns,.rdm.emb .rd-ctl,.rdm.emb .rd-pills,.rdm.emb .rd-tl,.rdm.emb .rd-att,.rdm.emb .rd-err{display:none}.rdm.full.emb{background:#0b1020}.rdm.full.emb .rd-top{top:calc(14px + env(safe-area-inset-top,0px))}
.rd-type:empty{display:none}.rd-type span{display:inline-flex;align-items:center;gap:5px;font-size:11px;font-weight:600;padding:4px 10px;border-radius:999px;background:rgba(8,12,28,.7);border:1px solid rgba(255,255,255,.12)}
.rd-warns{display:flex;flex-direction:column;gap:6px;align-items:flex-start;max-width:100%}.rd-warns:empty{display:none}
.rd-w{display:inline-flex;align-items:center;gap:6px;border:1.5px solid transparent;border-radius:18px;padding:5px 11px;font:inherit;font-size:12px;font-weight:700;box-shadow:0 4px 14px rgba(0,0,0,.35);cursor:pointer;max-width:100%;text-align:left}.rd-w span{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.rd-w.more{background:rgba(10,16,32,.78);color:#e2e8f0;border-color:rgba(255,255,255,.18)}
.rd-w.l1{background:#fde047;color:#3b2f00}.rd-w.l2{background:#fb923c;color:#3a1a00}.rd-w.l3{background:#ef4444;color:#fff}.rd-w.l4{background:#a21caf;color:#fff}
.rd-w.pre{background:rgba(8,12,28,.75);border-style:dashed}.rd-w.pre.l1{color:#fde047;border-color:#fde047}.rd-w.pre.l2{color:#fb923c;border-color:#fb923c}.rd-w.pre.l3{color:#f87171;border-color:#f87171}.rd-w.pre.l4{color:#e879f9;border-color:#e879f9}
.rd-w.rdp{animation:rdwp 1.8s infinite}@keyframes rdwp{0%{box-shadow:0 0 0 0 rgba(239,68,68,.65)}70%{box-shadow:0 0 0 10px rgba(239,68,68,0)}100%{box-shadow:0 0 0 0 rgba(239,68,68,0)}}
.rd-ctl{position:absolute;right:10px;top:50%;transform:translateY(-50%);display:flex;flex-direction:column;gap:8px}
.rd-cb{width:42px;height:42px;border-radius:50%;border:1px solid rgba(255,255,255,.14);background:rgba(8,12,28,.72);color:#fff;display:grid;place-items:center;backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);cursor:pointer;padding:0}.rd-cb:hover{background:rgba(30,41,80,.85)}
.rdm:not(.full) .rd-cb.z,.rdm:not(.full) .rd-cb.rdx,.rdm.full .rd-cb.ex{display:none}
.rdm.full .rd-cb.rdx{position:absolute;left:12px;top:calc(10px + env(safe-area-inset-top,0px));z-index:6;width:48px;height:48px;pointer-events:auto;filter:none;animation:none}
.rd-pills{position:absolute;left:10px;right:10px;bottom:76px;display:flex;flex-wrap:wrap;gap:6px 8px;align-items:flex-end;justify-content:space-between;pointer-events:none}.rdm.full .rd-pills{bottom:calc(80px + env(safe-area-inset-bottom,0px))}.rd-bp{margin-left:auto}
.rd-wc,.rd-bc{display:flex;align-items:center;gap:10px;padding:6px 12px 6px 8px;border-radius:16px;background:rgba(10,16,32,.78);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,.1);font-size:12px}
.rd-wc b{font-size:15px;color:var(--wc)}.rd-wc small{font-size:11px;font-weight:500;color:#cbd5e1}.rd-wc s{display:block;text-decoration:none;color:#cbd5e1;font-size:11px;margin-top:1px}
.rd-cp{position:relative;width:36px;height:36px;border-radius:50%;border:1.5px solid var(--wc);display:grid;place-items:center;color:var(--wc);flex:none}.rd-cp svg{width:20px;height:20px;transition:transform .6s}.rd-cp em{position:absolute;top:-1px;font-style:normal;font-size:7px;font-weight:700;color:#cbd5e1;transform:translateY(-50%);background:rgba(8,12,28,.9);padding:0 2px}
.rd-bc{padding:7px 12px;font-weight:600;color:#fde047;border-color:rgba(250,204,21,.4)}.rd-bc b{font-size:14px}.rd-bc.soft{color:#fcd34d;font-weight:500;border-style:dashed}.rd-bc .i{fill:currentColor}
.rd-tl{position:absolute;left:10px;right:10px;bottom:20px;height:48px;display:flex;align-items:center;gap:10px;padding:0 14px 0 6px;border-radius:18px;background:rgba(8,12,28,.74);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,.1)}.rdm.full .rd-tl{bottom:calc(22px + env(safe-area-inset-bottom,0px));left:12px;right:12px}
.rd-play{width:36px;height:36px;border-radius:50%;border:1.5px solid var(--acc,#5eead4);background:rgba(94,234,212,.14);color:var(--acc,#5eead4);display:grid;place-items:center;cursor:pointer;flex:none;padding:0}
.rd-dw{position:relative;flex:1;min-width:0;height:100%}.rd-dots{display:flex;gap:2px;align-items:flex-end;height:30px;padding-bottom:3px;box-sizing:border-box;touch-action:none;cursor:pointer}
.rd-dots i{flex:1;min-width:2px;height:8px;border-radius:3px;background:rgba(148,163,184,.45);transition:height .12s,background .12s}.rd-dots i.f{background:rgba(167,139,250,.5)}.rd-dots i.r{height:calc(6px + var(--h,0) * 20px);background:var(--c)}.rd-dots i.f.r{opacity:.72}.rd-dots i.on{height:max(14px,calc(6px + var(--h,0) * 20px));background:var(--acc,#5eead4);box-shadow:0 0 10px var(--acc,#5eead4);opacity:1}.rd-dots i.on.r{background:var(--c);box-shadow:0 0 0 1.5px #fff,0 0 10px var(--c)}.rd-dots i.na{opacity:.25}
.rd-lb{position:absolute;left:0;right:0;bottom:3px;height:11px;font-size:9.5px;color:#94a3b8;pointer-events:none}.rd-lb span{position:absolute;transform:translateX(-50%);white-space:nowrap}
.rd-clk{display:flex;flex-direction:column;align-items:flex-end;line-height:1.05;flex:none}.rd-clk b{font-size:20px;font-weight:700;font-variant-numeric:tabular-nums}.rd-clk span{font-size:9.5px;letter-spacing:.12em;color:#94a3b8;margin-top:2px}.rd-clk.fc span{color:#fcd34d}
.rd-att{position:absolute;left:10px;right:10px;bottom:4px;font-size:8px;color:rgba(203,213,225,.7);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;pointer-events:none}.rdm.full .rd-att{bottom:calc(6px + env(safe-area-inset-bottom,0px))}
.rd-err{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);padding:8px 14px;border-radius:12px;background:rgba(8,12,28,.85);font-size:12px;color:#fca5a5}
.ico.wl.l1{background:#fde047;color:#3b2f00}.ico.wl.l2{background:#fb923c;color:#3a1a00}.ico.wl.l3{background:#ef4444;color:#fff}.ico.wl.l4{background:#a21caf;color:#fff}
.wbox{display:flex;flex-direction:column;gap:12px;border-radius:22px;padding:16px;border:1.5px solid var(--line);background:rgba(var(--wh),.05)}.wbox.l1{border-color:#fde047}.wbox.l2{border-color:#fb923c}.wbox.l3{border-color:#ef4444}.wbox.l4{border-color:#c026d3}.wbox.pre{border-style:dashed}
.wbox h3{margin:0;font-size:16px}.wt{display:flex;justify-content:space-between;gap:10px;font-size:12px;color:var(--tx2);font-variant-numeric:tabular-nums}
.wd{margin:0;white-space:pre-line;font-size:14px;line-height:1.55;color:var(--tx)}.wi{border-radius:16px;padding:12px 14px;background:rgba(var(--wh),.06)}.wi b{display:block;font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:var(--tx2);margin-bottom:4px}.wi p{margin:0;white-space:pre-line;font-size:14px;line-height:1.55}.wbox small{color:var(--tx3);font-size:11px}
.wo{display:flex;flex-wrap:wrap;gap:8px;margin-top:14px}
@media (max-width:640px){.rd-ol{display:none}.rd-say{font-size:19px}.rdm.full .rd-say{font-size:22px}}
.nb.lk.on{color:var(--acc,#5eead4)}
.pinw{display:flex;flex-direction:column;align-items:center;gap:22px;padding:8px 0 4px}
.pdots{display:flex;gap:16px;height:18px}.pdots i{width:14px;height:14px;border-radius:50%;border:2px solid rgba(var(--wh),.45);transition:background .12s,transform .12s}.pdots i.on{background:var(--acc,#5eead4);border-color:var(--acc,#5eead4);transform:scale(1.1)}
.pdots.bad i{border-color:#f87171;animation:pkshake .45s}@keyframes pkshake{20%{transform:translateX(-8px)}40%{transform:translateX(8px)}60%{transform:translateX(-5px)}80%{transform:translateX(5px)}}
.pad{display:grid;grid-template-columns:repeat(3,76px);gap:12px}
.pk{height:64px;border-radius:22px;border:1px solid var(--line);background:rgba(var(--wh),.07);color:var(--tx);font:inherit;font-size:24px;font-weight:600;display:grid;place-items:center;cursor:pointer;padding:0}.pk:active{background:rgba(var(--wh),.18);transform:scale(.96)}.pk.del{font-size:0;color:var(--tx2)}
.fseg{margin:0 0 12px;width:100%}.fseg button{flex:1;justify-content:center}
.fl{display:flex;flex-direction:column;gap:8px}.fr{display:flex;align-items:center;gap:12px;padding:11px 14px;border-radius:18px;background:rgba(var(--wh),.05);border:1px solid var(--line)}
.fr .rk{flex:none;width:28px;height:28px;border-radius:50%;display:grid;place-items:center;font-size:13px;font-weight:700;background:rgba(var(--wh),.09);color:var(--tx2)}
.fr .tx{flex:1;min-width:0}.fr .n{font-size:15px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.fr .s{font-size:12.5px;color:var(--tx2);margin-top:2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.fr .pr{flex:none;text-align:right;display:flex;flex-direction:column;align-items:flex-end}.fr .pr b{font-size:20px;font-weight:700;font-variant-numeric:tabular-nums;white-space:nowrap}.fr .pr b small{font-size:12px;font-weight:500;color:var(--tx2)}.fr .pr sup{font-size:.6em;margin-left:1px;vertical-align:.45em;line-height:0}.fr .pr span{font-size:11.5px;color:var(--tx2);font-variant-numeric:tabular-nums}
.fr.bst{border-color:rgba(94,234,212,.5);background:rgba(94,234,212,.1)}.fr.bst .rk{background:#5eead4;color:#06201c}.fr.bst .pr span{color:#5eead4;font-weight:600}.fr.cl{opacity:.5}
.pwat{display:flex;align-items:center;gap:12px;padding:12px 14px;border-radius:20px;background:rgba(var(--wh),.05);border:1px solid var(--line);margin-bottom:6px}.pwat .bub{width:42px;height:42px;border-radius:14px;display:grid;place-items:center;flex:none;background:rgba(96,165,250,.18);color:#60a5fa}.pwat.due{border-color:rgba(251,191,36,.5)}.pwat.due .bub{background:rgba(251,191,36,.2);color:#fbbf24}.pwat .tx{flex:1;min-width:0}.pwat .n{font-weight:600;font-size:15px}.pwat .s{font-size:12.5px;color:var(--tx2);margin-top:2px}
.pgb{flex:none;display:inline-flex;align-items:center;gap:6px;height:40px;padding:0 16px;border-radius:14px;border:0;background:#5eead4;color:#06201c;font:inherit;font-weight:700;font-size:14px;cursor:pointer}.pgb:active{transform:scale(.96)}
.pll{display:flex;flex-direction:column;gap:8px;align-items:stretch}.plc{display:flex;align-items:center;gap:13px;padding:13px 14px;border-radius:20px;background:linear-gradient(135deg,rgba(var(--c),.13),rgba(var(--wh),.035));border:1px solid rgba(var(--c),.3);min-width:0;cursor:pointer}.plc.dry{border-color:rgba(var(--c),.6)}
.plc .bub{width:46px;height:46px;border-radius:15px;display:grid;place-items:center;flex:none;background:rgba(var(--c),.2);color:rgb(var(--c))}.plc .tx{flex:1;min-width:0}.plc .n{font-size:15.5px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.plc .pm{display:flex;align-items:center;gap:10px;margin-top:7px}.plc .pm .pc2{flex:1;width:auto;height:8px}.plc .pm b{font-size:14px;font-variant-numeric:tabular-nums;min-width:42px;text-align:right}
.pchs{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}.pch{display:inline-flex;align-items:center;gap:5px;font-size:12px;color:var(--tx2);padding:3px 9px;border-radius:99px;background:rgba(var(--wh),.07);font-variant-numeric:tabular-nums}.pch.w{color:#fbbf24}
.plc .bd{flex:none;min-width:58px;text-align:center;align-self:flex-start;font-size:11.5px;font-weight:700;padding:4px 10px;border-radius:99px;background:rgba(251,191,36,.2);color:#fbbf24}.plc .bd.ok{background:rgba(52,211,153,.16);color:#34d399}
.xr.tapx{cursor:pointer}
.spool.act{border-color:rgba(94,234,212,.7);box-shadow:0 0 0 1px rgba(94,234,212,.35) inset}
.htap{cursor:pointer;-webkit-tap-highlight-color:transparent}.htap:active{opacity:.7}.hmore{display:inline-flex;align-items:center;gap:3px;margin-left:10px;padding:2px 9px;border-radius:99px;background:rgba(251,146,60,.16);color:#fb923c;font-size:11.5px;font-weight:600}
.hhero{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:14px;align-items:center;padding:14px;border-radius:24px;background:rgba(var(--wh),.05);border:1px solid var(--line);margin-bottom:12px}.hhero.heat{border-color:rgba(251,146,60,.5);box-shadow:0 0 30px -10px rgba(251,146,60,.5)}
.hdial{position:relative;max-width:230px;width:100%;margin:0 auto}.hdial svg{display:block;width:100%;overflow:visible}.hdial .mid{position:absolute;left:0;right:0;top:28%;text-align:center}.hdial .mid .l{font-size:11.5px;color:var(--tx2);letter-spacing:.08em;text-transform:uppercase}.hdial .mid .big{font-size:46px}.hdial .mid .tg{font-size:13px;color:var(--tx2);margin-top:2px}.hdial .mid .hhum{display:flex;justify-content:center;align-items:center;gap:4px;font-size:12px;color:#38bdf8;margin-top:4px;font-variant-numeric:tabular-nums}.hdial .mid .hhum svg{flex:none;width:12px;height:12px}
.hside{display:flex;flex-direction:column;gap:14px;min-width:0}.hctl{display:flex;align-items:center;justify-content:space-between;gap:10px}.hset{text-align:center}.hset b{display:block;font-size:34px;font-weight:300;font-variant-numeric:tabular-nums}.hset span{font-size:11.5px;color:var(--tx2)}.hctl .rbn:disabled{opacity:.35}
.hseg{width:100%}.hseg button{flex:1;justify-content:center}
.hq{display:grid;grid-template-columns:repeat(auto-fit,minmax(44px,1fr));gap:6px}.hq button,.hpre button{border:1px solid var(--line);background:rgba(var(--wh),.06);color:var(--tx);font:inherit;border-radius:14px;cursor:pointer;transition:.2s}.hq button{height:44px;padding:0;font-size:15px;font-weight:600;font-variant-numeric:tabular-nums}
.hq button.on,.hpre button.on{background:rgba(251,146,60,.2);border-color:rgba(251,146,60,.6);color:#fb923c}.hq button:active,.hpre button:active{transform:scale(.95)}
.hpre{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px}.hpre button{display:flex;flex-direction:column;align-items:center;gap:2px;padding:9px 6px}.hpre b{font-size:13.5px;font-weight:600}.hpre span{font-size:12px;color:var(--tx2);font-variant-numeric:tabular-nums}.hpre button.on span{color:#fb923c}
.hpre.hdur{grid-template-columns:repeat(auto-fit,minmax(104px,1fr))}.hpre.hdur b{font-size:12.5px;font-weight:500}.hpre.hmodes svg{opacity:.8}
.hoff{display:flex;align-items:center;gap:6px;flex:none}.hoff .rbn{width:34px;height:34px;border-radius:12px}.hoff .rbn:disabled{opacity:.35}.hoff span{min-width:46px;text-align:center;font-size:13.5px;font-weight:600;font-variant-numeric:tabular-nums}
.trend{padding:14px 14px 12px}.trend.tb{padding:0}.trow{display:flex;align-items:stretch;gap:10px}.tmid{flex:1;min-width:0;border-top:1px solid var(--line);border-bottom:1px solid var(--line)}.tsvg{display:block;width:100%;height:120px;overflow:visible}
.tcol{flex:none;width:58px;display:flex;flex-direction:column;justify-content:space-between;font-size:13px;font-weight:600;font-variant-numeric:tabular-nums;padding:2px 0}.tcol span{display:inline-flex;align-items:center;gap:3px;white-space:nowrap}.tcol.r{text-align:right;align-items:flex-end}.tcol:not(.r) span:nth-child(2){padding-left:17px}.tcol.r span:nth-child(2){padding-right:0}
.tax{display:flex;justify-content:space-between;font-size:11.5px;color:var(--tx3);padding:6px 68px 0;font-variant-numeric:tabular-nums}.tavg{display:flex;flex-wrap:wrap;justify-content:center;gap:6px 22px;margin-top:10px;font-size:13px;font-weight:600}.tavg span{display:inline-flex;align-items:center;gap:5px}
.sl{display:flex;flex-direction:column;gap:10px}.sch{padding:12px 14px 12px;border-radius:20px;background:rgba(var(--wh),.05);border:1px solid var(--line)}.sch.on{border-color:rgba(251,146,60,.55);background:linear-gradient(135deg,rgba(251,146,60,.12),rgba(var(--wh),.035))}
.sht{display:flex;align-items:center;gap:12px;cursor:pointer}.sht .ico{width:38px;height:38px;border-radius:13px;display:grid;place-items:center;flex:none;background:rgba(var(--wh),.08);color:var(--tx2)}.sch.on .ico{background:rgba(251,146,60,.2);color:#fb923c}.sht .tx{flex:1;min-width:0}.sht .n{font-size:15px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.sht .s{font-size:12.5px;color:var(--tx2);margin-top:2px}
.sht .bd{flex:none;font-size:11.5px;font-weight:700;padding:4px 10px;border-radius:99px;background:rgba(251,146,60,.2);color:#fb923c}.sht .bd.off{background:rgba(var(--wh),.08);color:var(--tx2)}
.swk{margin-top:12px;display:flex;flex-direction:column;gap:4px}.swr,.swa{display:grid;grid-template-columns:22px 1fr;gap:8px;align-items:center}.swr>span{font-size:11px;color:var(--tx3)}.swr.td>span{color:var(--tx);font-weight:700}
.swt{position:relative;height:9px;border-radius:5px;background:rgba(var(--wh),.07);overflow:hidden}.swt i{position:absolute;top:0;bottom:0;border-radius:4px;background:#fb923c;opacity:.85}.swr.td .swt{background:rgba(var(--wh),.11)}.swt b{position:absolute;top:-1px;bottom:-1px;width:2px;background:#fff;border-radius:1px;box-shadow:0 0 6px rgba(255,255,255,.8)}
.tpt{position:relative;height:20px;border-radius:6px;background:rgba(var(--wh),.06);overflow:hidden}.tpt i{position:absolute;top:0;bottom:0;border-right:1px solid rgba(0,0,0,.25);display:flex;align-items:center;justify-content:center}.tpt i em{font-style:normal;font-size:10.5px;font-weight:700;color:rgba(10,14,30,.85);white-space:nowrap}
.tpt b{position:absolute;top:-1px;bottom:-1px;width:2px;background:#fff;border-radius:1px;box-shadow:0 0 6px rgba(255,255,255,.9)}.tpw{gap:5px}.tpd{font-size:12px;color:var(--tx2);margin:2px 0 2px 30px}
.tpcs{display:flex;flex-wrap:wrap;gap:6px;margin-top:10px}.tpc{display:inline-flex;align-items:center;gap:6px;padding:5px 10px;border-radius:999px;background:rgba(var(--wh),.06);border:1px solid var(--line);font-size:12px;color:var(--tx)}.tpc small{font-size:10.5px;color:var(--tx3)}.tpc.on small{color:#fb923c}
.sch.tpl.on{border-color:rgba(251,146,60,.4)}
.swa>div{display:flex;justify-content:space-between;font-size:10px;color:var(--tx3);font-style:normal}.swa em{font-style:normal;width:0;display:flex;justify-content:center;overflow:visible}.swa em:first-child{justify-content:flex-start}.swa em:last-child{justify-content:flex-end}
.dg.dg3{grid-template-columns:repeat(3,minmax(0,1fr))}.dg3 .dt{padding:12px 10px;grid-column:auto!important}.dg3 .dt .v{font-size:21px}.hbtns{display:flex;flex-wrap:wrap;gap:8px;margin-top:14px}
@media (max-width:560px){.hhero{grid-template-columns:1fr}}
@media (min-width:900px){.fl{gap:6px}.fr{padding:7px 14px}.fseg{margin-bottom:6px}}
@media (prefers-reduced-motion:reduce){.rd-fx i,.rd-home,.rd-w.rdp,.rd-s.n{animation:none}}
.rb .hw{color:#fbbf24}.rb .hw2{color:#fb7185}.rb .stl,.stl{color:#fbbf24;display:inline-flex;align-items:center;gap:4px}.rm.stale .rw,.rm.stale .rv{opacity:.45}.rm.stale .rb .stl{opacity:1}
.hwarn{display:flex;align-items:center;gap:12px;width:100%;text-align:left;padding:12px 14px;margin:0 0 14px;border-radius:18px;border:1px solid rgba(251,191,36,.45);background:rgba(251,191,36,.12);color:#fde68a;cursor:pointer}.hwarn.l2{border-color:rgba(251,113,133,.5);background:rgba(251,113,133,.13);color:#fecdd3}.hwarn svg{flex:none}.hwarn div{display:flex;flex-direction:column;gap:2px;min-width:0}.hwarn b{font-size:14px;font-weight:600}.hwarn span{font-size:12.5px;opacity:.85}
.card-note.stn{display:flex;align-items:center;gap:6px;color:#fbbf24}.chip.stc{color:#fbbf24;border-color:rgba(251,191,36,.45)}
.camstale:empty{display:none}.camstale{position:absolute;left:12px;bottom:12px;display:inline-flex;align-items:center;gap:5px;padding:5px 10px;border-radius:12px;font-size:12px;font-weight:600;background:rgba(0,0,0,.6);color:#fbbf24}
.al{position:relative;overflow:hidden}.alb{position:absolute;left:0;right:0;bottom:0;height:3px;background:rgba(var(--wh),.12)}.alb u{display:block;height:100%;background:currentColor;opacity:.75;text-decoration:none;border-radius:0 3px 3px 0;transition:width .6s}
.fr .pr b .ft{display:inline-flex;align-items:center;font-style:normal;font-size:11.5px;font-weight:600;margin-right:8px;vertical-align:2px}.fr .pr b .ft svg{width:12px;height:12px}.fr .ft.up{color:#fb7185}.fr .ft.dn{color:#34d399}.fr.go{cursor:pointer}.fr .mp{flex:none;color:var(--tx3);display:grid;place-items:center}
.xr.kid{position:relative}.kdot{margin-left:auto;flex:none;width:10px;height:10px;border-radius:50%;background:#94a3b8}.kdot.ok{background:#34d399;box-shadow:0 0 10px rgba(52,211,153,.7)}.kdot.lk{background:#fb7185;box-shadow:0 0 10px rgba(251,113,133,.6)}.kdot.off{background:#f59e0b}
.kgrid{display:grid;gap:10px;margin:10px 0 4px}.kgrid.k1{grid-template-columns:1fr}.kgrid.k3{grid-template-columns:repeat(3,minmax(0,1fr))}.kgrid.k2{grid-template-columns:repeat(auto-fit,minmax(150px,1fr))}.kgrid:empty{display:none}
.kb{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;min-height:74px;padding:12px 10px;border-radius:20px;border:1px solid var(--line);background:rgba(var(--wh),.07);color:var(--tx);font:inherit;text-align:center;cursor:pointer;transition:.2s}
.kb b{font-size:15px;font-weight:650}.kb small{font-size:11.5px;color:var(--tx3);font-weight:500}.kb:active{transform:scale(.97)}.kb[disabled]{opacity:.45;pointer-events:none}
.kgrid.k1 .kb{flex-direction:row;gap:12px;min-height:64px;justify-content:center}.kgrid.k1 .kb small{display:none}
.ksc{display:flex;align-items:center;gap:12px;margin:8px 0 2px;padding:12px 14px;border-radius:18px;border:1px solid var(--line);background:rgba(var(--wh),.06)}.ksc b{display:block;font-size:15px;font-weight:650}.ksc span{display:block;font-size:12.5px;color:var(--tx3);margin-top:1px}.ksi{width:40px;height:40px;border-radius:14px;display:grid;place-items:center;flex:none;background:rgba(var(--wh),.08)}.ksc.live .ksi{background:rgba(52,211,153,.18);color:#6ee7b7}.ksc.hot .ksi{background:rgba(251,113,133,.18);color:#fda4af}.ksc.warn .ksi{background:rgba(251,191,36,.18);color:#fbbf24}.app.light .ksc.live .ksi{color:#047857}.app.light .ksc.hot .ksi{color:#be123c}.app.light .ksc.warn .ksi{color:#b45309}
.calc .h .r{display:inline-flex;align-items:center;gap:2px}.ccd{font-size:11px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:var(--tx3);margin:10px 0 2px;display:flex;gap:8px;align-items:baseline}.ccd:first-of-type{margin-top:2px}.ccd b{color:var(--tx);letter-spacing:0;text-transform:none;font-size:13.5px;font-weight:650}
.cc2{display:flex;align-items:center;gap:10px;padding:7px 2px;min-width:0}.cc2 i{width:8px;height:8px;border-radius:50%;background:var(--ec,#818cf8);flex:none;box-shadow:0 0 8px var(--ec,#818cf8)}.cc2 .t{flex:1;min-width:0;font-size:14px;font-weight:550;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.cc2 .w{font-size:12.5px;color:var(--tx3);white-space:nowrap;font-variant-numeric:tabular-nums}.ccm{margin-top:4px;font-size:12px;color:var(--tx3)}
.cal2tabs{display:flex;gap:4px;padding:3px;border-radius:15px;background:rgba(var(--wh),.06);margin-bottom:12px}.cal2tabs button{flex:1;min-height:38px;display:flex;align-items:center;justify-content:center;gap:6px;border-radius:12px;border:0;background:none;color:var(--tx3);font:inherit;font-size:13.5px;font-weight:600}.cal2tabs button.on{background:rgba(var(--wh),.13);color:var(--tx)}
.cmh{display:flex;align-items:center;gap:8px;margin-bottom:8px}.cmh b{flex:1;font-size:17px;font-weight:650;text-transform:capitalize}.cmh button{min-width:42px;min-height:42px;border-radius:13px;border:1px solid var(--line);background:rgba(var(--wh),.05);color:var(--tx);font:inherit;display:grid;place-items:center}.cmh button[disabled]{opacity:.3;pointer-events:none}.cmh .cmt{font-size:12.5px;padding:0 14px;font-weight:600}
.cmg{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:4px}.cmw{font-size:10.5px;letter-spacing:.1em;color:var(--tx3);text-align:center;padding:4px 0;text-transform:uppercase}
.cmd{display:flex;flex-direction:column;align-items:center;justify-content:flex-start;gap:4px;min-height:54px;padding:7px 2px 5px;border-radius:14px;border:1px solid transparent;background:rgba(var(--wh),.04);color:var(--tx);font:inherit;font-size:14.5px;font-weight:550;font-variant-numeric:tabular-nums}.cmd .dots{display:flex;gap:3px;min-height:6px}.cmd .dots i{width:6px;height:6px;border-radius:50%;background:var(--ec)}.cmd.out{opacity:.35}.cmd.today{border-color:rgba(var(--wh),.4)}.cmd.today .n{color:var(--acc)}.cmd.sel{background:rgba(var(--wh),.17);border-color:rgba(var(--wh),.32)}
.cmsel{margin:16px 2px 8px;font-size:13px;color:var(--tx3)}.cmsel b{color:var(--tx);font-size:15px;font-weight:650}
.dg.tvdg{grid-template-columns:repeat(2,minmax(0,1fr))}@media (min-width:560px){.dg.tvdg{grid-template-columns:repeat(4,minmax(0,1fr))}}
.kb.danger{background:rgba(251,113,133,.16);border-color:rgba(251,113,133,.4);color:#fda4af}.kb.good{background:rgba(52,211,153,.16);border-color:rgba(52,211,153,.4);color:#6ee7b7}
.app.light .kb.danger{color:#be123c}.app.light .kb.good{color:#047857}
.dg.kdg{grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin-top:12px}.dg.kdg .dt{min-width:0;grid-column:auto!important;padding:12px 12px}.dg.kdg .dt .v{font-size:19px;overflow-wrap:anywhere}.dg.kdg .dt.kfull{grid-column:1/-1!important}
.ban{display:flex;align-items:stretch;margin:0 0 12px;border-radius:18px;border:1px solid var(--line);overflow:hidden;animation:banin .4s ease both}
.ban .bmain{flex:1;min-width:0;display:flex;align-items:center;gap:12px;padding:12px 14px;text-align:left;color:inherit}.ban .bni{flex:none;display:grid;place-items:center;width:40px;height:40px;border-radius:13px;background:rgba(255,255,255,.12)}
.ban .bnt{min-width:0;display:flex;flex-direction:column;gap:2px}.ban .bnt b{font-size:15px;font-weight:600}.ban .bnt small{font-size:12.5px;opacity:.85;overflow-wrap:anywhere}.ban em{margin-left:auto;flex:none;font-style:normal;font-size:12px;font-weight:600;padding:3px 9px;border-radius:999px;background:rgba(255,255,255,.14)}
.ban .bnx{flex:none;width:46px;display:grid;place-items:center;color:inherit;opacity:.7;border-left:1px solid rgba(255,255,255,.12)}
.ban.warn{background:rgba(251,191,36,.18);border-color:rgba(251,191,36,.5);color:#fde68a}.ban.bad{background:rgba(251,113,133,.2);border-color:rgba(251,113,133,.55);color:#fecdd3}.ban.bad .bni{animation:banp 1.8s ease-in-out infinite}
.app.light .ban.warn{color:#92400e;background:rgba(251,191,36,.26)}.app.light .ban.bad{color:#9f1239;background:rgba(251,113,133,.22)}
@keyframes banin{from{opacity:0;transform:translateY(-8px)}}@keyframes banp{50%{box-shadow:0 0 0 7px rgba(251,113,133,.0),0 0 18px rgba(251,113,133,.55)}}
.al.crit{box-shadow:0 0 0 1px rgba(251,191,36,.25),0 0 14px rgba(251,191,36,.18)}.al.bad.crit{box-shadow:0 0 0 1px rgba(251,113,133,.3),0 0 14px rgba(251,113,133,.25)}
.qp.on{background:rgba(94,234,212,.2);border-color:rgba(94,234,212,.5)}.qp.qe{padding:10px 12px;opacity:.75;border-style:dashed}.qp.qe:first-child{background:rgba(var(--wh),.07)}
.qfl{display:flex;gap:6px;flex-wrap:wrap;margin:2px 0 10px}.qfc{padding:7px 13px;border-radius:999px;font-size:12.5px;font-weight:500;background:rgba(var(--wh),.07);border:1px solid var(--line);color:var(--tx)}.qfc.on{background:rgba(94,234,212,.2);border-color:rgba(94,234,212,.5)}
.pzc .pzbar,.pzbar{height:4px;border-radius:4px;background:rgba(var(--wh),.1);overflow:hidden;margin:0 0 6px}.pzbar i{display:block;height:100%;border-radius:4px;background:#34d399}
.pzr{display:flex;align-items:center;gap:11px;padding:8px 0;border-top:1px solid var(--line);position:relative;touch-action:pan-y}.pzr:first-of-type{border-top:0}
.pzr>div:nth-child(2){flex:1;min-width:0}.pzr .t{font-size:14px;font-weight:600;line-height:1.25}.pzr .s{font-size:12px;color:var(--tx3);line-height:1.3;margin-top:1px}
.pzr .ico,.pzfresh .ico{width:36px;height:36px;border-radius:12px;display:grid;place-items:center;flex:none;background:rgba(var(--wh),.07)}
.pzr.o .ico{color:#fda4af;background:rgba(251,113,133,.16)}.pzr.d .ico{color:#fcd34d;background:rgba(251,191,36,.16)}.pzfresh .ico.ok{color:#6ee7b7;background:rgba(52,211,153,.18)}
.pzb2{flex:none;width:40px;height:40px;border-radius:50%;border:1px solid rgba(52,211,153,.4);background:rgba(52,211,153,.14);color:#34d399;display:grid;place-items:center;cursor:pointer}
.pzr.swp{background-image:linear-gradient(90deg,rgba(52,211,153,calc(var(--sw,0)*.4)),transparent 70%);transition:none}.pzr:not(.swp){transition:transform .2s}
.pzmore{display:flex;align-items:center;justify-content:center;gap:6px;width:100%;margin-top:6px;padding:9px 0 3px;border:0;border-top:1px solid var(--line);background:none;color:var(--tx2);font:inherit;font-size:12.5px;font-weight:500;cursor:pointer}
.pzfresh{display:flex;align-items:center;gap:12px;text-align:left;width:100%;color:inherit;font:inherit;padding:14px 16px}.pzfresh>div:nth-child(2){flex:1;min-width:0}.pzfresh .t{font-size:14.5px;font-weight:600}.pzfresh .s{font-size:12.5px;color:var(--tx3);margin-top:2px}.pzfresh .pzv,.pzmore .pzv{display:grid;place-items:center;color:var(--tx3)}
.app.light .pzr.o .ico{color:#be123c}.app.light .pzr.d .ico{color:#b45309}.app.light .pzb2{color:#047857}
.pzpage{max-width:1100px}.pzg{display:block}.app.wide .pzpage .pzl{column-width:430px;column-gap:20px}.app.wide .pzpage .pzg{break-inside:avoid}
.app.wide .cock .pzc{padding-top:10px;padding-bottom:6px}.app.wide .cock .pzc .pzbar{margin:0 0 2px}.app.wide .cock .pzc .h{margin-bottom:4px}.app.wide .cock .pzc .pzr{padding:4px 0}.app.wide .cock .pzc .pzr .ico{width:32px;height:32px}.app.wide .cock .pzc .pzb2{width:36px;height:36px}.app.wide .cock .pzc .pzmore{margin-top:3px;padding:7px 0 2px}.app.wide .pzpage .pzh{break-after:avoid}
.toast.tap.show{pointer-events:auto;cursor:pointer;border-color:rgba(52,211,153,.5)}
.pzq{display:block;width:100%;box-sizing:border-box;margin:0 0 4px;padding:11px 14px;border-radius:14px;border:1px solid var(--line);background:rgba(var(--wh),.05);color:var(--tx);font:inherit;font-size:14px;outline:none}.pzq:focus{border-color:rgba(56,189,248,.55)}.pzq::placeholder{color:var(--tx3)}
.pzh{display:flex;align-items:center;gap:10px;width:100%;box-sizing:border-box;background:none;border:0;color:inherit;font:inherit;text-align:left;padding:6px 4px;margin:16px 0 6px;cursor:pointer;min-height:36px}
.pzh .pzn{font-size:11px;font-weight:600;letter-spacing:.16em;color:var(--tx3);min-width:0}.pzh .pzs{font-size:11px;font-weight:600;color:#fbbf24;white-space:nowrap}
.pzh .pzp{flex:1;min-width:24px;max-width:110px;height:4px;border-radius:4px;background:rgba(var(--wh),.1);overflow:hidden;margin-left:auto}.pzh .pzp i{display:block;height:100%;border-radius:4px;background:#34d399}
.pzh .pzc{font-size:11px;color:var(--tx3);font-variant-numeric:tabular-nums;margin-left:auto}.pzh .pzp+.pzc{margin-left:0}
.pzh .pzv{display:grid;place-items:center;color:var(--tx3);transition:transform .2s;transform:rotate(90deg)}.pzh.c .pzv{transform:rotate(0)}
.pzhome svg{transform:rotate(180deg)}
.fi.fh{display:none!important}
.cc2 .t{white-space:normal;overflow-wrap:anywhere;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;line-height:1.3}
.vr.pz[data-sw]{touch-action:pan-y;position:relative}.vr.pz.swp{background-image:linear-gradient(90deg,rgba(52,211,153,calc(var(--sw,0)*.4)),transparent 70%);transition:none}.vr.pz:not(.swp){transition:transform .2s}
.pzgo{margin-top:12px;width:100%;min-height:46px;display:inline-flex;align-items:center;justify-content:center;gap:8px;border-radius:16px;background:rgba(56,189,248,.18);border:1px solid rgba(56,189,248,.45);color:#7dd3fc;font-weight:600;font-size:14px}.app.light .pzgo{color:#0369a1}
.pzcf{margin-top:12px;padding:14px 16px;border-radius:20px;border:1px solid rgba(56,189,248,.35);background:rgba(56,189,248,.08)}.pzct{font-weight:600;font-size:15px}.pzcs{font-size:12.5px;color:var(--tx2);margin-top:5px;line-height:1.4}
.pzcb{display:flex;gap:8px;margin-top:12px}.pzcb .vbt{flex:1;min-height:44px;margin:0;display:inline-flex;align-items:center;justify-content:center}.pzcb .pzgo{margin-top:0}
.vr.pz .ico{background:rgba(var(--wh),.07)}.vr.pz.o .ico{color:#fda4af;background:rgba(251,113,133,.16)}.vr.pz.d .ico{color:#fcd34d;background:rgba(251,191,36,.16)}.vr.pz.k .ico{color:#6ee7b7;background:rgba(52,211,153,.14)}
.vr.pz.o{border-color:rgba(251,113,133,.3)}.vr.pz .vbt{flex:none;white-space:nowrap}.vr.pz .pzb{background:rgba(52,211,153,.16);border-color:rgba(52,211,153,.4);color:#6ee7b7}
.app.light .vr.pz.o .ico{color:#be123c}.app.light .vr.pz.d .ico{color:#b45309}.app.light .vr.pz.k .ico{color:#047857}.app.light .vr.pz .pzb{color:#047857}
.vr.pz{padding:11px 12px;gap:11px;margin-bottom:7px}.vr.pz .t{white-space:normal;overflow:visible;text-overflow:clip;line-height:1.25}.vr.pz .s{line-height:1.3}
.vr.pz .vbt{display:inline-flex;align-items:center;justify-content:center;gap:7px;min-height:42px}.vr.pz .pzb{padding:0 14px}.vr.pz .pzu{padding:0 12px;color:var(--tx2)}
@media (max-width:860px){.vr.pz .pzb{width:44px;height:44px;min-height:0;padding:0;border-radius:50%}.vr.pz .pzb span{display:none}.vr.pz .pzb svg{width:20px;height:20px}.vr.pz .pzu{padding:0 12px;font-size:12px}}
.pzstb{display:inline-flex;align-items:center;gap:6px;margin-left:auto}.pzstb svg{opacity:.8}
.pzsb{display:flex;align-items:flex-end;gap:8px;height:128px;margin:10px 0 2px;padding:0 2px}.pzsb .c1{flex:1;min-width:0;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;height:100%;gap:4px}.pzsb .c1 i{display:block;width:100%;max-width:40px;border-radius:9px 9px 4px 4px;background:rgba(var(--wh),.16)}.pzsb .c1.t i{background:#34d399}.pzsb .c1 b{font-size:12px;font-weight:650;font-variant-numeric:tabular-nums;min-height:15px}.pzsb .c1 span{font-size:11px;color:var(--tx3)}.pzsb .c1.t span{color:var(--tx);font-weight:600}
.qfc.pzsc{cursor:default}.qfc.pzsc b{margin-left:4px;color:#34d399;font-variant-numeric:tabular-nums}
.pzsr{display:flex;align-items:center;gap:10px;padding:8px 4px;border-bottom:1px solid var(--line)}.pzsr:last-of-type{border-bottom:0}.pzsr .pzt{font-size:12.5px;color:var(--tx3);font-variant-numeric:tabular-nums;min-width:44px}.pzsr .ico{width:30px;height:30px;border-radius:10px;display:grid;place-items:center;background:rgba(var(--wh),.07);flex:none}.pzsr .t{font-size:14px;font-weight:550;line-height:1.25}.pzsr .s{font-size:12px;color:var(--tx3)}.pzsr>div:last-child{min-width:0}.pzsn{font-size:12.5px;color:var(--tx3);padding:6px 4px}
.wxwrap{overflow-x:auto;margin:6px -2px 0;padding:0 2px 2px;scrollbar-width:none}.wxwrap::-webkit-scrollbar{display:none}
.wxc{position:relative;touch-action:pan-y;-webkit-user-select:none;user-select:none}.wxc svg.wxs{position:absolute;left:0;overflow:visible;display:block}
.wxs text{fill:var(--tx3);font-size:10.5px;font-variant-numeric:tabular-nums}.wxs text.mm{fill:#7dd3fc;opacity:.85}.wxs .gl{stroke:rgba(var(--wh),.09);stroke-width:1}.wxs .dl{stroke:rgba(var(--wh),.22);stroke-width:1}.wxs .wxn{fill:rgba(3,5,22,.42)}.wxs .wxr{fill:#38bdf8;opacity:.72}
.wxs .tp{fill:none;stroke-width:2.8;stroke-linecap:round;stroke-linejoin:round;filter:drop-shadow(0 2px 6px rgba(251,146,60,.35))}.wxs .wxp{fill:none;stroke:rgba(var(--wh),.55);stroke-width:1.5;stroke-dasharray:2 4;stroke-linecap:round}.wxs .wxcl{stroke:rgba(var(--wh),.7);stroke-width:1.2}.wxs .wxcd{fill:#fff;stroke:#fb7185;stroke-width:3}
.wxd{position:absolute;top:0;height:22px;display:flex;align-items:center;justify-content:center;gap:5px;font-size:12.5px;font-weight:650;white-space:nowrap;overflow:hidden;color:var(--tx)}.wxd small{font-size:10.5px;font-weight:500;color:var(--tx3)}
.wxi{position:absolute;top:22px;width:34px;margin-left:-17px;height:30px;display:grid;place-items:center;pointer-events:none}.wxi .wx *{animation:none!important}
.wxw{position:absolute;width:34px;margin-left:-17px;text-align:center;font-size:10px;line-height:1;color:var(--tx3);font-variant-numeric:tabular-nums;pointer-events:none}.wxw svg{display:block;margin:0 auto 3px}
.wxt{position:absolute;z-index:4;box-sizing:border-box;padding:10px 12px;border-radius:14px;background:rgba(10,15,40,.92);border:1px solid rgba(255,255,255,.16);color:#e9efff;box-shadow:0 10px 30px rgba(0,0,0,.4);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);display:flex;flex-wrap:wrap;gap:4px 8px;pointer-events:none;font-size:12px}
.wxtl{flex:1;min-width:0}.wxth{flex:0 0 100%;font-size:11.5px;color:#fff;margin-bottom:1px;white-space:nowrap}.wxth b{display:block}.wxtl>b{display:inline}.wxtr{display:flex;align-items:center;gap:6px;line-height:1.55}.wxtr b{margin-left:auto;font-weight:650;font-variant-numeric:tabular-nums}
.wxdt{width:9px;height:9px;border-radius:50%;background:rgba(255,255,255,.75);flex:none}.wxdt.t{background:#fb7185}.wxdt.r{background:#38bdf8}
.wxti{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;font-size:10.5px;color:#b8c4e6;text-align:center;max-width:66px}
.wxt.nar{padding:8px 10px;font-size:11px}.wxt.nar .wxti{display:none}.wxt.nar .wxtr{line-height:1.45}
.trdot{width:9px;height:9px;border-radius:50%;flex:none;background:#fff}.trdot.h{background:#fb7185}.trdot.l{background:#60a5fa}.trdot.r{background:#38bdf8}.trdot.r2{background:#7dd3fc}.trdot.s{background:#facc15}
.trlg{display:inline-block;width:16px;height:3px;border-radius:2px;vertical-align:middle;margin:0 5px 2px 0}.trlg.h{background:#fb7185}.trlg.l{background:#60a5fa;margin-left:8px}
.trw{position:relative;touch-action:pan-y;-webkit-user-select:none;user-select:none}.trw svg.wxs{position:absolute;left:0;overflow:visible;display:block}
.wxs .trb.h{fill:rgba(251,113,133,.2)}.wxs .trb.l{fill:rgba(96,165,250,.22)}.wxs .trl{fill:none;stroke-width:2.6;stroke-linecap:round;stroke-linejoin:round}.wxs .trl.h{stroke:#fb7185}.wxs .trl.l{stroke:#60a5fa}
.wxs .trp rect{fill:rgba(10,15,40,.62)}.wxs .trp text{font-size:10.5px;font-weight:700;font-variant-numeric:tabular-nums}.wxs .trs{fill:#facc15}.wxs .trhit{fill:transparent;cursor:pointer}
.wxt .wxtr{white-space:nowrap}.wxdt.b{background:#60a5fa}.wxdt.s{background:#facc15}.wxtr small{font-weight:500;color:#9fb0d8}
.grs{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px;margin-top:6px}.gr{position:relative;display:flex;flex-direction:column;align-items:center;text-align:center}
.gr svg{width:100%;max-width:150px;height:auto;display:block}.gr .gv{position:absolute;left:0;right:0;top:0;aspect-ratio:1;max-width:150px;margin:0 auto;display:flex;flex-direction:column;align-items:center;justify-content:center;padding-bottom:6px}
.gr .gv b{font-size:30px;font-weight:300;letter-spacing:-.02em;font-variant-numeric:tabular-nums;line-height:1}.gr .gv small{font-size:12px;color:var(--tx2);margin-top:3px}
.gr .gl2{font-size:13px;font-weight:600;margin-top:2px}.gr .gs{font-size:11.5px;color:var(--tx2);margin-top:2px}
.hlr{display:flex;gap:18px;margin-top:10px;font-size:14px}.hlr span{display:inline-flex;align-items:center;gap:6px}.hlr b{font-weight:600;color:#fff}.hlr i{font-style:normal;font-size:12px;opacity:.7}
.bchs{display:flex;flex-wrap:wrap;gap:8px}.bch{display:inline-flex;align-items:center;gap:7px;padding:7px 12px;border-radius:12px;background:rgba(var(--wh),.06);font-size:13px}.bch i{width:8px;height:8px;border-radius:50%}.bch b{font-weight:600}
@media (max-width:860px){.grs{grid-template-columns:repeat(2,minmax(0,1fr));row-gap:16px}.gr .gv b{font-size:26px}}
.ins{display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:8px;margin-top:14px}.inc{display:grid;grid-template-columns:1fr auto;align-items:baseline;column-gap:8px;padding:8px 12px;border-radius:14px;background:rgba(var(--wh),.05);min-width:0}.inc .n{grid-column:1/-1;font-size:12px;color:var(--tx2);overflow:hidden;white-space:nowrap;text-overflow:ellipsis;margin-bottom:2px}.inc .n svg{display:none}.inc b{font-size:17px;font-weight:600;font-variant-numeric:tabular-nums}.inc .hm{font-size:12px;color:var(--tx2);text-align:right}
.r7h{font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--tx2);margin:14px 0 6px}.r7{display:grid;grid-template-columns:repeat(7,1fr);gap:6px;align-items:end}.r7>div{display:flex;flex-direction:column;align-items:center;justify-content:flex-end;gap:3px;height:70px}.r7 b{font-size:10.5px;font-weight:600;color:#bae6fd;min-height:12px;font-variant-numeric:tabular-nums}.r7 i{width:100%;max-width:26px;border-radius:5px;background:linear-gradient(180deg,#38bdf8,#818cf8);display:block}.r7 span{font-size:10.5px;color:var(--tx2)}
.hb{margin-top:4px}.hbt{position:relative;height:10px;border-radius:6px;background:linear-gradient(90deg,#60a5fa 0%,#34d399 25%,#fde047 50%,#fb923c 75%,#fb7185 90%,#c084fc 100%);opacity:.9}.hbt i{position:absolute;top:-4px;width:6px;height:18px;margin-left:-3px;border-radius:3px;background:#fff;box-shadow:0 0 8px rgba(0,0,0,.5)}.hbl{display:flex;justify-content:space-between;font-size:10.5px;color:var(--tx2);margin-top:5px}
@media (max-width:860px){.heatg{grid-template-columns:repeat(3,minmax(0,1fr))!important}}
`;
const CSS2 = `

/* Lüften */
.vsum{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:4px}
.vk{padding:16px 18px;border-radius:22px;background:rgba(var(--wh),.05);border:1px solid var(--line)}
.vk .big{font-size:40px}.vk .l{font-size:12px;color:var(--tx2);margin-top:6px}
.vk.hot{background:linear-gradient(150deg,rgba(56,189,248,.28),rgba(var(--wh),.04))}
.vc{position:relative;display:flex;gap:16px;align-items:flex-start;padding:16px;border-radius:26px;margin-bottom:12px;background:linear-gradient(150deg,rgba(var(--rc),.28),rgba(var(--wh),.04) 72%);border:1px solid rgba(var(--rc),.5);box-shadow:0 16px 36px -18px rgba(var(--rc),.7);transition:transform .25s}
.vc.tap{cursor:pointer}.vc.tap:hover{transform:translateY(-2px)}
.vm{position:relative;width:78px;height:78px;flex:none}.vm svg{position:absolute;inset:0;overflow:visible}
.vm .n{position:absolute;inset:0;display:grid;place-items:center;text-align:center;line-height:1}.vm .n b{font-size:26px;font-weight:300;display:block}.vm .n span{font-size:10px;color:var(--tx2)}
.vb{min-width:0;flex:1}.vb h3{font-size:17px;font-weight:600;display:flex;align-items:center;gap:8px;flex-wrap:wrap}.vb p{font-size:13.5px;color:var(--tx);margin-top:4px}.vb p.why{color:var(--tx2);font-size:12.5px;margin-top:2px}
.tags{display:flex;gap:6px;flex-wrap:wrap;margin-top:10px}
.tag{font-size:11.5px;padding:4px 10px;border-radius:999px;background:rgba(var(--wh),.08);color:var(--tx2);display:inline-flex;align-items:center;gap:5px;white-space:nowrap}
.tag.ok{color:#6ee7b7;background:rgba(52,211,153,.15)}.tag.warn{color:#fcd34d;background:rgba(251,191,36,.16)}.tag.bad{color:#fda4af;background:rgba(251,113,133,.17)}.tag.live{color:#7dd3fc;background:rgba(56,189,248,.17)}
.tag.live::before{content:"";width:6px;height:6px;border-radius:50%;background:currentColor;animation:pulse 1.4s ease-in-out infinite}
.vbs{display:flex;gap:8px;flex-wrap:wrap;margin-top:12px}
.vbt{padding:8px 12px;border-radius:14px;background:rgba(var(--wh),.09);border:1px solid rgba(var(--wh),.12);font-size:12px;color:var(--tx);transition:.2s}.vbt:hover{background:rgba(var(--wh),.17)}
.vbar{height:5px;border-radius:3px;background:rgba(var(--wh),.14);overflow:hidden;margin-top:10px}.vbar i{display:block;height:100%;border-radius:3px;background:rgb(var(--rc))}
.vr{display:flex;align-items:center;gap:12px;padding:12px 14px;border-radius:20px;background:rgba(var(--wh),.045);border:1px solid rgba(var(--wh),.07);margin-bottom:8px}
.vr.tap{cursor:pointer}.vr .ico{width:38px;height:38px;border-radius:13px;display:grid;place-items:center;background:rgba(var(--wh),.07);color:var(--tx2);flex:none}
.vr .t{font-weight:600;font-size:14px}.vr .s{font-size:12px;color:var(--tx3);margin-top:2px}.vr .m{margin-left:auto;text-align:right;font-size:13px;color:var(--tx2);white-space:nowrap;padding-left:8px}.vr .m small{display:block;font-size:11px;color:var(--tx3);margin-top:2px}
.okc{display:flex;flex-wrap:wrap;gap:8px}.okc span{padding:8px 13px;border-radius:999px;background:rgba(52,211,153,.12);color:#6ee7b7;font-size:13px;display:inline-flex;gap:6px;align-items:center}
.tr{display:flex;align-items:flex-end;gap:8px;height:130px;padding:6px 4px 0}
.tr div{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;gap:5px;height:100%;font-size:11px;color:var(--tx3)}
.tr i{display:block;width:100%;max-width:36px;min-height:4px;border-radius:10px 10px 4px 4px;background:linear-gradient(180deg,rgba(94,234,212,.95),rgba(129,140,248,.5))}
.tr .today i{box-shadow:0 0 20px rgba(94,234,212,.6)}.tr .today{color:var(--tx)}.tr b{font-weight:600;color:var(--tx2);font-size:11px}
/* Wetter */
.sky{position:relative;min-height:320px;color:#fff;border:1px solid rgba(var(--wh),.2);display:flex;flex-direction:column;backdrop-filter:none}
.sky .skyin{position:relative;z-index:2;display:flex;flex-direction:column;justify-content:space-between;gap:26px;flex:1}
.cl{position:absolute;border-radius:50%;background:rgba(var(--wh),.17);filter:blur(30px);animation:cdrift 42s ease-in-out infinite alternate;pointer-events:none}
.cl.c1{width:320px;height:110px;left:-50px;top:18px}.cl.c2{width:400px;height:130px;right:-70px;top:90px;animation-duration:58s;opacity:.8}.cl.c3{width:280px;height:90px;left:32%;bottom:-14px;animation-duration:50s}
@keyframes cdrift{to{transform:translateX(80px)}}
.sunglow{position:absolute;right:-70px;top:-90px;width:360px;height:360px;border-radius:50%;pointer-events:none;background:radial-gradient(circle,rgba(255,228,150,.85),rgba(255,200,90,.28) 45%,transparent 70%);animation:glow 9s ease-in-out infinite}
@keyframes glow{50%{transform:scale(1.12);opacity:.8}}
.sky .wtemp{font-size:clamp(84px,12vw,128px);text-shadow:0 6px 40px rgba(0,0,0,.25)}
.sky .wcond{color:rgba(var(--wh),.88);font-size:17px}.sky .hl2{font-size:14px;color:rgba(var(--wh),.75);margin-top:4px}
.sky .chip{background:rgba(var(--wh),.16);border-color:rgba(var(--wh),.22);color:rgba(var(--wh),.88)}.sky .chip b{color:#fff}
.mg{position:relative;height:250px;min-width:760px}.mgw{overflow-x:auto;scrollbar-width:none}.mgw::-webkit-scrollbar{display:none}
.mg .ab{position:absolute;transform:translateX(-50%);text-align:center;font-size:12px;color:var(--tx2);line-height:1}
.mg .tl{font-size:13px;font-weight:600;color:var(--tx);transform:translate(-50%,-100%)}
.mg .rb2{position:absolute;bottom:34px;width:14px;transform:translateX(-50%);border-radius:5px 5px 2px 2px;background:linear-gradient(180deg,#7dd3fc,rgba(56,189,248,.35))}
.mg>svg{position:absolute;left:0;top:76px;width:100%;height:100px;overflow:visible}
.dr{display:grid;grid-template-columns:50px 34px 44px 28px 1fr 30px;align-items:center;gap:8px;padding:10px 0;border-top:1px solid rgba(var(--wh),.07);font-size:14px}
.dr.f{border-top:0}.dd{font-weight:600}.dp{font-size:11.5px;color:#7dd3fc;display:flex;align-items:center;gap:2px}.dlo{color:var(--tx3);text-align:right}.dhi{font-weight:600}
.dbar{position:relative;height:6px;border-radius:3px;background:rgba(var(--wh),.1)}.dbar i{position:absolute;top:0;bottom:0;border-radius:3px}
.dg{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}
@media (max-width:860px){.dg{grid-template-columns:1fr 1fr}}
.dt{padding:14px;border-radius:20px;background:rgba(var(--wh),.05);border:1px solid var(--line)}.dt .v{font-size:24px;font-weight:300;white-space:nowrap}.dt .l{font-size:12px;color:var(--tx2);margin-top:4px;display:flex;align-items:center;gap:5px}
.cmp{display:flex;align-items:center;gap:18px;flex-wrap:wrap;justify-content:center}.cmp .t{font-size:13px;color:var(--tx2);line-height:1.6}.cmp .t b{display:block;font-size:24px;font-weight:300;color:var(--tx)}
.moon{display:flex;align-items:center;gap:14px;margin-top:16px;padding-top:14px;border-top:1px solid rgba(var(--wh),.08);font-size:13px;color:var(--tx2)}.moon b{display:block;color:var(--tx);font-size:14px}
.hero{flex-direction:row;flex-wrap:wrap;gap:24px;align-items:stretch}
.hl{flex:1;min-width:250px;display:flex;flex-direction:column;justify-content:space-between}
.rings{display:flex;align-items:center;gap:20px;margin-right:6px}
.rgsvg{width:176px;height:176px;flex:none;overflow:visible}
.rl{display:flex;flex-direction:column;gap:12px;font-size:13px;color:var(--tx2);min-width:150px}
.rl div{display:flex;align-items:center;gap:9px}.rl i{width:9px;height:9px;border-radius:50%;flex:none;box-shadow:0 0 10px currentColor}.rl b{color:var(--tx);margin-left:auto;padding-left:14px;font-weight:600}
.sunarc{max-width:300px;margin:0 auto}
.dials{grid-template-columns:repeat(auto-fill,minmax(min(100%,330px),1fr))}
.lg{grid-template-columns:repeat(auto-fill,minmax(min(100%,160px),1fr))}
.chw{position:relative;padding:8px 10px 24px 38px}
.plot{position:relative;height:100%}.plot svg{position:absolute;inset:0;width:100%;height:100%;overflow:visible}
.yl{position:absolute;left:-36px;width:30px;text-align:right;transform:translateY(-50%);font-size:11px;color:var(--tx3)}
.xl{position:absolute;bottom:-22px;transform:translateX(-50%);font-size:11px;color:var(--tx3)}
.cd{position:absolute;width:9px;height:9px;border-radius:50%;transform:translate(-50%,-50%);box-shadow:0 0 12px currentColor}
@media (max-width:860px){.rings{width:100%;justify-content:space-between;margin:0}.rgsvg{width:150px;height:150px}}
.rw{position:relative;width:62px;height:62px;flex:none}.rw .ring{position:absolute;inset:0}.rw .ri{position:absolute;inset:0;display:grid;place-items:center;color:var(--tx2)}
.rw.nr{border-radius:50%;background:rgba(var(--wh),.07)}
.qb{display:inline-flex;align-items:center;gap:6px;padding:8px 12px;border-radius:14px;background:rgba(var(--wh),.07);border:1px solid var(--line);font-size:12px;color:var(--tx2);transition:.25s}
.qb:hover{background:rgba(var(--wh),.14);color:var(--tx)}.qb.on{background:rgba(251,191,36,.18);color:var(--warm);border-color:rgba(251,191,36,.4)}
.mrow{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:8px}
.vh{display:flex;align-items:flex-end;justify-content:space-between;gap:12px;margin-bottom:16px;flex-wrap:wrap}
.vh h1{font-size:30px;font-weight:300;letter-spacing:-.02em}.vh p{font-size:14px;color:var(--tx2);margin-top:4px}
.col{display:flex;flex-direction:column;gap:16px}
.gwrap{position:relative;width:200px;max-width:100%}.gwrap .gv{position:absolute;left:0;right:0;bottom:2px;text-align:center}.gwrap .gv .big{font-size:44px}
.twocol{display:flex;gap:20px;align-items:center;flex-wrap:wrap;justify-content:space-around}
/* Hinweise */
.alerts{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px}
.al{display:inline-flex;align-items:center;gap:8px;padding:10px 14px;min-height:42px;border-radius:16px;font-size:13px;font-weight:500;border:1px solid var(--line);background:rgba(var(--wh),.07);color:var(--tx);text-align:left;cursor:pointer;transition:.2s}
.al:active{transform:scale(.97)}
.al.warn{background:rgba(251,191,36,.16);border-color:rgba(251,191,36,.45);color:#fde68a}
.al.bad{background:rgba(251,113,133,.16);border-color:rgba(251,113,133,.5);color:#fecdd3}
.al.info{background:rgba(56,189,248,.14);border-color:rgba(56,189,248,.4);color:#bae6fd}
.al.ok{background:rgba(52,211,153,.12);border-color:rgba(52,211,153,.35);color:#a7f3d0}
.al small{opacity:.75;font-size:11.5px;font-weight:400}
/* Termine */
.dh{font-size:11px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:var(--tx3);margin:16px 2px 8px;display:flex;gap:8px;align-items:baseline}
.dh:first-child{margin-top:0}.dh b{color:var(--tx);letter-spacing:0;text-transform:none;font-size:13.5px;font-weight:600}
.ev{display:flex;gap:12px;align-items:stretch;padding:10px 12px;border-radius:16px;background:rgba(var(--wh),.045);margin-bottom:6px}
.ev i{width:4px;border-radius:2px;background:var(--ec,#818cf8);flex:none;box-shadow:0 0 12px var(--ec,#818cf8)}
.ev .t{font-size:14px;font-weight:500;overflow-wrap:anywhere}.ev .s{font-size:12px;color:var(--tx3);margin-top:2px}
.ev .tm{margin-left:auto;font-size:12.5px;color:var(--tx2);white-space:nowrap;text-align:right;align-self:center;padding-left:8px}
.calf{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px}
.calf button{display:inline-flex;align-items:center;gap:6px;padding:7px 11px;border-radius:999px;border:1px solid var(--line);background:rgba(var(--wh),.04);font-size:12px;color:var(--tx3);min-height:34px}
.calf button.on{color:var(--tx);background:rgba(var(--wh),.1)}.calf button i{width:8px;height:8px;border-radius:50%;background:var(--ec)}
/* Listen */
.todo{display:flex;align-items:center;gap:12px;padding:10px 12px;border-radius:16px;background:rgba(var(--wh),.045);margin-bottom:6px;min-height:48px}
.todo .ck{width:28px;height:28px;border-radius:50%;border:2px solid rgba(var(--wh),.28);display:grid;place-items:center;flex:none;transition:.2s;color:transparent}
.todo .ck:hover{border-color:var(--acc);color:var(--acc)}.todo .t{font-size:14.5px;overflow-wrap:anywhere}
.todo.ro .ck{display:none}.todo.ro::before{content:"";width:6px;height:6px;border-radius:50%;background:var(--acc2);flex:none;margin:0 4px}
.addrow{display:flex;gap:8px;margin-bottom:12px}
.addrow input{flex:1;min-width:0;height:46px;border-radius:15px;border:1px solid var(--line);background:rgba(var(--wh),.06);color:var(--tx);font:inherit;font-size:15px;padding:0 14px;outline:none;transition:.2s}
.addrow input:focus{border-color:rgba(94,234,212,.6);background:rgba(var(--wh),.1)}.addrow input::placeholder{color:var(--tx3)}
.addrow button{width:46px;height:46px;border-radius:15px;display:grid;place-items:center;background:linear-gradient(135deg,rgba(94,234,212,.3),rgba(129,140,248,.3));border:1px solid rgba(var(--wh),.16);flex:none}
.lstab{display:flex;gap:6px;margin-bottom:12px}
.lstab button{flex:1;min-height:40px;border-radius:14px;background:rgba(var(--wh),.05);border:1px solid var(--line);font-size:13px;color:var(--tx2)}
.lstab button.on{background:rgba(var(--wh),.13);color:var(--tx);border-color:rgba(var(--wh),.24)}
/* Pflanze / Drucker / Batterie */
.pl{display:flex;align-items:center;gap:16px}
.pl .rw{width:84px;height:84px}.pl .rw .ring{width:84px;height:84px}
.pl .big{font-size:40px}.pl .l{font-size:12.5px;color:var(--tx2);margin-top:4px}
.pbtn{display:inline-flex;align-items:center;justify-content:center;gap:8px;min-height:44px;padding:10px 16px;border-radius:15px;background:linear-gradient(135deg,rgba(52,211,153,.28),rgba(56,189,248,.24));border:1px solid rgba(52,211,153,.4);font-size:13.5px;font-weight:500;margin-top:14px;width:100%}
.pbtn:active{transform:scale(.98)}
.pn{display:flex;align-items:center;gap:14px}
.pn .big{font-size:42px}.pn .l{font-size:12.5px;color:var(--tx2);margin-top:4px}
.pnimg{width:100%;border-radius:18px;margin-top:12px;display:block;max-height:200px;object-fit:cover}
.bt{display:flex;align-items:center;gap:12px;padding:10px 12px;border-radius:16px;background:rgba(var(--wh),.045);margin-bottom:6px;min-height:50px}
.bt .t{font-size:13.5px;font-weight:500;min-width:0;overflow-wrap:anywhere;line-height:1.3;flex:1}
.bt .pc2{width:70px;height:7px;border-radius:4px;background:rgba(var(--wh),.12);overflow:hidden;flex:none}.bt .pc2 i{display:block;height:100%;border-radius:4px}
.bt b{font-size:13px;width:44px;text-align:right;font-weight:600;flex:none}
.bt.low b{color:var(--bad)}.bt.mid b{color:var(--warm)}
.cnt{display:flex;gap:8px;flex-wrap:wrap}
.card-note{font-size:12px;color:var(--tx3);margin-top:12px}
.vr>div:nth-child(2){min-width:0;flex:1}.vr .t{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.vr .m{flex:none}
/* Segment, Drucker, Station */
.ex.two{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}@media (max-width:860px){.ex.two{grid-template-columns:1fr}}
.pc2{height:7px;border-radius:4px;background:rgba(var(--wh),.12);overflow:hidden;width:70px;flex:none}.pc2 i{display:block;height:100%;border-radius:4px}
.seg{display:inline-flex;gap:4px;padding:4px;border-radius:18px;background:rgba(var(--wh),.06);border:1px solid var(--line)}
.seg button{display:inline-flex;align-items:center;gap:7px;min-height:40px;padding:0 16px;border-radius:14px;font-size:13.5px;color:var(--tx2);transition:.25s}
.seg button.on{background:linear-gradient(135deg,rgba(94,234,212,.28),rgba(129,140,248,.28));color:#fff;box-shadow:inset 0 0 0 1px rgba(var(--wh),.16)}
.prh{display:grid;grid-template-columns:minmax(0,1.05fr) minmax(0,1fr);gap:20px;padding:16px}
.prcam{position:relative;border-radius:22px;overflow:hidden;min-height:220px;background:linear-gradient(150deg,rgba(var(--wh),.07),rgba(var(--wh),.02));display:grid;place-items:center}
.prcam img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.prnone{display:flex;flex-direction:column;align-items:center;gap:10px;color:var(--tx3);font-size:13px}
.prpill{position:absolute;left:12px;top:12px;font-size:12px;padding:6px 12px;backdrop-filter:blur(10px)}
.prinfo{display:flex;flex-direction:column;justify-content:center;min-width:0;padding:6px 6px 6px 0}
.prtitle{font-size:22px;font-weight:600;line-height:1.2;overflow-wrap:anywhere}
.pbar{height:10px;border-radius:5px;background:rgba(var(--wh),.12);overflow:hidden;margin:16px 0 14px}
.pbar i{display:block;height:100%;border-radius:5px;background:linear-gradient(90deg,#38bdf8,#818cf8,#f472b6);box-shadow:0 0 16px rgba(129,140,248,.7);transition:width 1s}
.prs{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px}
.prs div{min-width:0}.prs b{display:block;font-size:15px;font-weight:600;white-space:nowrap}.prs span{font-size:11.5px;color:var(--tx3)}
.prctl{display:flex;gap:8px;flex-wrap:wrap;margin-top:16px}
.ggs{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}
.gg{position:relative;text-align:center}.gg svg{width:100%;max-width:150px;display:block;margin:0 auto}
.gg .gt{position:absolute;left:0;right:0;top:34%;}.gg .gt .big{font-size:30px}
.gl{font-size:13px;color:var(--tx2);margin-top:-6px}.gl span{display:block;font-size:11.5px;color:var(--tx3);margin-top:2px}
.fan{display:flex;align-items:center;gap:10px;margin-bottom:10px;font-size:13px;color:var(--tx2)}.fan span{width:120px;flex:none}.fan .pc2{flex:1;width:auto}.fan b{width:46px;text-align:right;color:var(--tx);font-weight:600;font-size:13px}
.spools{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}
.spool{display:flex;flex-direction:column;align-items:center;gap:6px;text-align:center;padding:14px 6px;border-radius:20px;background:rgba(var(--wh),.04);border:1px solid var(--line)}
.sp-c{width:64px;height:64px;border-radius:50%;display:grid;place-items:center;background:rgba(var(--wh),.08);color:rgba(0,0,0,.35);transition:.4s}
.spool b{font-size:13.5px;font-weight:600}.spool span{font-size:11.5px;color:var(--tx3)}
.uvr{position:relative;max-width:220px;margin:0 auto 10px}.uvr svg{width:100%;display:block}.uvv{position:absolute;left:0;right:0;bottom:0;text-align:center}.uvv .big{font-size:40px;line-height:1}.uvv span{font-size:12px;color:var(--tx2)}
.rrt{display:flex;gap:28px;flex-wrap:wrap;margin-bottom:14px}
.rrow{display:flex;align-items:center;gap:12px;margin-bottom:10px;font-size:13px;color:var(--tx2)}.rrow span{width:58px;flex:none}.rrow b{width:68px;text-align:right;color:var(--tx);font-weight:600}
.dg .dt .l{line-height:1.25}
@media (max-width:860px){.prh{grid-template-columns:1fr}.prcam{min-height:200px}.prs{grid-template-columns:repeat(2,minmax(0,1fr));row-gap:12px}.ggs{gap:4px}.gg .gt .big{font-size:26px}.spools{grid-template-columns:repeat(2,minmax(0,1fr))}.seg{width:100%}.seg button{flex:1;justify-content:center}.fan span{width:104px}.rrt{gap:20px}.vh .seg{margin-top:4px}}
.mcol{display:flex;flex-direction:column;gap:8px}
.mpr{cursor:default;gap:10px;padding:10px 12px}.mpr .grow{flex:1;min-width:0;cursor:pointer}.mpr .t{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.mpb{width:42px;height:42px;border-radius:14px;display:grid;place-items:center;background:rgba(var(--wh),.08);border:1px solid var(--line);flex:none;transition:.2s}
.spk{display:grid;grid-template-columns:56px minmax(0,1fr) auto;grid-template-areas:"art inf ctl" "vol vol vol";align-items:center;column-gap:12px;row-gap:10px;padding:12px;border-radius:20px;background:rgba(var(--wh),.05);border:1px solid var(--line);margin-bottom:8px;transition:.25s}
.spk.on{border-color:rgba(94,234,212,.4);background:linear-gradient(135deg,rgba(94,234,212,.12),rgba(129,140,248,.10))}
.spk .art{grid-area:art;width:56px;height:56px;border-radius:15px;background:rgba(var(--wh),.08) center/cover no-repeat;display:grid;place-items:center;color:var(--tx2);cursor:pointer}
.spk .inf{grid-area:inf;min-width:0;cursor:pointer}.spk .n{font-weight:600;font-size:14.5px;display:flex;align-items:center;gap:8px}.spk .s{font-size:12.5px;color:var(--tx2);margin-top:3px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.spk .ctl{grid-area:ctl;display:flex;gap:6px}.spk .vol{grid-area:vol;display:flex;align-items:center;gap:10px;color:var(--tx3)}.spk .vol input{margin:0;flex:1}.spk .vp{width:44px;text-align:right;font-size:12px;color:var(--tx2);font-variant-numeric:tabular-nums}
.eq{display:inline-flex;align-items:flex-end;gap:2px;height:12px}.eq i{width:3px;border-radius:1px;background:#5eead4;animation:eqb 1s ease-in-out infinite}.eq i:nth-child(2){animation-delay:-.4s}.eq i:nth-child(3){animation-delay:-.7s}
@keyframes eqb{0%,100%{height:3px}50%{height:12px}}@media (prefers-reduced-motion:reduce){.eq i{animation:none;height:8px}}
.annt,.annp{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:10px}.annp{margin:10px 0 0}
.annt button,.annp button{padding:8px 13px;border-radius:999px;background:rgba(var(--wh),.06);border:1px solid var(--line);font-size:13px;color:var(--tx2);transition:.2s;min-height:36px}
.annt button.on{background:linear-gradient(135deg,rgba(94,234,212,.28),rgba(129,140,248,.28));color:var(--tx);border-color:rgba(var(--wh),.2)}.annp button{font-size:12.5px}.annp button:hover,.annt button:hover{color:var(--tx)}
.xr.mus{cursor:pointer;flex-wrap:nowrap;min-width:0;overflow:hidden;padding:12px;gap:12px}.xr.mus .grow{min-width:0}.xr.mus .s{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
@media (max-width:359px){.spk{grid-template-columns:48px minmax(0,1fr);grid-template-areas:"art inf" "ctl ctl" "vol vol"}.spk .art{width:48px;height:48px}.spk .ctl:empty{display:none}}
.mpb:active{transform:scale(.92)}.mpb.main{background:linear-gradient(135deg,rgba(94,234,212,.28),rgba(129,140,248,.28));border-color:rgba(var(--wh),.2)}
@media (max-width:860px){.mpb{width:44px;height:44px}.mpr{flex-wrap:wrap}.mpr .grow{flex:1 1 calc(100% - 60px)}.ev{padding:10px}.dg .dt:last-child:nth-child(odd){grid-column:span 2}.alerts{gap:6px}.al{flex:none}.alerts{flex-wrap:nowrap;overflow-x:auto;scrollbar-width:none;margin-inline:-14px;padding-inline:14px}.alerts::-webkit-scrollbar{display:none}.h .r{text-align:right}}
/* pz22: Einkaufsliste & Rezepte */
.todo .t{flex:1}.todo .ck.on{border-color:rgba(52,211,153,.55);background:rgba(52,211,153,.2);color:#6ee7b7}.todo.dn{opacity:.62}.todo.dn .t{text-decoration:line-through;color:var(--tx3)}
.shx{flex:none;font-size:12px;color:var(--tx2);padding:3px 9px;border-radius:999px;background:rgba(var(--wh),.08)}
.shdl{display:flex;align-items:center;justify-content:space-between;gap:8px}.shdl .vbt{letter-spacing:0;font-weight:500;display:inline-flex;align-items:center;gap:6px}
.shmore{width:100%;margin-top:4px;min-height:40px}.shq{margin:0 0 4px}.shq button{display:inline-flex;align-items:center;gap:4px}
.rcg{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:10px}
.rc{display:flex;flex-direction:column;text-align:left;border-radius:18px;background:rgba(var(--wh),.05);border:1px solid var(--line);overflow:hidden;padding:0 0 12px;transition:.2s}.rc:hover{background:rgba(var(--wh),.09)}
.rc .ri{aspect-ratio:4/3;background:rgba(var(--wh),.06) center/cover;display:grid;place-items:center;color:var(--tx3);margin-bottom:9px}
.rc .rn{font-size:14px;font-weight:600;padding:0 12px;line-height:1.25}.rc .rs{font-size:11.5px;color:var(--tx3);padding:3px 12px 0}
.rwk{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:6px}
.rwk button{display:flex;flex-direction:column;gap:4px;padding:8px 5px;border-radius:14px;background:rgba(var(--wh),.05);border:1px solid var(--line);text-align:center;min-height:64px;min-width:0}
.rwk b{font-size:11px;color:var(--tx3);letter-spacing:.08em}.rwk span{font-size:12px;line-height:1.2;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden;overflow-wrap:anywhere}
.rwk button.on{border-color:rgba(94,234,212,.5);background:rgba(94,234,212,.12)}.rwk button.no{opacity:.45}
.rcback{display:inline-flex;align-items:center;gap:6px;margin-bottom:12px}.rcback svg{transform:rotate(180deg)}
.rch{position:relative;height:190px;border-radius:20px;background:rgba(var(--wh),.06) center/cover;display:grid;place-items:center;color:var(--tx3);overflow:hidden}
.rct{position:absolute;left:0;right:0;bottom:0;padding:30px 16px 14px;background:linear-gradient(transparent,rgba(0,0,0,.75));color:#fff}.rct h3{margin:0 0 2px;font-size:20px;font-weight:600}.rct span{font-size:12.5px;opacity:.85}
.rsv{display:inline-flex;align-items:center;gap:8px;letter-spacing:0}.rsv b{font-size:13px;color:var(--tx);font-weight:500;white-space:nowrap}.lab2 .rsv .mpb,.ing .mpb{width:36px;height:36px;flex:none}
.ings{display:flex;flex-direction:column;gap:6px}
.ing{display:flex;align-items:center;gap:10px;padding:6px 6px 6px 12px;border-radius:14px;background:rgba(var(--wh),.045)}
.ing .q{flex:none;min-width:68px;font-size:13px;color:var(--tx2);font-variant-numeric:tabular-nums}.ing .n{flex:1;min-width:0;font-size:14px;overflow-wrap:anywhere}
.ing.on .mpb{color:#6ee7b7}.mpb[disabled]{pointer-events:none;opacity:.55}.rcall{width:100%}
.stp{margin:0;padding-left:24px;display:flex;flex-direction:column;gap:10px}.stp li{font-size:14px;line-height:1.5;padding-left:4px}.stp li::marker{color:var(--acc);font-weight:600}
/* pz23: Kalender-Woche */
.wkn{display:block;font-size:12px;font-weight:500;color:var(--tx3);text-transform:none}
.wk{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:6px}
.wkd{min-width:0;border-radius:16px;background:rgba(var(--wh),.04);border:1px solid var(--line);padding:8px 6px;min-height:150px}
.wkd.we{background:rgba(var(--wh),.065)}.wkd.past{opacity:.5}.wkd.today{border-color:rgba(94,234,212,.55);background:rgba(94,234,212,.1)}
.wkh{display:flex;align-items:baseline;justify-content:center;gap:5px;margin-bottom:8px}.wkh b{font-size:12px;letter-spacing:.06em;color:var(--tx3);text-transform:uppercase}.wkh span{font-size:16px;font-weight:650}.wkd.today .wkh b{color:#5eead4}
.wkl{display:flex;flex-direction:column;gap:5px}
.wke{position:relative;border-radius:10px;padding:5px 6px 5px 10px;background:rgba(var(--wh),.06);font-size:12px;line-height:1.25;overflow-wrap:break-word;hyphens:auto}
.wke i{position:absolute;left:3px;top:5px;bottom:5px;width:3px;border-radius:2px;background:var(--ec)}.wke b{display:block;font-size:11px;font-weight:600;color:var(--tx2);font-variant-numeric:tabular-nums}
.wke.ad{background:color-mix(in srgb,var(--ec) 22%,transparent)}.wk0{font-size:11.5px;color:var(--tx3);text-align:center;padding:6px 0}
@media (max-width:640px){.wk{grid-template-columns:1fr;gap:6px}.wkd{display:flex;gap:10px;min-height:0;padding:8px 10px;align-items:flex-start}
  .wkh{flex-direction:column;align-items:center;gap:0;width:38px;flex:none;margin:2px 0 0}.wkl{flex:1;min-width:0}.wk0{text-align:left;padding:4px 0}
  .wke{display:flex;gap:8px;align-items:baseline;font-size:13.5px;padding:7px 8px 7px 12px}.wke b{display:inline;font-size:12.5px;flex:none}}

/* pz34 Radio: Senderskala wie am alten Radio, Glas-Kacheln im Aurora-Stil */
.rx-vh{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;flex-wrap:wrap}.rx-top{display:flex;align-items:center;gap:10px}
.rx-live{display:inline-flex;align-items:center;gap:8px;font-size:10px;letter-spacing:.17em;font-weight:800;color:var(--tx3);padding:8px 12px;border-radius:999px;background:rgba(var(--wh),.05);border:1px solid var(--line)}
.rx-live i{width:7px;height:7px;border-radius:50%;background:#64748b}.rx-live.on{color:#5eead4;border-color:rgba(94,234,212,.32);background:rgba(94,234,212,.08)}.rx-live.on i{background:#5eead4;box-shadow:0 0 10px rgba(94,234,212,.9)}
.rx{display:flex;flex-direction:column;gap:12px}.rx .h{margin:4px 0 -4px}
.rx-dial{padding:14px 18px}
.rx-scale{position:relative;height:96px;border-radius:14px;background:linear-gradient(180deg,rgba(94,234,212,.1),rgba(129,140,248,.06));border:1px solid rgba(94,234,212,.2);overflow:hidden}
.rx-nums{position:absolute;left:16px;right:16px;top:7px;display:flex;justify-content:space-between;font-size:12px;color:var(--tx2);font-variant-numeric:tabular-nums}
.rx-tk{position:absolute;left:16px;right:16px;top:30px;height:20px;background:repeating-linear-gradient(90deg,rgba(var(--wh),.4) 0 1px,transparent 1px 12px)}
.rx-tk2{position:absolute;left:16px;right:16px;top:25px;height:26px;background:repeating-linear-gradient(90deg,rgba(var(--wh),.75) 0 2px,transparent 2px 60px)}
.rx-marks{position:absolute;left:16px;right:16px;top:56px;height:34px}
.rxm{position:absolute;transform:translateX(-50%);max-width:130px;overflow:hidden;text-overflow:ellipsis;font:inherit;font-size:11px;letter-spacing:.06em;font-weight:700;color:var(--tx3);padding:6px 4px;white-space:nowrap;background:none;border:0;cursor:pointer}.rxm.on{color:#5eead4;text-shadow:0 0 10px rgba(94,234,212,.6)}
.rx-needle{position:absolute;top:0;bottom:0;width:3px;margin-left:-1px;background:#5eead4;box-shadow:0 0 14px #5eead4,0 0 30px rgba(94,234,212,.55);border-radius:2px;transition:left .7s cubic-bezier(.3,1.3,.5,1);pointer-events:none}
.rx-scale .rx-needle{left:calc(16px + (100% - 32px) * var(--p, 0))}
.rx-needle.idle{opacity:.35;box-shadow:none}
.rx-fm{position:absolute;left:12px;bottom:6px;font-size:10px;color:#5eead4;font-weight:800;letter-spacing:.2em;pointer-events:none}
.rx-mid{display:grid;grid-template-columns:1.25fr 1fr;gap:12px}
.rx-now{padding:16px 20px;display:flex;gap:16px;align-items:center;min-width:0}
.rx-logo{width:84px;height:84px;flex:none;border-radius:20px;display:grid;place-items:center;font-weight:900;font-size:21px;letter-spacing:-.01em;color:#fff;background:linear-gradient(145deg,rgba(94,234,212,.2),rgba(129,140,248,.18));border:1px solid rgba(255,255,255,.14);box-shadow:0 10px 30px rgba(0,0,0,.3);text-align:center;line-height:1.05;padding:4px}
.rx-tr{min-width:0;flex:1}.rx-k{font-size:10px;letter-spacing:.16em;color:#5eead4;font-weight:800}.rx-t{font-size:clamp(19px,2.6vw,26px);font-weight:700;margin:3px 0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.rx-a{color:var(--tx3);font-size:13px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.rx-eq{display:flex;gap:3px;align-items:flex-end;height:36px;flex:none}.rx-eq i{width:5px;height:6px;border-radius:3px;background:linear-gradient(#5eead4,#818cf8);opacity:.5}
.rx-eq.on i{opacity:1;animation:rxeq .9s ease-in-out infinite alternate}.rx-eq.on i:nth-child(2n){animation-delay:-.4s}.rx-eq.on i:nth-child(3n){animation-delay:-.65s}
@keyframes rxeq{from{height:6px}to{height:36px}}
.rx-ctl{padding:14px 18px;display:flex;gap:16px;align-items:center;min-width:0}
.rx-knob{width:92px;height:92px;flex:none;border-radius:50%;display:grid;place-items:center;color:var(--tx3);background:radial-gradient(circle at 35% 30%,#334155,#0b1220 70%);border:2px solid rgba(var(--wh),.15);box-shadow:inset 0 2px 6px rgba(255,255,255,.12),0 8px 20px rgba(0,0,0,.35);cursor:pointer;transition:.25s}
.rx-knob.on{color:#5eead4;border-color:rgba(94,234,212,.6);box-shadow:0 0 0 6px rgba(94,234,212,.08),0 0 30px rgba(94,234,212,.35),inset 0 2px 6px rgba(255,255,255,.12)}.rx-knob.on svg{filter:drop-shadow(0 0 6px #5eead4)}.rx-knob:disabled{opacity:.4}
.rx-vol{flex:1;min-width:0}.rx-vh2{display:flex;justify-content:space-between;align-items:baseline;font-size:10px;letter-spacing:.14em;color:var(--tx3);font-weight:700}.rx-vh2 b{color:var(--tx);font-size:16px;letter-spacing:0}
input.rx-bar[type=range]{-webkit-appearance:none;appearance:none;width:100%;height:14px;border-radius:99px;margin:12px 0 6px;background:linear-gradient(90deg,#22c55e,#a3e635 35%,#facc15 60%,#f97316 80%,#ef4444);outline:none;cursor:pointer}
input.rx-bar[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:26px;height:26px;border-radius:50%;background:#fff;box-shadow:0 0 0 4px rgba(255,255,255,.15),0 4px 10px rgba(0,0,0,.5)}
input.rx-bar[type=range]::-moz-range-thumb{width:24px;height:24px;border:0;border-radius:50%;background:#fff;box-shadow:0 0 0 4px rgba(255,255,255,.15),0 4px 10px rgba(0,0,0,.5)}input.rx-bar[type=range]:disabled{opacity:.35}
.rx-vr{display:flex;justify-content:space-between;font-size:11px;color:var(--tx3)}
.rx-qv{display:flex;gap:6px;margin-top:10px}.rx-qv button{flex:1;min-width:0;font:inherit;font-size:13px;color:var(--tx2);padding:8px 0;border-radius:12px;border:1px solid var(--line);background:rgba(var(--wh),.05);cursor:pointer}.rx-qv button:active{background:rgba(94,234,212,.15)}.rx-qv button:disabled{opacity:.4}
.rx-pls{display:flex;gap:8px;flex-wrap:wrap}
.rxp{display:flex;align-items:center;gap:8px;font:inherit;font-size:14px;font-weight:600;color:var(--tx);padding:10px 14px;border-radius:14px;border:1px solid var(--line);background:rgba(var(--wh),.05);cursor:pointer;transition:.2s}
.rxp i{width:8px;height:8px;border-radius:50%;background:#64748b}.rxp small{font-weight:500;color:var(--tx3);font-size:12px}
.rxp.pl i{background:#a78bfa;box-shadow:0 0 8px #a78bfa}
.rxp.on{border-color:rgba(94,234,212,.6);background:rgba(94,234,212,.12);box-shadow:0 0 18px rgba(94,234,212,.2)}.rxp.on i{background:#5eead4;box-shadow:0 0 8px #5eead4}
.rxp.off{opacity:.42;cursor:default}
.rx-st{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:10px}
.rxs{container-type:inline-size;display:flex;flex-direction:column;align-items:center;gap:8px;padding:12px;border-radius:18px;font:inherit;color:var(--tx);cursor:pointer;text-align:center;min-width:0;transition:transform .2s,border-color .2s,box-shadow .2s}
.rxs:active{transform:scale(.97)}
.rxb{width:100%;height:58px;border-radius:12px;display:grid;place-items:center;font-weight:900;font-size:18px;letter-spacing:-.01em;color:#fff;text-shadow:0 1px 3px rgba(0,0,0,.35);overflow:hidden;padding:0 4px}
.rxb.lg{font-size:13px;font-size:min(16px,calc((100cqw - 32px) / (var(--n) * .72)));letter-spacing:0;white-space:nowrap}.rx-logo.lg{font-size:12px}.rxb.sm{width:52px;height:40px;font-size:12px;flex:none;border-radius:10px}
.rxn{font-size:12px;font-weight:700;letter-spacing:.05em;color:var(--tx2);text-transform:uppercase;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:100%}
.rxs.on{border-color:rgba(94,234,212,.7);box-shadow:0 0 0 1px rgba(94,234,212,.4),0 0 26px rgba(94,234,212,.25)}.rxs.on .rxn{color:#5eead4}
.rxadd .rxb{background:rgba(var(--wh),.04);border:1.5px dashed rgba(var(--wh),.22);color:var(--tx3);text-shadow:none}
.rxf{display:flex;flex-direction:column;gap:8px;margin-bottom:12px}
.rxf input{height:46px;border-radius:15px;border:1px solid var(--line);background:rgba(var(--wh),.06);color:var(--tx);font:inherit;font-size:15px;padding:0 14px;outline:none}
.rxf input:focus{border-color:rgba(94,234,212,.6);background:rgba(var(--wh),.1)}.rxf input::placeholder{color:var(--tx3)}
.rxfb{display:flex;gap:8px;justify-content:flex-end}
.rxe{display:flex;align-items:center;gap:12px;padding:8px 6px;border-bottom:1px solid var(--line)}.rxe.on{background:rgba(94,234,212,.08);border-radius:12px}
.rxe .t{font-weight:650;font-size:15px}.rxe .s{font-size:12px;color:var(--tx3);margin-top:2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.rxe .grow{min-width:0;flex:1}
.rxe .mpb.arm{background:rgba(248,113,113,.2);color:#fca5a5;border-color:rgba(248,113,113,.4)}
@media(max-width:900px){.rx-mid{grid-template-columns:1fr}.rx-st{grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}}
@media(max-width:640px){.rx-dial{padding:10px}.rx-scale{height:84px}.rx-nums span:nth-child(2n){visibility:hidden}.rxm{font-size:9px;letter-spacing:0;max-width:62px}
  .rx-now{padding:12px 14px;gap:12px}.rx-logo{width:64px;height:64px;font-size:16px;border-radius:16px}.rx-ctl{padding:12px 14px;gap:12px}.rx-knob{width:70px;height:70px}
  .rx-qv{gap:4px}.rx-qv button{font-size:12px}.rxp{padding:8px 11px;font-size:13px}.rxb{height:48px;font-size:15px}.rxs{padding:9px;gap:6px}.rxn{font-size:10.5px}}
@media(prefers-reduced-motion:reduce){.rx-eq.on i{animation:none;height:24px}.rx-needle{transition:none}}

`;
