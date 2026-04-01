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

            if (!celElem) return //ha nincs meg a cél, akkor nem fut

            if (tipus == "toggle") {
                const osszesRejtett = document.querySelectorAll(".rejtett-kep");
                if (!celElem.classList.contains("lathato")) {
                    osszesRejtett.forEach(elem => elem.classList.remove("lathato")); // becsukja, ha másik nyitva volt
                }
                celElem.classList.toggle("lathato"); //a javaslatban "megjelenik" volt a class, de én "lathato"t használok
            }
            else if (tipus == "modal") {
                modalKep.src = celElem.src;
                //modal.style.display = "block";
                modal.classList.add("lathato");
            }
        });
    });

    //modal bezárása
    bezaroGomb.addEventListener("click", function(event){
        //modal.style.display = "none";
        modal.classList.remove("lathato");
    });
    window.addEventListener("click", function(e) {
        if (e.target === modal) {
            //modal.style.display = "none";
            modal.classList.remove("lathato");

        }
    });
    window.addEventListener("keydown", function(e) {
        if (e.key === "Escape") {
            //modal.style.display = "none";
            modal.classList.remove("lathato");
        }
    });
    
});