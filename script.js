try {
    if (localStorage.getItem('theme') === 'dark') {
        document.documentElement.classList.add('dark-mode');
    }
} catch (e) {}

document.addEventListener("DOMContentLoaded", function(){

    generateNavbar();
    setupDarkMode();
    
    const modal = document.getElementById("kep-modal");
    const modalTartalom = document.querySelector(".modal-tartalom");
    const bezaroGomb = document.querySelector(".modal-bezaras");

    const kattinthatoSzavak = document.querySelectorAll(".ia");
    
    kattinthatoSzavak.forEach(function(szo) {
        szo.addEventListener("click", function() {
            const tipus = this.getAttribute("data-tipus");
            const celId = this.getAttribute("data-target");
            const celElem = document.getElementById(celId);

            if (!celElem) return; 

            if (tipus == "toggle") {
                const osszesRejtett = document.querySelectorAll(".rejtett-kep");
                if (!celElem.classList.contains("lathato")) {
                    osszesRejtett.forEach(elem => elem.classList.remove("lathato"));
                }
                celElem.classList.toggle("lathato"); 
            }
            else if (tipus == "modal") {
                const modalTartalom = document.querySelector(".modal-tartalom");
                modalTartalom.innerHTML = "";

                const ujKep = celElem.cloneNode(true);
                ujKep.id = "modal-benne-levo-kep";
                ujKep.classList.remove("rejtett-kep", "lathato");

                ujKep.style.visibility = "visible";
                // ujKep.style.opacity = "1";
                ujKep.style.display = "inline-block";
                // ujKep.style.transform = "none";

                const belsoFelirat = ujKep.querySelector(".kep-felirat");
                let feliratSzoveg = "";

                if (belsoFelirat) {
                    feliratSzoveg = belsoFelirat.innerHTML;
                    belsoFelirat.remove(); //kiveszem a dobozból, hogy a nagyítás ne vonatkozzon rá
                } else {
                    const imgElem = ujKep.querySelector("img");
                    if (imgElem && imgElem.alt) feliratSzoveg = imgElem.alt;
                    else if (celElem.alt) feliratSzoveg = celElem.alt;
                }

                modalTartalom.appendChild(ujKep);

                if (feliratSzoveg) {
                    const feliratDiv = document.createElement("div");
                    feliratDiv.className = "modal-felirat";
                    feliratDiv.innerHTML = feliratSzoveg;
                    modalTartalom.appendChild(feliratDiv);
                }

                modal.classList.add("lathato");
                if(bezaroGomb) bezaroGomb.classList.add("lathato");
            }
        });
    });

    //modal bezárása
    if (modal && bezaroGomb) {
        bezaroGomb.addEventListener("click", function(event){
            modal.classList.remove("lathato");
            const aktKep = document.getElementById("modal-benne-levo-kep");
            if(aktKep) setTimeout(() => modalTartalom.innerHTML = "", 300);
        });
        
        window.addEventListener("click", function(e) {
            if (e.target === modal) {
                modal.classList.remove("lathato");
                const aktKep = document.getElementById("modal-benne-levo-kep");
                if(aktKep) setTimeout(() => modalTartalom.innerHTML = "", 300);
            }
        });
        
        window.addEventListener("keydown", function(e) {
            if (e.key === "Escape") {
                modal.classList.remove("lathato");
                const aktKep = document.getElementById("modal-benne-levo-kep");
                if(aktKep) setTimeout(() => modalTartalom.innerHTML = "", 300);
            }
        });

        modalTartalom.addEventListener("click", function(e) {
            e.stopPropagation();
            const aktKep = document.getElementById("modal-benne-levo-kep");
            if (aktKep &&(e.target === aktKep || aktKep.contains(e.target))) {

                if (!aktKep.classList.contains("nagyitott")) {
                    const rect = aktKep.getBoundingClientRect();

                    const x = ((e.clientX - rect.left) / rect.width) * 100;
                    const y = ((e.clientY - rect.top) / rect.height) * 100;

                    aktKep.style.transformOrigin = `${x}% ${y}%`;
                }
                aktKep.classList.toggle("nagyitott");
            }
        });
        modalTartalom.addEventListener("mousemove", function(e) {
            const aktKep = document.getElementById("modal-benne-levo-kep");

            if (aktKep && aktKep.classList.contains("nagyitott")) {
                const rect = modalTartalom.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;

                aktKep.style.transformOrigin = `${x}% ${y}%`;
            }
        })
    }

    // ctrl + c beállítása, hogy formázva másoljon
    document.addEventListener("copy", function(e) {
        const kivalasztottSzoveg = window.getSelection();

        if (!kivalasztottSzoveg || kivalasztottSzoveg.toString().length === 0) return;

        let aDobozbanVan = false;
        let elem = kivalasztottSzoveg.anchorNode;
        while (elem && elem !== document.body) {
            if (elem.classList && elem.classList.contains("bekezdessel")) {
                aDobozbanVan = true;
                break;
            }
            elem = elem.parentNode;
        }

        if (aDobozbanVan) {
            e.preventDefault(); //megakadályozza az alap másolást
            e.clipboardData.setData("text/plain", kivalasztottSzoveg.toString());
        }
    })
});

// Másolás funkció a kóddobozokhoz
function copyCode(button) {
    const codeBlock = button.nextElementSibling;
    const textToCopy = codeBlock.innerText;

    navigator.clipboard.writeText(textToCopy).then(() => {
    const originalText = button.innerText;
    button.innerText = "Másolva! ✓";
    button.classList.add("copied");

    setTimeout(() => {
        button.innerText = originalText;
        button.classList.remove("copied");
    }, 2000);
    }).catch(err => {
    console.error('Sikertelen másolás: ', err);
    button.innerText = "Hiba :(";
    });
}

// Dark Mode beállítás önálló függvényben
function setupDarkMode() {
    let toggleBtn = document.getElementById('theme-toggle');
    const body = document.documentElement; // itt most valójában nem a bodyt, hanem a html-t választom ki, ez kapja meg a classt

    // Ha nincs gomb, létrehozzuk
    if (!toggleBtn) {
        toggleBtn = document.createElement('button');
        toggleBtn.id = 'theme-toggle';
        toggleBtn.title = 'Sötét/Világos mód';
        toggleBtn.innerHTML = '🌙';
        document.body.appendChild(toggleBtn);
    }

    // Megpróbáljuk betölteni az elmentett beállítást (ha engedi a böngésző)
    try {
        if (localStorage.getItem('theme') === 'dark') {
            body.classList.add('dark-mode');
            toggleBtn.textContent = '☀️';
        }
    } catch (error) {
        console.warn("Helyi tároló (localStorage) blokkolva. A sötét mód csak erre a munkamenetre él.");
    }

    toggleBtn.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        
        // Ellenőrizzük, sötétben vagyunk-e, és aszerint cseréljük az ikont
        const isDark = body.classList.contains('dark-mode');
        toggleBtn.textContent = isDark ? '☀️' : '🌙';
        
        // Megpróbáljuk elmenteni az új állapotot
        try {
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        } catch (error) {
            // Nem gond, ha hiba van, a gomb így is működni fog!
        }
    });
}

// navbar generálás kódja
function generateNavbar() {
    const pathname = window.location.pathname;

    // A perjelek (/) hozzáadása pontosítja a felismerést
    const inSubFolder = pathname.includes('/info/') || pathname.includes('/kemia/') || pathname.includes('/biosz/');
    const rootPrefix = inSubFolder ? "../" : "./";

    const subjects = [
        {
            title: "💻 Digitális kultúra",
            folder: "info",
            categories: [
                {
                    name: "🐍 Python programozás",
                    items: [
                    //     { title: "1. Alapismeretek", file: "Python_9ny_01_alapok.html" },
                    //     { title: "2. Elágazások (if-else)", file: "Python_9ny_02_alapok_II.html" },
                    //     { title: "3. Összetett adattípusok", file: "Python_9ny_03_osszetett_adattipusok.html" },
                    //     { title: "4. A for ciklus", file: "Python_9ny_04_for_ciklus.html" },
                    //     { title: "5. A while ciklus", file: "Python_9ny_05_while_ciklus.html" },
                    //     { title: "Az eddig tanultak átismétlése", file: "Python_9_ismetles.html" },
                    //     { title: "6. Kivételkezelés (try-except)", file: "Python_9_06_try_except.html" },
                    //     { title: "7. Függvények (def)", file: "Python_9_07_eljarasok_fuggvenyek.html" },
                    //     { title: "8. Modulok (random, math)", file: "Python_9_08_modulok.html" },
                    //     { title: "9. Teknőcgrafika (Turtle)", file: "Python_9_09_teknocgrafika.html" },
                    //     { title: "Az eddig tanultak átismétlése", file: "Python_10_ismetles.html" }
                        ]
                },
                {
                    name: "Szövegszerkesztés",
                    items: [
                        {title: "Word alapok", file: "word_07_01_A_szamitogep_tortenete.html"},
                        {title: "Tabulátorok", file: "word_07_02_filmklub.html"},
                        {title: "Hosszabb szöveg szerkesztése", file: "word_08_03_hulladekgazdalkodas.html"}
                    ]
                },
                {
                    name: "Táblázatkezelés",
                    items: [
                        // {title: "Excel alapok", file: "excel_08_01_alapok.html"},
                        // {title: "Grafikonok", file: "excel_08_02_grafikonok.html"}
                    ]
                },
                {
                    name: "🖥️ A számítógép felépítése",
                    items: [
                        {title: "A számítógép felépítése, az operációs rendszer", file: "oprsz_felepites_9ny_01_hardver_alapok.html"},
                        {title: "A számrendszerek és a bináris logika", file: "oprsz_felepites_9ny_02_szamrendszer_alapok.html"}
                    ]
                }
            ]
        },
        {
            title: "🧪 Kémia",
            folder: "kemia",
            categories: [
                {
                    name: "Általános kémia",
                    items: [
                        {title: "1. Atommag, radioaktivitás", file: "alapok_03_atommag_radioaktivitas.html"},
                        {title: "1+. Atommodellek, bevezetés", file: "alapok_02_atommodell_atommag.html"}
                    ]
                },
                {
                    name: "Reakciókinetika",
                    items: [
                        {title: "1. Bevezetés, alapfogalmak", file: "reakciok_01_bevezetes.html"},
                        {title: "2. Reakciók sebessége és iránya", file: "reakciok_02_sebesseg_irany.html"}
                    ]
                }
            ]
        },
        {
            title: "🌹 Biológia",
            folder: "biosz",
            categories: [
                {
                    name: "Bevezetés a biológiába",
                    items: [
                        //{title: "1. A biológia tudománya", file: "biosz_01_01.html"}
                    ]
                }
            ]
        }
    ];

    let navItemsHTML = "";
    subjects.forEach(sub => {
        let dropdownContent = "";
        let hasContent = false;

        sub.categories.forEach(cat => {
            if (cat.items.length > 0) {
                hasContent = true;
                dropdownContent += `<div class="menu-category">${cat.name}</div>`;
                cat.items.forEach(item => {
                    const active = pathname.includes(item.file) ? "active" : "";
                    dropdownContent += `<a href="${rootPrefix}${sub.folder}/${item.file}" class="${active}">${item.title}</a>`;
                });
            }
        });

        if (hasContent) {
            navItemsHTML += `
            <li class="nav-item dropdown">
                <a href="#" class="nav-link">${sub.title} ▼</a>
                <div class="dropdown-content">${dropdownContent}</div>
            </li>`;
        }
    });

    const navHTML = `<nav class="top-nav"><ul class="nav-list">
        <li class="nav-item"><a href="${rootPrefix}index.html" class="nav-link">🏠 Kezdőlap</a></li>
        ${navItemsHTML}
    </ul></nav>`;

    document.body.insertAdjacentHTML('afterbegin', navHTML);
}

// --- KÉMIA: ELLENŐRZŐ KÉRDÉSEK ---
function checkQuiz(button, isCorrect, feedback) {
    const card = button.closest('.task-card');
    let feedbackDiv = card.querySelector('.quiz-feedback');
    
    if (!feedbackDiv) {
        feedbackDiv = document.createElement('div');
        feedbackDiv.className = 'quiz-feedback osszefoglalas';
        feedbackDiv.style.marginTop = '10px';
        card.appendChild(feedbackDiv);
    }

    if (isCorrect) {
        feedbackDiv.innerHTML = "✅ Helyes! " + feedback;
        feedbackDiv.style.borderColor = "green";
    } else {
        feedbackDiv.innerHTML = "❌ Nem talált. " + feedback;
        feedbackDiv.style.borderColor = "red";
    }
}

document.addEventListener("DOMContentLoaded", function() {
    // --- ÖNÉRTÉKELŐ PROGRESS BAR RENDSZER ---
    const ellenorzok = document.querySelectorAll(".feladat-ellenorzo");
    
    // Ha nincs az oldalon ilyen feladat, ne is fusson le a kód (pl. kémia jegyzetnél)
    if (ellenorzok.length === 0) {
        const stickyBar = document.querySelector(".progress-sticky");
        if (stickyBar) stickyBar.style.display = "none";
        return;
    }

    let maxPont = 0;
    let osszesFeladat = ellenorzok.length;

    // Kiszámoljuk a maximális pontszámot a HTML data-pont attribútumokból
    ellenorzok.forEach(ell => {
        maxPont += parseInt(ell.getAttribute("data-pont")) || 0;
    });

    document.getElementById("max-pont").innerText = maxPont;

    // Eseményfigyelők rákötése a checkboxokra
    ellenorzok.forEach(ell => {
        const keszBox = ell.querySelector(".kesz-box");
        const hibatlanBox = ell.querySelector(".hibatlan-box");
        const hibatlanLabel = ell.querySelector(".hibatlan-label");

        // "Kész" checkbox kattintása
        keszBox.addEventListener("change", function() {
            if (this.checked) {
                // Engedélyezzük a "Szerintem hibátlan" gombot
                hibatlanBox.disabled = false;
                hibatlanLabel.classList.remove("disable-label");
            } else {
                // Ha kikapcsolja a Készt, a Hibátlan is kikapcsol és letiltódik
                hibatlanBox.checked = false;
                hibatlanBox.disabled = true;
                hibatlanLabel.classList.add("disable-label");
            }
            kiertekel();
        });

        // "Hibátlan" checkbox kattintása
        hibatlanBox.addEventListener("change", function() {
            kiertekel();
        });
    });

    function kiertekel() {
        // Dinamikusan lekérjük az aktuálisan oldalon lévő feladatokat (csoportválasztás után!)
        const aktualisEllenorzok = document.querySelectorAll(".feladat-ellenorzo");
        let keszDarab = 0;
        let szerzettPont = 0;
        let aktualisMaxPont = 0;

        aktualisEllenorzok.forEach(ell => {
            const keszBox = ell.querySelector(".kesz-box");
            const hibatlanBox = ell.querySelector(".hibatlan-box");
            const pontErtek = parseInt(ell.getAttribute("data-pont")) || 0;

            aktualisMaxPont += pontErtek;
            if (keszBox.checked) keszDarab++;
            if (hibatlanBox.checked) szerzettPont += pontErtek;
        });

        // Progress bar (Százalék a KÉSZ feladatok alapján)
        const szazalek = Math.round((keszDarab / aktualisEllenorzok.length) * 100);
        document.getElementById("haladas-szoveg").innerText = `Haladás: ${szazalek}%`;
        document.getElementById("progress-fill").style.width = `${szazalek}%`;

        // Pontszám frissítése
        document.getElementById("szerzett-pont").innerText = szerzettPont;
        document.getElementById("max-pont").innerText = aktualisMaxPont;

        // Várható jegy becslése (százalékos ponthatárok: 40-55-70-85%)
        const pontSzazalek = (szerzettPont / aktualisMaxPont) * 100;
        let jegy = 1;
        if (pontSzazalek >= 85) jegy = 5;
        else if (pontSzazalek >= 70) jegy = 4;
        else if (pontSzazalek >= 55) jegy = 3;
        else if (pontSzazalek >= 40) jegy = 2;

        const jegySzoveg = keszDarab === 0 ? "-" : jegy;
        document.getElementById("varhato-jegy").innerText = `Várható jegy: ${jegySzoveg}`;
    }
});

// --- KÖZPONTI KVÍZMOTOR (SORSOLÁS, MEGJELENÍTÉS, ELLENŐRZÉS) ---
let aktualisKvizKerdesek = [];

function keverKvizTomb(tomb) {
  const masolat = [...tomb];
  for (let i = masolat.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [masolat[i], masolat[j]] = [masolat[j], masolat[i]];
  }
  return masolat;
}

function ujKvizSorsolas(darab = 10) {
  if (typeof kerdesBank === "undefined" || !Array.isArray(kerdesBank) || kerdesBank.length === 0) {
    return;
  }

  const eredmenyJelzo = document.getElementById("kviz-eredmeny-jelzo");
  if (eredmenyJelzo) eredmenyJelzo.innerHTML = "";

  const alapok = kerdesBank.filter(k => k.szint === "alap");
  const haladok = kerdesBank.filter(k => k.szint === "halado");

  // Ha vannak szintjelölések, 70% alap és 30% haladó kérdést sorsol
  if (alapok.length > 0 && haladok.length > 0) {
    const alapDb = Math.min(alapok.length, Math.round(darab * 0.7));
    const haladoDb = Math.min(haladok.length, darab - alapDb);
    const sorsoltAlap = keverKvizTomb(alapok).slice(0, alapDb);
    const sorsoltHalado = keverKvizTomb(haladok).slice(0, haladoDb);
    aktualisKvizKerdesek = keverKvizTomb([...sorsoltAlap, ...sorsoltHalado]);
  } else {
    aktualisKvizKerdesek = keverKvizTomb(kerdesBank).slice(0, darab);
  }

  renderKozpontiKviz();
}

function renderKozpontiKviz() {
  const kontener = document.getElementById("kviz-terulet");
  if (!kontener) return;
  kontener.innerHTML = "";

  const tipusNevek = {
    single: "egyszerű választás",
    multi: "többválaszos (jelöld be mindet!)",
    tf: "igaz vagy hamis?",
    short: "rövid szöveges válasz",
    order: "sorba rendezés",
    group: "csoportba sorolás",
    match: "párosítás"
  };

  aktualisKvizKerdesek.forEach((k, index) => {
    const kartya = document.createElement("div");
    kartya.className = "kviz-kerdes-kartya";
    kartya.id = `kerdes-doboz-${index}`;

    let szintBadge = "";
    if (k.szint === "alap") {
      szintBadge = `<span class="kviz-tipus-badge badge-alap">⭐ alapkövetelmény</span>`;
    } else if (k.szint === "halado") {
      szintBadge = `<span class="kviz-tipus-badge badge-halado">🌟 pluszpontos (haladó)</span>`;
    }

    let belsoHTML = `
      ${szintBadge}
      <span class="kviz-tipus-badge">${k.kategoria} • ${tipusNevek[k.tipus] || k.tipus}</span>
      <p style="font-weight: bold; margin-top: 5px;">${index + 1}. ${k.kerdes}</p>
    `;

    if (k.tipus === "single") {
      belsoHTML += `<div class="kviz-opciok">`;
      k.opciok.forEach((op, opIdx) => {
        belsoHTML += `
          <label>
            <input type="radio" name="q_${index}" value="${opIdx}"> ${op}
          </label>`;
      });
      belsoHTML += `</div>`;
    } 
    else if (k.tipus === "multi") {
      belsoHTML += `<div class="kviz-opciok">`;
      k.opciok.forEach((op, opIdx) => {
        belsoHTML += `
          <label>
            <input type="checkbox" name="q_${index}" value="${opIdx}"> ${op}
          </label>`;
      });
      belsoHTML += `</div>`;
    } 
    else if (k.tipus === "tf") {
      belsoHTML += `
        <div class="kviz-opciok">
          <label><input type="radio" name="q_${index}" value="true"> 🟢 igaz</label>
          <label><input type="radio" name="q_${index}" value="false"> 🔴 hamis</label>
        </div>`;
    } 
    else if (k.tipus === "short") {
      belsoHTML += `
        <input type="text" id="q_${index}_input" class="rovid-input" placeholder="írd ide a választ..." style="width: 100%; max-width: 300px;">
      `;
    } 
    else if (k.tipus === "order") {
      const kevertElemek = keverKvizTomb(k.elemek.map((el, i) => ({ szoveg: el, eredetiIndex: i })));
      belsoHTML += `<div>`;
      for (let pos = 0; pos < k.elemek.length; pos++) {
        belsoHTML += `
          <div class="parosito-sor">
            <b>${pos + 1}. hely:</b>
            <select id="q_${index}_pos_${pos}">
              <option value="">-- válassz --</option>
              ${kevertElemek.map(ke => `<option value="${ke.eredetiIndex}">${ke.szoveg}</option>`).join("")}
            </select>
          </div>`;
      }
      belsoHTML += `</div>`;
    } 
    else if (k.tipus === "group") {
      belsoHTML += `<div>`;
      k.tetelek.forEach((tetel, tIdx) => {
        belsoHTML += `
          <div class="parosito-sor">
            <span>${tetel.szoveg}</span>
            <select id="q_${index}_group_${tIdx}">
              <option value="">-- melyik csoport? --</option>
              ${k.csoportok.map((cs, csIdx) => `<option value="${csIdx}">${cs}</option>`).join("")}
            </select>
          </div>`;
      });
      belsoHTML += `</div>`;
    } 
    else if (k.tipus === "match") {
      const jobbOpciok = keverKvizTomb(k.parok.map((p, i) => ({ szoveg: p.jobb, eredetiIndex: i })));
      belsoHTML += `<div>`;
      k.parok.forEach((par, pIdx) => {
        belsoHTML += `
          <div class="parosito-sor">
            <b>${par.bal}</b>
            <select id="q_${index}_match_${pIdx}">
              <option value="">-- válassz párt --</option>
              ${jobbOpciok.map(jo => `<option value="${jo.eredetiIndex}">${jo.szoveg}</option>`).join("")}
            </select>
          </div>`;
      });
      belsoHTML += `</div>`;
    }

    belsoHTML += `<div id="visszajelzes-${index}" class="visszajelzes-doboz"></div>`;
    kartya.innerHTML = belsoHTML;
    kontener.appendChild(kartya);
  });
}

function ellenorizKozpontiKviz() {
  let helyesPont = 0;

  aktualisKvizKerdesek.forEach((k, index) => {
    let jo = false;
    const visszajelzes = document.getElementById(`visszajelzes-${index}`);

    if (k.tipus === "single") {
      const valasztott = document.querySelector(`input[name="q_${index}"]:checked`);
      if (valasztott && parseInt(valasztott.value) === k.helyes) jo = true;
    } 
    else if (k.tipus === "multi") {
      const bejeloltek = Array.from(document.querySelectorAll(`input[name="q_${index}"]:checked`)).map(cb => parseInt(cb.value)).sort();
      const elvart = [...k.helyes].sort();
      if (bejeloltek.length === elvart.length && bejeloltek.every((v, i) => v === elvart[i])) jo = true;
    } 
    else if (k.tipus === "tf") {
      const valasztott = document.querySelector(`input[name="q_${index}"]:checked`);
      if (valasztott && (valasztott.value === "true") === k.helyes) jo = true;
    } 
    else if (k.tipus === "short") {
      const beirt = document.getElementById(`q_${index}_input`).value.trim().toLowerCase();
      if (k.elfogadott.includes(beirt)) jo = true;
    } 
    else if (k.tipus === "order") {
      jo = true;
      for (let pos = 0; pos < k.elemek.length; pos++) {
        const val = document.getElementById(`q_${index}_pos_${pos}`).value;
        if (val === "" || parseInt(val) !== pos) jo = false;
      }
    } 
    else if (k.tipus === "group") {
      jo = true;
      k.tetelek.forEach((tetel, tIdx) => {
        const val = document.getElementById(`q_${index}_group_${tIdx}`).value;
        if (val === "" || parseInt(val) !== tetel.helyesCsoport) jo = false;
      });
    } 
    else if (k.tipus === "match") {
      jo = true;
      k.parok.forEach((par, pIdx) => {
        const val = document.getElementById(`q_${index}_match_${pIdx}`).value;
        if (val === "" || parseInt(val) !== pIdx) jo = false;
      });
    }

    if (jo) helyesPont++;

    visszajelzes.style.display = "block";
    visszajelzes.className = "visszajelzes-doboz " + (jo ? "helyes-valasz" : "hibas-valasz");
    visszajelzes.innerHTML = (jo ? "✔️ <b>helyes!</b> " : "❌ <b>hibás vagy hiányos!</b> ") + k.magyarazat;
  });

  const szazalek = Math.round((helyesPont / aktualisKvizKerdesek.length) * 100);
  const eredmenyJelzo = document.getElementById("kviz-eredmeny-jelzo");
  if (eredmenyJelzo) {
    eredmenyJelzo.innerHTML = `eredményed: <span style="color: var(--secondary);">${helyesPont} / ${aktualisKvizKerdesek.length} pont (${szazalek}%)</span>`;
  }
}

// Automatikus inicializálás, ha az oldalon jelen van a kvíz konténer és a kérdésbank
document.addEventListener("DOMContentLoaded", function() {
  if (document.getElementById("kviz-terulet") && typeof kerdesBank !== "undefined") {
    ujKvizSorsolas(10);
  }
});