/* =====================================================================
   Moteur du site — navigation, pages, mode Présenter, démonstrations
   ===================================================================== */
(function () {
  "use strict";
  const C = window.COURSE;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  /* ---------- stockage local (facultatif, ne doit jamais bloquer) ---------- */
  const store = {
    get(k, d) { try { const v = localStorage.getItem("bda:" + k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem("bda:" + k, JSON.stringify(v)); } catch (e) {} }
  };
  let done = store.get("done", {});

  /* ---------- icônes ---------- */
  const I = {
    notion: '<path d="M3 5.5C5.5 4.5 9 4.5 12 6.5c3-2 6.5-2 9-1V19c-2.5-1-6-1-9 1-3-2-6.5-2-9-1zM12 6.5V20"/>',
    filrouge: '<path d="M4 17c3-6 5 2 8-4s5-2 8-6"/><circle cx="4" cy="17" r="1.6"/><circle cx="20" cy="7" r="1.6"/>',
    exemple: '<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10.5c.8.8 1 1.5 1 2.5h6c0-1 .2-1.7 1-2.5A6 6 0 0 0 12 3z"/>',
    requete: '<path d="m8 8-4 4 4 4M16 8l4 4-4 4M14 5l-4 14"/>',
    comparaison: '<path d="M12 3v18M5 7h4M5 11h4M15 7h4M15 11h4M5 15h4M15 15h4"/>',
    question: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.3-1 .9-1 1.7M12 17h.01"/>',
    simulation: '<rect x="3" y="4" width="18" height="13" rx="2"/><path d="m10 8.5 4 2.5-4 2.5zM8 21h8"/>',
    demo: '<path d="M4 19V5M4 19h16M8 15l3-4 3 2 5-6"/>',
    retenir: '<path d="M6 3h12v18l-6-4-6 4z"/>',
    quiz: '<path d="M9 11l2 2 4-4"/><rect x="3" y="3" width="18" height="18" rx="3"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    play: '<rect x="3" y="4" width="18" height="13" rx="2"/><path d="m10 8.5 4 2.5-4 2.5zM8 21h8"/>',
    pdf: '<path d="M12 3v12m0 0-4-4m4 4 4-4M5 19h14"/>',
    td: '<path d="m8 8-4 4 4 4M16 8l4 4-4 4"/>',
    check: '<path d="m5 12 5 5 9-10"/>',
    menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
    close: '<path d="M6 6l12 12M18 6 6 18"/>',
    moon: '<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    copy: '<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h8"/>',
    ext: '<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>',
    full: '<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>',
    lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>'
  };
  const ico = (n, cls = "") => `<svg class="ico ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${I[n] || ""}</svg>`;
  const LABEL = { notion: "Notion", filrouge: "Fil rouge", exemple: "Exemple", requete: "Requête", comparaison: "Comparaison", question: "À vous de réfléchir", simulation: "Simulation", demo: "Démonstration", retenir: "À retenir", quiz: "Auto-évaluation" };
  const pad = n => String(n).padStart(2, "0");

  /* ---------- aides ---------- */
  const chap = id => C.chapitres.find(c => c.id === id);
  const toutes = c => c.parties || [];                       // toutes les parties (ouvertes et verrouillées)
  const partsOf = c => toutes(c).filter(p => !p.verrou);    // parties visibles par les étudiants
  const totalMin = c => toutes(c).reduce((s, p) => s + p.duree, 0);
  const keyOf = (c, p) => c.id + "/" + p.id;
  const allParts = () => C.chapitres.flatMap(c => partsOf(c).map(p => ({ c, p })));

  /* ---------- coloration syntaxique légère ---------- */
  const KW = {
    sql: "SELECT|FROM|WHERE|JOIN|INNER|LEFT|RIGHT|ON|AND|OR|NOT|AS|GROUP BY|ORDER BY|HAVING|INSERT|INTO|VALUES|UPDATE|SET|DELETE|CREATE|TABLE|PRIMARY|KEY|NULL|IS|IN|LIKE|COUNT|SUM|AVG|MIN|MAX|START TRANSACTION|COMMIT|ROLLBACK|DISTINCT|LIMIT|text|timestamp|float",
    js: "db|find|insertOne|updateOne|aggregate|true|false|null",
    redis: "SET|GET|EX|DEL|EXPIRE",
    cypher: "MATCH|RETURN|WHERE|CREATE|MERGE"
  };
  function highlight(el) {
    const lang = (el.className.match(/\b(sql|json|js|redis|cypher)\b/) || [])[1] || "sql";
    let s = el.textContent.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const tokens = [];
    const keep = (html) => { tokens.push(html); return "\uE000" + String.fromCharCode(0xE100 + tokens.length - 1); };
    s = s.replace(/--[^\n]*/g, m => keep(`<span class="c">${m}</span>`));
    s = s.replace(/"(?:[^"\\]|\\.)*"(\s*:)?|'(?:[^'\\]|\\.)*'/g, (m, colon) => keep(colon ? `<span class="k2">${m.slice(0, m.length - colon.length)}</span>${colon}` : `<span class="s">${m}</span>`));
    if (KW[lang]) s = s.replace(new RegExp("\\b(" + KW[lang] + ")\\b", "g"), '<span class="k">$1</span>');
    s = s.replace(/\b(\d+(?:[.,]\d+)?)\b/g, '<span class="n">$1</span>');
    s = s.replace(/\uE000([\uE100-\uF8FF])/g, (m, ch) => tokens[ch.charCodeAt(0) - 0xE100]);
    el.innerHTML = s;
  }

  /* =================================================================
     WIDGETS
     ================================================================= */
  const W = {};

  W.timer = function (el) {
    const sec = +el.dataset.timer;
    const fmt = s => Math.floor(s / 60) + ":" + pad(s % 60);
    el.classList.add("timer");
    el.innerHTML = `<span class="timer-c">${ico("clock")} <b>Consigne :</b> ${el.dataset.consigne || ""}</span>
      <button class="btn small timer-b" type="button">▶ ${fmt(sec)}</button><span class="timer-bar"><i></i></span>`;
    const b = $(".timer-b", el), bar = $(".timer-bar i", el);
    let left = sec, h = null;
    b.addEventListener("click", e => {
      e.stopPropagation();
      if (h) { clearInterval(h); h = null; left = sec; b.textContent = "▶ " + fmt(sec); bar.style.width = "0"; el.classList.remove("running", "over"); return; }
      el.classList.add("running");
      h = setInterval(() => {
        left--; b.textContent = "■ " + fmt(Math.max(left, 0)); bar.style.width = (100 * (sec - left) / sec) + "%";
        if (left <= 0) { clearInterval(h); h = null; el.classList.remove("running"); el.classList.add("over"); b.textContent = "Temps écoulé · ↺"; left = sec; }
      }, 1000);
    });
  };

  W.sim = function (el) {
    const src = el.dataset.src;
    el.classList.add("sim");
    el.innerHTML = `<div class="sim-frame"><iframe src="${src}" title="Simulation" loading="lazy"></iframe></div>
      <div class="sim-bar"><span>Cliquez dans la simulation, puis utilisez ses boutons ou les flèches du clavier.</span>
      <a class="btn small" href="${src}" target="_blank" rel="noopener">${ico("full")} Plein écran</a></div>`;
  };

  W.replication = function (el) {
    el.classList.add("repl");
    const col = (id, titre) => `
      <div class="repl-col" id="${id}">
        <div class="repl-h">${titre}</div>
        <div class="repl-net">
          <div class="node cli">Client</div>
          <div class="node pri" data-n="p"><b>Primaire</b><span class="val">x = 1</span></div>
          <div class="row2"><div class="node rep" data-n="r1"><b>Réplique 1</b><span class="val">x = 1</span></div>
          <div class="node rep" data-n="r2"><b>Réplique 2</b><span class="val">x = 1</span></div></div>
        </div>
        <div class="repl-status">En attente d'une écriture…</div>
      </div>`;
    el.innerHTML = `<div class="repl-grid">${col("rs", "Réplication synchrone")}${col("ra", "Réplication asynchrone")}</div>
      <div class="repl-ctl"><button class="btn primary" type="button">Écrire x = 5 sur les deux systèmes</button><button class="btn" type="button">↺ Réinitialiser</button></div>`;
    const [go, reset] = $$(".repl-ctl button", el);
    let timers = [];
    const at = (ms, f) => timers.push(setTimeout(f, ms));
    const set = (col, n, v, cls) => { const nd = $(`[data-n="${n}"]`, col); $(".val", nd).textContent = "x = " + v; nd.classList.remove("flash"); void nd.offsetWidth; nd.classList.add("flash"); if (cls) nd.classList.add(cls); };
    const st = (col, t, cls) => { const s = $(".repl-status", col); s.innerHTML = t; s.className = "repl-status " + (cls || ""); };
    function doReset() {
      timers.forEach(clearTimeout); timers = [];
      $$(".repl-col", el).forEach(c => { $$(".node[data-n]", c).forEach(n => { $(".val", n).textContent = "x = 1"; n.classList.remove("flash", "new", "old"); }); st(c, "En attente d'une écriture…"); });
      go.disabled = false;
    }
    go.addEventListener("click", e => {
      e.stopPropagation(); doReset(); go.disabled = true;
      const s = $("#rs", el), a = $("#ra", el);
      st(s, "Écriture reçue par le primaire…", "wait"); st(a, "Écriture reçue par le primaire…", "wait");
      at(500, () => { set(s, "p", 5, "new"); set(a, "p", 5, "new"); st(s, "Le primaire attend les copies avant de confirmer…", "wait"); st(a, "<b>Écriture confirmée immédiatement ✓</b> · les copies suivront", "ok"); });
      at(900, () => { $('[data-n="r2"]', a).classList.add("old"); st(a, "<b>Confirmée ✓</b> · un lecteur sur la réplique 2 lit encore <b>x = 1</b> (valeur ancienne)", "warn"); });
      at(1300, () => set(s, "r1", 5, "new"));
      at(1900, () => { set(s, "r2", 5, "new"); st(s, "<b>Écriture confirmée ✓</b> · toutes les copies sont à jour", "ok"); });
      at(2300, () => set(a, "r1", 5, "new"));
      at(3300, () => { const r2 = $('[data-n="r2"]', a); r2.classList.remove("old"); set(a, "r2", 5, "new"); st(a, "<b>Toutes les copies ont convergé ✓</b> (cohérence à terme)", "ok"); go.disabled = false; });
    });
    reset.addEventListener("click", e => { e.stopPropagation(); doReset(); });
  };

  W.partition = function (el) {
    el.classList.add("stepper");
    const steps = [
      "Réseau normal : les deux serveurs se synchronisent.",
      "Coupure réseau : A et B ne peuvent plus communiquer.",
      "U1 achète la dernière place sur le serveur A : A passe à 0.",
      "U2 demande au serveur B : « Reste-t-il une place ? ». B ne sait pas que la place est vendue.",
      "<b>Choix CP : refuser.</b> B répond « service momentanément indisponible ». + aucune place vendue deux fois · − U2 n'obtient pas de réponse.",
      "<b>Choix AP : répondre.</b> B répond « oui, 1 place ». + U2 obtient une réponse immédiate · − réponse périmée : la place risque d'être vendue deux fois."
    ];
    let i = 0;
    el.innerHTML = `<svg viewBox="0 0 640 230" class="part-svg" role="img" aria-label="Partition réseau">
        <g class="link-ok"><line x1="185" y1="150" x2="455" y2="150"/><text x="320" y="138" text-anchor="middle">synchronisation</text></g>
        <g class="link-ko"><line x1="185" y1="150" x2="455" y2="150"/><text x="320" y="158" text-anchor="middle" class="bolt">⚡</text><text x="320" y="185" text-anchor="middle">coupure réseau</text></g>
        <g class="srv"><rect x="35" y="118" width="150" height="64" rx="10"/><text x="110" y="143" text-anchor="middle" class="b">Serveur A</text><text x="110" y="166" text-anchor="middle" class="pa">places = 1</text></g>
        <g class="srv"><rect x="455" y="118" width="150" height="64" rx="10"/><text x="530" y="143" text-anchor="middle" class="b">Serveur B</text><text x="530" y="166" text-anchor="middle">places = 1</text></g>
        <g class="u1"><circle cx="110" cy="40" r="17"/><text x="110" y="45" text-anchor="middle" class="w">U1</text><line x1="110" y1="58" x2="110" y2="112"/><text x="134" y="45" class="lbl">achète la dernière place</text></g>
        <g class="u2"><circle cx="530" cy="40" r="17"/><text x="530" y="45" text-anchor="middle" class="w">U2</text><line x1="530" y1="58" x2="530" y2="112"/><text x="506" y="45" text-anchor="end" class="lbl">« Reste-t-il une place ? »</text></g>
        <g class="rep-cp"><rect x="430" y="196" width="200" height="28" rx="6"/><text x="530" y="215" text-anchor="middle">« Indisponible »</text></g>
        <g class="rep-ap"><rect x="430" y="196" width="200" height="28" rx="6"/><text x="530" y="215" text-anchor="middle">« Oui, 1 place »</text></g>
      </svg>
      <div class="step-txt"></div>
      <div class="step-ctl"><button class="btn" type="button">← Précédent</button><span class="dots"></span><button class="btn primary" type="button">Suivant →</button></div>`;
    const svg = $("svg", el), txt = $(".step-txt", el), [prev, next] = $$(".step-ctl button", el), dots = $(".dots", el);
    dots.innerHTML = steps.map(() => "<i></i>").join("");
    function render() {
      svg.dataset.s = i; txt.innerHTML = steps[i];
      $(".pa", svg).textContent = i >= 2 ? "places = 0" : "places = 1";
      $$("i", dots).forEach((d, k) => d.classList.toggle("on", k <= i));
      prev.disabled = i === 0; next.disabled = i === steps.length - 1;
    }
    prev.addEventListener("click", e => { e.stopPropagation(); if (i > 0) { i--; render(); } });
    next.addEventListener("click", e => { e.stopPropagation(); if (i < steps.length - 1) { i++; render(); } });
    render();
  };

  W.cap = function (el) {
    el.classList.add("capw");
    const etats = [
      { t: "Réseau normal : aucun arbitrage", x: "Les serveurs communiquent : le système peut être à la fois cohérent et disponible.", sac: "", cut: "" },
      { t: "Partition + choix CP", x: "Le serveur isolé refuse de répondre plutôt que de donner une valeur périmée : cohérent, mais indisponible pour ces requêtes.", sac: "A", cut: "CP" },
      { t: "Partition + choix AP", x: "Chaque serveur continue de répondre avec ce qu'il sait : disponible, mais les réponses peuvent différer jusqu'au retour du réseau.", sac: "C", cut: "AP" }
    ];
    el.innerHTML = `<div class="seg"><button type="button">Réseau normal</button><button type="button">Partition + CP</button><button type="button">Partition + AP</button></div>
      <div class="cap-body"><svg viewBox="-40 0 440 290" class="cap-svg">
        <line class="e CA" x1="180" y1="40" x2="60" y2="230"/><line class="e CP" x1="180" y1="40" x2="300" y2="230"/><line class="e AP" x1="60" y1="230" x2="300" y2="230"/>
        <g class="v" data-v="C"><circle cx="180" cy="40" r="26"/><text x="180" y="47" text-anchor="middle">C</text><text class="lab" x="180" y="10" text-anchor="middle">Cohérence</text></g>
        <g class="v" data-v="A"><circle cx="60" cy="230" r="26"/><text x="60" y="237" text-anchor="middle">A</text><text class="lab" x="60" y="280" text-anchor="middle">Disponibilité</text></g>
        <g class="v" data-v="P"><circle cx="300" cy="230" r="26"/><text x="300" y="237" text-anchor="middle">P</text><text class="lab" x="300" y="280" text-anchor="middle">Tolérance aux partitions</text></g>
      </svg><div class="cap-txt"><div class="cap-t"></div><p class="cap-x"></p></div></div>`;
    const btns = $$(".seg button", el), svg = $("svg", el);
    function show(k) {
      const e = etats[k];
      btns.forEach((b, j) => b.classList.toggle("on", j === k));
      $$(".v", svg).forEach(v => v.classList.toggle("sac", v.dataset.v === e.sac));
      $$(".e", svg).forEach(l => l.classList.toggle("cut", e.cut && l.classList.contains(e.cut)));
      $(".cap-t", el).textContent = e.t; $(".cap-x", el).textContent = e.x + (e.sac ? "  (" + (e.sac === "A" ? "Disponibilité" : "Cohérence") + " sacrifiée)" : "");
    }
    btns.forEach((b, j) => b.addEventListener("click", ev => { ev.stopPropagation(); show(j); }));
    show(0);
  };

  W.vraifaux = function (el) {
    el.classList.add("vf");
    el.innerHTML = C.vraiFaux.map((q, k) => `<div class="vf-q" data-k="${k}"><p><b>${k + 1}.</b> ${q.a}</p>
      <div class="vf-b"><button type="button" data-v="1">Vrai</button><button type="button" data-v="0">Faux</button></div><div class="vf-e"></div></div>`).join("") +
      `<div class="vf-score"></div>`;
    let ok = 0, n = 0;
    $$(".vf-q", el).forEach(d => {
      const q = C.vraiFaux[+d.dataset.k];
      $$("button", d).forEach(b => b.addEventListener("click", e => {
        e.stopPropagation(); if (d.classList.contains("answered")) return;
        const good = (b.dataset.v === "1") === q.v; d.classList.add("answered", good ? "good" : "bad"); b.classList.add("picked");
        $(".vf-e", d).innerHTML = `<b>${good ? "Bonne réponse." : "Pas tout à fait."}</b> C'est <b>${q.v ? "vrai" : "faux"}</b> : ${q.e}`;
        n++; if (good) ok++;
        if (n === C.vraiFaux.length) $(".vf-score", el).innerHTML = `Score : <b>${ok} / ${n}</b> (${Math.round(100 * ok / n)} %) <button type="button" class="btn small">↺ Recommencer</button>`;
        const r = $(".vf-score button", el); if (r) r.onclick = ev => { ev.stopPropagation(); W.vraifaux(el); };
      }));
    });
  };

  W.famille = function (el) {
    el.classList.add("fam");
    const F = C.familles;
    el.innerHTML = F.besoins.map((b, k) => `<div class="fam-q" data-k="${k}"><p><b>${k + 1}.</b> ${b.b}</p>
      <div class="chips">${F.options.map(o => `<button type="button">${o}</button>`).join("")}</div><div class="fam-e"></div></div>`).join("") +
      `<div class="fam-ctl"><button type="button" class="btn primary">Vérifier mes réponses</button></div>`;
    $$(".fam-q", el).forEach(d => $$(".chips button", d).forEach(b => b.addEventListener("click", e => { e.stopPropagation(); $$(".chips button", d).forEach(x => x.classList.remove("sel")); b.classList.add("sel"); })));
    $(".fam-ctl button", el).addEventListener("click", e => {
      e.stopPropagation(); let ok = 0;
      $$(".fam-q", el).forEach(d => {
        const b = F.besoins[+d.dataset.k], sel = $(".chips .sel", d), good = sel && sel.textContent === b.r; if (good) ok++;
        d.classList.remove("good", "bad"); d.classList.add(good ? "good" : "bad");
        $(".fam-e", d).innerHTML = `<b>${b.r}</b> · ${b.j}`;
      });
      $(".fam-ctl", el).insertAdjacentHTML("beforeend", "");
      e.target.textContent = `Score : ${ok} / ${F.besoins.length} (${Math.round(100 * ok / F.besoins.length)} %) · Vérifier de nouveau`;
    });
  };

  function initWidgets(root) {
    $$("table.t", root).forEach(t => { if (t.parentElement.classList.contains("tw")) return; const w = document.createElement("div"); w.className = "tw" + (t.classList.contains("step") ? " step" : ""); t.classList.remove("step"); t.parentNode.insertBefore(w, t); w.appendChild(t); });
    $$("[data-widget]", root).forEach(el => { const f = W[el.dataset.widget]; if (f && !el.dataset.ready) { el.dataset.ready = "1"; f(el); } });
    $$("[data-timer]", root).forEach(el => { if (!el.dataset.ready) { el.dataset.ready = "1"; W.timer(el); } });
    $$("pre code", root).forEach(code => {
      if (code.dataset.ready) return; code.dataset.ready = "1"; highlight(code);
      const pre = code.parentElement, b = document.createElement("button");
      b.className = "copy"; b.type = "button"; b.title = "Copier"; b.innerHTML = ico("copy");
      b.addEventListener("click", e => { e.stopPropagation(); const t = code.textContent;
        const okf = () => { b.classList.add("ok"); setTimeout(() => b.classList.remove("ok"), 1200); };
        if (navigator.clipboard) navigator.clipboard.writeText(t).then(okf, () => {}); });
      pre.appendChild(b);
    });
  }

  /* =================================================================
     PAGES
     ================================================================= */
  const main = $("#main"), side = $("#sidebar-nav");

  function renderSidebar(curC, curP) {
    side.innerHTML = C.chapitres.map(c => {
      const open = c.id === curC, soon = c.statut !== "ok";
      return `<div class="sb-ch ${open ? "open" : ""} ${soon ? "soon" : ""}" style="--c:${HUES[C.chapitres.indexOf(c) % HUES.length]}">
        ${soon ? `<span class="sb-ct sb-soon" title="Bientôt disponible"><span class="sb-n">${c.num}</span><span>${c.titre}</span>${ico("lock")}</span>` : `<a class="sb-ct" href="#${c.id}/${c.parties[0].id}"><span class="sb-n">${c.num}</span><span>${c.titre}</span></a>`}
        ${soon ? "" : `<div class="sb-parts">${toutes(c).map((p, k) => p.verrou ? `<span class="locked" title="Disponible prochainement"><span class="sb-dot">${ico("lock")}</span>${p.titre}</span>` : `<a href="#${keyOf(c, p)}" class="${p.id === curP && open ? "cur" : ""} ${done[keyOf(c, p)] ? "done" : ""}"><span class="sb-dot">${done[keyOf(c, p)] ? ico("check") : k + 1}</span>${p.titre}</a>`).join("")}</div>`}
      </div>`;
    }).join("");
  }

  const HUES = ["#0f8a5f", "#4f46e5", "#d97706", "#db2777", "#0891b2"];
  const hue = c => HUES[C.chapitres.indexOf(c) % HUES.length];
  const nextTodo = () => allParts().find(x => !done[keyOf(x.c, x.p)]);

  const HERO_ART = `<svg viewBox="0 0 420 340" class="hero-svg" aria-hidden="true">
    <defs><linearGradient id="hg1" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="#34d399"/><stop offset="1" stop-color="#0f766e"/></linearGradient>
    <linearGradient id="hg2" x1="0" x2="1"><stop offset="0" stop-color="#fbbf24"/><stop offset="1" stop-color="#f97316"/></linearGradient>
    <linearGradient id="hg3" x1="0" x2="1"><stop offset="0" stop-color="#a5b4fc"/><stop offset="1" stop-color="#6366f1"/></linearGradient></defs>
    <g class="fl f1"><ellipse cx="120" cy="92" rx="70" ry="22" fill="#d1fae5"/><path d="M50 92v104c0 12 31 22 70 22s70-10 70-22V92" fill="url(#hg1)"/><ellipse cx="120" cy="92" rx="70" ry="22" fill="#6ee7b7"/>
      <path d="M50 128c0 12 31 22 70 22s70-10 70-22M50 162c0 12 31 22 70 22s70-10 70-22" fill="none" stroke="#ecfdf5" stroke-width="3" opacity=".6"/>
      <text x="120" y="200" text-anchor="middle" font-family="JetBrains Mono,monospace" font-size="15" font-weight="700" fill="#fff">SQL</text></g>
    <g class="fl f2"><rect x="232" y="40" width="160" height="120" rx="14" fill="#fff" stroke="#e5e7eb"/><rect x="232" y="40" width="160" height="26" rx="14" fill="url(#hg2)"/><rect x="232" y="54" width="160" height="12" fill="url(#hg2)"/>
      <text x="248" y="58" font-family="JetBrains Mono,monospace" font-size="11" font-weight="700" fill="#fff">document.json</text>
      <text font-family="JetBrains Mono,monospace" font-size="11.5" fill="#334155"><tspan x="248" y="88">{ "nom": "Fatima",</tspan><tspan x="256" y="106" fill="#c2410c">"filiere": "IDS",</tspan><tspan x="256" y="124">"notes": [14, 16]</tspan><tspan x="248" y="142">}</tspan></text></g>
    <g class="fl f3"><line x1="272" y1="232" x2="340" y2="206" stroke="#a5b4fc" stroke-width="3"/><line x1="272" y1="232" x2="330" y2="296" stroke="#a5b4fc" stroke-width="3"/><line x1="340" y1="206" x2="392" y2="262" stroke="#a5b4fc" stroke-width="3"/><line x1="330" y1="296" x2="392" y2="262" stroke="#a5b4fc" stroke-width="3"/>
      <circle cx="272" cy="232" r="19" fill="url(#hg3)"/><circle cx="340" cy="206" r="14" fill="#818cf8"/><circle cx="330" cy="296" r="15" fill="#6366f1"/><circle cx="392" cy="262" r="12" fill="#c7d2fe"/></g>
    <g class="fl f4"><rect x="40" y="250" width="186" height="38" rx="19" fill="#fff" stroke="#e5e7eb"/><rect x="40" y="250" width="86" height="38" rx="19" fill="#0f172a"/>
      <text x="83" y="274" text-anchor="middle" font-family="JetBrains Mono,monospace" font-size="12" font-weight="700" fill="#fff">session</text><text x="176" y="274" text-anchor="middle" font-family="JetBrains Mono,monospace" font-size="12" fill="#0f172a">→ { user: 42 }</text></g>
    <circle class="fl f2" cx="214" cy="226" r="6" fill="#f97316"/><circle class="fl f1" cx="402" cy="186" r="5" fill="#34d399"/><circle class="fl f3" cx="28" cy="226" r="7" fill="#818cf8"/>
  </svg>`;

  function pagePlan() {
    const all = allParts(), nd = all.filter(x => done[keyOf(x.c, x.p)]).length;
    const pct = all.length ? Math.round(100 * nd / all.length) : 0;
    const diapos = all.flatMap(x => x.p.diapos);
    const nq = diapos.reduce((n, d) => n + (d.html.match(/class="q-num"/g) || []).length, 0), nsim = diapos.filter(d => d.type === "simulation" || d.type === "demo").length;
    const nt = nextTodo();
    const cta = nt ? (nd ? `Continuer : ${nt.p.titre}` : "Commencer le cours") : "Revoir le cours";
    const ctaHref = nt ? "#" + keyOf(nt.c, nt.p) : "#" + keyOf(C.chapitres[0], C.chapitres[0].parties[0]);
    const R = 26, L = 2 * Math.PI * R;
    const nTot = C.chapitres.filter(c => c.statut === "ok").reduce((n, c) => n + toutes(c).length, 0), nVues = all.length;
    const pctCours = nTot ? Math.round(100 * nVues / nTot) : 0;   /* avancement = parties ouvertes (traitées en classe) */
    main.innerHTML = `<article class="content wide">
      <section class="hero-banner">
        <div class="hero-in">
          <p class="hero-eyebrow"><span class="pulse"></span>${C.niveau} · ${C.annee}</p>
          <h1>Bases de données <span class="grad">avancées</span></h1>
          <p class="hero-lead">${C.accroche}</p>
          <div class="hero-cta"><a class="btn primary big" href="${ctaHref}">${cta} →</a><a class="btn ghost big" href="#glossaire">Glossaire</a></div>
        </div>
        <div class="hero-art">${HERO_ART}</div>
      </section>

      <section class="progress-card">
        <svg viewBox="0 0 64 64" class="ring"><circle cx="32" cy="32" r="${R}" class="ring-bg"/><circle cx="32" cy="32" r="${R}" class="ring-fg" stroke-dasharray="${L}" stroke-dashoffset="${L * (1 - pctCours / 100)}"/><text x="32" y="37" text-anchor="middle">${pctCours}%</text></svg>
        <div><b>Avancement du cours</b><p>${nVues} partie${nVues > 1 ? "s" : ""} traitée${nVues > 1 ? "s" : ""} en classe sur ${nTot} (chapitre ${C.chapitres[0].num}). Relisez-les avant la prochaine séance.</p></div>
      </section>



      <h2 class="sec-t">Le parcours</h2>
      <div class="chapters">
      ${C.chapitres.filter(c => c.statut === "ok").map(c => {
        const soon = c.statut !== "ok", ps = partsOf(c), tt = toutes(c), dn = ps.filter(p => done[keyOf(c, p)]).length;
        return `<section class="ch-card ${soon ? "soon" : ""}" style="--c:${hue(c)}">
          <div class="ch-top"><span class="ch-num">${c.num}</span>
            <div class="ch-info"><h3>${c.titre}${soon ? ' <em class="badge">Bientôt</em>' : ""}</h3><p>${c.resume}</p>
            ${soon ? "" : `<div class="chips-meta"><span>${tt.length} parties</span>${tt.length > ps.length ? `<span class="open-chip">${ps.length} disponibles</span>` : ""}${c.pdf ? `<a href="${c.pdf}" target="_blank" rel="noopener">${ico("pdf")} Notes PDF</a>` : ""}${c.td && !c.tdVerrou ? `<a href="${c.td}" target="_blank" rel="noopener">${ico("td")} ${c.tdLabel || "TD"}</a>` : c.tdVerrou ? `<span class="lock-chip" title="Disponible à la prochaine séance">${ico("lock")} ${c.tdLabel || "TD"} · prochaine séance</span>` : ""}</div>`}</div>
            ${soon ? "" : `<div class="ch-prog"><b>${dn}/${ps.length}</b><span class="pbar"><i style="width:${100 * dn / ps.length}%"></i></span></div>`}
          </div>
          ${soon ? "" : `<ol class="timeline">${tt.map((p, k) => p.verrou ? `<li class="locked"><span class="tl-row"><span class="tl-dot">${ico("lock")}</span><span class="tl-t">${p.titre}</span><span class="tl-d">Prochainement</span></span></li>` : `<li class="${done[keyOf(c, p)] ? "done" : ""}"><a href="#${keyOf(c, p)}"><span class="tl-dot">${done[keyOf(c, p)] ? ico("check") : k + 1}</span><span class="tl-t">${p.titre}</span></a></li>`).join("")}</ol>`}
        </section>`;
      }).join("")}
      </div>
      ${C.chapitres.some(c => c.statut !== "ok") ? `<h2 class="sec-t small">À venir</h2>
      <div class="soon-grid">${C.chapitres.filter(c => c.statut !== "ok").map(c => `<div class="soon-card" style="--c:${hue(c)}"><div class="sc-top"><span class="sc-n">${c.num}</span><span class="sc-b">${ico("lock")} Bientôt</span></div><b>${c.titre}</b><p>${c.resume}</p></div>`).join("")}</div>` : ""}
    </article>`;
    renderSidebar(null, null);
    reveal();
    document.title = "Plan du cours · " + C.titre;
  }

  function pageLesson(c, p) {
    const parts = partsOf(c), idx = parts.indexOf(p), k = keyOf(c, p);
    const prev = parts[idx - 1], next = parts[idx + 1], n = p.diapos.length;
    main.innerHTML = `<article class="content">
      <header class="lesson-hero" style="--c:${hue(c)}">
        <nav class="breadcrumb"><a href="#plan">Le cours</a> / <a href="#${keyOf(c, parts[0])}">${c.titre}</a> / Partie ${idx + 1}</nav>
        <p class="eyebrow">Chapitre ${c.num} · Partie ${idx + 1} / ${toutes(c).length}</p>
        <h1>${p.titre}</h1>
        <p class="lead">${p.accroche}</p>
        <div class="part-steps">${toutes(c).map((q, j) => q.verrou ? `<span class="lk" title="Prochainement"></span>` : `<a href="#${keyOf(c, q)}" class="${j === idx ? "cur" : ""} ${done[keyOf(c, q)] ? "done" : ""}" title="${q.titre}"></a>`).join("")}</div>
        <p class="outcome"><span>À retenir</span>${p.retenir}</p>
        <div class="tools">
          <span class="reading">${n} diapositives</span>
          <button class="btn primary" type="button" data-act="present">${ico("play")} Présenter</button>
          ${c.pdf ? `<a class="btn" href="${c.pdf}" target="_blank" rel="noopener">${ico("pdf")} Notes PDF</a>` : ""}
          ${c.td && !c.tdVerrou ? `<a class="btn" href="${c.td}" target="_blank" rel="noopener">${ico("td")} ${c.tdLabel || "TD"}</a>` : c.tdVerrou ? `<span class="btn is-locked" title="Disponible à la prochaine séance">${ico("lock")} ${c.tdLabel || "TD"} · prochaine séance</span>` : ""}
        </div>
      </header>
      <details class="lesson-plan"><summary>Dans cette partie <span>${n} diapositives</span></summary>
        <ol>${p.diapos.map((d, j) => `<li><a href="#${k}" data-goto="${j}">${d.titre}</a><span class="pill t-${d.type}">${LABEL[d.type] || ""}</span></li>`).join("")}</ol></details>
      <div class="slides">${p.diapos.map((d, j) => `
        <section class="slide-panel t-${d.type}" id="d${j}">
          <header class="sp-h"><span class="sp-label">${ico(d.type)} ${LABEL[d.type] || ""}</span><span class="sp-num">${pad(j + 1)} / ${pad(n)}</span>
            <h2>${d.titre}</h2><button class="text-btn" type="button" data-present-from="${j}" title="Présenter à partir d'ici">${ico("play")} Présenter</button></header>
          <div class="sp-body">${d.html}</div>
        </section>`).join("")}</div>
      <div class="done-box ${done[k] ? "is-done" : ""}">
        <div><b>${done[k] ? "Partie terminée" : "Vous avez fini cette partie ?"}</b><span>${done[k] ? "Elle est cochée dans votre progression." : "Cochez-la pour suivre votre progression."}</span></div>
        <button class="btn ${done[k] ? "" : "primary"}" type="button" data-act="done">${ico("check")} ${done[k] ? "Annuler" : "Marquer comme terminée"}</button>
      </div>
      <nav class="pager">
        ${prev ? `<a class="pg prev" href="#${keyOf(c, prev)}"><span>← Partie précédente</span><b>${prev.titre}</b></a>` : "<span></span>"}
        ${next ? `<a class="pg next" href="#${keyOf(c, next)}"><span>Partie suivante →</span><b>${next.titre}</b></a>` : toutes(c).length > parts.length ? `<div class="pg next pg-lock"><span>${ico("lock")} La suite</span><b>À la prochaine séance</b></div>` : `<a class="pg next" href="#plan"><span>Fin du chapitre →</span><b>Retour au plan</b></a>`}
      </nav>
    </article>`;
    initWidgets(main);
    renderSidebar(c.id, p.id);
    reveal();
    document.title = p.titre + " · " + C.titre;
    $('[data-act="present"]', main).addEventListener("click", () => Present.open(c, p, 0));
    $$("[data-present-from]", main).forEach(b => b.addEventListener("click", () => Present.open(c, p, +b.dataset.presentFrom)));
    $$("[data-goto]", main).forEach(a => a.addEventListener("click", e => { e.preventDefault(); $("#d" + a.dataset.goto).scrollIntoView({ behavior: "smooth", block: "start" }); }));
    $('[data-act="done"]', main).addEventListener("click", e => {
      done[k] = !done[k]; if (!done[k]) delete done[k]; store.set("done", done);
      if (done[k]) { confetti(e.currentTarget); toast(next ? "Bravo ! Partie terminée. Prochaine étape : " + next.titre : toutes(c).length > parts.length ? "Bravo ! Vous êtes à jour. La suite à la prochaine séance." : "Bravo ! Vous avez terminé le chapitre " + c.num + "."); }
      const sy = scrollY; pageLesson(c, p); scrollTo(0, sy);
    });
  }

  /* ---------- petites animations ---------- */
  function reveal() {
    const els = $$(".slide-panel, .ch-card, .feat", main);
    return; /* animation d'apparition désactivée : elle rendait le texte flou pendant le défilement */
    els.forEach(e => e.classList.add("rv"));
    const io = new IntersectionObserver(es => es.forEach(x => { if (x.isIntersecting) { x.target.classList.add("in"); io.unobserve(x.target); } }), { rootMargin: "0px 0px -8% 0px" });
    els.forEach(e => io.observe(e));
    setTimeout(() => els.forEach(e => e.classList.add("in")), 2500);
  }
  function toast(msg) {
    let t = $("#toast"); if (!t) { t = document.createElement("div"); t.id = "toast"; document.body.appendChild(t); }
    t.textContent = msg; t.classList.add("on"); clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove("on"), 3200);
  }
  function confetti(from) {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = from.getBoundingClientRect(), cols = ["#0f8a5f", "#4f46e5", "#d97706", "#db2777", "#0891b2", "#fbbf24"];
    for (let i = 0; i < 46; i++) {
      const s = document.createElement("i"); s.className = "cf";
      s.style.left = (r.left + r.width / 2) + "px"; s.style.top = (r.top + r.height / 2) + "px"; s.style.background = cols[i % cols.length];
      const a = Math.random() * Math.PI * 2, d = 90 + Math.random() * 160;
      s.style.setProperty("--x", Math.cos(a) * d + "px"); s.style.setProperty("--y", (Math.sin(a) * d - 80) + "px"); s.style.setProperty("--r", (Math.random() * 720 - 360) + "deg");
      document.body.appendChild(s); setTimeout(() => s.remove(), 1300);
    }
  }
  addEventListener("scroll", () => { const h = document.documentElement, m = h.scrollHeight - h.clientHeight; const b = $("#readbar i"); if (b) b.style.width = (m > 0 ? 100 * scrollY / m : 0) + "%"; }, { passive: true });

  function pageGlossaire() {
    main.innerHTML = `<article class="content"><header class="lesson-hero" style="--c:#4f46e5"><p class="eyebrow">${C.titre}</p><h1>Glossaire</h1>
      <p class="lead">Les mots clés du cours, avec une définition courte.</p>
      <input class="search" type="search" placeholder="Rechercher un terme… (ex. CAP, réplication)" aria-label="Rechercher"></header>
      <dl class="gloss">${C.glossaire.map(([t, d]) => `<div class="g-item"><dt>${t}</dt><dd>${d}</dd></div>`).join("")}</dl>
      <p class="muted empty" hidden>Aucun terme ne correspond.</p></article>`;
    const inp = $(".search", main), norm = s => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
    inp.addEventListener("input", () => {
      const q = norm(inp.value); let n = 0;
      $$(".g-item", main).forEach(g => { const v = norm(g.textContent).includes(q); g.hidden = !v; if (v) n++; });
      $(".empty", main).hidden = n > 0;
    });
    renderSidebar(null, null); document.title = "Glossaire · " + C.titre;
  }

  function pageRessources() {
    main.innerHTML = `<article class="content"><header class="lesson-hero" style="--c:#d97706"><p class="eyebrow">${C.titre}</p><h1>Ressources</h1>
      <p class="lead">Supports à télécharger, base de données des TP et simulations.</p></header>
      <div class="res-grid">${C.ressources.map(r => `<a class="res" href="${r.lien}" target="_blank" rel="noopener"><span class="res-type rt-${r.type.toLowerCase().replace("é","e")}">${r.type}</span><b>${r.titre}</b><span class="muted">${r.desc}</span></a>`).join("")}</div>
      <h2 class="sec-t">Références</h2><ul class="refs">${C.references.map(r => `<li>${r}</li>`).join("")}</ul></article>`;
    renderSidebar(null, null); document.title = "Ressources · " + C.titre;
  }

  /* =================================================================
     MODE PRÉSENTER
     ================================================================= */
  const Present = (function () {
    const ov = $("#present"), stage = $("#pr-stage"), count = $("#pr-count"), title = $("#pr-title"), bar = $("#pr-bar i");
    let list = [], pos = 0, steps = [], shown = 0;
    function build(c) { list = []; partsOf(c).forEach(p => p.diapos.forEach((d, j) => list.push({ c, p, d, j }))); }
    function render(fromEnd) {
      const it = list[pos];
      title.textContent = `Chapitre ${it.c.num} · ${it.p.titre}`;
      stage.innerHTML = `<div class="pr-slide t-${it.d.type}"><span class="sp-label">${ico(it.d.type)} ${LABEL[it.d.type] || ""}</span><h2>${it.d.titre}</h2><div class="sp-body">${it.d.html}</div></div>`;
      initWidgets(stage);
      steps = $$(".step", stage);
      shown = fromEnd ? steps.length : 0;
      steps.forEach((s, k) => s.classList.toggle("hid", k >= shown));
      count.textContent = `${pos + 1} / ${list.length}`;
      bar.style.width = (100 * (pos + 1) / list.length) + "%";
      stage.scrollTop = 0;
    }
    function next() { if (shown < steps.length) { steps[shown++].classList.remove("hid"); return; } if (pos < list.length - 1) { pos++; render(false); } }
    function prev() { if (shown > 0) { steps[--shown].classList.add("hid"); return; } if (pos > 0) { pos--; render(true); } }
    function open(c, p, j) {
      build(c);
      pos = list.findIndex(x => x.p === p && x.j === j); if (pos < 0) pos = 0;
      ov.hidden = false; document.body.classList.add("presenting"); render(false); ov.focus();
    }
    function close() { ov.hidden = true; document.body.classList.remove("presenting"); stage.innerHTML = ""; if (document.fullscreenElement && document.exitFullscreen) document.exitFullscreen(); }
    function full() { if (!document.fullscreenElement) { (ov.requestFullscreen || function () {}).call(ov); } else if (document.exitFullscreen) document.exitFullscreen(); }
    $("#pr-next").addEventListener("click", next); $("#pr-prev").addEventListener("click", prev);
    $("#pr-close").addEventListener("click", close); $("#pr-full").addEventListener("click", full);
    stage.addEventListener("click", e => { if (e.target.closest("button,a,iframe,input,.chips,.seg")) return; next(); });
    document.addEventListener("keydown", e => {
      if (ov.hidden) return;
      if (["ArrowRight", "PageDown", " ", "Enter"].includes(e.key)) { e.preventDefault(); next(); }
      else if (["ArrowLeft", "PageUp", "Backspace"].includes(e.key)) { e.preventDefault(); prev(); }
      else if (e.key === "Escape") { if (!document.fullscreenElement) close(); }
      else if (e.key === "f" || e.key === "F") full();
      else if (e.key === "b" || e.key === "B") ov.classList.toggle("black");
    });
    return { open };
  })();

  /* =================================================================
     ROUTEUR, MENU, THÈME
     ================================================================= */
  function route() {
    const h = decodeURIComponent(location.hash.replace(/^#/, ""));
    document.body.classList.remove("nav-open");
    if (h === "glossaire") return pageGlossaire();
    const [cid, pid] = h.split("/");
    const c = chap(cid);
    if (c && c.statut === "ok") {
      const p = partsOf(c).find(x => x.id === pid) || partsOf(c)[0];
      pageLesson(c, p); window.scrollTo(0, 0); return;
    }
    pagePlan(); window.scrollTo(0, 0);
  }

  $("#brand-title").textContent = C.titre;
  $("#brand-sub").textContent = C.niveau;
  $("#foot").innerHTML = `${C.auteur} · ${C.titre} · ${C.niveau} · ${C.annee}`;
  $("#nav-toggle").innerHTML = ico("menu");
  $("#nav-close").innerHTML = ico("close");
  $("#nav-toggle").addEventListener("click", () => document.body.classList.add("nav-open"));
  $("#nav-close").addEventListener("click", () => document.body.classList.remove("nav-open"));
  $("#scrim").addEventListener("click", () => document.body.classList.remove("nav-open"));
  $("#pr-close").innerHTML = "Fermer · Échap";
  $("#pr-full").innerHTML = ico("full");

  const themeBtn = $("#theme");
  function applyTheme(t) {
    if (t) document.documentElement.dataset.theme = t; else delete document.documentElement.dataset.theme;
    const dark = t ? t === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
    themeBtn.innerHTML = ico(dark ? "sun" : "moon"); themeBtn.title = dark ? "Mode clair" : "Mode sombre";
  }
  applyTheme(store.get("theme", null));
  themeBtn.addEventListener("click", () => {
    const cur = document.documentElement.dataset.theme || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    const t = cur === "dark" ? "light" : "dark"; store.set("theme", t); applyTheme(t);
  });

  addEventListener("hashchange", route);
  route();
})();
