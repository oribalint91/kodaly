document.addEventListener("DOMContentLoaded", function(){
    const kattinthatoSzo = document.getElementById("word_helyesiras_szerkeszto_toggle");
    const kep = document.getElementById("word_helyesiras_szerkeszto")

    kattinthatoSzo.addEventListener("click", function() {
        if (kep.style.display == "none") {
            kep.style.display = "block";
        } else {
            kep.style.display = "none";
        }
    });
}
)