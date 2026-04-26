# ha csak egy sort szeretnél kommentbe tenni, akkor használd a hashtaget
print(str(list(i for i in range(20) if i%2 == 0))) # ha magyarázni szeretnél egy sort, a kód után is tehetsz hashtaget
'''ha több dolgot szeretnél kifejteni, hosszabban, akkor használd a három aposztrófot
(vagy használhatsz három idézőjelet is, de az aposztrófos megoldás biztosabb)
Érdemes megjegyezni ezt a módszert, mert lesz később is jelentősége!'''
l = list(i for i in range(5))
print(len(l), l)

for i in range(100, -1, -2):
    print(i)

idojaras = "napos"
T = 5
ido = 10

if idojaras == "napos":
    if T > 18:
        if ido > 8 and ido < 18:
            print("Remek kirándulóidő van, irány a természet!")
print("Mindig készülj megfelelő öltözettel!")

print(25**0.5)

jelszo = input("Mondd a jelszót, hogy beléphess a titkos ajtón: ")

if jelszo == "Mellon":
    print("Az ajtó kinyílik. Üdvözöllek, barátom!")
else:
    print("Helytelen jelszó! Az ajtó zárva marad.")

kivansagok = ["örök élet", "rengeteg pénz", "nyugodt élet", "akciós kenyér", "örök boldogság"]

print(kivansagok[-1])
print(f"egy ember {6+7} éves")