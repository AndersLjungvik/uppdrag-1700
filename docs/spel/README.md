# Uppdrag 1700 – version 1.1.0

26 oktober 2026. Gemensam ingång: `/uppdrag-1700/spel/`.
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


## Speljustering 1.2

Tryckpressen i Tryckeriet är nedskalad och står längre bak mot väggen i både smal och bred vy. Kapitel 6 har två sparade gatuhändelser som kan inträffa under verklig förflyttning: en ficktjuv/äppeltjuv försöker ta högst en resurs och spelaren kan välja att jaga. Jakten använder en enda kort repetitionsfråga från redan spelade kapitel; den räknas inte som mastery och fel svar blockerar aldrig progressionen. I lärarvyn triggas händelserna inte automatiskt, men kan testas via ”Brevet & stadens bok”.

Mästarfrågorna om skiftet accepterar fler rimliga beskrivningar. Om den regelbaserade kontrollen ändå inte känner igen ett rimligt kapitel-6-svar kan eleven välja ”Spara svaret och gå vidare”. Svaret markeras då som väntande lärargranskning och ger inte självständig mästarstatus, men eleven fastnar inte i en loop.


## Korrigering 1.2.2 · 26 oktober 2026

Den faktiska rumsrenderaren `interior-ch1-pilot.js` får nu pressjusteringen (föregående 1.2 riktade sig mot en annan grafikfil). Handpressen har mindre skala och står med fötterna nära väggens golvlinje i både bred och smal vy.

En tidigare korrekt men stödd mästarförklaring kan inte längre hålla kvar kapitel 6 i en upprepningsloop. Svaret förblir markerat `independent:false` och ger alltså inte självständig mästarprestation. Osäkra egna formuleringar kan fortsatt sparas för granskning och ge progression utan att överbedömas. Svar och kapitelöppningar för 1–5 ändras inte.

Test: `node tests/room-master-regression.cjs` efter `python decode_sources.py`. Dessutom kontrollerades Byn i Chromium med korrekt stödd mästartext och återgång till nästa arbetsbesök, samt pressens placering i 1280 px och 390 px vyer lokalt. Publicerad iPhone/Safari måste fortfarande användarprovas.


## Återställd stadsvärld 1.2.3 · 26 oktober 2026

Kapitel 6 använder nu exakt samma godkända bostadskvarter och vägnät som kapitel 1–5. I den tidigare källan hade den gemensamma kartläggningen ett kapitelvillkor för bara 1–5, så kapitel 6 visade äldre huskoordinater.

Hagen med tre får och två kor ligger nu mellan Byn och Herrgården (världskoordinater ungefär x=3160–3430, y=440–610), mellan herrgårdsvägen y=355 och byvägen y=705. Samma betesrörelser används, liksom samma pappersgrafik. Den gemensamma placeringen används i kapitel 1–6. Frågor, uppdragslogik, tryckpress och sparnycklar är oförändrade.

Lokal Chromium-kontroll av kapitel 5 och 6: samma koordinater för Bostadskvarteren, identiskt vägnät (roads-1), nåbara vägar till bostadskvarter, by och herrgård samt synliga och rörliga betesdjur i bred- och mobilvy. Automatisk regressionskontroll: `node docs/spel/tests/world-layout.cjs` efter `python docs/spel/decode_sources.py`. Den publicerade Safari-versionen har inte testats på en fysisk mobil.
