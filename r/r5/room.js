/* Room 5: the Church Hall, where the choir practises. Nights 11 and 13.
   South of the churchyard: the tall windows (back wall) look north across the churchyard to St Nicholas.
   Wording from book/content/n11.py (commentary, Mrs Pike's letter, choir list) and n13.py (Quill's receipt).
   Robe numbers are not shown here: Night 20 works them out on paper. */
const ROOM = {
  code:'r5',
  title:'The Church Hall',
  subtitle:'Crime scene 5 · Night 11',
  view:{ pos:[0.0, 1.6, 0.9], yaw:-0.35, pitch:-0.06 },
  previews:[-0.35, 0.6, -1.4, 2.8, 1.6],
  intro:{
    kicker:'Night 11 · Crime scene 5',
    heading:'The Church Hall',
    paras:[
      'The village choir practises here, beside the churchyard. Bernard Lark of Valley Radio has brought his typed copy of the switch-on commentary, and the station is playing it again tonight.',
      '<b>Your task:</b> search the hall. Was anyone missing from the choir during the carols? Come back on Night 13 too: something pinned up here matters then.',
    ],
    button:'Step into the Church Hall',
  },

  build(K){
    const { T, box, cyl, sph, plane, grp, col, mats, D, tex, rnd } = K;
    const W = 9.0, DP = 7.0, H = 3.6, BZ = -DP / 2, FZ = DP / 2, LX = -W / 2, RX = W / 2;
    const WINS = [{ u:-2.4, w:1.1, b:1.2, t:2.95 }, { u:2.4, w:1.1, b:1.2, t:2.95 }];
    const wallMat = K.M({ map:tex(128, 128, (g, w, h) => { g.fillStyle = '#d8cdb0'; g.fillRect(0, 0, w, h); for (let i = 0; i < 300; i++){ g.fillStyle = `rgba(120,100,70,${rnd(.02, .07)})`; g.fillRect(rnd(0, w), rnd(0, h), 3, 3); } }, [1, 1]), roughness:.95 });
    const panel = K.M({ map:tex(256, 128, (g, w, h) => { g.fillStyle = '#5a3a22'; g.fillRect(0, 0, w, h); for (let i = 0; i < 8; i++){ g.fillStyle = D.shade('#6b4423', rnd(-10, 10)); g.fillRect(i * 32 + 2, 0, 28, h); } }, [1, 1]), roughness:.7 });
    K.shell({ w:W, d:DP, h:H, wallMat, panelMat:panel, wallTile:[1.0, 1.0], panelTile:[1.0, 1.2], dado:1.2, beams:1.5, trimMat:col(0x3b2414, .5),
      floorMat:K.M({ map:tex(512, 512, (g, w, h) => D.planks(g, w, h, '#8a6440', 10), [4, 4]), roughness:.6 }),
      open:{ back:WINS.map(o => ({ u:o.u, w:o.w, b:o.b, t:o.t })) } });
    // tall windows onto the churchyard and the church
    for (const o of WINS){ K.windowFrame({ side:'back', u:o.u, w:o.w, b:o.b, t:o.t, snow:true, bars:3, frame:col(0x3b2414, .5) });
      const arch = plane(o.w + 0.16, 0.3, wallMat, o.u, o.t + 0.15, BZ + 0.012); }
    K.backdrop('back', 0, 2.4, 9, 24, 8, (g, w, h) => { D.night(g, w, h, '#09111f', '#283553');
      g.fillStyle = '#e6ebf3'; g.fillRect(0, h * .66, w, h * .34);
      for (let i = 0; i < 16; i++){ const x = w * (.03 + i * .06) + rnd(-8, 8), y = h * rnd(.66, .76); g.fillStyle = '#5a5e66'; g.fillRect(x, y - 30, 20, 30); g.beginPath(); g.arc(x + 10, y - 30, 10, Math.PI, 0); g.fill(); g.fillStyle = '#eef2f7'; g.fillRect(x - 1, y - 42, 22, 5); }
      g.fillStyle = '#1a2130'; g.fillRect(w * .34, h * .28, w * .3, h * .38); g.fillRect(w * .44, h * .06, w * .09, h * .6); g.beginPath(); g.moveTo(w * .435, h * .06); g.lineTo(w * .485, -h * .1); g.lineTo(w * .535, h * .06); g.fill();
      g.fillStyle = '#eef2f7'; g.beginPath(); g.moveTo(w * .33, h * .29); g.lineTo(w * .49, h * .18); g.lineTo(w * .65, h * .29); g.lineTo(w * .65, h * .31); g.lineTo(w * .33, h * .31); g.fill();
      g.fillStyle = 'rgba(255,210,130,.95)'; for (let i = 0; i < 4; i++){ g.beginPath(); g.moveTo(w * (.37 + i * .07), h * .52); g.lineTo(w * (.37 + i * .07), h * .4); g.arc(w * (.38 + i * .07), h * .4, w * .01, Math.PI, 0); g.lineTo(w * (.39 + i * .07), h * .52); g.fill(); }
      g.fillStyle = '#101820'; for (let i = 0; i < 8; i++){ const x = i < 4 ? w * (.03 + i * .07) : w * (.7 + (i - 4) * .07), s = rnd(40, 70); g.beginPath(); g.moveTo(x, h * .66 - s * 2.6); g.lineTo(x - s * .6, h * .67); g.lineTo(x + s * .6, h * .67); g.fill(); }
    }, 1024, 360);
    // notice board between the windows (the choir list and Hector's receipt are pinned here)
    box(1.7, 1.0, 0.04, col(0xb08a5a, .9), 0, 1.75, BZ + 0.02, false); box(1.8, 1.1, 0.03, col(0x3b2414, .5), 0, 1.75, BZ + 0.005, false);
    const sheet = (x, y, w, h, lines, rot) => { const m = plane(w, h, K.M({ map:tex(128, Math.round(128 * h / w), (g, cw, chh) => { g.fillStyle = '#f6f1e0'; g.fillRect(0, 0, cw, chh); g.fillStyle = '#222'; g.fillRect(10, 8, cw * .6, 6); g.fillStyle = 'rgba(30,30,30,.7)'; for (let y2 = 22; y2 < chh - 8; y2 += lines) g.fillRect(10, y2, rnd(cw * .4, cw - 20), 2.5); }), roughness:.9 }), x, y, BZ + 0.045, 0, 0, rot || 0); sph(0.012, mats.red, x, y + h / 2 - 0.03, BZ + 0.05, null, 6); return m; };
    sheet(-0.45, 1.8, 0.42, 0.56, 10, 0.02); sheet(0.35, 1.76, 0.32, 0.7, 8, -0.03); sheet(0.7, 2.05, 0.2, 0.26, 12, 0.1);
    // ---- left wall: the robe pegs (empty, numbered) and the boots rack ----
    box(0.05, 0.12, 3.4, col(0x3b2414, .5), LX + 0.03, 1.75, 0.2, false);
    for (let i = 0; i < 8; i++){ const z = -1.3 + i * 0.43; cyl(0.015, 0.015, 0.12, mats.brass, LX + 0.1, 1.72, z, 6).rotation.z = Math.PI / 2;
      plane(0.1, 0.08, K.M({ map:tex(32, 26, (g, w, h) => { g.fillStyle = '#f3ead2'; g.fillRect(0, 0, w, h); g.fillStyle = '#222'; g.font = 'bold 18px Georgia'; g.textAlign = 'center'; g.fillText(String(i + 1), 16, 20); }) }), LX + 0.065, 1.88, z, 0, Math.PI / 2, 0); }
    const br = grp(LX + 0.25, 0, 0.2); box(0.4, 0.04, 3.2, col(0x6b4423, .6), 0, 0.3, 0, true, br); box(0.4, 0.04, 3.2, col(0x6b4423, .6), 0, 0.05, 0, true, br); for (const z of [-1.58, 1.58]) box(0.4, 0.36, 0.04, col(0x6b4423, .6), 0, 0.18, z, true, br);
    for (let i = 0; i < 3; i++){ const oz = -1.2 + i * 0.6; box(0.26, 0.09, 0.1, col(0x3a2a22, .8), 0.02, 0.37, oz, true, br); box(0.26, 0.09, 0.1, col(0x3a2a22, .8), 0.02, 0.37, oz + 0.13, true, br); }
    // ---- rows of chairs, a music stand, the conductor's stand ----
    const chair = (x, z, ry) => { const c = grp(x, 0, z, ry); const cm = col(0x6b4423, .6); box(0.42, 0.04, 0.4, cm, 0, 0.45, 0, true, c); box(0.42, 0.42, 0.04, cm, 0, 0.7, -0.19, true, c); for (const a of [[-.18, -.17], [-.18, .17], [.18, -.17], [.18, .17]]) box(0.03, 0.45, 0.03, mats.dark, a[0], 0.225, a[1], true, c); };
    for (let r = 0; r < 2; r++) for (let i = 0; i < 4; i++) chair(-3.0 + i * 0.6, -0.9 + r * 0.8, Math.PI);
    const ms = grp(-1.6, 0, -2.0); cyl(0.012, 0.012, 1.1, mats.iron, 0, 0.55, 0, 6, ms); const ml = box(0.45, 0.32, 0.02, mats.iron, 0, 1.15, 0.02, true, ms); ml.rotation.x = -0.4;
    for (let i = 0; i < 3; i++){ const lg = cyl(0.01, 0.01, 0.35, mats.iron, Math.cos(i * 2.1) * 0.12, 0.12, Math.sin(i * 2.1) * 0.12, 4, ms); lg.rotation.z = Math.cos(i * 2.1) * 0.6; lg.rotation.x = -Math.sin(i * 2.1) * 0.6; }
    plane(0.4, 0.28, mats.paper, -1.6, 1.16, -1.97, -0.4, 0, 0);
    // ---- right wall: the old upright piano with the wooden angel (the gold star of The Hidden Case lies on top), the radio and its table ----
    const pz = -1.6; const pg = grp(RX - 0.35, 0, pz, -Math.PI / 2); const pm = col(0x2a1a10, .35);
    box(1.5, 1.3, 0.6, pm, 0, 0.65, 0, true, pg); box(1.52, 0.05, 0.62, pm, 0, 1.32, 0, true, pg); box(1.4, 0.05, 0.3, pm, 0, 0.78, 0.42, true, pg);
    plane(1.3, 0.14, K.M({ map:tex(256, 32, (g, w, h) => { g.fillStyle = '#f6f1e0'; g.fillRect(0, 0, w, h); g.fillStyle = '#111'; for (let i = 0; i < 52; i++){ g.fillRect(i * 5, 0, 1, h); if ([1, 2, 4, 5, 6].includes(i % 7)) g.fillRect(i * 5 - 1.5, 0, 3, h * .6); } }) }), 0, 0.81, 0.42, -Math.PI / 2, 0, 0, pg);
    box(1.0, 0.05, 0.36, col(0x3b2414, .5), 0, 0.48, 0.9, true, pg);
    const an = grp(0.4, 1.35, 0, 0, pg); const am = col(0xd9c49a, .6); const ab = new T.Mesh(new T.ConeGeometry(0.09, 0.3, 10), am); ab.position.y = 0.15; ab.castShadow = true; an.add(ab); sph(0.045, am, 0, 0.34, 0, an, 10);
    for (const s of [-1, 1]){ const wg = box(0.02, 0.18, 0.1, col(0xe9dcbc, .6), 0.06 * s, 0.24, -0.04, true, an); wg.rotation.z = s * 0.5; }
    const halo = new T.Mesh(new T.TorusGeometry(0.04, 0.007, 6, 14), mats.gold); halo.position.y = 0.41; halo.rotation.x = Math.PI / 2; an.add(halo);
    for (let i = 0; i < 4; i++) box(0.2, 0.03, 0.15, col([0x8e1f1f, 0x1f3a2c, 0x2f4a6b, 0x5a3a1a][i], .7), -0.4 + rnd(-.05, .05), 1.36 + i * 0.03, 0, false, pg);
    // a copy of Silent Night on the piano, and a shoe box from Quill's Boots by the door (extra clues)
    const smT = tex(128, 160, (g, w, h) => { g.fillStyle = '#f6f1e0'; g.fillRect(0, 0, w, h); g.fillStyle = '#222'; g.fillRect(24, 10, 80, 7); g.strokeStyle = 'rgba(30,30,30,.55)'; for (let k = 0; k < 4; k++) for (let i = 0; i < 5; i++){ g.beginPath(); g.moveTo(10, 32 + k * 32 + i * 4); g.lineTo(w - 10, 32 + k * 32 + i * 4); g.stroke(); } g.strokeStyle = 'rgba(70,70,70,.7)'; g.lineWidth = 2; g.beginPath(); g.ellipse(64, 104, 56, 12, 0, 0, Math.PI * 2); g.stroke(); });
    plane(0.26, 0.33, K.M({ map:smT, roughness:.9 }), RX - 0.66, 1.02, pz - 0.15, -0.12, -Math.PI / 2, 0);
    const sb = grp(2.55, 0, FZ - 0.3, 0.2); box(0.34, 0.12, 0.2, col(0xd9c49a, .8), 0, 0.06, 0, true, sb); const sbl = box(0.35, 0.03, 0.21, col(0x2f4a6b, .7), 0.1, 0.13, 0.04, true, sb); sbl.rotation.z = -0.25;
    for (let i = 0; i < 4; i++){ const tk = box(0.05, 0.002, 0.07, col(0xf6f1e0, .9), -0.1 + i * 0.05, 0.122, rnd(-.03, .03), false, sb); tk.rotation.y = rnd(-.4, .4); }
    // radio on a small table, Lark's folder with the letter beside it
    const rt = grp(RX - 0.4, 0, 0.9); box(0.6, 0.04, 0.5, col(0x6b4423, .55), 0, 0.72, 0, true, rt); for (const x of [-0.25, 0.25]) for (const z of [-0.2, 0.2]) box(0.04, 0.7, 0.04, mats.dark, x, 0.35, z, true, rt);
    const ra = grp(RX - 0.42, 0.74, 0.72, -Math.PI / 2); box(0.42, 0.3, 0.22, col(0x6b4423, .35), 0, 0.15, 0, true, ra);
    plane(0.22, 0.18, K.M({ map:tex(128, 128, (g, w, h) => { g.fillStyle = '#2b1d12'; g.fillRect(0, 0, w, h); g.strokeStyle = '#c9993f'; g.lineWidth = 3; for (let x = 8; x < w; x += 12){ g.beginPath(); g.moveTo(x, 6); g.lineTo(x, h - 6); g.stroke(); } }) }), -0.07, 0.16, 0.111, 0, 0, 0, ra);
    plane(0.1, 0.1, new T.MeshStandardMaterial({ color:0xffd58a, emissive:0xffaa44, emissiveIntensity:.8 }), 0.12, 0.16, 0.111, 0, 0, 0, ra);
    const fd = plane(0.22, 0.3, K.M({ map:tex(64, 90, (g, w, h) => { g.fillStyle = '#f6f1e0'; g.fillRect(0, 0, w, h); g.strokeStyle = 'rgba(30,40,90,.6)'; for (let y = 12; y < h - 6; y += 7){ g.beginPath(); g.moveTo(6, y); g.lineTo(6 + rnd(30, 52), y); g.stroke(); } }) }), RX - 0.38, 0.745, 1.13, -Math.PI / 2, 0, 0.3);
    box(0.25, 0.01, 0.33, col(0x2f4a6b, .7), RX - 0.36, 0.742, 1.14, false).rotation.y = 0.3;
    K.tree(RX - 0.9, FZ - 0.9, 0.85);
    // ---- front wall: the hall door, the trestle table with the tea urn and hymn books ----
    K.door({ side:'front', u:1.6, w:1.1, h:2.2, mat:col(0x3b2414, .5), panel:0x4a2d19 });
    K.holly(1.6, 2.35, FZ - 0.1, 1.6);
    const tt = grp(-1.6, 0, FZ - 0.45); box(1.8, 0.04, 0.6, col(0x8a6a4a, .6), 0, 0.76, 0, true, tt); for (const x of [-0.8, 0.8]){ const l = box(0.04, 0.78, 0.5, mats.dark, x, 0.38, 0, true, tt); }
    cyl(0.16, 0.16, 0.42, col(0x9aa0a8, .3, .8), -0.55, 0.99, 0, 18, tt); cyl(0.05, 0.05, 0.06, mats.black, -0.55, 1.23, 0, 10, tt); const tap = cyl(0.012, 0.012, 0.1, mats.brass, -0.55, 0.88, 0.17, 6, tt); tap.rotation.x = Math.PI / 2;
    for (let i = 0; i < 6; i++){ cyl(0.035, 0.03, 0.07, col(0xf4f1ea, .3), -0.15 + (i % 3) * 0.11, 0.815, -0.1 + Math.floor(i / 3) * 0.12, 10, tt); }
    for (let i = 0; i < 5; i++) box(0.16, 0.04, 0.22, col(0x8e1f1f, .7), 0.55, 0.8 + i * 0.04, 0, true, tt);
    // stove in the front left corner
    const st = grp(LX + 0.6, 0, FZ - 0.7); box(0.5, 0.8, 0.5, mats.iron, 0, 0.45, 0, true, st); cyl(0.07, 0.07, H - 0.85, mats.iron, 0, 0.85 + (H - 0.85) / 2, 0, 10, st);
    plane(0.22, 0.14, new T.MeshBasicMaterial({ color:0xff8a2a }), 0.255, 0.45, 0, 0, Math.PI / 2, 0, st);
    K.fire(LX + 0.95, 0.4, FZ - 0.7, 'z', 0, [0, 0]);
    // paper chains and two hanging lamps
    K.lights([LX + 0.2, H - 0.08, BZ + 0.2], [RX - 0.2, H - 0.08, FZ - 0.2], 40, 0.35);
    for (const x of [-1.6, 1.6]){ cyl(0.006, 0.006, 0.7, mats.iron, x, H - 0.35, 0, 4); cyl(0.1, 0.3, 0.18, K.M({ color:0x2e4a3a, side:T.DoubleSide, roughness:.5, emissive:0x2e4a3a, emissiveIntensity:.2 }), x, H - 0.75, 0, 16); sph(0.05, new T.MeshBasicMaterial({ color:0xfff0c8 }), x, H - 0.82, 0, null, 8).castShadow = false; }
    K.point(0xffd7a8, 0.8, 10, -1.6, H - 0.95, 0); K.point(0xffd7a8, 0.8, 10, 1.6, H - 0.95, 0);
    K.key([0.0, H - 0.2, 2.2], [0.0, 0.6, -1.8], 0.6, Math.PI / 2.4);
    K.scene.add(new T.HemisphereLight(0xffe2b8, 0x24160c, 0.3));
    const moon = new T.DirectionalLight(0x9fb6ff, 0.25); moon.position.set(0, 5, BZ - 6); moon.target.position.set(0, 0, BZ + 2); K.scene.add(moon); K.scene.add(moon.target);
  },

  clues:{
    radio:{ name:'The radio', at:[4.08, 0.92, 0.72], size:[0.3, 0.42, 0.42],
      look:'A wooden radio on a little table. It is tuned to Valley Radio, which is playing back the switch-on commentary.',
      prompt:'Find a way to hear what it is playing.', hint:'Radios have a knob.', hot:[[0.66, 0.3, 0.9, 0.7]],
      draw(g, w, h, K){ const D = K.D; D.wood(g, w, h, '#2a1d12'); g.fillStyle = '#6b4423'; D.rr(g, w * .08, h * .12, w * .84, h * .76, 30); g.fill();
        g.fillStyle = '#2b1d12'; g.fillRect(w * .14, h * .22, w * .42, h * .56); g.strokeStyle = '#c9993f'; g.lineWidth = 5; for (let x = w * .16; x < w * .55; x += 18){ g.beginPath(); g.moveTo(x, h * .24); g.lineTo(x, h * .76); g.stroke(); }
        g.fillStyle = '#ffd58a'; g.beginPath(); g.arc(w * .78, h * .34, h * .08, 0, Math.PI * 2); g.fill(); g.fillStyle = '#2a1d14'; g.font = '14px Georgia'; g.textAlign = 'center'; g.fillText('TUNING', w * .78, h * .47);
        g.fillStyle = '#3a2415'; g.beginPath(); g.arc(w * .78, h * .6, h * .085, 0, Math.PI * 2); g.fill(); g.fillStyle = '#c9993f'; g.fillRect(w * .775, h * .52, w * .01, h * .06); g.fillStyle = '#f3e7cf'; g.font = '13px Georgia'; g.fillText('ON / OFF', w * .78, h * .74); g.textAlign = 'left'; },
      kicker:'Listen', clip:'radio', playLabel:'Play the commentary',
      html:'<p>Valley Radio is playing back Bernard Lark\'s live commentary from the green, on the night of the lights. He brought his typed copy to the hall.</p>',
      note:'Bernard Lark, live on the radio, at 9:00 during Silent Night: "the tenor line sounds one voice short to my ear."' },

    letter:{ name:'A letter in a blue folder', at:[4.12, 0.78, 1.14], size:[0.3, 0.12, 0.38],
      look:"Bernard Lark's blue folder lies open beside the radio, with a letter on top.",
      prompt:'Read the letter. What did the writer count?', hint:'Look at the numbers for each carol.', hot:[[0.06, 0.3, 0.94, 0.7]],
      draw(g, w, h, K){ const D = K.D; D.wood(g, w, h, '#6b4423'); g.fillStyle = '#2f4a6b'; g.fillRect(30, 10, 540, 380); D.paper(g, 50, 18, 500, 366, '#fbf6e8', 0.01);
        D.text(g, ['Dear Mr Lark,', 'I watched the choir from my window with your', 'programme on. I always count the singers, not', 'counting Miss Wren. Hark the Herald: seven.', 'Silent Night: six. Ding Dong Merrily: seven.', 'And whenever there was a gap, it was among', 'the men at the back.', '          Yours, Edna Pike (Mrs)'], 72, 32, 42, '27px Caveat, cursive', '#1a2550'); },
      kicker:'Evidence',
      html:'<div class="doc hand">Dear Mr Lark,<br>I watched the choir from my window with your programme on. I always count the singers, not counting Miss Wren. Hark the Herald: seven. Silent Night: six. Ding Dong Merrily: seven. And whenever there was a gap, it was among the men at the back.<br>&nbsp;&nbsp;&nbsp;&nbsp;Yours, Edna Pike (Mrs)</div>',
      note:'Mrs Edna Pike counted the singers: Hark the Herald seven, Silent Night six, Ding Dong Merrily seven. The gap was among the men at the back.' },

    list:{ name:'The choir list', at:[-0.45, 1.8, -3.44], size:[0.46, 0.6, 0.1],
      look:'A typed sheet headed CHOIR LIST is pinned to the notice board.',
      prompt:'Read the choir list. How is the choir arranged?', hint:'Look at who stands at the back.', hot:[[0.06, 0.4, 0.94, 0.8]],
      draw(g, w, h, K){ const D = K.D; g.fillStyle = '#b08a5a'; g.fillRect(0, 0, w, h); D.paper(g, 60, 20, 480, 360, '#f6f1e0');
        D.text(g, ['CHOIR LIST'], 300, 46, 30, 'bold 26px Special Elite, monospace', '#111', 'center');
        D.text(g, ['At the front: two sopranos, two altos.', '', 'At the back, the men: two tenors,', 'and Mr Quill, our bass, on the top', 'step behind them.', '', 'Seven singers and the conductor.'], 90, 108, 34, '19px Special Elite, monospace', '#222'); },
      kicker:'Evidence',
      html:'<div class="doc type"><b>CHOIR LIST</b><br>At the front: two sopranos, two altos.<br>At the back, the men: two tenors, and Mr Quill, our bass, on the top step behind them.<br>Seven singers and the conductor.</div><p class="small">Pinned up in the hall. The two tenors are Albert Dobbs and Jasper Lowe.</p>',
      note:'Choir list: two sopranos and two altos at the front; at the back the men, two tenors (Albert Dobbs and Jasper Lowe) and Mr Quill the bass. Seven singers and the conductor.' },

    receipt:{ name:"Hector Quill's receipt", at:[0.35, 1.76, -3.44], size:[0.36, 0.72, 0.1],
      look:'A long shop receipt is pinned up on the notice board, next to the choir list.',
      prompt:'Read the receipt. Which line matters for the prints in the yard?', hint:'Look at the sizes and the sole lengths.', hot:[[0.3, 0.14, 0.7, 0.86]],
      ch:600,
      draw(g, w, h, K){ const D = K.D; g.fillStyle = '#b08a5a'; g.fillRect(0, 0, w, h); D.paper(g, 170, 10, 260, 580, '#fbf8ee');
        D.text(g, ["QUILL'S BOOTS", 'High Street, Thimbleby Green', 'Delivered 26 November', 'Account: St Nicholas Choir', 'and the Vicarage', '--------------------------', 'Choir boots, black,', 'all the same style', "Ladies' pairs, sizes 5 to 7 .. 5", "Gents' size 9 ........... 2", "Gents' size 10 .......... 1", "Gents' size 11 .......... 1", 'Total pairs ............. 9', '--------------------------', 'Sole lengths', "Ladies' 5 to 7 ... 25 to 27 cm", 'Size 9 .................. 30 cm', 'Size 10 ................. 31 cm', 'Size 11 ................. 32 cm', '--------------------------', 'Every heel checked and clean.', '                     H.Q.', 'This style sold to nobody else.'], 182, 22, 24.5, '12.5px Special Elite, monospace', '#222'); },
      kicker:'Evidence',
      html:'<div class="doc type" style="font-size:12.5px"><b>QUILL\'S BOOTS</b><br>High Street, Thimbleby Green<br>Delivered 26 November<br>Account: St Nicholas Choir and the Vicarage<br>--------------------<br>Choir boots, black, all the same style<br>Ladies\' pairs, sizes 5 to 7 ...... 5<br>Gents\' size 9 ...... 2<br>Gents\' size 10 ...... 1<br>Gents\' size 11 ...... 1<br>Total pairs ...... 9<br>--------------------<br>Sole lengths<br>Ladies\' 5 to 7 ...... 25 to 27 cm<br>Size 9 ...... 30 cm<br>Size 10 ...... 31 cm<br>Size 11 ...... 32 cm<br>--------------------<br>Every heel checked and clean. H.Q.<br>This style sold to nobody else.</div>',
      note:'Quill\'s Boots receipt: 9 pairs of the same black boots for the choir and the vicarage, delivered 26 November. Two pairs of gents\' size 9 (30 cm soles). Every heel clean on delivery.' },
  },

  decoys:{
    piano:{ name:'The upright piano', at:[4.25, 0.6, -1.6], size:[0.5, 1.1, 1.55], look:'An old upright piano with a pile of music and a carved wooden angel on top.', close:'Badly out of tune, the choir says. Nothing out of place.' },
    pegs:{ name:'The robe pegs', at:[-4.42, 1.8, 0.2], size:[0.18, 0.4, 3.4], look:'A row of eight pegs, numbered 1 to 8.', close:'They are empty. After the carols the choir hang their robes in the vestry at the church. Nothing out of place.' },
    boots:{ name:'The boots rack', at:[-4.25, 0.25, 0.2], size:[0.44, 0.45, 3.2], look:'A low rack for boots and shoes, with three pairs of old indoor shoes on it.', close:'The choir wear their new boots home. Only old indoor shoes here. Nothing out of place.' },
    chairs:{ name:'The chairs', at:[-2.1, 0.55, -0.5], size:[2.5, 1.0, 1.4], look:'Rows of wooden chairs for choir practice.', close:'A forgotten glove under one chair. Nothing out of place.' },
    stand:{ name:'The music stand', at:[-1.6, 0.9, -2.0], size:[0.5, 1.4, 0.4], look:"The conductor's music stand, with a carol sheet on it.", close:'Silent Night, with pencil marks for breathing. Nothing out of place.' },
    urn:{ name:'The tea urn', at:[-2.15, 1.0, 3.05], size:[0.4, 0.55, 0.4], look:'A big tea urn on the trestle table, with cups ready.', close:'Still warm. Nothing out of place.' },
    hymns:{ name:'The hymn books', at:[-1.05, 0.88, 3.05], size:[0.3, 0.26, 0.3], look:'A pile of red hymn books.', close:'Well thumbed. Nothing out of place.' },
    door:{ name:'The hall door', at:[1.6, 1.1, 3.44], size:[1.1, 2.2, 0.12], look:'The big door of the Church Hall.', close:'Martha Dobbs locks this door whenever the choir goes out. Nothing out of place.' },
    tree:{ name:'The Christmas tree', at:[3.6, 1.2, 2.6], size:[1.6, 2.4, 1.6], look:'A tall tree, glowing with little lights.', close:'You check every branch. Nothing out of place.' },
    stove:{ name:'The stove', at:[-3.9, 0.5, 2.8], size:[0.56, 0.9, 0.56], look:'An iron stove keeps the hall warm for practice.', close:'Coal and ash. Nothing out of place.' },
  },

  // ---------------------------------------------------------------- extra clues (room only, never needed: one for each night)
  extras:{
    music:{ night:11, name:'Music on the piano', at:[3.78, 1.02, -1.75], size:[0.12, 0.34, 0.36],
      look:'A copy of a carol stands open on the piano.',
      prompt:'Look at the music. Has anyone written on it?', hint:'Look for pencil marks around one of the lines of notes.', hot:[[0.08, 0.5, 0.94, 0.78]],
      draw(g, w, h, K){ const D = K.D; g.fillStyle = '#2a1a10'; g.fillRect(0, 0, w, h); D.paper(g, 70, 14, 460, 372, '#f6f1e0');
        D.text(g, ['Silent Night'], 300, 30, 30, 'bold 26px Georgia', '#222', 'center');
        const parts = ['Soprano', 'Alto', 'Tenor', 'Bass']; for (let k = 0; k < 4; k++){ const y0 = 92 + k * 74; g.fillStyle = '#444'; g.font = '13px Georgia'; g.fillText(parts[k], 84, y0 + 4); g.strokeStyle = 'rgba(30,30,30,.6)'; g.lineWidth = 1.2; for (let i = 0; i < 5; i++){ g.beginPath(); g.moveTo(150, y0 - 8 + i * 7); g.lineTo(510, y0 - 8 + i * 7); g.stroke(); }
          for (let n = 0; n < 9; n++){ g.fillStyle = '#222'; g.beginPath(); g.ellipse(170 + n * 38, y0 + ((n * 3 + k) % 5) * 3.5 - 4, 6, 4.5, -0.3, 0, Math.PI * 2); g.fill(); g.fillRect(175 + n * 38, y0 - 26 + ((n * 3 + k) % 5) * 3.5, 1.5, 22); } }
        g.strokeStyle = 'rgba(70,70,70,.75)'; g.lineWidth = 3; g.beginPath(); g.ellipse(325, 240, 200, 30, -0.02, 0, Math.PI * 2); g.stroke();
        g.fillStyle = 'rgba(60,60,60,.85)'; g.font = 'bold 40px Caveat, cursive'; g.fillText('?', 530, 254); },
      text:'On the piano, a copy of "Silent Night" with the tenor line circled in pencil and a question mark beside it.' },

    shoebox:{ night:13, name:'A shoe box by the door', at:[2.55, 0.1, 3.2], size:[0.4, 0.24, 0.32],
      look:'A shoe box from Quill\'s Boots sits on the floor by the hall door, its lid pushed half off.',
      prompt:'Look inside the box. What has been kept in it?', hint:'Read the little tickets.', hot:[[0.18, 0.3, 0.82, 0.74]],
      draw(g, w, h, K){ const D = K.D; D.planks(g, w, h, '#8a6440', 5); g.fillStyle = '#d9c49a'; g.fillRect(60, 40, 480, 320); g.fillStyle = '#b8a070'; g.fillRect(76, 56, 448, 288); g.fillStyle = '#2f4a6b'; g.save(); g.translate(470, 70); g.rotate(0.5); g.fillRect(-60, -40, 260, 60); g.restore();
        for (let i = 0; i < 5; i++){ g.save(); g.translate(150 + i * 70, 210 + (i % 2) * 14); g.rotate(-0.2 + i * 0.1); D.paper(g, -36, -50, 72, 100, '#fbf8ee'); g.fillStyle = '#2f4a6b'; g.fillRect(-36, -50, 72, 12); g.restore(); }
        g.save(); g.translate(300, 200); g.rotate(-0.03); D.paper(g, -150, -60, 300, 124, '#fbf8ee'); g.fillStyle = '#2f4a6b'; g.fillRect(-150, -60, 300, 16); D.text(g, ["QUILL'S BOOTS"], 0, -58, 14, 'bold 12px Special Elite, monospace', '#f6f1e0', 'center');
        D.text(g, ['Choir boots, size 9:', 'two pairs, a tenor', 'and the vicar.'], -134, -34, 28, '24px Caveat, cursive', '#1a2550'); g.restore(); },
      text:'In a shoe box by the door, Hector\'s spare price tickets: "Choir boots, size 9: two pairs, a tenor and the vicar."' },
  },

  // ---------------------------------------------------------------- The Hidden Case: the small gold star (clue in assets/star.js)
  star:{ at:[4.2, 1.4, -1.75], rot:[-Math.PI / 2, -1.0, 0.3], size:[0.24, 0.2, 0.24], seek:'Look on top of the old upright piano.' },

  clips:{
    radio:{ kind:'radio', speaker:'Bernard Lark, live from the green', voice:{ pitch:0.9, rate:0.98 },
      text:'[8:50] And Miss Wren raises her baton for Hark the Herald! Ah, the altos sound a voice light. No wonder: Mrs Ambrose is chasing her music sheet across the snow, singing all the while. Bless her! [9:00] Nine o\'clock! The Reverend throws the switch and THERE are the lights! Straight into Silent Night. Lovely. Though I must say, listeners, the tenor line sounds one voice short to my ear. Mr Quill\'s bass, mind you, is as steady as the church bell. [9:08] Silent Night ends. Miss Wren turns the page. [9:09] Ding Dong Merrily! Now, is that a gap at the back? No, no, it\'s only Mr Quill bending down to tie his bootlace. Up he pops. A fine, full sound.',
      say:'And Miss Wren raises her baton for Hark the Herald! Ah, the altos sound a voice light. No wonder: Mrs Ambrose is chasing her music sheet across the snow, singing all the while. Bless her! Nine o\'clock! The Reverend throws the switch and THERE are the lights! Straight into Silent Night. Lovely. Though I must say, listeners, the tenor line sounds one voice short to my ear. Mr Quill\'s bass, mind you, is as steady as the church bell. Silent Night ends. Miss Wren turns the page. Ding Dong Merrily! Now, is that a gap at the back? No, no, it\'s only Mr Quill bending down to tie his bootlace. Up he pops. A fine, full sound.' },
  },
  // Recorded voices go in /audio/ at the site root; if a file is missing, the phone's own voice reads the words.
  AUDIO_FILES:{ radio:'r5_radio.mp3' },
};
CM.start(ROOM);
