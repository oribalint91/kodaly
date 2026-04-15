document.addEventListener("DOMContentLoaded", function(){

    generateNavbar();
    
    const modal = document.getElementById("kep-modal");
    const modalKep = document.getElementById("modal-benne-levo-kep");
    const bezaroGomb = document.querySelector(".modal-bezaras");

    const kattinthatoSzavak = document.querySelectorAll(".ia");
    
    kattinthatoSzavak.forEach(function(szo) {
        szo.addEventListener("click", function() {
            const tipus = this.getAttribute("data-tipus");
            const celId = this.getAttribute("data-target");
            const celElem = document.getElementById(celId);

            if (!celElem) return; // pontosvessző pótolva

            if (tipus == "toggle") {
                const osszesRejtett = document.querySelectorAll(".rejtett-kep");
                if (!celElem.classList.contains("lathato")) {
                    osszesRejtett.forEach(elem => elem.classList.remove("lathato"));
                }
                celElem.classList.toggle("lathato"); 
            }
            else if (tipus == "modal") {
                modalKep.src = celElem.src;
                modal.classList.add("lathato");
                bezaroGomb.classList.add("lathato");
            }
        });
    });

    //modal bezárása
    if (modal && modalKep && bezaroGomb) {
        bezaroGomb.addEventListener("click", function(event){
            modal.classList.remove("lathato");
            setTimeout(() => modalKep.classList.remove("nagyitott"), 300);
        });
        
        window.addEventListener("click", function(e) {
            if (e.target === modal) {
                modal.classList.remove("lathato");
                // Itt window helyett simán a setTimeout-ot érdemes hívni
                setTimeout(() => modalKep.classList.remove("nagyitott"), 300);
            }
        });
        
        window.addEventListener("keydown", function(e) {
            if (e.key === "Escape") {
                modal.classList.remove("lathato");
                setTimeout(() => modalKep.classList.remove("nagyitott"), 300);
            }
        });

        modalKep.addEventListener("click", function(e) {
            e.stopPropagation();
            this.classList.toggle("nagyitott");
        });
    }
    // --- DARK MODE VÁLTÁS ---
    
    let toggleBtn = document.getElementById('theme-toggle');
    const body = document.body;

    // Megpróbáljuk betölteni az elmentett beállítást (ha engedi a böngésző)
    if (!toggleBtn) {
        toggleBtn = document.createElement('button');
        toggleBtn.id = 'theme-toggle';
        toggleBtn.title = 'Sötét/Világos mód';
        toggleBtn.innerHTML = '🌙';
        body.appendChild(toggleBtn);
    }
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

// navbar generálás kódja
function generateNavbar() {
    const pathname = window.location.pathname;

    const isIndex = pathname.endsWith("index.html") || pathname.endsWith("/");

    const pathToIndex = isIndex ? "index.html" : "../index.html";
    const pathToInfo = isIndex ? "info/" : "";

    const lessons = [
        {
            title: "💻 Digitális kultúra",
            items: [
            { title: "1. Alapismeretek", file: "Python_9ny_01_alapok.html" },
            { title: "2. Elágazások (if-else)", file: "Python_9ny_02_alapok_II.html" },
            { title: "3. Összetett adattípusok", file: "Python_9ny_03_osszetett_adattipusok.html" },
            { title: "4. A for ciklus", file: "Python_9ny_04_for_ciklus.html" }//,
            // { title: "5. A while ciklus", file: "Python_9ny_05_while_ciklus.html" },
            // { title: "6. Kivételkezelés (try-except)", file: "Python_9ny_06_kivetelkezeles.html" }
            ]
        },
        {
            title: "🧪 Kémia",
            items: [

            ]
        },
        {
            title: "🌹 Biológia",
            items: [

            ]
        }
    ];

    let navItemsHTML = "";
    lessons.forEach(subject => {
        if (subject.items.length > 0) {
            let dropdownLinks = "";
            subject.items.forEach(l => {
                    const fullPath = pathToInfo + l.file;
                    const isActive = pathname.includes(l.file) ? "active" : "";
                    dropdownLinks += `<a href="${fullPath}" class="${isActive}">${l.title}</a>`
                });
                navItemsHTML += `
                <li class="nav-item dropdown">
                    <a href="#" class = "nav-link">${subject.title} ▼</a>
                    <div class="dropdown-content">
                        ${dropdownLinks}
                    </div>
                </li>`;
            }
        });
        
    const navHTML = `
    <nav class="top-nav">
        <ul class="nav-list">
            <li class="nav-item">
                <a href="${pathToIndex}" class="nav-link">🏠 Kezdőlap</a>
            </li>
            ${navItemsHTML}
        </ul>
    </nav>`;

    document.body.insertAdjacentHTML('afterbegin', navHTML);

    const oldBackBtn = document.querySelector('.back');
    if (oldBackBtn) oldBackBtn.remove();
}