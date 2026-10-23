# Uppdrag 1700 – version 1.1.0

23 oktober 2026. Gemensam ingång: `/uppdrag-1700/spel/`.
Direkt lärarförhandsvisning av kapitel 6: `?teacher=1&chapter=6&v=1.1.0`.

## Spelbart innehåll

Kapitel 1–6 använder samma värld, 22 miljöer och den omarbetade frågemotorn. Kapitel 6 tillför 36 uppgifter och 12 arbetsbesök till de tidigare 78 uppgifterna. Brevet kommer fram genom jämförelse av bykartor; en färdigtryckt sida behöver sedan lämnas till Maja. Kapitel 7–10 återstår. Läs `CHAPTER6.md` för källunderlag och genomförda kontroller samt `ROADMAP.md` för fortsättningen.

Normal spelgång kräver avslutat föregående kapitel och tillåter återbesök. Lärarvyn ger fria kapitel- och rumsgenvägar med egen sparning. Den är inte en säker lärarinloggning.

## Sparning

Samma prefix som version 1.0: `uppdrag1700.integrated.20261023.v1.` med skilda `play.` och `teacher.`. Kapitel 6 får en egen nyckel; daler och äpplen förs vidare från avslutat kapitel 5. Tidigare kapitel, äldre separata spel och frågetestets sparningar nollställs inte. Menyn kan exportera/importera en kopia. Vid blockerad lagring används minne tills sidan stängs. Inga elevsvar skickas till servern.

## Återanvända källfiler

`base/` är det frysta trädet `f81cf7fd17174b293f54f68598c07d78c1b61ea4`. De fyra delta-filerna, originalgrafiken och frågesnapshoten från sammanfogningen 1.0 är oförändrade. `decode_sources.py` skriver ut granskningsbara källfiler. Frågerättning 3.1 behålls för kapitel 1–5; kapitel 6 lägger till egna fältvisa kriterier. `chapter6-build.js` återanvänder befintliga kontroller och stoppar om dess källkodsankare inte matchar.

## Kontroller

Se `CHAPTER6.md`. Kör rättningstester lokalt med:

```sh
python decode_sources.py
node tests/chapter6.cjs
```

Testerna är inte en garanti för varje elevformulering. Webbläsarkontroller har gjorts lokalt med simulerad filhämtning, sparning och navigering, inte på fysisk mobil eller genom den publicerade webbadressen. Regelbaserad rättning kan fortfarande behöva lärargranskning. Spelet är träning, inte ett betygsunderlag.
