/* Room 8: the yard and the churchyard path (crime scene 8). Night 21. An outdoor night scene.
   Laid out as on the Constable's map (book/content/n21.py): north is -z. Edmund's yard lies south of the workshop, with the yard
   gate in its east wall onto Church Lane; across the lane the churchyard wall (Y), and the churchyard path runs east to the back
   of the green and the choir stand (S), with St Nicholas to the north of the path and the Church Hall to the south. Walking from
   the green to the yard gate, as the Constable does, the dark church is on your right. You stand in the yard, on the planks.
   From the scene: snow on the old stones, the yew tree with an owl in it, an icy step halfway along the path, police string
   across the yard gate. The printed evidence comes word for word from assets/printed.js. */
const P = window.CM_PRINTED;
const ROOM = {
  code:'r8',
  title:'The Yard and the Churchyard Path',
  subtitle:'Crime scene 8 · Night 21',
  bg:0x0b1322, exposure:0.92,
  view:{ pos:[-3.5, 1.6, 0.05], yaw:-Math.PI / 2, pitch:-0.05, fovPortrait:80 },
  previews:[-Math.PI / 2, -0.35, 0.75, 2.5, -2.3],
  intro:{
    kicker:'Night 21 · Crime scene 8',
    heading:'The yard and the churchyard path',
    paras:[
      "Edmund's little yard is still roped off. Through the open gate, across Church Lane, the churchyard path runs past the dark church to the back of the green, where the choir stood.",
      '<b>Your task:</b> Constable Ambrose has measured the ways from the choir stand to the workshop. Find his map and his notes, and work out which way a singer could go and still be back in time.',
    ],
    button:'Step into the yard',
    sound:'Sound on if you like: tonight the clues are all things you read.',
  },

  build(K){
    const { T, box, cyl, sph, plane, grp, col, mats, D, tex, rnd } = K;
    const S = K.scene; S.fog = new T.FogExp2(0x0b1322, 0.024);
    const snowMat = K.M({ map:tex(256, 256, (g, w, h) => D.snow(g, w, h), [30, 30]), roughness:1, color:0xc4cede });
    const ground = new T.Mesh(new T.PlaneGeometry(120, 120), snowMat); ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; S.add(ground);
    // the sky all round (u 0 west, .25 south, .5 east, .75 north): stars, the moon, the village rooftops low on the horizon, the green's lights to the east
    const sky = new T.Mesh(new T.SphereGeometry(58, 32, 16), new T.MeshBasicMaterial({ side:T.BackSide, fog:false, map:tex(2048, 1024, (g, w, h) => {
      const gr = g.createLinearGradient(0, 0, 0, h * .5); gr.addColorStop(0, '#03060d'); gr.addColorStop(.8, '#0c1830'); gr.addColorStop(1, '#22304c'); g.fillStyle = gr; g.fillRect(0, 0, w, h * .5); g.fillStyle = '#0d1220'; g.fillRect(0, h * .5, w, h * .5);
      for (let i = 0; i < 700; i++){ g.fillStyle = `rgba(255,255,255,${rnd(.25, .9)})`; g.fillRect(rnd(0, w), rnd(0, h * .45), rnd(1, 2.4), rnd(1, 2.4)); }
      g.fillStyle = '#eef2f8'; g.beginPath(); g.arc(w * .14, h * .2, 18, 0, Math.PI * 2); g.fill(); g.fillStyle = 'rgba(220,230,255,.1)'; g.beginPath(); g.arc(w * .14, h * .2, 50, 0, Math.PI * 2); g.fill();
      const house = (x, bw, hh) => { const y0 = h * .5, top = y0 - hh; g.fillStyle = '#141a28'; g.fillRect(x, top, bw, hh); g.beginPath(); g.moveTo(x - 3, top + 1); g.lineTo(x + bw / 2, top - hh * .45); g.lineTo(x + bw + 3, top + 1); g.fill(); g.fillStyle = '#c9d2e0'; g.beginPath(); g.moveTo(x - 3, top + 1); g.lineTo(x + bw / 2, top - hh * .45); g.lineTo(x + bw / 2, top - hh * .45 + 4); g.lineTo(x - 1, top + 4); g.fill(); if (Math.random() < .6){ g.fillStyle = 'rgba(255,205,125,.85)'; g.fillRect(x + bw * .3, top + hh * .35, 5, 6); } };
      for (let x = -w * .12; x < w * .14; x += rnd(34, 52)) house((x + w) % w, rnd(28, 44), rnd(18, 30));
      for (let x = w * .64; x < w * .86; x += rnd(40, 70)) house(x, rnd(26, 40), rnd(14, 22));
      for (let i = 0; i < 70; i++){ g.fillStyle = ['#ffcf80', '#ff8a6a', '#ffe9a0', '#9ad7ff'][i % 4]; g.globalAlpha = rnd(.5, .9); g.fillRect(w * rnd(.45, .56), h * rnd(.488, .5), 2.5, 2.5); }
      g.globalAlpha = 1; }) })); sky.position.y = 1.6; S.add(sky);

    // ---------------- Church Lane ----------------
    plane(3.0, 80, K.M({ map:tex(128, 512, (g, w, h) => { g.fillStyle = '#b9c3d2'; g.fillRect(0, 0, w, h); for (let i = 0; i < 400; i++){ g.fillStyle = `rgba(90,105,130,${rnd(.05, .2)})`; g.fillRect(rnd(0, w), rnd(0, h), rnd(2, 8), rnd(2, 10)); } g.fillStyle = 'rgba(80,95,120,.25)'; g.fillRect(w * .28, 0, 10, h); g.fillRect(w * .66, 0, 10, h); }, [1, 8]), roughness:1 }), 0, 0.004, 0, -Math.PI / 2);

    // ---------------- Edmund's yard: walls, gate, the workshop with its yard window, the kitchen door ----------------
    const stone = col(0x57524c, .95), cap = mats.snow;
    const wallZ = (x, z0, z1, hgt) => { box(0.3, hgt, Math.abs(z1 - z0), stone, x, hgt / 2, (z0 + z1) / 2); box(0.36, 0.08, Math.abs(z1 - z0) + 0.02, cap, x, hgt + 0.04, (z0 + z1) / 2, false); };
    const wallX = (z, x0, x1, hgt) => { box(Math.abs(x1 - x0), hgt, 0.3, stone, (x0 + x1) / 2, hgt / 2, z); box(Math.abs(x1 - x0) + 0.02, 0.08, 0.36, cap, (x0 + x1) / 2, hgt + 0.04, z, false); };
    wallZ(-1.6, -3.6, -0.85, 1.4); wallZ(-1.6, 0.85, 2.6, 1.4); wallX(2.6, -9.2, -1.45, 1.4); wallZ(-9.2, -3.6, 2.6, 1.4);
    for (const dz of [-0.65, 0.65]){ box(0.4, 1.6, 0.4, col(0x5e5953, .95), -1.6, 0.8, dz); box(0.44, 0.08, 0.44, cap, -1.6, 1.64, dz, false); }
    // the gate stands open against the inside of the wall; police string is tied across the gateway
    const gt = grp(-1.83, 0, 0.62, 0); const gw = col(0x4a3a2a, .8);
    for (let i = 0; i < 6; i++) box(0.05, 1.25, 0.16, gw, 0, 0.7, 0.12 + i * 0.2, false, gt);
    box(0.07, 0.1, 1.15, gw, 0.02, 1.1, 0.6, false, gt); box(0.07, 0.1, 1.15, gw, 0.02, 0.35, 0.6, false, gt);
    const tape = K.M({ map:tex(64, 8, (g, w, h) => { for (let i = 0; i < 8; i++){ g.fillStyle = i % 2 ? '#f2f2f2' : '#2a4a9a'; g.fillRect(i * 8, 0, 8, h); } }, [6, 1]), roughness:.6 });
    box(0.012, 0.05, 1.3, tape, -1.6, 1.02, 0, false); box(0.012, 0.05, 1.3, tape, -1.6, 0.62, 0, false);
    // the lantern on the gatepost (as seen from the workshop window)
    const glowT = tex(64, 64, (g, w, h) => { const gr = g.createRadialGradient(32, 32, 2, 32, 32, 32); gr.addColorStop(0, 'rgba(255,210,130,.9)'); gr.addColorStop(1, 'rgba(255,210,130,0)'); g.fillStyle = gr; g.fillRect(0, 0, 64, 64); });
    const glow = (x, y, z, s) => { const sp = new T.Sprite(new T.SpriteMaterial({ map:glowT, transparent:true, depthWrite:false, blending:T.AdditiveBlending })); sp.scale.set(s, s, 1); sp.position.set(x, y, z); S.add(sp); return sp; };
    box(0.1, 0.14, 0.1, mats.iron, -1.6, 1.75, -0.65, false); box(0.07, 0.1, 0.07, new T.MeshBasicMaterial({ color:0xffc870 }), -1.6, 1.75, -0.65, false); glow(-1.6, 1.78, -0.65, 0.7);
    // the Constable's map on a clipboard, hung on the gatepost (clue)
    plane(0.24, 0.32, K.M({ map:tex(96, 128, (g, w, h) => { g.fillStyle = '#6b4a2a'; g.fillRect(0, 0, w, h); g.fillStyle = '#f6f2e6'; g.fillRect(6, 14, w - 12, h - 20); g.fillStyle = '#9a9a9a'; g.fillRect(10, 26, w - 20, 6); g.fillRect(40, 32, 6, h - 40); g.strokeStyle = '#222'; g.lineWidth = 1.5; g.strokeRect(14, 40, 22, 16); g.strokeRect(54, 44, 28, 20); g.setLineDash([2, 3]); g.beginPath(); g.moveTo(80, 90); g.quadraticCurveTo(64, 96, 50, 86); g.stroke(); g.setLineDash([]); g.fillStyle = '#c9993f'; g.fillRect(36, 6, 24, 12); }), roughness:.8 }), -1.812, 1.2, -0.65, 0, -Math.PI / 2, 0);
    // the workshop and Edmund's house, north of the yard
    const brick = K.M({ map:tex(256, 256, (g, w, h) => { g.fillStyle = '#4a4038'; g.fillRect(0, 0, w, h); for (let r = 0; r < 10; r++) for (let c = 0; c < 5; c++){ const x = c * 52 + (r % 2 ? 26 : 0) - 26, y = r * 26, v = rnd(-12, 12); g.fillStyle = D.shade('#7a6250', v); g.fillRect(x + 2, y + 2, 48, 22); } }, [5, 2]), roughness:.95 });
    const WX = -4.1, WB = 0.5, WT = 2.0, WW = 1.7;
    const bw = (x0, x1, y0, y1) => { const m = new T.Mesh(new T.PlaneGeometry(x1 - x0, y1 - y0), brick); m.position.set((x0 + x1) / 2, (y0 + y1) / 2, -3.6); m.receiveShadow = true; const uv = m.geometry.attributes.uv; for (let i = 0; i < uv.count; i++) uv.setXY(i, (x0 + uv.getX(i) * (x1 - x0)) / 1.6, (y0 + uv.getY(i) * (y1 - y0)) / 1.6); S.add(m); };
    bw(-9.4, WX - WW / 2, 0, 3.2); bw(WX + WW / 2, -1.45, 0, 3.2); bw(WX - WW / 2, WX + WW / 2, 0, WB); bw(WX - WW / 2, WX + WW / 2, WT, 3.2);
    box(8.0, 0.18, 2.6, K.M({ color:0x2e2a2a, roughness:.9 }), -5.4, 3.55, -4.6).rotation.x = -0.45;
    box(8.1, 0.06, 2.6, cap, -5.4, 3.66, -4.6, false).rotation.x = -0.45;
    box(8.0, 3.4, 2.4, col(0x3a3230, .95), -5.4, 1.7, -4.85, false);
    // the yard window, lit from inside
    const fr = mats.white;
    box(WW + 0.16, 0.08, 0.16, fr, WX, WT, -3.56, false); box(WW + 0.3, 0.06, 0.3, fr, WX, WB - 0.02, -3.48, false); box(WW * 0.92, 0.035, 0.24, cap, WX, WB + 0.02, -3.44, false);
    for (const x of [-WW / 2, 0, WW / 2]) box(x === 0 ? 0.05 : 0.08, WT - WB, 0.16, fr, WX + x, (WB + WT) / 2, -3.56, false);
    box(WW, 0.035, 0.05, fr, WX, (WB + WT) / 2, -3.56, false);
    plane(WW, WT - WB, new T.MeshBasicMaterial({ map:tex(256, 160, (g, w, h) => { const gr = g.createRadialGradient(w * .62, h * .3, 4, w * .5, h * .5, w * .7); gr.addColorStop(0, '#f0c888'); gr.addColorStop(1, '#6a4422'); g.fillStyle = gr; g.fillRect(0, 0, w, h); g.fillStyle = '#4a2d19'; g.fillRect(w * .45, h * .55, w * .55, h * .1); g.fillRect(w * .5, h * .65, 8, h * .35); g.fillStyle = '#5a3a22'; for (let i = 0; i < 6; i++) g.fillRect(w * (.5 + i * .07), h * .2, 6, h * .25); g.fillStyle = '#2e4a3a'; g.beginPath(); g.moveTo(w * .8, h * .3); g.lineTo(w * .9, h * .3); g.lineTo(w * .86, h * .45); g.fill(); g.fillStyle = '#1f4a2a'; g.beginPath(); g.moveTo(w * .14, h * .22); g.lineTo(w * .04, h * .62); g.lineTo(w * .24, h * .62); g.fill(); g.fillStyle = 'rgba(30,18,8,.35)'; g.fillRect(0, 0, w, h); g.fillStyle = 'rgba(255,255,255,.06)'; g.beginPath(); g.moveTo(0, 0); g.lineTo(w * .35, 0); g.lineTo(0, h * .6); g.fill(); }) }), WX, (WB + WT) / 2, -3.64);
    plane(WW, WT - WB, mats.glass, WX, (WB + WT) / 2, -3.57);
    K.point(0xffc07a, 0.9, 7, WX, 1.3, -2.9);
    // the kitchen window and back door
    box(0.9, 0.06, 0.2, fr, -6.4, 1.0, -3.52, false); plane(0.8, 0.8, new T.MeshBasicMaterial({ color:0x6a4a2a }), -6.4, 1.45, -3.59); box(0.9, 0.06, 0.12, fr, -6.4, 1.88, -3.55, false);
    box(0.92, 2.0, 0.08, col(0x2f4a3a, .6), -7.6, 1.0, -3.56); sph(0.035, mats.brass, -7.25, 1.0, -3.5, null, 6);
    // the washing line roping off the yard, on four posts, and the two planks laid on the snow
    const posts = [[-1.95, -3.3], [-5.4, -3.3], [-5.4, 1.25], [-1.95, 1.25]];
    posts.forEach(([x, z]) => cyl(0.03, 0.035, 1.0, col(0x6b4a2a, .8), x, 0.5, z, 6));
    const pts = []; for (let k = 0; k < 4; k++){ const a = posts[k], b = posts[(k + 1) % 4]; if (k === 0) continue; for (let i = 0; i <= 8; i++){ const t = i / 8; pts.push(new T.Vector3(a[0] + (b[0] - a[0]) * t, 0.95 - Math.sin(t * Math.PI) * 0.12, a[1] + (b[1] - a[1]) * t)); } }
    const rope = new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3(pts), 60, 0.007, 4, false), col(0xe9e1cf, .8)); S.add(rope);
    for (let i = 0; i < 5; i++){ const pg = box(0.012, 0.05, 0.02, col(0xb08a5a, .8), -5.4, 0.9, -2.4 + i * 0.7, false); }
    const plk = col(0x8a6a44, .85);
    box(2.0, 0.04, 0.26, plk, -2.75, 0.02, 0.0); const p2 = box(0.26, 0.04, 2.9, plk, -3.95, 0.022, -1.65); p2.rotation.y = 0.09;
    // old prints under the frozen crust, beside the planks, and the cat's paws along the south wall
    const prT = tex(128, 256, (g, w, h) => { g.clearRect(0, 0, w, h); D.bootPrint(g, w / 2, h * .62, 1.05, 0, { fill:'rgba(80,100,135,.32)', tread:'rgba(60,78,110,.25)' }); });
    const prM = new T.MeshStandardMaterial({ map:prT, transparent:true, depthWrite:false, roughness:.9 });
    for (let i = 0; i < 8; i++){ const t = (i + .5) / 8, x = -1.9 + (WX + 0.3 + 1.9) * t, z = 0.3 - 3.3 * t; const m = new T.Mesh(new T.PlaneGeometry(0.16, 0.32), prM); m.rotation.x = -Math.PI / 2; m.rotation.z = Math.atan2(WX + 0.3 + 1.9, -3.3) + Math.PI; m.position.set(x + (i % 2 ? 0.08 : -0.08) + 0.35, 0.008, z); S.add(m); }

    // ---------------- across the lane: the churchyard wall, with a gap for the path ----------------
    const cw = col(0x625d56, .95);
    const cwall = (z0, z1) => { box(0.4, 1.1, Math.abs(z1 - z0), cw, 1.6, 0.55, (z0 + z1) / 2); box(0.46, 0.08, Math.abs(z1 - z0) + 0.02, cap, 1.6, 1.14, (z0 + z1) / 2, false); };
    cwall(-16, -1.0); cwall(1.0, 14);
    for (const z of [-0.8, 0.8]){ box(0.5, 1.35, 0.45, col(0x6a645c, .95), 1.6, 0.675, z); box(0.56, 0.1, 0.5, cap, 1.6, 1.4, z, false); }
    // the Constable's notebook, pocket watch and lantern on the wall top
    const nb = grp(1.6, 1.185, -1.3, 0.1); box(0.3, 0.02, 0.22, col(0x1e2a44, .7), 0, 0, 0, true, nb);
    plane(0.28, 0.2, K.M({ map:tex(128, 96, (g, w, h) => { g.fillStyle = '#f3eedf'; g.fillRect(0, 0, w, h); g.fillStyle = 'rgba(0,0,0,.2)'; g.fillRect(w / 2 - 1, 0, 2, h); g.strokeStyle = 'rgba(30,40,90,.6)'; g.lineWidth = 1.2; for (let y = 12; y < h - 6; y += 8){ g.beginPath(); g.moveTo(6, y); g.lineTo(rnd(30, 58), y); g.moveTo(70, y); g.lineTo(rnd(90, 122), y); g.stroke(); } }), roughness:.9 }), 0, 0.012, 0, -Math.PI / 2, 0, 0, nb);
    const wt = grp(1.62, 1.19, -1.72); cyl(0.03, 0.03, 0.012, mats.brass, 0, 0, 0, 14, wt); plane(0.05, 0.05, K.M({ map:tex(64, 64, (g) => D.clockFace(g, 32, 32, 28, 9, 17, { arabic:true })) }), 0, 0.007, 0, -Math.PI / 2, 0, 0, wt);
    const ln = grp(1.6, 1.18, -2.1); box(0.14, 0.03, 0.14, mats.iron, 0, 0.015, 0, true, ln); box(0.1, 0.16, 0.1, new T.MeshBasicMaterial({ color:0xffd08a }), 0, 0.11, 0, false, ln); for (const a of [[-.06, -.06], [-.06, .06], [.06, -.06], [.06, .06]]) box(0.012, 0.2, 0.012, mats.iron, a[0], 0.12, a[1], false, ln); box(0.14, 0.03, 0.14, mats.iron, 0, 0.23, 0, false, ln);
    glow(1.6, 1.3, -2.1, 0.8); K.point(0xffc070, 0.75, 6, 1.6, 1.4, -2.1);

    // ---------------- the churchyard path, with the icy step halfway along ----------------
    const pathM = K.M({ map:tex(128, 128, (g, w, h) => { g.fillStyle = '#aab4c4'; g.fillRect(0, 0, w, h); for (let i = 0; i < 200; i++){ g.fillStyle = `rgba(80,95,120,${rnd(.05, .18)})`; g.fillRect(rnd(0, w), rnd(0, h), rnd(2, 7), rnd(2, 7)); } }, [1, 1]), roughness:1 });
    const seg = [[1.4, 0.0], [5.0, 0.15], [9.0, 0.1], [13.0, 0.35], [17.0, 0.4], [21.5, 0.3]];
    for (let i = 0; i < seg.length - 1; i++){ const a = seg[i], b = seg[i + 1]; const len = Math.hypot(b[0] - a[0], b[1] - a[1]); const m = plane(len + 0.2, 1.3, pathM, (a[0] + b[0]) / 2, 0.006 + i * 0.0004, (a[1] + b[1]) / 2, -Math.PI / 2, 0, -Math.atan2(b[1] - a[1], b[0] - a[0])); }
    box(0.5, 0.14, 1.5, col(0x7a746c, .9), 9.5, 0.07, 0.12);
    plane(0.52, 1.5, K.M({ map:tex(64, 128, (g, w, h) => { const gr = g.createLinearGradient(0, 0, w, h); gr.addColorStop(0, '#cfe4f6'); gr.addColorStop(1, '#9ab8d6'); g.fillStyle = gr; g.fillRect(0, 0, w, h); g.fillStyle = 'rgba(255,255,255,.6)'; for (let i = 0; i < 12; i++) g.fillRect(rnd(0, w), rnd(0, h), rnd(6, 20), 2); }), roughness:.05, metalness:.2 }), 9.5, 0.142, 0.12, -Math.PI / 2, 0, 0);
    plane(0.13, 0.26, new T.MeshStandardMaterial({ map:tex(128, 256, (g, w, h) => { g.clearRect(0, 0, w, h); D.bootPrint(g, w / 2, h * .62, 1.05, 0, { fill:'rgba(60,80,118,.75)', tread:'rgba(35,50,80,.6)', nick:true, snow:'#b6cde4' }); }), transparent:true, depthWrite:false, roughness:.1 }), 9.5, 0.145, 0.25, -Math.PI / 2, 0, -Math.PI / 2);

    // ---------------- gravestones, the yew tree and its owl ----------------
    const gs = col(0x7f7a72, .95), gs2 = col(0x625e58, .95);
    const head = (x, z, hgt, wd, ry, m) => { const g2 = grp(x, 0, z, ry); box(wd, hgt, 0.12, m, 0, hgt / 2, 0, true, g2); const top = cyl(wd / 2, wd / 2, 0.12, m, 0, hgt, 0, 10, g2); top.rotation.x = Math.PI / 2; box(wd * 0.9, 0.05, 0.13, cap, 0, hgt + wd / 2 - 0.02, 0, false, g2); g2.rotation.z = rnd(-.06, .06); };
    const cross = (x, z, hgt, ry) => { const g2 = grp(x, 0, z, ry); box(0.14, hgt, 0.12, gs, 0, hgt / 2, 0, true, g2); box(0.5, 0.12, 0.12, gs, 0, hgt * 0.75, 0, true, g2); box(0.16, 0.05, 0.14, cap, 0, hgt + 0.02, 0, false, g2); box(0.52, 0.04, 0.14, cap, 0, hgt * 0.75 + 0.08, 0, false, g2); box(0.5, 0.2, 0.4, gs2, 0, 0.1, 0, true, g2); };
    const tomb = (x, z, ry) => { const g2 = grp(x, 0, z, ry); box(1.1, 0.6, 0.6, gs2, 0, 0.3, 0, true, g2); box(1.2, 0.08, 0.7, gs, 0, 0.64, 0, true, g2); box(1.16, 0.06, 0.66, cap, 0, 0.71, 0, false, g2); };
    cross(3.2, -2.7, 1.7, 0.1); head(3.9, -3.9, 1.35, 0.6, -0.2, gs); head(2.7, -4.6, 1.0, 0.5, 0.3, gs2);
    head(4.6, 2.4, 1.2, 0.55, 0.2, gs); head(5.2, -2.0, 1.05, 0.5, -0.1, gs2); tomb(7.2, -3.2, 0.05); head(8.4, 2.2, 1.25, 0.55, 0.1, gs); cross(11.0, -2.4, 1.5, -0.1);
    head(12.4, 2.6, 1.1, 0.5, -0.2, gs2); head(13.6, -2.2, 1.2, 0.55, 0.15, gs); tomb(15.0, 2.8, -0.08); head(16.2, -2.8, 1.0, 0.5, 0.2, gs2); head(3.6, 5.2, 1.1, 0.5, 0.1, gs2); head(9.8, 4.8, 1.3, 0.55, -0.2, gs); cross(14.2, 5.6, 1.6, 0.1); head(7.6, -6.0, 1.2, 0.55, 0.2, gs);
    const yw = grp(6.0, 0, 4.4); cyl(0.25, 0.35, 1.6, col(0x3a2418, .9), 0, 0.8, 0, 8, yw); const yM = col(0x16301f, .95);
    for (const [x, y, z, r] of [[0, 2.4, 0, 1.6], [-0.9, 1.9, 0.5, 1.1], [0.9, 2.0, -0.4, 1.2], [0.1, 3.3, 0.1, 1.1]]){ const b = sph(r, yM, x, y, z, yw, 10); b.scale.set(1, 0.85, 1); const sn = sph(r * 0.8, cap, x, y + r * 0.5, z, yw, 8); sn.scale.set(1, 0.25, 1); sn.castShadow = false; }
    const ow = grp(5.05, 2.5, 3.6, -1.2); sph(0.09, col(0x6a4a2a, .9), 0, 0, 0, ow, 8).scale.set(1, 1.25, 1); sph(0.065, col(0x6a4a2a, .9), 0, 0.13, 0, ow, 8);
    for (const s of [-1, 1]) sph(0.02, new T.MeshBasicMaterial({ color:0xffd36b }), s * 0.03, 0.15, 0.055, ow, 6);

    // ---------------- St Nicholas, north of the path, with the vestry at its side; the Church Hall to the south ----------------
    const chs = K.M({ map:tex(256, 256, (g, w, h) => { g.fillStyle = '#2c2c32'; g.fillRect(0, 0, w, h); for (let r = 0; r < 8; r++) for (let c = 0; c < 4; c++){ const x = c * 72 + (r % 2 ? 36 : 0) - 36, y = r * 32, v = rnd(-8, 8); g.fillStyle = D.shade('#3c3c44', v); g.fillRect(x + 3, y + 3, 66, 26); } }, [6, 3]), roughness:.95 });
    box(12, 6, 7, chs, 10, 3, -11.0);
    const rf = K.M({ color:0x22222a, roughness:.9 });
    for (const s of [-1, 1]){ const r = box(12.2, 0.25, 4.6, rf, 10, 7.4, -11 + s * 1.9); r.rotation.x = s * 0.72; const sn = box(12.3, 0.06, 4.6, cap, 10, 7.56, -11 + s * 1.95, false); sn.rotation.x = s * 0.72; }
    box(3.6, 14, 3.6, chs, 3.2, 7, -11.5); box(3.8, 0.14, 3.8, cap, 3.2, 14.07, -11.5, false);
    for (let i = 0; i < 4; i++) for (const s of [-1, 1]){ box(0.5, 0.5, 0.5, chs, 3.2 - 1.55 + i * 1.03, 14.4, -11.5 + s * 1.55); }
    const winM = new T.MeshBasicMaterial({ color:0x10182a });
    for (let i = 0; i < 4; i++){ const x = 6.6 + i * 2.4; plane(0.9, 2.6, winM, x, 3.2, -7.48); const ar = new T.Mesh(new T.CircleGeometry(0.45, 12, 0, Math.PI), winM); ar.position.set(x, 4.5, -7.48); S.add(ar); }
    box(2.6, 3.4, 2.2, chs, 14.6, 1.7, -6.6); const vr = box(2.8, 0.2, 2.6, rf, 14.6, 3.55, -6.6); vr.rotation.x = 0.25; box(2.8, 0.06, 2.6, cap, 14.6, 3.7, -6.6, false).rotation.x = 0.25;
    plane(0.6, 0.8, new T.MeshBasicMaterial({ color:0xffcf8a }), 14.6, 1.9, -5.49); glow(14.6, 1.9, -5.4, 1.2);
    const hall = col(0x4a4038, .95);
    box(9, 4, 5, hall, 10.5, 2, 14.5); for (const s of [-1, 1]){ const r = box(9.2, 0.2, 3.2, rf, 10.5, 4.7, 14.5 + s * 1.3); r.rotation.x = -s * 0.6; box(9.3, 0.06, 3.2, cap, 10.5, 4.84, 14.5 + s * 1.33, false).rotation.x = -s * 0.6; }
    box(1.2, 2.2, 0.1, col(0x3b2414, .6), 10.5, 1.1, 11.98); for (const x of [7.2, 8.8, 12.2, 13.8]) plane(0.8, 1.2, winM, x, 2.2, 11.97, 0, Math.PI, 0);
    box(0.2, 0.2, 0.2, new T.MeshBasicMaterial({ color:0xffd08a }), 10.5, 2.5, 11.9, false); glow(10.5, 2.5, 11.8, 1.0); K.point(0xffc890, 0.6, 6, 10.5, 2.4, 11.3);

    // ---------------- the back of the green: the empty choir stand, lanterns, the stalls far off, the great tree ----------------
    const stW = col(0x5a3a22, .7);
    for (let k = 0; k < 3; k++){ box(0.55, 1.2 - k * 0.4, 4.2, stW, 20.0 + k * 0.55, (1.2 - k * 0.4) / 2, 0.3); box(0.57, 0.05, 4.22, cap, 20.0 + k * 0.55, 1.22 - k * 0.4, 0.3, false); }
    box(0.8, 0.9, 0.8, stW, 22.6, 0.45, 0.3); box(0.84, 0.05, 0.84, cap, 22.6, 0.92, 0.3, false);
    for (const z of [-3, 3.6]){ cyl(0.05, 0.06, 2.4, mats.iron, 19.4, 1.2, z, 6); box(0.16, 0.22, 0.16, new T.MeshBasicMaterial({ color:0xffcf80 }), 19.4, 2.45, z, false); glow(19.4, 2.45, z, 1.2); }
    for (let i = 0; i < 6; i++){ const x = 27 + i * 2.6, z = -3 + (i % 2) * 6; box(2.0, 1.1, 1.0, col([0x8e1f1f, 0x1f3a2c, 0x2f4a6b][i % 3], .8), x, 0.55, z); box(2.2, 0.1, 1.3, col(0xe9e1cf, .8), x, 1.6, z); glow(x, 1.3, z + 0.6, 1.6); }
    const tg = grp(33, 0, -9); for (let i = 0; i < 5; i++){ const c = new T.Mesh(new T.ConeGeometry(3.0 - i * 0.55, 2.2, 10), col(0x173f23, .9)); c.position.y = 1.5 + i * 1.2; tg.add(c); }
    const tStar = new T.Mesh(new T.OctahedronGeometry(0.45), new T.MeshBasicMaterial({ color:0xffd36b })); tStar.position.y = 8.2; tg.add(tStar); glow(33, 8.2, -9, 3.0);
    { const N = 30, lp = new Float32Array(N * 3); for (let i = 0; i < N; i++){ const t = i / N, a = i * 2.4, r = (1 - t) * 2.8 + 0.2; lp[i * 3] = 33 + Math.cos(a) * r; lp[i * 3 + 1] = 1.0 + t * 6.5; lp[i * 3 + 2] = -9 + Math.sin(a) * r; }
      const lg = new T.BufferGeometry(); lg.setAttribute('position', new T.BufferAttribute(lp, 3)); S.add(new T.Points(lg, new T.PointsMaterial({ map:glowT, size:0.55, transparent:true, depthWrite:false, blending:T.AdditiveBlending, color:0xffe0a0 }))); }

    // ---------------- lights ----------------
    const moon = K.key([-8, 16, 10], [3, 0, -1], 0.5, Math.PI / 3.4); moon.color.set(0xaebde6); moon.distance = 0; moon.decay = 0; moon.shadow.camera.far = 60;
    S.add(new T.HemisphereLight(0x6a7aa8, 0x141824, 0.42));
  },

  // ---------------------------------------------------------------- clues (printed evidence word for word, from assets/printed.js)
  clues:{
    map:{ name:'A clipboard on the gatepost', at:[-1.86, 1.2, -0.65], size:[0.1, 0.42, 0.34],
      look:'A clipboard hangs on a nail on the gatepost, with a sheet of paper on it in Constable Ambrose\'s hand.',
      prompt:'Look at the map. Which way runs the dotted line?', hint:'Find the dotted line through the churchyard.', hot:[[0.4, 0.38, 0.72, 0.6]],
      draw(g, w, h, K){ const D = K.D; g.fillStyle = '#6b4a2a'; g.fillRect(0, 0, w, h); D.paper(g, 64, 20, 472, 372, '#fbfbf6');
        const X = (x) => 76 + x * 1.12, Y = (y) => 36 + y * 1.12, R = (x, y, ww, hh, f, dash) => { g.fillStyle = f || '#fff'; g.fillRect(X(x), Y(y), ww * 1.12, hh * 1.12); g.strokeStyle = '#111'; g.lineWidth = 2; if (dash) g.setLineDash([5, 4]); g.strokeRect(X(x), Y(y), ww * 1.12, hh * 1.12); g.setLineDash([]); };
        g.fillStyle = '#c8c8c8'; g.fillRect(X(0), Y(12), 400 * 1.12, 18 * 1.12); g.fillRect(X(140), Y(30), 16 * 1.12, 270 * 1.12);
        R(8, 34, 128, 44); R(62, 80, 74, 36, '#e0e0e0'); R(86, 118, 50, 34, '#fff', true); R(164, 36, 74, 54); R(240, 66, 24, 24, '#e0e0e0'); R(162, 108, 104, 100, '#fff', true); R(162, 216, 104, 30); R(272, 36, 120, 232); R(298, 46, 76, 22, '#e0e0e0'); R(283, 132, 14, 40, '#999');
        const lab = (t, x, y, s) => { g.fillStyle = '#111'; g.font = `${s || 12}px Georgia`; g.fillText(t, X(x), Y(y)); };
        lab('HIGH STREET', 300, 25); lab("CRANE'S", 14, 54); lab('TOYS', 22, 68); lab('workshop', 88, 102, 11); lab('yard', 98, 146); lab('ST NICHOLAS', 168, 68, 11); lab('churchyard', 186, 198); lab('Church Hall', 186, 235); lab('STAGE', 316, 61); lab('THE GREEN', 306, 100);
        g.strokeStyle = '#111'; g.lineWidth = 3; g.setLineDash([2, 6]); g.lineCap = 'round'; g.beginPath(); g.moveTo(X(281), Y(152)); g.bezierCurveTo(X(250), Y(170), X(200), Y(130), X(164), Y(140)); g.stroke(); g.setLineDash([]); g.lineCap = 'butt';
        g.beginPath(); g.moveTo(X(164), Y(140)); g.lineTo(X(137), Y(136)); g.moveTo(X(281), Y(152)); g.lineTo(X(281), Y(21)); g.lineTo(X(148), Y(21)); g.lineTo(X(148), Y(132)); g.lineTo(X(137), Y(136)); g.moveTo(X(148), Y(21)); g.lineTo(X(70), Y(21)); g.stroke();
        for (const [k, x, y] of [['S', 281, 152], ['Y', 164, 140], ['G', 137, 136], ['H', 281, 21], ['C', 148, 21], ['D', 70, 21], ['W', 80, 98]]){ g.fillStyle = '#111'; g.beginPath(); g.arc(X(x), Y(y), 4.5, 0, Math.PI * 2); g.fill(); g.font = 'bold 15px Georgia'; g.fillText(k, X(x) + 6, Y(y) - 6); } },
      kicker:'Evidence', title:'The Constable\'s map',
      html:'<div class="doc map">' + P.n21.a + '</div>',
      note:'The Constable\'s map: three ways from the choir stand (S) to the workshop. By the churchyard path (S, Y, G); by the High Street and down Church Lane (S, H, C, G); by the High Street and in through the shop (S, H, C, D, W). Not to scale.' },

    notes:{ name:'The Constable\'s notebook', at:[1.6, 1.2, -1.3], size:[0.42, 0.16, 0.34],
      look:'Constable Ambrose\'s notebook lies open on top of the churchyard wall, beside his lantern and his pocket watch.',
      prompt:'Read the measuring notes. How fast does the Constable walk?', hint:'Look at the lines under the table.', hot:[[0.06, 0.74, 0.94, 0.96]],
      draw(g, w, h, K){ const D = K.D; g.fillStyle = '#7a746c'; g.fillRect(0, 0, w, h); g.fillStyle = '#eef2f7'; g.fillRect(0, 0, w, 18); D.paper(g, 30, 14, 540, 378, '#f3eedf'); g.fillStyle = 'rgba(0,0,0,.15)'; g.fillRect(298, 14, 4, 378);
        D.text(g, ['Constable Ambrose:', 'my measuring notes', 'S the choir stand', 'Y the churchyard wall', 'G Edmund\'s yard gate', 'H the High Street', 'C the corner of Church Lane', 'D the shop door', 'W the workshop'], 44, 24, 31, '22px Caveat, cursive', '#1a2550');
        D.text(g, ['S to Y ..... 300 yards', 'Y to G ...... 50 yards', 'S to H ..... 200 yards', 'H to C ..... 250 yards', 'C to G ..... 200 yards', 'C to D ...... 50 yards', 'D to W ...... 50 yards'], 314, 30, 33, '22px Caveat, cursive', '#1a2550');
        D.text(g, ['100 yards paced out, walked quick in exactly 1 minute.', 'Gate to window: ten steps, no time at all.'], 44, 310, 32, '23px Caveat, cursive', '#1a2550'); },
      kicker:'Evidence', title:'The Constable\'s measuring notes',
      html:P.n21.b,
      note:'The Constable\'s measuring notes: S to Y 300 yards, Y to G 50, S to H 200, H to C 250, C to G 200, C to D 50, D to W 50. He walked 100 yards, quick, in exactly 1 minute. From the yard gate to the window is ten steps: count it as no time at all.' },
  },

  // ---------------------------------------------------------------- extra clue (room only, never needed)
  extras:{
    step:{ night:21, name:'An icy step on the path', at:[9.5, 0.2, 0.12], size:[1.4, 0.5, 1.6],
      look:'Halfway along the churchyard path, one stone step is glazed with ice. This is where the Constable slipped.',
      prompt:'Look closely at the ice on the step. Is anything pressed into it?', hint:'Look at the back of the heel in the print.', hot:[[0.5, 0.3, 0.8, 0.72]],
      draw(g, w, h, K){ const D = K.D; D.snow(g, w, h); g.fillStyle = '#7a746c'; g.fillRect(40, 80, 520, 240); const gr = g.createLinearGradient(40, 80, 560, 320); gr.addColorStop(0, 'rgba(200,225,245,.92)'); gr.addColorStop(1, 'rgba(150,185,215,.9)'); g.fillStyle = gr; g.fillRect(50, 90, 500, 220);
        g.fillStyle = 'rgba(255,255,255,.55)'; for (let i = 0; i < 16; i++) g.fillRect(60 + Math.random() * 460, 100 + Math.random() * 200, 20 + Math.random() * 40, 2);
        D.bootPrint(g, 330, 200, 1.4, -Math.PI / 2, { fill:'rgba(70,95,135,.75)', tread:'rgba(40,60,95,.6)', nick:true, snow:'#c8dcee' }); },
      text:'On an icy step of the churchyard path, one sharp boot print with a V-shaped nick in the heel, pointing towards the yard gate.' },
  },

  // ---------------------------------------------------------------- the rest: things to look at
  decoys:{
    window:{ name:'The yard window', at:[-4.1, 1.25, -3.5], size:[1.9, 1.6, 0.2], look:'The workshop\'s only window looks onto the yard. A lamp is lit inside.', close:'From the yard gate to this window is only ten steps across the snow. Nothing out of place.' },
    gate:{ name:'The yard gate', at:[-1.86, 0.75, 1.25], size:[0.16, 1.4, 1.2], look:'Edmund\'s yard gate onto Church Lane stands open, with police string tied across the gateway.', close:'The string keeps everyone out of the yard. Just across the lane is the churchyard wall. Nothing out of place.' },
    line:{ name:'The washing line and the planks', at:[-3.9, 0.2, -1.8], size:[1.2, 0.4, 2.0], look:'Constable Ambrose has roped off the yard with Edmund\'s washing line, and laid two planks across the snow to walk on.', close:'Under the rope, the old snow is frozen hard, and the planks keep everyone off it. Nothing out of place.' },
    kitchen:{ name:'The kitchen door', at:[-7.6, 1.0, -3.5], size:[1.0, 2.0, 0.2], look:'The back door of Edmund\'s kitchen, where Agnes works, opens onto the yard too.', close:'Agnes says it is never locked. Nothing out of place.' },
    graves:{ name:'The old gravestones', at:[3.3, 1.2, -3.6], size:[1.8, 1.2, 2.4], look:'Old gravestones lean this way and that, each wearing a cap of snow like icing on a cake.', close:'The names are worn almost smooth. The Constable apologised to one of them when he slipped. Nothing out of place.' },
    yew:{ name:'The yew tree', at:[6.0, 2.4, 4.4], size:[3.6, 4.0, 3.4], look:'A great dark yew tree spreads over the graves. Somewhere inside it, an owl is complaining about the cold.', close:'Hoo. Hoo hoo. The owl does not think much of detectives. Nothing out of place.' },
    church:{ name:'St Nicholas', at:[10.0, 3.5, -7.8], size:[11, 6, 1.2], look:'The dark bulk of St Nicholas rises beside the churchyard path, its tower white with snow.', close:'At the side of the church, a light burns in the little vestry, where the choir robes are kept. Nothing out of place.' },
    stand:{ name:'The choir stand', at:[20.6, 0.9, 0.3], size:[2.4, 1.8, 4.4], look:'At the far end of the path, at the back of the green, stands the empty choir stand.', close:'Three rows of wooden steps, with the conductor\'s box in front. The men stood at the back. Nothing out of place.' },
    hall:{ name:'The Church Hall', at:[10.5, 2.0, 11.9], size:[8.0, 4.0, 0.6], look:'Across the churchyard stands the Church Hall, where the choir practises.', close:'Its door is shut and its windows are dark tonight. Nothing out of place.' },
    watch:{ name:'The Constable\'s pocket watch', at:[1.62, 1.2, -1.72], size:[0.2, 0.12, 0.2], look:'Constable Ambrose\'s pocket watch lies open on the wall.', close:'It ticks along. The Constable says it may be slow, but it counts a minute right. Nothing out of place.' },
  },

  // ---------------------------------------------------------------- The Hidden Case: the small gold star (clue in assets/star.js)
  star:{ at:[-4.6, 0.05, 1.95], rot:[-2.31, 0.47, 0.4], scale:1.1, size:[0.26, 0.22, 0.26], seek:'Look down at the snow in the yard, near the far wall.' },

  clips:{},
  AUDIO_FILES:{},
};
CM.start(ROOM);
