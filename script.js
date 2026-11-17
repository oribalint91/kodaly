try {
    if (localStorage.getItem('theme') === 'dark') {
        document.documentElement.classList.add('dark-mode');
    }
} catch (e) {}

document.addEventListener("DOMContentLoaded", function(){

    generateNavbar();
    generateIndex();
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
                if (!modal || !modalTartalom) return; // nincs modal az oldalon, nem tudjuk megnyitni
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
    if (modal && bezaroGomb && modalTartalom) {
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

    // Ctrl + C a .bekezdessel dobozokban: formázás nélkül, de a szöveget pontosan másolja.
    // Megmaradnak a sortörések, tabulátorok és a különleges szóközök (pl. &nbsp;) is,
    // amiket a böngésző alapból sima szóközre cserélne.
    document.addEventListener("copy", function(e) {
        const kijeloles = window.getSelection();

        if (!kijeloles || kijeloles.rangeCount === 0 || kijeloles.toString().length === 0) return;

        let elem = kijeloles.anchorNode;
        if (elem && elem.nodeType !== Node.ELEMENT_NODE) elem = elem.parentElement;
        if (!elem || !elem.closest(".bekezdessel")) return;

        let szoveg = "";
        for (let i = 0; i < kijeloles.rangeCount; i++) {
            szoveg += nyersSzoveg(kijeloles.getRangeAt(i).cloneContents());
        }

        e.preventDefault(); //megakadályozza az alap másolást
        e.clipboardData.setData("text/plain", szoveg);
    });

    // Lenyíló menük mobilon / érintőképernyőn: kattintásra (koppintásra) is nyíljanak
    document.querySelectorAll(".nav-item.dropdown > .nav-link").forEach(link => {
        link.addEventListener("click", function(e) {
            e.preventDefault(); // a href="#" ne ugorjon az oldal tetejére
            const sajat = this.parentElement;
            const nyitvaVolt = sajat.classList.contains("nyitva");
            document.querySelectorAll(".nav-item.dropdown.nyitva").forEach(m => m.classList.remove("nyitva"));
            if (!nyitvaVolt) sajat.classList.add("nyitva");
        });
    });
    document.addEventListener("click", function(e) {
        if (!e.target.closest(".nav-item.dropdown")) {
            document.querySelectorAll(".nav-item.dropdown.nyitva").forEach(m => m.classList.remove("nyitva"));
        }
    });
});

// Szöveg kinyerése egy elemből vagy kijelölésből úgy, hogy minden karakter megmaradjon:
// sortörés, tabulátor, nem törhető szóköz és egyéb szóközfélék is.
const BLOKK_ELEMEK = new Set(["P", "DIV", "LI", "UL", "OL", "H1", "H2", "H3", "H4", "H5", "H6", "TR", "TABLE", "PRE", "BLOCKQUOTE"]);
function nyersSzoveg(csomopont) {
    let eredmeny = "";
    csomopont.childNodes.forEach(gyerek => {
        if (gyerek.nodeType === Node.TEXT_NODE) {
            eredmeny += gyerek.nodeValue;
        } else if (gyerek.nodeType === Node.ELEMENT_NODE) {
            if (gyerek.tagName === "BR") { eredmeny += "\n"; return; }
            if (gyerek.tagName === "BUTTON") return; // pl. a másológomb felirata ne kerüljön bele
            const blokk = BLOKK_ELEMEK.has(gyerek.tagName);
            if (blokk && eredmeny && !eredmeny.endsWith("\n")) eredmeny += "\n";
            eredmeny += nyersSzoveg(gyerek);
            if (blokk && !eredmeny.endsWith("\n")) eredmeny += "\n";
        }
    });
    return eredmeny;
}

// Másolás funkció a kóddobozokhoz és a nyers szöveges dobozokhoz
function copyCode(button) {
    const codeBlock = button.nextElementSibling;
    if (!codeBlock) return;

    // Ha a doboz megőrzi a szóközöket (pl. .bekezdessel vagy <pre>), akkor karakterhűen másolunk,
    // különben (normál HTML-szövegnél) a böngésző által megjelenített szöveget vesszük.
    const whiteSpace = getComputedStyle(codeBlock).whiteSpace;
    const megorzi = whiteSpace.startsWith("pre") || whiteSpace === "break-spaces";
    const textToCopy = megorzi ? nyersSzoveg(codeBlock) : codeBlock.innerText;

    // Az eredeti feliratot csak egyszer mentjük el, így gyors dupla kattintásnál sem ragad be a "Másolva!"
    if (!button.dataset.eredetiFelirat) button.dataset.eredetiFelirat = button.innerText;
    clearTimeout(button._visszaallito);

    const visszaallit = () => {
        button._visszaallito = setTimeout(() => {
            button.innerText = button.dataset.eredetiFelirat;
            button.classList.remove("copied");
        }, 2000);
    };

    navigator.clipboard.writeText(textToCopy).then(() => {
        button.innerText = "Másolva! ✓";
        button.classList.add("copied");
        visszaallit();
    }).catch(err => {
        console.error('Sikertelen másolás: ', err);
        button.innerText = "Hiba :(";
        visszaallit();
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

// =====================================================================
//  TARTALOMJEGYZÉK – EZ AZ EGYETLEN HELY, AHOL AZ OLDALAKAT FEL KELL VENNI
//  Ebből készül a felső menü (navbar) ÉS a kezdőlap (index.html) listája is.
//
//  Egy oldal mezői:
//    title    – rövid cím (ez jelenik meg a menüben)
//    file     – a fájl neve a tantárgy mappáján belül
//    active   – true: látszik a menüben és a kezdőlapon; false: rejtett (pl. még nem tananyag)
//    evfolyam – (nem kötelező) melyik évfolyamnál jelenjen meg a kezdőlapon, pl. "8" vagy "9ny"
//    leiras   – (nem kötelező) hosszabb szöveg a kezdőlapra; ha nincs, a title látszik
//
//  Egy tantárgy mezői:
//    title / indexCim – név a menüben / a kezdőlapon
//    folder           – a tantárgy mappája
//    indexCsoport     – "evfolyam": a kezdőlapon évfolyamok szerint, különben témakörök szerint
//    indexSorrend     – hányadikként jelenjen meg a kezdőlapon
// =====================================================================
const TARTALOM = [
    {
        title: "💻 Digitális kultúra",
        indexCim: "💻 Infós tartalmak",
        folder: "info",
        indexCsoport: "evfolyam",
        indexSorrend: 2,
        categories: [
            {
                name: "🐍 Python programozás",
                items: [
                    { title: "1. Alapismeretek", file: "Python_9ny_01_alapok.html", evfolyam: "9ny", active: false,
                      leiras: "Python alapok (programozási környezet beállítása, adattípusok, változók)" },
                    { title: "2. Elágazások (if-else)", file: "Python_9ny_02_alapok_II.html", evfolyam: "9ny", active: false,
                      leiras: "Python alapok II. (feltételek, elágazások)" },
                    { title: "3. Összetett adattípusok", file: "Python_9ny_03_osszetett_adattipusok.html", evfolyam: "9ny", active: false,
                      leiras: "Python alapok III. (összetett adattípusok)" },
                    { title: "4. A for ciklus", file: "Python_9ny_04_for_ciklus.html", evfolyam: "9ny", active: false,
                      leiras: "Python ciklusok I. (for ciklus)" },
                    { title: "5. A while ciklus", file: "Python_9ny_05_while_ciklus.html", evfolyam: "9ny", active: false,
                      leiras: "Python ciklusok II. (while ciklus)" },
                    { title: "Az eddig tanultak átismétlése", file: "Python_9_ismetles.html", evfolyam: "9", active: false,
                      leiras: "Python: az alapok átismétlése" },
                    { title: "6. Kivételkezelés (try-except)", file: "Python_9_06_try_except.html", evfolyam: "9", active: false,
                      leiras: "Python hibakezelés: a try-except blokk" },
                    { title: "7. Függvények (def)", file: "Python_9_07_eljarasok_fuggvenyek.html", evfolyam: "9", active: false,
                      leiras: "Python: eljárások és függvények készítése és használata" },
                    { title: "8. Modulok (random, math)", file: "Python_9_08_modulok.html", evfolyam: "9", active: false,
                      leiras: "Python modulok használata" },
                    { title: "9. Teknőcgrafika (Turtle)", file: "Python_9_09_teknocgrafika.html", evfolyam: "9", active: false,
                      leiras: "Python: teknőcgrafika használata" },
                    { title: "Az eddig tanultak átismétlése", file: "Python_10_ismetles.html", evfolyam: "10", active: false,
                      leiras: "Python: az eddig tanultak átismétlése" }
                ]
            },
            {
                name: "Szövegszerkesztés",
                items: [
                    { title: "Ismerkedés a szövegszerkesztéssel", file: "word_04_ismerkedes.html", evfolyam: "4", active: true,
                      leiras: "Ismerkedés a szövegszerkesztéssel, internetes keresés" },
                    { title: "Formázási ismeretek", file: "word_05_formazas.html", evfolyam: "5", active: false },
                    { title: "Word alapok", file: "word_07_01_A_szamitogep_tortenete.html", evfolyam: "7", active: true,
                      leiras: "Szövegszerkesztés ismétlés: bekezdés- és karakterformázás, felsorolás, képek beillesztése" },
                    { title: "Tabulátorok", file: "word_07_02_filmklub.html", evfolyam: "7", active: true,
                      leiras: "Táblázat és ismerkedés a tabulátorokkal (filmklub)" },
                    { title: "Rövid szöveg: Mars", file: "word_08_02_Mars_kolonizalasa.html", evfolyam: "8", active: true,
                      leiras: "Rövid szöveg szerkesztése (Mars)" },
                    { title: "Közepes szöveg: K-pop", file: "word_08_03_Kpop.html", evfolyam: "8", active: true,
                      leiras: "Közepesen hosszú szöveg szerkesztése (K-pop)" },
                    { title: "Hosszú szöveg: AI", file: "word_08_03_A_mesterseges_intelligencia_vilaga.html", evfolyam: "8", active: true,
                      leiras: "Hosszú szöveg szerkesztése (AI)" },
                    { title: "Hosszú szöveg: hulladékgazdálkodás", file: "word_08_03_hulladekgazdalkodas.html", evfolyam: "8", active: true,
                      leiras: "Hosszú szöveg szerkesztése (hulladékgazdálkodás)" }
                ]
            },
            {
                name: "Táblázatkezelés",
                items: [
                    // TODO: évfolyam beírása, ha élesíted őket
                    { title: "Excel alapok", file: "Excel_01_alapok.html", active: false },
                    { title: "Excel alapok gyakorlása", file: "Excel_02_gyakorlas_01.html", active: false },
                    { title: "Logikai értékek és formázás", file: "Excel_03_logika.html", active: false }
                ]
            },
            {
                name: "Prezentációkészítés",
                items: [
                    { title: "Animálás az egérmutatóval", file: "ppt_11_egerre.html", evfolyam: "11", active: false }
                ]
            },
            {
                name: "🖥️ A számítógép felépítése",
                items: [
                    { title: "A számítógép felépítése, az operációs rendszer", file: "oprsz_felepites_9ny_01_hardver_alapok.html", evfolyam: "9ny", active: true },
                    { title: "A számrendszerek és a bináris logika", file: "oprsz_felepites_9ny_02_szamrendszer_alapok.html", evfolyam: "9ny", active: true }
                ]
            },
            {
                name: "🗄️ Adatbázis-kezelés",
                items: [
                    { title: "Adatbázis-kezelés: kapcsolatok", file: "Adatbazis_11_01_.html", evfolyam: "11", active: true,
                      leiras: "Adatbázis-kezelés" }
                ]
            }
        ]
    },
    {
        title: "🧪 Kémia",
        indexCim: "🧪 Kémiás tartalmak",
        folder: "kemia",
        indexSorrend: 3,
        categories: [
            {
                name: "8. évfolyam",
                items: [
                    { title: "1. Atomszerkezet és a periódusos rendszer", file: "08_01_atomszerkezet.html", evfolyam: "8", active: false }
                ]
            },
            {
                name: "Általános kémia",
                items: [
                    { title: "1. Atommodellek, bevezetés", file: "alapok_02_atommodell_atommag.html", evfolyam: "9", active: true },
                    { title: "2. Atommag, radioaktivitás", file: "alapok_03_atommag_radioaktivitas.html", evfolyam: "9", active: true }
                ]
            },
            {
                name: "Reakciókinetika",
                items: [
                    { title: "1. Bevezetés, alapfogalmak", file: "reakciok_01_bevezetes.html", evfolyam: "9", active: true },
                    { title: "2. Reakciók sebessége és iránya", file: "reakciok_02_sebesseg_irany.html", evfolyam: "9", active: true }
                ]
            }
        ]
    },
    {
        title: "🌹 Biológia",
        indexCim: "🌹 Bioszos tartalmak",
        folder: "biosz",
        indexSorrend: 4,
        categories: [
            {
                name: "Bevezetés a biológiába",
                items: [
                    // { title: "1. A biológia tudománya", file: "biosz_01_01.html", active: false }
                ]
            }
        ]
    },
    {
        title: "✍️ Magyar nyelv",
        indexCim: "📖 Nyelvtan gyakorló",
        folder: "magyar",
        indexSorrend: 1,
        categories: [
            {
                name: "Szóelemzés és szóalkotás",
                items: [
                    { title: "1. A szóelemzés", file: "nyelvtan_01_szoelemek.html", evfolyam: "8", active: true, leiras: "Szóelemek" },
                    { title: "2. A szóalkotás", file: "nyelvtan_02_szoalkotas.html", evfolyam: "8", active: true, leiras: "Szóalkotás" }
                ]
            },
            {
                name: "Szófajok és mondatelemzés",
                items: [
                    { title: "3. Szófajok", file: "nyelvtan_03_szofajok.html", evfolyam: "8", active: true, leiras: "Szófajok" },
                    { title: "4. Mondattani bevezető", file: "nyelvtan_04_mondattani_bevezeto.html", evfolyam: "8", active: true,
                      leiras: "Mondattani bevezető: alany, állítmány, tárgy" },
                    { title: "5. Mondattan: határozók", file: "nyelvtan_05_mondattan_hatarozok.html", evfolyam: "8", active: true, leiras: "Határozók" }
                ]
            },
            {
                name: "Hangtan és helyesírás",
                items: [
                    { title: "Hangtan és helyesírás", file: "nyelvtan_helyesiras_hangtan.html", evfolyam: "8", active: false }
                ]
            }
        ]
    }
];

// Csak az aktív oldalak (a kategóriák is csak akkor maradnak, ha van bennük aktív oldal)
function aktivKategoriak(sub) {
    return sub.categories
        .map(cat => ({ ...cat, items: cat.items.filter(item => item.active) }))
        .filter(cat => cat.items.length > 0);
}

// Gyökérmappa-előtag: almappából "../", a kezdőlapról "./"
function gyokerElotag() {
    const pathname = window.location.pathname;
    const inSubFolder = TARTALOM.some(sub => pathname.includes(`/${sub.folder}/`));
    return inSubFolder ? "../" : "./";
}

// navbar generálás kódja
function generateNavbar() {
    const pathname = decodeURIComponent(window.location.pathname);
    const rootPrefix = gyokerElotag();

    let navItemsHTML = "";
    TARTALOM.forEach(sub => {
        const kategoriak = aktivKategoriak(sub);
        if (kategoriak.length === 0) return;

        let dropdownContent = "";
        kategoriak.forEach(cat => {
            dropdownContent += `<div class="menu-category">${cat.name}</div>`;
            cat.items.forEach(item => {
                // pontos egyezés a mappa+fájlnév végére, hogy két hasonló nevű fájl ne legyen egyszerre aktív
                const active = pathname.endsWith(`/${sub.folder}/${item.file}`) ? "active" : "";
                dropdownContent += `<a href="${rootPrefix}${sub.folder}/${item.file}" class="${active}">${item.title}</a>`;
            });
        });

        navItemsHTML += `
            <li class="nav-item dropdown">
                <a href="#" class="nav-link">${sub.title} ▼</a>
                <div class="dropdown-content">${dropdownContent}</div>
            </li>`;
    });

    const navHTML = `<nav class="top-nav"><ul class="nav-list">
        <li class="nav-item"><a href="${rootPrefix}index.html" class="nav-link">🏠 Kezdőlap</a></li>
        ${navItemsHTML}
    </ul></nav>`;

    document.body.insertAdjacentHTML('afterbegin', navHTML);
}

// Kezdőlap (index.html) listájának generálása – csak ott fut, ahol van #tartalomjegyzek elem
function generateIndex() {
    const kontener = document.getElementById("tartalomjegyzek");
    if (!kontener) return;
    const rootPrefix = gyokerElotag();

    const evfolyamSorrend = e => {
        const szam = parseInt(e);
        // "9ny" a 9. elé kerüljön, az évfolyam nélküliek a végére
        return isNaN(szam) ? 999 : szam - (String(e).includes("ny") ? 0.5 : 0);
    };

    let html = "";
    [...TARTALOM]
        .sort((a, b) => (a.indexSorrend ?? 99) - (b.indexSorrend ?? 99))
        .forEach(sub => {
            const kategoriak = aktivKategoriak(sub);
            if (kategoriak.length === 0) return;

            // Csoportok: évfolyamok vagy témakörök szerint
            const csoportok = new Map();
            kategoriak.forEach(cat => cat.items.forEach(item => {
                const kulcs = sub.indexCsoport === "evfolyam"
                    ? (item.evfolyam ? `${item.evfolyam}. évfolyam`.replace("ny.", "ny") : "Egyéb")
                    : cat.name;
                if (!csoportok.has(kulcs)) csoportok.set(kulcs, { sorrend: evfolyamSorrend(item.evfolyam), items: [] });
                csoportok.get(kulcs).items.push(item);
            }));

            let csoportLista = [...csoportok.entries()];
            if (sub.indexCsoport === "evfolyam") csoportLista.sort((a, b) => a[1].sorrend - b[1].sorrend);

            html += `<div class="task-card"><h3>${sub.indexCim || sub.title}</h3>`;
            csoportLista.forEach(([nev, csoport]) => {
                html += `<details><summary>${nev}</summary><ul>`;
                csoport.items.forEach(item => {
                    html += `<li><a href="${rootPrefix}${sub.folder}/${item.file}">${item.leiras || item.title}</a></li>`;
                });
                html += `</ul></details>`;
            });
            html += `</div>`;
        });

    kontener.innerHTML = html;
}

// --- KÉMIA: ELLENŐRZŐ KÉRDÉSEK ---
function checkQuiz(button, isCorrect, feedback) {
    const card = button.closest('.task-card');
    if (!card) return;
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
    const maxPontElem = document.getElementById("max-pont");
    const haladasElem = document.getElementById("haladas-szoveg");
    const progressFill = document.getElementById("progress-fill");
    const szerzettPontElem = document.getElementById("szerzett-pont");
    const varhatoJegyElem = document.getElementById("varhato-jegy");

    if (!maxPontElem || !haladasElem || !progressFill ||
        !szerzettPontElem || !varhatoJegyElem) {
        return;
    }

    let maxPont = 0;

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
        const szazalek = aktualisEllenorzok.length ? Math.round((keszDarab / aktualisEllenorzok.length) * 100) : 0;
        document.getElementById("haladas-szoveg").innerText = `Haladás: ${szazalek}%`;
        document.getElementById("progress-fill").style.width = `${szazalek}%`;

        // Pontszám frissítése
        document.getElementById("szerzett-pont").innerText = szerzettPont;
        document.getElementById("max-pont").innerText = aktualisMaxPont;

        // Várható jegy becslése (százalékos ponthatárok: 40-55-70-85%)
        const pontSzazalek = aktualisMaxPont ? (szerzettPont / aktualisMaxPont) * 100 : 0;
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
    const sorsolt = [...keverKvizTomb(alapok).slice(0, alapDb), ...keverKvizTomb(haladok).slice(0, haladoDb)];
    // Ha valamelyik szintből nem volt elég kérdés, a hiányzó helyeket a kimaradt kérdésekből
    // (a szint nélkülieket is beleértve) töltjük fel, hogy mindig 'darab' kérdés legyen.
    if (sorsolt.length < darab) {
      const maradek = keverKvizTomb(kerdesBank.filter(k => !sorsolt.includes(k)));
      sorsolt.push(...maradek.slice(0, darab - sorsolt.length));
    }
    aktualisKvizKerdesek = keverKvizTomb(sorsolt);
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
      // Kis- és nagybetű, valamint a felesleges szóközök nem számítanak – mindkét oldalon
      const normal = s => String(s).trim().toLowerCase().replace(/\s+/g, " ");
      const beirt = normal(document.getElementById(`q_${index}_input`).value);
      if (k.elfogadott.some(e => normal(e) === beirt)) jo = true;
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
    visszajelzes.innerHTML = (jo ? "✔️ <b>helyes!</b> " : "❌ <b>hibás vagy hiányos!</b> ") + (k.magyarazat || "");
  });

  if (aktualisKvizKerdesek.length === 0) return;
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
