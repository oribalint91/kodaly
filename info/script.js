document.addEventListener("DOMContentLoaded", function(){
    
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
    }); // Pontosvessző pótolva

    // --- DARK MODE VÁLTÁS ---
    
    const toggleBtn = document.getElementById('theme-toggle');
    const body = document.body;

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