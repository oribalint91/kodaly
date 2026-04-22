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

                modalTartalom.appendChild(ujKep);

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
                        { title: "1. Alapismeretek", file: "Python_9ny_01_alapok.html" },
                        { title: "2. Elágazások (if-else)", file: "Python_9ny_02_alapok_II.html" },
                        { title: "3. Összetett adattípusok", file: "Python_9ny_03_osszetett_adattipusok.html" },
                        { title: "4. A for ciklus", file: "Python_9ny_04_for_ciklus.html" },
                        { title: "5. A while ciklus", file: "Python_9ny_05_while_ciklus.html" },
                        { title: "Az eddig tanultak átismétlése", file: "Python_9_ismetles.html" },
                        { title: "6. Kivételkezelés (try-except)", file: "Python_9_06_try_except.html" },
                        { title: "7. Függvények (def)", file: "Python_9_07_eljarasok_fuggvenyek.html" },
                        { title: "8. Modulok (random, math)", file: "Python_9_08_modulok.html" },
                        { title: "9. Teknőcgrafika (Turtle)", file: "Python_9_09_teknocgrafika.html" },
                        { title: "Az eddig tanultak átismétlése", file: "Python_10_ismetles.html" }
                        ]
                },
                {
                    name: "Szövegszerkesztés",
                    items: [
                        {title: "Word alapok", file: "word_07_01_A_szamitogep_tortenete.html"},
                        {title: "Tabulátorok", file: "word_07_02_filmklub.html"}
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
                        // {title: "1. Atomok", file: "kemia_01.html"}
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