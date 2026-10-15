'use strict';
window.CURRICULUM={
  "version": 3,
  "bankId": "kapitel1700-2026-10-v3",
  "title": "Uppdrag 1700",
  "scope": "Kapitlet 1700-talets Sverige, grundbok s. 62–105, arbetsbok s. 24–39 och lärarguide s. 34–49.",
  "missions": [
    {
      "id": "press",
      "title": "Ord som förändrar",
      "npc": "Boktryckaren Brita",
      "location": "Tryckeriet",
      "symbol": "▤",
      "period": "1719–1809",
      "story": "Jag behöver din hjälp med ord som förändrar.",
      "bookReference": "Grundboken s. 75–77 och 103. Arbetsboken uppgift 11–12 och 31.",
      "notes": [
        "År 1766 fick Sverige en tryckfrihetsförordning.",
        "Censur innebär att texter granskas och kan förbjudas.",
        "Offentlighetsprincipen ger insyn. Vissa uppgifter kan vara hemliga.",
        "Tryckfriheten har haft begränsningar och har förändrats över tid.",
        "Kyrkan ville att barn skulle kunna läsa religiösa texter.",
        "Katekesen användes för att undervisa om kristendomen.",
        "Cajsa Wargs kokbok blev mycket spridd.",
        "Brev, tidningar, bilder och protokoll kan användas som historiska källor."
      ],
      "cards": [
        {
          "id": "press-year",
          "type": "short",
          "question": "Vilket år fick Sverige sin första tryckfrihetsförordning?",
          "answer": "1766",
          "accept": [
            "1766"
          ],
          "explanation": "År 1766 fick Sverige en tryckfrihetsförordning.",
          "chapter": 1,
          "simpleQuestion": "Vilket år infördes tryckfrihet i Sverige?"
        },
        {
          "id": "press-censor",
          "type": "short",
          "question": "Vad kallas granskning som kan stoppa en text innan den trycks?",
          "answer": "Censur",
          "accept": [
            "Censur",
            "censurering"
          ],
          "explanation": "Censur innebär att texter granskas och kan förbjudas.",
          "chapter": 1,
          "simpleQuestion": "Vad kallas det när texter granskas och kan stoppas före tryckning?"
        },
        {
          "id": "press-open",
          "type": "short",
          "question": "Vilken princip ger rätt att läsa många av myndigheternas handlingar?",
          "answer": "Offentlighetsprincipen",
          "accept": [
            "Offentlighetsprincipen",
            "offentlighetsprincip"
          ],
          "explanation": "Offentlighetsprincipen ger insyn. Vissa uppgifter kan vara hemliga.",
          "chapter": 1,
          "simpleQuestion": "Vad kallas rätten att läsa många av myndigheternas papper och beslut?"
        },
        {
          "id": "press-freedom",
          "type": "short",
          "question": "Vad kallas friheten att skriva och sprida tryckta texter?",
          "answer": "Tryckfrihet",
          "accept": [
            "Tryckfrihet"
          ],
          "explanation": "Tryckfriheten har haft begränsningar och har förändrats över tid.",
          "chapter": 1,
          "simpleQuestion": "Vad kallas friheten att skriva och sprida tryckta texter?"
        },
        {
          "id": "press-reading",
          "type": "short",
          "question": "Vilken institution krävde att barn skulle lära sig läsa under stormaktstiden?",
          "answer": "Kyrkan",
          "accept": [
            "Kyrkan",
            "svenska kyrkan"
          ],
          "explanation": "Kyrkan ville att barn skulle kunna läsa religiösa texter.",
          "chapter": 1,
          "simpleQuestion": "Vilken institution ville att barn skulle lära sig läsa kristna texter?"
        },
        {
          "id": "press-catechism",
          "type": "short",
          "question": "Vad hette boken som lärde ut grunderna i kristendomen?",
          "answer": "Katekesen",
          "accept": [
            "Katekesen",
            "katekes"
          ],
          "explanation": "Katekesen användes för att undervisa om kristendomen.",
          "chapter": 1,
          "simpleQuestion": "Vad hette boken som lärde ut grunderna i kristendomen?"
        },
        {
          "id": "press-warg",
          "type": "short",
          "question": "Vilken kvinna skrev en känd kokbok på 1700-talet?",
          "answer": "Cajsa Warg",
          "accept": [
            "Cajsa Warg",
            "cajsa",
            "kajsa warg",
            "warg"
          ],
          "explanation": "Cajsa Wargs kokbok blev mycket spridd.",
          "chapter": 1,
          "simpleQuestion": "Vilken kvinna skrev en känd kokbok på 1700-talet?"
        },
        {
          "id": "press-sources",
          "type": "short",
          "question": "Vad kallas material som berättar om det förflutna, till exempel brev och protokoll?",
          "answer": "Historiska källor",
          "accept": [
            "Historiska källor",
            "källor",
            "historiska källor"
          ],
          "explanation": "Brev, tidningar, bilder och protokoll kan användas som historiska källor.",
          "chapter": 1,
          "simpleQuestion": "Vad kallas material som berättar om det förflutna, till exempel brev och protokoll?"
        },
        {
          "id": "press-reason-1",
          "type": "chain",
          "stage": "journey",
          "question": "Bygg en förklaring till varför läsning kunde förändra samhället.",
          "steps": [
            {
              "answer": "fler kunde läsa själva",
              "options": [
                "fler kunde läsa själva",
                "alla slutade läsa",
                "kungen förbjöd all läsning"
              ],
              "connector": "Eftersom"
            },
            {
              "answer": "jämföra texter med det prästerna sa",
              "options": [
                "jämföra texter med det prästerna sa",
                "bevisa att varje text var sann",
                "sluta tänka själva"
              ],
              "connector": "kunde de"
            },
            {
              "answer": "makthavarnas påståenden ifrågasättas",
              "options": [
                "makthavarnas påståenden ifrågasättas",
                "alla rösta i riksdagen",
                "kyrkan bestämma mer automatiskt"
              ],
              "connector": "Därför kunde"
            }
          ],
          "requires": [
            "press-year",
            "press-censor",
            "press-open",
            "press-freedom",
            "press-reading",
            "press-catechism",
            "press-warg",
            "press-sources"
          ],
          "explanation": "Att kunna läsa gav möjligheter att pröva påståenden. Det gav inte alla politisk makt.",
          "chapter": 1,
          "simpleQuestion": "Bygg en förklaring till varför läsning kunde förändra samhället."
        },
        {
          "id": "press-reason-2",
          "type": "chain",
          "stage": "journey",
          "question": "Bygg sambandet mellan insyn och granskning.",
          "steps": [
            {
              "answer": "människor fick läsa många myndighetshandlingar",
              "options": [
                "människor fick läsa många myndighetshandlingar",
                "alla dokument blev hemliga",
                "bara kungen fick läsa"
              ],
              "connector": "Eftersom"
            },
            {
              "answer": "beslut och missförhållanden granskas",
              "options": [
                "beslut och missförhållanden granskas",
                "alla hemligheter alltid avslöjas",
                "alla makthavare bli felfria"
              ],
              "connector": "kunde"
            },
            {
              "answer": "att makthavare kritiserades",
              "options": [
                "att makthavare kritiserades",
                "att riksdagen försvann",
                "att alla lagar slutade gälla"
              ],
              "connector": "vilket kunde leda till"
            }
          ],
          "requires": [
            "press-year",
            "press-censor",
            "press-open",
            "press-freedom",
            "press-reading",
            "press-catechism",
            "press-warg",
            "press-sources"
          ],
          "explanation": "Insyn gör granskning möjlig, men hindrar inte automatiskt alla fel.",
          "chapter": 1,
          "simpleQuestion": "Bygg sambandet mellan insyn och granskning."
        },
        {
          "id": "press-reason-3",
          "type": "chain",
          "stage": "master",
          "question": "En skrivare säger: ”Alla tryckta texter från 1766 berättar hela sanningen.” Bygg ett källkritiskt svar.",
          "steps": [
            {
              "answer": "en text är från den tid vi undersöker",
              "options": [
                "en text är från den tid vi undersöker",
                "en text är gammal måste den vara falsk",
                "tryckta texter saknar avsändare"
              ],
              "connector": "Även om"
            },
            {
              "answer": "undersöka vem som skrev och varför",
              "options": [
                "undersöka vem som skrev och varför",
                "tro på varje uppgift",
                "bara titta på typsnittet"
              ],
              "connector": "behöver vi"
            },
            {
              "answer": "författarens syfte påverkar vad som berättas",
              "options": [
                "författarens syfte påverkar vad som berättas",
                "ett datum gör innehållet helt neutralt",
                "alla vittnen minns likadant"
              ],
              "connector": "eftersom"
            }
          ],
          "requires": [
            "press-year",
            "press-censor",
            "press-open",
            "press-freedom",
            "press-reading",
            "press-catechism",
            "press-warg",
            "press-sources"
          ],
          "explanation": "En samtida källa är värdefull men måste tolkas. Jämför gärna flera källor.",
          "chapter": 1,
          "simpleQuestion": "En skrivare säger: ”Alla tryckta texter från 1766 berättar hela sanningen.” Bygg ett källkritiskt svar."
        }
      ]
    },
    {
      "id": "power",
      "title": "Makt och motstånd",
      "npc": "Skrivaren Elias",
      "location": "Riksdagshuset",
      "symbol": "♜",
      "period": "1719–1809",
      "story": "Jag behöver din hjälp med makt och motstånd.",
      "bookReference": "Grundboken s. 64–65 och 70–74. Arbetsboken uppgift 1–4 och 8–10.",
      "notes": [
        "Kungens envälde avskaffades, men friheten var olika för olika grupper.",
        "Riksdagen och riksrådet fick större makt när kungens makt minskade.",
        "Riksrådet fungerade ungefär som en regering.",
        "Grundlagen innehöll regler för hur makten skulle delas.",
        "Hattarna ville starta krig mot Ryssland. Mössorna var deras motståndare.",
        "Ulrika Eleonora följde Karl XII. Hennes make blev sedan Fredrik I.",
        "Bönder protesterade mot kriget och valet av ny kung. Upproret slogs ned.",
        "Rysslands tsarinna stödde Adolf Fredrik som svensk tronföljare."
      ],
      "cards": [
        {
          "id": "power-era",
          "type": "short",
          "question": "Vad kallas perioden i Sverige mellan 1719 och 1772?",
          "answer": "Frihetstiden",
          "accept": [
            "Frihetstiden",
            "frihetstid"
          ],
          "explanation": "Kungens envälde avskaffades, men friheten var olika för olika grupper.",
          "chapter": 1,
          "simpleQuestion": "Vad kallas perioden i Sverige mellan 1719 och 1772?"
        },
        {
          "id": "power-parliament",
          "type": "short",
          "question": "Vilken församling fick större makt under frihetstiden?",
          "answer": "Riksdagen",
          "accept": [
            "Riksdagen",
            "ståndsriksdagen"
          ],
          "explanation": "Riksdagen och riksrådet fick större makt när kungens makt minskade.",
          "chapter": 1,
          "simpleQuestion": "Vilken församling fick större makt under frihetstiden?"
        },
        {
          "id": "power-council",
          "type": "short",
          "question": "Vad kallades frihetstidens motsvarighet till regering?",
          "answer": "Riksrådet",
          "accept": [
            "Riksrådet",
            "riksråd"
          ],
          "explanation": "Riksrådet fungerade ungefär som en regering.",
          "chapter": 1,
          "simpleQuestion": "Vad hette den grupp som var som en regering under frihetstiden?"
        },
        {
          "id": "power-law",
          "type": "short",
          "question": "Vad kallas en särskilt viktig lag om hur ett land ska styras?",
          "answer": "Grundlag",
          "accept": [
            "Grundlag",
            "grundlagen"
          ],
          "explanation": "Grundlagen innehöll regler för hur makten skulle delas.",
          "chapter": 1,
          "simpleQuestion": "Vad kallas en extra viktig lag om hur landet ska styras?"
        },
        {
          "id": "power-parties",
          "type": "short",
          "question": "Vilka två politiska grupper konkurrerade under frihetstiden?",
          "answer": "Hattar och mössor",
          "accept": [
            "Hattar och mössor",
            "hattarna och mössorna",
            "mössor och hattar",
            "mössorna och hattarna"
          ],
          "explanation": "Hattarna ville starta krig mot Ryssland. Mössorna var deras motståndare.",
          "chapter": 1,
          "simpleQuestion": "Vilka två politiska grupper konkurrerade under frihetstiden?"
        },
        {
          "id": "power-estates",
          "type": "short",
          "question": "Vilket stånd bestod bland annat av städernas köpmän och hantverkare?",
          "answer": "Borgare",
          "accept": [
            "borgare",
            "borgarna",
            "borgarståndet"
          ],
          "explanation": "Borgare var ett av riksdagens fyra stånd. Där fanns bland annat köpmän och hantverkare.",
          "chapter": 1,
          "simpleQuestion": "Vilket stånd tillhörde köpmän och hantverkare i städerna?"
        },
        {
          "id": "power-rebellion",
          "type": "short",
          "question": "Vad kallas böndernas uppror och marsch till Stockholm 1743?",
          "answer": "Stora daldansen",
          "accept": [
            "Stora daldansen",
            "daldansen"
          ],
          "explanation": "Bönder protesterade mot kriget och valet av ny kung. Upproret slogs ned.",
          "chapter": 1,
          "simpleQuestion": "Vad kallas böndernas uppror i Stockholm år 1743?"
        },
        {
          "id": "power-four-estates",
          "type": "short",
          "question": "Vilka fyra stånd var representerade i riksdagen?",
          "answer": "Adel, präster, borgare och bönder",
          "accept": [
            "adel präster borgare bönder",
            "adel präster borgare och bönder",
            "adel präster bönder borgare",
            "adel präster bönder och borgare",
            "adel borgare präster bönder",
            "adel borgare präster och bönder",
            "adel borgare bönder präster",
            "adel borgare bönder och präster",
            "adel bönder präster borgare",
            "adel bönder präster och borgare",
            "adel bönder borgare präster",
            "adel bönder borgare och präster",
            "präster adel borgare bönder",
            "präster adel borgare och bönder",
            "präster adel bönder borgare",
            "präster adel bönder och borgare",
            "präster borgare adel bönder",
            "präster borgare adel och bönder",
            "präster borgare bönder adel",
            "präster borgare bönder och adel",
            "präster bönder adel borgare",
            "präster bönder adel och borgare",
            "präster bönder borgare adel",
            "präster bönder borgare och adel",
            "borgare adel präster bönder",
            "borgare adel präster och bönder",
            "borgare adel bönder präster",
            "borgare adel bönder och präster",
            "borgare präster adel bönder",
            "borgare präster adel och bönder",
            "borgare präster bönder adel",
            "borgare präster bönder och adel",
            "borgare bönder adel präster",
            "borgare bönder adel och präster",
            "borgare bönder präster adel",
            "borgare bönder präster och adel",
            "bönder adel präster borgare",
            "bönder adel präster och borgare",
            "bönder adel borgare präster",
            "bönder adel borgare och präster",
            "bönder präster adel borgare",
            "bönder präster adel och borgare",
            "bönder präster borgare adel",
            "bönder präster borgare och adel",
            "bönder borgare adel präster",
            "bönder borgare adel och präster",
            "bönder borgare präster adel",
            "bönder borgare präster och adel"
          ],
          "explanation": "De fyra stånden var adel, präster, borgare och bönder. Alla invånare fick ändå inte vara med och bestämma.",
          "chapter": 1,
          "simpleQuestion": "Vilka fyra stånd fanns i riksdagen? Skriv alla fyra."
        },
        {
          "id": "power-reason-1",
          "type": "chain",
          "stage": "journey",
          "question": "Förklara varför frihetstid inte betydde lika frihet för alla.",
          "steps": [
            {
              "answer": "kungens makt begränsades",
              "options": [
                "kungens makt begränsades",
                "alla fick lika rösträtt",
                "riksdagen avskaffades"
              ],
              "connector": "Eftersom"
            },
            {
              "answer": "riksdagen och riksrådet större inflytande",
              "options": [
                "riksdagen och riksrådet större inflytande",
                "alla barn samma inflytande som adeln",
                "bönderna ensam makt"
              ],
              "connector": "fick"
            },
            {
              "answer": "många människor saknade politiskt inflytande",
              "options": [
                "många människor saknade politiskt inflytande",
                "alla kunde välja regeringen",
                "kvinnor och barn fick rösta"
              ],
              "connector": "men"
            }
          ],
          "requires": [
            "power-era",
            "power-parliament",
            "power-council",
            "power-law",
            "power-parties",
            "power-estates",
            "power-rebellion",
            "power-four-estates"
          ],
          "explanation": "Det förändrade styret innebar inte modern demokrati.",
          "chapter": 1,
          "simpleQuestion": "Förklara varför frihetstid inte betydde lika frihet för alla."
        },
        {
          "id": "power-reason-2",
          "type": "chain",
          "stage": "journey",
          "question": "Förklara böndernas protest 1743.",
          "steps": [
            {
              "answer": "kriget misslyckades och kungavalet väckte ilska",
              "options": [
                "kriget misslyckades och kungavalet väckte ilska",
                "skatterna försvann",
                "bönderna hade beslutat om kriget själva"
              ],
              "connector": "Eftersom"
            },
            {
              "answer": "bönder mot Stockholm",
              "options": [
                "bönder mot Stockholm",
                "alla bönder till Ryssland",
                "riksdagen till Dalarna"
              ],
              "connector": "marscherade"
            },
            {
              "answer": "militären slog ned upproret",
              "options": [
                "militären slog ned upproret",
                "bönderna fick all makt",
                "alla krav genomfördes fredligt"
              ],
              "connector": "men"
            }
          ],
          "requires": [
            "power-era",
            "power-parliament",
            "power-council",
            "power-law",
            "power-parties",
            "power-estates",
            "power-rebellion",
            "power-four-estates"
          ],
          "explanation": "Protesten handlade både om kriget och om vem som skulle bli kung.",
          "chapter": 1,
          "simpleQuestion": "Förklara böndernas protest 1743."
        },
        {
          "id": "power-reason-3",
          "type": "chain",
          "stage": "master",
          "question": "En berättare säger: ”Kungen bestämde mindre, alltså bestämde alla lika mycket.” Bygg en invändning.",
          "steps": [
            {
              "answer": "hade kungen mindre makt under frihetstiden",
              "options": [
                "hade kungen mindre makt under frihetstiden",
                "styrde kungen ensam under hela frihetstiden",
                "var riksdagen avskaffad"
              ],
              "connector": "Visserligen"
            },
            {
              "answer": "adeln hade fortfarande stort inflytande",
              "options": [
                "adeln hade fortfarande stort inflytande",
                "alla invånare hade lika många röster",
                "barn valde riksrådet"
              ],
              "connector": "men"
            },
            {
              "answer": "måste vi fråga vilka grupper som faktiskt fick makt",
              "options": [
                "måste vi fråga vilka grupper som faktiskt fick makt",
                "bevisar ordet frihet att alla var jämlika",
                "saknar maktfördelning betydelse"
              ],
              "connector": "Därför"
            }
          ],
          "requires": [
            "power-era",
            "power-parliament",
            "power-council",
            "power-law",
            "power-parties",
            "power-estates",
            "power-rebellion",
            "power-four-estates"
          ],
          "explanation": "Undersök hur makten fördelades mellan grupper, inte bara mellan kung och riksdag.",
          "chapter": 1,
          "simpleQuestion": "En berättare säger: ”Kungen bestämde mindre, alltså bestämde alla lika mycket.” Bygg en invändning."
        }
      ]
    },
    {
      "id": "nature",
      "title": "Vetenskap att granska",
      "npc": "Trädgårdslärlingen Sam",
      "location": "Trädgården",
      "symbol": "❧",
      "period": "1719–1809",
      "story": "Jag behöver din hjälp med vetenskap att granska.",
      "bookReference": "Grundboken s. 78–80. Arbetsboken uppgift 13–15.",
      "notes": [
        "Linnés system för att namnge arter används internationellt.",
        "Gemensamma latinska namn gjorde det lättare att dela kunskap.",
        "Anders Celsius undersökte bland annat vatten och temperatur.",
        "Scheele arbetade som apotekare och forskade i kemi.",
        "Syre är en gas i luften. Scheele bidrog till kunskapen om den.",
        "Eva Ekeblad undersökte hur potatis kunde användas.",
        "Ekeblad visade bland annat hur mjöl kunde göras av potatis.",
        "Akademien samlade och spred forskning, men möjligheterna att delta var ojämna."
      ],
      "cards": [
        {
          "id": "nature-linne",
          "type": "short",
          "question": "Vem ordnade och gav vetenskapliga namn åt växter och djur?",
          "answer": "Carl von Linné",
          "accept": [
            "Carl von Linné",
            "linné",
            "carl linnaeus",
            "linnaeus"
          ],
          "explanation": "Linnés system för att namnge arter används internationellt.",
          "chapter": 1,
          "simpleQuestion": "Vem ordnade växter och djur i grupper och gav dem vetenskapliga namn?"
        },
        {
          "id": "nature-language",
          "type": "short",
          "question": "Vilket språk använde Linné när han gav växter och djur namn?",
          "answer": "Latin",
          "accept": [
            "Latin",
            "latinska"
          ],
          "explanation": "Gemensamma latinska namn gjorde det lättare att dela kunskap.",
          "chapter": 1,
          "simpleQuestion": "Vilket språk använde Linné när han gav växter och djur namn?"
        },
        {
          "id": "nature-celsius",
          "type": "short",
          "question": "Vem förknippas med temperaturskalan Celsius?",
          "answer": "Anders Celsius",
          "accept": [
            "Anders Celsius",
            "celsius"
          ],
          "explanation": "Anders Celsius undersökte bland annat vatten och temperatur.",
          "chapter": 1,
          "simpleQuestion": "Vem förknippas med temperaturskalan Celsius?"
        },
        {
          "id": "nature-scheele",
          "type": "short",
          "question": "Vilken svensk apotekare upptäckte bland annat syre?",
          "answer": "Carl Wilhelm Scheele",
          "accept": [
            "Carl Wilhelm Scheele",
            "scheele",
            "carl vilhelm scheele"
          ],
          "explanation": "Scheele arbetade som apotekare och forskade i kemi.",
          "chapter": 1,
          "simpleQuestion": "Vilken apotekare upptäckte bland annat syre?"
        },
        {
          "id": "nature-oxygen",
          "type": "short",
          "question": "Vilken gas i luften upptäckte bland andra Scheele?",
          "answer": "Syre",
          "accept": [
            "Syre",
            "syrgas",
            "oxygen"
          ],
          "explanation": "Syre är en gas i luften. Scheele bidrog till kunskapen om den.",
          "chapter": 1,
          "simpleQuestion": "Vilken gas i luften upptäckte bland andra Scheele?"
        },
        {
          "id": "nature-ekeblad",
          "type": "short",
          "question": "Vem blev den första kvinnan i Kungliga Vetenskapsakademien?",
          "answer": "Eva Ekeblad",
          "accept": [
            "Eva Ekeblad",
            "ekeblad",
            "eva de la gardie"
          ],
          "explanation": "Eva Ekeblad undersökte hur potatis kunde användas.",
          "chapter": 1,
          "simpleQuestion": "Vem var den första kvinnan i Vetenskapsakademien?"
        },
        {
          "id": "nature-potato",
          "type": "short",
          "question": "Vilken gröda undersökte Eva Ekeblad?",
          "answer": "Potatis",
          "accept": [
            "Potatis",
            "potatisen"
          ],
          "explanation": "Ekeblad visade bland annat hur mjöl kunde göras av potatis.",
          "chapter": 1,
          "simpleQuestion": "Vilken gröda undersökte Eva Ekeblad?"
        },
        {
          "id": "nature-academy",
          "type": "short",
          "question": "Vilken akademi bildades 1739 för att sprida forskning?",
          "answer": "Kungliga Vetenskapsakademien",
          "accept": [
            "Kungliga Vetenskapsakademien",
            "vetenskapsakademien",
            "kungliga vetenskapsakademin",
            "vetenskapsakademin"
          ],
          "explanation": "Akademien samlade och spred forskning, men möjligheterna att delta var ojämna.",
          "chapter": 1,
          "simpleQuestion": "Vilken grupp bildades år 1739 för att sprida forskning?"
        },
        {
          "id": "nature-science",
          "type": "short",
          "question": "Vad kallas kunskap som bygger på forskning?",
          "answer": "Vetenskap",
          "accept": [
            "vetenskap",
            "forskning"
          ],
          "explanation": "Vetenskap bygger på undersökningar. Påståenden måste kunna granskas.",
          "chapter": 1,
          "simpleQuestion": "Vad kallas kunskap som bygger på forskning?"
        },
        {
          "id": "nature-reason-1",
          "type": "chain",
          "stage": "journey",
          "question": "Förklara varför vetenskapliga namn kan hjälpa forskare.",
          "steps": [
            {
              "answer": "arter får gemensamma namn",
              "options": [
                "arter får gemensamma namn",
                "varje forskare håller namnen hemliga",
                "alla arter blir samma art"
              ],
              "connector": "Eftersom"
            },
            {
              "answer": "forskare jämföra vad de menar",
              "options": [
                "forskare jämföra vad de menar",
                "alla undersökningar upphöra",
                "namnet ersätta alla bevis"
              ],
              "connector": "kan"
            },
            {
              "answer": "kan kunskap lättare delas mellan länder",
              "options": [
                "kan kunskap lättare delas mellan länder",
                "är alla gamla teorier riktiga",
                "behövs inga nya frågor"
              ],
              "connector": "Därför"
            }
          ],
          "requires": [
            "nature-linne",
            "nature-language",
            "nature-celsius",
            "nature-scheele",
            "nature-oxygen",
            "nature-ekeblad",
            "nature-potato",
            "nature-academy",
            "nature-science"
          ],
          "explanation": "Ett gemensamt språk hjälper samarbete. Det ersätter inte undersökningar.",
          "chapter": 1,
          "simpleQuestion": "Förklara varför vetenskapliga namn kan hjälpa forskare."
        },
        {
          "id": "nature-reason-2",
          "type": "chain",
          "stage": "journey",
          "question": "Förklara varför fred kunde gynna forskning.",
          "steps": [
            {
              "answer": "krig tog mindre resurser",
              "options": [
                "krig tog mindre resurser",
                "alla forskare blev soldater",
                "alla böcker förbjöds"
              ],
              "connector": "När"
            },
            {
              "answer": "mer tid och pengar för undersökningar",
              "options": [
                "mer tid och pengar för undersökningar",
                "ingen anledning att undersöka något",
                "lika möjligheter för alla automatiskt"
              ],
              "connector": "fanns"
            },
            {
              "answer": "nya upptäckter och mer spridd kunskap",
              "options": [
                "nya upptäckter och mer spridd kunskap",
                "att alla teorier blev sanna",
                "att samhällets orättvisor upphörde"
              ],
              "connector": "vilket kunde leda till"
            }
          ],
          "requires": [
            "nature-linne",
            "nature-language",
            "nature-celsius",
            "nature-scheele",
            "nature-oxygen",
            "nature-ekeblad",
            "nature-potato",
            "nature-academy",
            "nature-science"
          ],
          "explanation": "Fred kunde frigöra resurser, men tillgången till utbildning var fortfarande ojämn.",
          "chapter": 1,
          "simpleQuestion": "Förklara varför fred kunde gynna forskning."
        },
        {
          "id": "nature-reason-3",
          "type": "chain",
          "stage": "master",
          "question": "En besökare säger: ”Linné var viktig, så hans indelning av människor måste också vara riktig.” Bygg ett svar.",
          "steps": [
            {
              "answer": "bidrog Linné till kunskapen om växter och djur",
              "options": [
                "bidrog Linné till kunskapen om växter och djur",
                "forskade Linné aldrig",
                "är alla gamla forskningsresultat värdelösa"
              ],
              "connector": "Visserligen"
            },
            {
              "answer": "hans rasindelning av människor var felaktig",
              "options": [
                "hans rasindelning av människor var felaktig",
                "bevisar hans berömmelse alla hans påståenden",
                "kan en forskare aldrig ha fel"
              ],
              "connector": "men"
            },
            {
              "answer": "måste även berömda forskares påståenden granskas",
              "options": [
                "måste även berömda forskares påståenden granskas",
                "ska rasindelningen användas i dag",
                "kan vi bortse från belägg"
              ],
              "connector": "Därför"
            }
          ],
          "requires": [
            "nature-linne",
            "nature-language",
            "nature-celsius",
            "nature-scheele",
            "nature-oxygen",
            "nature-ekeblad",
            "nature-potato",
            "nature-academy",
            "nature-science"
          ],
          "explanation": "Viktiga vetenskapliga bidrag gör inte alla en persons idéer riktiga. Människor har samma värde.",
          "chapter": 1,
          "simpleQuestion": "En besökare säger: ”Linné var viktig, så hans indelning av människor måste också vara riktig.” Bygg ett svar."
        }
      ]
    },
    {
      "id": "farm",
      "title": "Byn som förändras",
      "npc": "Bonden Karin",
      "location": "Byn",
      "symbol": "♧",
      "period": "1719–1809",
      "story": "Jag behöver din hjälp med byn som förändras.",
      "bookReference": "Grundboken s. 86–87. Arbetsboken uppgift 18–20.",
      "notes": [
        "De flesta bodde på landet och arbetade med jordbruk.",
        "Jordbruket var centralt för de flesta människors försörjning.",
        "En familjs jord var ofta uppdelad på flera smala tegar.",
        "Skiften förändrade både åkrarna och byarnas gemenskap.",
        "I städerna växte fabriker fram. Många kvinnor och barn arbetade där.",
        "Fabriksägare anställde barn eftersom de kunde betala dem mindre.",
        "Tobak odlades på flera platser i Sverige under 1700-talet.",
        "Hantverkare tillverkade många av städernas varor."
      ],
      "cards": [
        {
          "id": "farm-land",
          "type": "short",
          "question": "Var bodde omkring 90 procent av Sveriges befolkning under gustavianska tiden?",
          "answer": "På landsbygden",
          "accept": [
            "På landsbygden",
            "landsbygden",
            "landet",
            "på landet"
          ],
          "explanation": "De flesta bodde på landet och arbetade med jordbruk.",
          "chapter": 2,
          "simpleQuestion": "Var bodde ungefär nio av tio människor under gustavianska tiden?"
        },
        {
          "id": "farm-work",
          "type": "short",
          "question": "Vad kallas arbetet med att odla mark och hålla djur för mat?",
          "answer": "Jordbruk",
          "accept": [
            "Jordbruk",
            "lantbruk"
          ],
          "explanation": "Jordbruket var centralt för de flesta människors försörjning.",
          "chapter": 2,
          "simpleQuestion": "Vad kallas arbetet med att odla mark och hålla djur för mat?"
        },
        {
          "id": "farm-strips",
          "type": "short",
          "question": "Vad kallades de smala jordbitar en bondefamilj hade på flera platser?",
          "answer": "Tegar",
          "accept": [
            "Tegar",
            "teg",
            "tegarna"
          ],
          "explanation": "En familjs jord var ofta uppdelad på flera smala tegar.",
          "chapter": 2,
          "simpleQuestion": "Vad hette de smala åkerbitar som en familj hade på flera platser?"
        },
        {
          "id": "farm-reform",
          "type": "short",
          "question": "Vad kallades förändringen då jord samlades till större sammanhängande åkrar?",
          "answer": "Skifte",
          "accept": [
            "Skifte",
            "skiftet",
            "skiften",
            "jordskifte"
          ],
          "explanation": "Skiften förändrade både åkrarna och byarnas gemenskap.",
          "chapter": 2,
          "simpleQuestion": "Vad kallas det när små åkerbitar slås ihop till större åkrar?"
        },
        {
          "id": "farm-factory",
          "type": "short",
          "question": "Vad kallas en arbetsplats där många tillverkar varor, till exempel tyg?",
          "answer": "Fabrik",
          "accept": [
            "Fabrik",
            "fabriken",
            "manufaktur"
          ],
          "explanation": "I städerna växte fabriker fram. Många kvinnor och barn arbetade där.",
          "chapter": 2,
          "simpleQuestion": "Vad kallas en arbetsplats där många tillverkar varor, till exempel tyg?"
        },
        {
          "id": "farm-cheap",
          "type": "short",
          "question": "Varför var barn billiga att anställa jämfört med vuxna?",
          "answer": "De fick lägre lön",
          "accept": [
            "De fick lägre lön",
            "lägre lön",
            "låg lön",
            "de fick mindre lön",
            "mindre lön",
            "de behövde inte lika mycket lön",
            "barn fick lägre lön",
            "barnen fick lägre lön",
            "de fick mindre lön",
            "barn fick mindre betalt",
            "de fick mindre betalt",
            "lägre lön",
            "mindre lön",
            "billigare arbetskraft",
            "de hade lägre lön"
          ],
          "explanation": "Fabriksägare anställde barn eftersom de kunde betala dem mindre.",
          "chapter": 2,
          "simpleQuestion": "Varför kostade det mindre att anställa barn än vuxna?"
        },
        {
          "id": "farm-tobacco",
          "type": "short",
          "question": "Vilken gröda odlades bland annat för att tillverka snus och röktobak?",
          "answer": "Tobak",
          "accept": [
            "Tobak",
            "tobaken"
          ],
          "explanation": "Tobak odlades på flera platser i Sverige under 1700-talet.",
          "chapter": 2,
          "simpleQuestion": "Vilken gröda odlades bland annat för att tillverka snus och röktobak?"
        },
        {
          "id": "farm-handcraft",
          "type": "short",
          "question": "Vad kallas tillverkning där man gör saker för hand, som skor eller kärl?",
          "answer": "Hantverk",
          "accept": [
            "Hantverk",
            "hantverket"
          ],
          "explanation": "Hantverkare tillverkade många av städernas varor.",
          "chapter": 2,
          "simpleQuestion": "Vad kallas det när man tillverkar saker för hand?"
        },
        {
          "id": "farm-reason-1",
          "type": "chain",
          "stage": "journey",
          "question": "Förklara hur skiften kunde förändra bylivet.",
          "steps": [
            {
              "answer": "familjens jord samlades på färre platser",
              "options": [
                "familjens jord samlades på färre platser",
                "alla åkrar försvann",
                "alla blev lika rika"
              ],
              "connector": "Eftersom"
            },
            {
              "answer": "jordbruket skötas mer av varje familj",
              "options": [
                "jordbruket skötas mer av varje familj",
                "ingen längre odla mat",
                "alla hushåll flytta till slottet"
              ],
              "connector": "kunde"
            },
            {
              "answer": "byarnas gemenskap kunde splittras",
              "options": [
                "byarnas gemenskap kunde splittras",
                "alla fick exakt samma villkor",
                "behövde ingen arbeta"
              ],
              "connector": "men"
            }
          ],
          "requires": [
            "farm-land",
            "farm-work",
            "farm-strips",
            "farm-reform",
            "farm-factory",
            "farm-cheap",
            "farm-tobacco",
            "farm-handcraft"
          ],
          "explanation": "Skiften kunde göra jordbruk effektivare och samtidigt förändra gemenskap och fördelning av jord.",
          "chapter": 2,
          "simpleQuestion": "Förklara hur skiften kunde förändra bylivet."
        },
        {
          "id": "farm-reason-2",
          "type": "chain",
          "stage": "journey",
          "question": "Förklara varför fabriksägare anställde barn.",
          "steps": [
            {
              "answer": "barn fick lägre lön än vuxna",
              "options": [
                "barn fick lägre lön än vuxna",
                "barn ägde alla fabriker",
                "alla barn valde fabrik framför skola"
              ],
              "connector": "Eftersom"
            },
            {
              "answer": "ägaren minska sina kostnader",
              "options": [
                "ägaren minska sina kostnader",
                "barnen bestämma alla löner",
                "arbetet alltid bli ofarligt"
              ],
              "connector": "kunde"
            },
            {
              "answer": "barnen kunde få långa och tunga arbetsdagar",
              "options": [
                "barnen kunde få långa och tunga arbetsdagar",
                "var barnens liv alltid lättare",
                "fick alla barn god utbildning"
              ],
              "connector": "men"
            }
          ],
          "requires": [
            "farm-land",
            "farm-work",
            "farm-strips",
            "farm-reform",
            "farm-factory",
            "farm-cheap",
            "farm-tobacco",
            "farm-handcraft"
          ],
          "explanation": "En vinst för fabriksägaren kunde innebära svåra villkor för barnen.",
          "chapter": 2,
          "simpleQuestion": "Förklara varför fabriksägare anställde barn."
        },
        {
          "id": "farm-reason-3",
          "type": "chain",
          "stage": "master",
          "question": "En bonde säger att skiftet var bra för alla. Använd två perspektiv.",
          "steps": [
            {
              "answer": "kunde större samlade åkrar göra odlingen lättare",
              "options": [
                "kunde större samlade åkrar göra odlingen lättare",
                "försvann behovet av mat",
                "blev all mark gratis"
              ],
              "connector": "För en del familjer"
            },
            {
              "answer": "kunde andra få sämre jord eller förlora gemenskap",
              "options": [
                "kunde andra få sämre jord eller förlora gemenskap",
                "fick alla familjer samma resultat",
                "slutade alla bo på landet"
              ],
              "connector": "Samtidigt"
            },
            {
              "answer": "behöver vi jämföra vilka som vann och förlorade",
              "options": [
                "behöver vi jämföra vilka som vann och förlorade",
                "räcker en persons berättelse för att beskriva alla",
                "måste en förändring alltid vara helt bra eller helt dålig"
              ],
              "connector": "Därför"
            }
          ],
          "requires": [
            "farm-land",
            "farm-work",
            "farm-strips",
            "farm-reform",
            "farm-factory",
            "farm-cheap",
            "farm-tobacco",
            "farm-handcraft"
          ],
          "explanation": "En historisk förändring kan få olika följder för olika människor.",
          "chapter": 2,
          "simpleQuestion": "En bonde säger att skiftet var bra för alla. Använd två perspektiv."
        }
      ]
    },
    {
      "id": "ideas",
      "title": "Människors liv och röster",
      "npc": "Brevskrivaren Noor",
      "location": "Kaffehuset",
      "symbol": "✧",
      "period": "1719–1809",
      "story": "Jag behöver din hjälp med människors liv och röster.",
      "bookReference": "Grundboken s. 66–69, 82–85 och 88–89. Arbetsboken uppgift 5–7, 17 och 21–22.",
      "notes": [
        "Barnhus gav tak över huvudet men många barn tvingades arbeta hårt.",
        "Gustav III tillät fler religiösa grupper, men friheten hade stora begränsningar.",
        "Upplysningen förknippas med kritiskt tänkande och rättigheter.",
        "Bellman skrev både om kungligheter och om fattiga människors liv.",
        "Lenngren skrev bland annat i tidningar och försvarade kvinnors möjligheter att bilda sig.",
        "Gustav III stödde kultur. En del av kulturen hyllade också honom själv.",
        "Kön, rikedom och samhällsställning påverkade människors möjligheter.",
        "Barn kunde få sy, tvätta eller spinna och utsattes också för våld."
      ],
      "cards": [
        {
          "id": "ideas-shelter",
          "type": "short",
          "question": "Vad kallades institutioner där barn utan omsorg kunde få bo?",
          "answer": "Barnhus",
          "accept": [
            "Barnhus",
            "barnhuset",
            "barnhem"
          ],
          "explanation": "Barnhus gav tak över huvudet men många barn tvingades arbeta hårt.",
          "chapter": 1,
          "simpleQuestion": "Vad kallades husen där barn utan omsorg kunde få bo?"
        },
        {
          "id": "ideas-faith",
          "type": "short",
          "question": "Vad kallas friheten att få utöva sin religion?",
          "answer": "Religionsfrihet",
          "accept": [
            "Religionsfrihet",
            "religionsfriheten"
          ],
          "explanation": "Gustav III tillät fler religiösa grupper, men friheten hade stora begränsningar.",
          "chapter": 2,
          "simpleQuestion": "Vad kallas friheten att få utöva sin religion?"
        },
        {
          "id": "ideas-enlighten",
          "type": "short",
          "question": "Vad kallas idéerna om förnuft, undersökningar och människors rättigheter under 1700-talet?",
          "answer": "Upplysningen",
          "accept": [
            "Upplysningen",
            "upplysning"
          ],
          "explanation": "Upplysningen förknippas med kritiskt tänkande och rättigheter.",
          "chapter": 2,
          "simpleQuestion": "Vad kallas 1700-talets idéer om förnuft, forskning och människors rättigheter?"
        },
        {
          "id": "ideas-bellman",
          "type": "short",
          "question": "Vilken visdiktare skrev bland annat om livet i Stockholm?",
          "answer": "Carl Michael Bellman",
          "accept": [
            "Carl Michael Bellman",
            "bellman",
            "carl mikael bellman"
          ],
          "explanation": "Bellman skrev både om kungligheter och om fattiga människors liv.",
          "chapter": 2,
          "simpleQuestion": "Vilken visdiktare skrev bland annat om livet i Stockholm?"
        },
        {
          "id": "ideas-lenngren",
          "type": "short",
          "question": "Vilken författare skrev om kvinnors rättigheter och människors orättvisor?",
          "answer": "Anna Maria Lenngren",
          "accept": [
            "Anna Maria Lenngren",
            "lenngren",
            "anna maria"
          ],
          "explanation": "Lenngren skrev bland annat i tidningar och försvarade kvinnors möjligheter att bilda sig.",
          "chapter": 2,
          "simpleQuestion": "Vilken författare skrev om kvinnors rättigheter och människors orättvisor?"
        },
        {
          "id": "ideas-patron",
          "type": "short",
          "question": "Vilken kung gav stöd till Bellman, teater och andra delar av kulturlivet?",
          "answer": "Gustav III",
          "accept": [
            "Gustav III",
            "gustav 3",
            "gustav den tredje"
          ],
          "explanation": "Gustav III stödde kultur. En del av kulturen hyllade också honom själv.",
          "chapter": 2,
          "simpleQuestion": "Vilken kung gav pengar till Bellman och teatern?"
        },
        {
          "id": "ideas-inequality",
          "type": "short",
          "question": "Vilket ord beskriver att människor inte har samma rättigheter och möjligheter?",
          "answer": "Ojämlikhet",
          "accept": [
            "Ojämlikhet",
            "ojämlikt",
            "ojämlikheten"
          ],
          "explanation": "Kön, rikedom och samhällsställning påverkade människors möjligheter.",
          "chapter": 1,
          "simpleQuestion": "Vad kallas det när människor har olika rättigheter och möjligheter?"
        },
        {
          "id": "ideas-workchildren",
          "type": "short",
          "question": "Vad måste många barn på barnhus göra större delen av dagen?",
          "answer": "Arbeta",
          "accept": [
            "Arbeta",
            "jobba",
            "arbete",
            "arbeta hårt",
            "jobba hårt",
            "arbeta hela dagen",
            "jobba hela dagen"
          ],
          "explanation": "Barn kunde få sy, tvätta eller spinna och utsattes också för våld.",
          "chapter": 1,
          "simpleQuestion": "Vad måste många barn på barnhus göra större delen av dagen?"
        },
        {
          "id": "ideas-culture",
          "type": "short",
          "question": "Vilket ord kan samla musik, teater, konst och litteratur?",
          "answer": "Kultur",
          "accept": [
            "kultur"
          ],
          "explanation": "Här betyder kultur till exempel musik, konst, litteratur och teater.",
          "chapter": 2,
          "simpleQuestion": "Vilket ord kan samla musik, teater, konst och litteratur?"
        },
        {
          "id": "ideas-reason-1",
          "type": "chain",
          "stage": "journey",
          "question": "Förklara varför en ogift kvinna kunde frukta att få barn.",
          "steps": [
            {
              "answer": "hon kunde drabbas av straff och skam",
              "options": [
                "hon kunde drabbas av straff och skam",
                "alla kvinnor hade samma frihet som män",
                "alla barn fick trygg omsorg"
              ],
              "connector": "Eftersom"
            },
            {
              "answer": "hon bli rädd för hur familj och samhälle skulle behandla henne",
              "options": [
                "hon bli rädd för hur familj och samhälle skulle behandla henne",
                "hon räkna med att alla hjälpte henne",
                "hon alltid välja fritt"
              ],
              "connector": "kunde"
            },
            {
              "answer": "samhällets regler kunde utsätta kvinnor och barn för svår press",
              "options": [
                "samhällets regler kunde utsätta kvinnor och barn för svår press",
                "kvinnorna själva orsakade alla orättvisor",
                "alla familjer hade samma villkor"
              ],
              "connector": "Det visar att"
            }
          ],
          "requires": [
            "ideas-shelter",
            "ideas-inequality",
            "ideas-workchildren"
          ],
          "explanation": "Förklara utsattheten genom samhällets normer och villkor. Lägg inte skulden på kvinnan.",
          "chapter": 1,
          "simpleQuestion": "Förklara varför en ogift kvinna kunde frukta att få barn."
        },
        {
          "id": "ideas-reason-2",
          "type": "chain",
          "stage": "journey",
          "question": "Förklara varför stödet till kultur kunde gynna både konstnären och kungen.",
          "steps": [
            {
              "answer": "kungen gav pengar till kultur",
              "options": [
                "kungen gav pengar till kultur",
                "all kultur förbjöds",
                "inga författare kunde skriva"
              ],
              "connector": "När"
            },
            {
              "answer": "konstnärer och författare arbeta vidare",
              "options": [
                "konstnärer och författare arbeta vidare",
                "alla invånare automatiskt få lika makt",
                "alla texter bli oberoende av pengar"
              ],
              "connector": "kunde"
            },
            {
              "answer": "hyllningar göra kungen mer omtyckt",
              "options": [
                "hyllningar göra kungen mer omtyckt",
                "kritik aldrig förekomma",
                "alla fattiga bli rika"
              ],
              "connector": "Samtidigt kunde"
            }
          ],
          "requires": [
            "ideas-shelter",
            "ideas-faith",
            "ideas-enlighten",
            "ideas-bellman",
            "ideas-lenngren",
            "ideas-patron",
            "ideas-inequality",
            "ideas-workchildren",
            "ideas-culture"
          ],
          "explanation": "Stödet kunde både möjliggöra konst och stärka kungens anseende.",
          "chapter": 2,
          "simpleQuestion": "Förklara varför stödet till kultur kunde gynna både konstnären och kungen."
        },
        {
          "id": "ideas-reason-3",
          "type": "chain",
          "stage": "master",
          "question": "Ett brev beskriver barnhus som enbart hjälp. Ett annat berättar om hårt arbete. Bygg en jämförelse.",
          "steps": [
            {
              "answer": "kan lyfta fram mat och tak över huvudet",
              "options": [
                "kan lyfta fram mat och tak över huvudet",
                "bevisar att alla barn trivdes",
                "gör andra berättelser onödiga"
              ],
              "connector": "Det första brevet"
            },
            {
              "answer": "visa tvång och svåra arbetsvillkor",
              "options": [
                "visa tvång och svåra arbetsvillkor",
                "sakna värde för att det kritiserar",
                "bevisa att ingen fick mat"
              ],
              "connector": "Samtidigt kan det andra"
            },
            {
              "answer": "undersöka avsändare och jämföra flera erfarenheter",
              "options": [
                "undersöka avsändare och jämföra flera erfarenheter",
                "välja den trevligaste berättelsen",
                "räkna vilket brev som är längst"
              ],
              "connector": "Därför behöver vi"
            }
          ],
          "requires": [
            "ideas-shelter",
            "ideas-inequality",
            "ideas-workchildren"
          ],
          "explanation": "Båda källorna kan belysa delar av samma institution. Vi behöver undersöka deras perspektiv.",
          "chapter": 1,
          "simpleQuestion": "Ett brev beskriver barnhus som enbart hjälp. Ett annat berättar om hårt arbete. Bygg en jämförelse."
        }
      ]
    },
    {
      "id": "trade",
      "title": "Handel, kolonier och motstånd",
      "npc": "Hamnskrivaren Jo",
      "location": "Hamnen",
      "symbol": "⚓",
      "period": "1719–1809",
      "story": "Jag behöver din hjälp med handel, kolonier och motstånd.",
      "bookReference": "Grundboken s. 64 och 90–94. Arbetsboken uppgift 3 och 23–26.",
      "notes": [
        "Kompaniets skepp seglade från Göteborg till Kina.",
        "Göteborg var utgångspunkt för kompaniets resor till Kina.",
        "Sverige importerade bland annat te, siden och porslin.",
        "Svenska företag exporterade bland annat järn.",
        "Sverige styrde Saint Barthélemy och deltog i slavhandeln.",
        "Förslavade människor utsattes för tvång och våld. De gjorde också motstånd.",
        "Slaveriet på ön avskaffades 1847, efter 1700-talets slut.",
        "Förslavade människor krävde rättigheter, flydde och gjorde uppror."
      ],
      "cards": [
        {
          "id": "trade-company",
          "type": "short",
          "question": "Vilket svenskt företag seglade till Kina för att köpa te, siden och porslin?",
          "answer": "Ostindiska kompaniet",
          "accept": [
            "Ostindiska kompaniet",
            "svenska ostindiska kompaniet"
          ],
          "explanation": "Kompaniets skepp seglade från Göteborg till Kina.",
          "chapter": 1,
          "simpleQuestion": "Vilket svenskt företag seglade till Kina för att köpa te, siden och porslin?"
        },
        {
          "id": "trade-port",
          "type": "short",
          "question": "Från vilken svensk stad seglade Ostindiska kompaniets skepp?",
          "answer": "Göteborg",
          "accept": [
            "Göteborg",
            "göteborgs hamn"
          ],
          "explanation": "Göteborg var utgångspunkt för kompaniets resor till Kina.",
          "chapter": 1,
          "simpleQuestion": "Från vilken svensk stad seglade Ostindiska kompaniets skepp?"
        },
        {
          "id": "trade-import",
          "type": "short",
          "question": "Vad kallas det att köpa in varor från andra länder?",
          "answer": "Import",
          "accept": [
            "Import",
            "importera"
          ],
          "explanation": "Sverige importerade bland annat te, siden och porslin.",
          "chapter": 1,
          "simpleQuestion": "Vad kallas det att köpa in varor från andra länder?"
        },
        {
          "id": "trade-export",
          "type": "short",
          "question": "Vad kallas det att sälja varor till andra länder?",
          "answer": "Export",
          "accept": [
            "Export",
            "exportera"
          ],
          "explanation": "Svenska företag exporterade bland annat järn.",
          "chapter": 1,
          "simpleQuestion": "Vad kallas det att sälja varor till andra länder?"
        },
        {
          "id": "trade-colony",
          "type": "short",
          "question": "Vilken ö i Karibien blev svensk koloni under Gustav III?",
          "answer": "Saint Barthélemy",
          "accept": [
            "Saint Barthélemy",
            "saint barthelemy",
            "sankt barthelemy",
            "st barthelemy",
            "s:t barthelemy"
          ],
          "explanation": "Sverige styrde Saint Barthélemy och deltog i slavhandeln.",
          "chapter": 2,
          "simpleQuestion": "Vilken ö i Karibien blev svensk koloni under Gustav III?"
        },
        {
          "id": "trade-slavery",
          "type": "short",
          "question": "Vad kallas ett system där människor berövas friheten och behandlas som egendom?",
          "answer": "Slaveri",
          "accept": [
            "Slaveri",
            "slaveriet"
          ],
          "explanation": "Förslavade människor utsattes för tvång och våld. De gjorde också motstånd.",
          "chapter": 2,
          "simpleQuestion": "Vad kallas ett system där människor berövas friheten och behandlas som egendom?"
        },
        {
          "id": "trade-abolish",
          "type": "short",
          "question": "Blick framåt: vilket år avskaffades slaveriet på svenska Saint Barthélemy?",
          "answer": "1847",
          "accept": [
            "1847"
          ],
          "explanation": "Slaveriet på ön avskaffades 1847, efter 1700-talets slut.",
          "chapter": 2,
          "simpleQuestion": "Blick framåt: vilket år avskaffades slaveriet på svenska Saint Barthélemy?"
        },
        {
          "id": "trade-resist",
          "type": "short",
          "question": "Vad kallas det när människor aktivt gör motstånd mot makten, ibland tillsammans med våld?",
          "answer": "Uppror",
          "accept": [
            "Uppror",
            "ett uppror"
          ],
          "explanation": "Förslavade människor krävde rättigheter, flydde och gjorde uppror.",
          "chapter": 2,
          "simpleQuestion": "Vad kallas det när människor aktivt gör motstånd mot makten, ibland tillsammans med våld?"
        },
        {
          "id": "trade-colonydef",
          "type": "short",
          "question": "Vad kallas ett område som styrs från ett annat land?",
          "answer": "Koloni",
          "accept": [
            "koloni",
            "en koloni"
          ],
          "explanation": "En koloni styrs av en makt i ett annat land.",
          "chapter": 2,
          "simpleQuestion": "Vad kallas ett område som styrs från ett annat land?"
        },
        {
          "id": "trade-slavetrade",
          "type": "short",
          "question": "Vad kallas handel där människor köps och säljs som egendom?",
          "answer": "Slavhandel",
          "accept": [
            "slavhandel",
            "slavhandeln"
          ],
          "explanation": "Slavhandel innebar att människor berövades friheten och köptes och såldes.",
          "chapter": 2,
          "simpleQuestion": "Vad kallas handel där människor köps och säljs som egendom?"
        },
        {
          "id": "trade-reason-1",
          "type": "chain",
          "stage": "journey",
          "question": "Förklara hur kolonial handel kunde gynna vissa och skada andra.",
          "steps": [
            {
              "answer": "handel med kolonier gav inkomster",
              "options": [
                "handel med kolonier gav inkomster",
                "alla arbetade frivilligt",
                "inga människor utnyttjades"
              ],
              "connector": "Eftersom"
            },
            {
              "answer": "köpmän och kungamakt tjäna pengar",
              "options": [
                "köpmän och kungamakt tjäna pengar",
                "alla bli lika rika",
                "slaveriet upphöra automatiskt"
              ],
              "connector": "kunde"
            },
            {
              "answer": "berövades förslavade människor frihet och rättigheter",
              "options": [
                "berövades förslavade människor frihet och rättigheter",
                "delade alla på vinsten",
                "hade de förslavade samma makt som köpmännen"
              ],
              "connector": "Samtidigt"
            }
          ],
          "requires": [
            "trade-company",
            "trade-port",
            "trade-import",
            "trade-export",
            "trade-colony",
            "trade-slavery",
            "trade-abolish",
            "trade-resist",
            "trade-colonydef",
            "trade-slavetrade"
          ],
          "explanation": "Beskriv både vinsterna och vilka människor som utsattes för övergrepp.",
          "chapter": 2,
          "simpleQuestion": "Förklara hur kolonial handel kunde gynna vissa och skada andra."
        },
        {
          "id": "trade-reason-2",
          "type": "chain",
          "stage": "journey",
          "question": "Förklara hur motstånd kunde göra slaveriet svårare att upprätthålla.",
          "steps": [
            {
              "answer": "förslavade människor krävde rättigheter och flydde",
              "options": [
                "förslavade människor krävde rättigheter och flydde",
                "alla accepterade förtrycket",
                "slavägarna avstod från all vinst"
              ],
              "connector": "När"
            },
            {
              "answer": "slavägarnas makt",
              "options": [
                "slavägarnas makt",
                "bara vädret",
                "behovet av rättigheter"
              ],
              "connector": "utmanades"
            },
            {
              "answer": "växte också kritik mot att människor fick köpas och säljas",
              "options": [
                "växte också kritik mot att människor fick köpas och säljas",
                "försvann slaveriet samma dag överallt",
                "blev alla kolonier svenska"
              ],
              "connector": "Samtidigt"
            }
          ],
          "requires": [
            "trade-company",
            "trade-port",
            "trade-import",
            "trade-export",
            "trade-colony",
            "trade-slavery",
            "trade-abolish",
            "trade-resist",
            "trade-colonydef",
            "trade-slavetrade"
          ],
          "explanation": "Motståndet hade flera former. Avskaffandet skedde vid olika tidpunkter på olika platser.",
          "chapter": 2,
          "simpleQuestion": "Förklara hur motstånd kunde göra slaveriet svårare att upprätthålla."
        },
        {
          "id": "trade-reason-3",
          "type": "chain",
          "stage": "master",
          "question": "En hamnbok räknar bara vinster och avgifter. Vad behöver arkivet lägga till?",
          "steps": [
            {
              "answer": "visa hur handeln gav inkomster",
              "options": [
                "visa hur handeln gav inkomster",
                "visa varje förslavad människas hela liv",
                "bevisa att handeln var rättvis"
              ],
              "connector": "Hamnboken kan"
            },
            {
              "answer": "förslavades erfarenheter och motstånd kan saknas",
              "options": [
                "förslavades erfarenheter och motstånd kan saknas",
                "pengar berättar allt om lidande",
                "alla röster finns alltid i bokföringen"
              ],
              "connector": "men"
            },
            {
              "answer": "fler källor och människornas perspektiv",
              "options": [
                "fler källor och människornas perspektiv",
                "bara större siffror",
                "bortse från Sveriges roll"
              ],
              "connector": "Därför behöver vi"
            }
          ],
          "requires": [
            "trade-company",
            "trade-port",
            "trade-import",
            "trade-export",
            "trade-colony",
            "trade-slavery",
            "trade-abolish",
            "trade-resist",
            "trade-colonydef",
            "trade-slavetrade"
          ],
          "explanation": "Handelsdokument kan vara viktiga källor men gör ofta förtryckta människors röster osynliga.",
          "chapter": 2,
          "simpleQuestion": "En hamnbok räknar bara vinster och avgifter. Vad behöver arkivet lägga till?"
        }
      ]
    },
    {
      "id": "king",
      "title": "Kungamakt och förlust",
      "npc": "Slottsbudet Amira",
      "location": "Slottet",
      "symbol": "♛",
      "period": "1719–1809",
      "story": "Jag behöver din hjälp med kungamakt och förlust.",
      "bookReference": "Grundboken s. 81–85 och 95–102. Arbetsboken uppgift 16–17 och 27–30.",
      "notes": [
        "Gustav III tog makt från riksrådet och stärkte kungamakten 1772.",
        "Kuppen 1772 markerar slutet på frihetstiden.",
        "Gustav III använde militären när han tog makten.",
        "Gustav III sköts på operan 1792 och dog senare av skadorna.",
        "Anckarström dömdes för mordet. Fler personer var inblandade i planerna.",
        "Revolutionen i Frankrike följdes av stora politiska förändringar och krig.",
        "Gustav IV Adolf avsattes efter krigsförlusten.",
        "Finland och Åland blev delar av det ryska riket efter kriget."
      ],
      "cards": [
        {
          "id": "king-name",
          "type": "short",
          "question": "Vilken kung tog makten genom en kupp år 1772?",
          "answer": "Gustav III",
          "accept": [
            "Gustav III",
            "gustav 3",
            "gustav den tredje"
          ],
          "explanation": "Gustav III tog makt från riksrådet och stärkte kungamakten 1772.",
          "chapter": 2,
          "simpleQuestion": "Vilken kung tog makten genom en kupp år 1772?"
        },
        {
          "id": "king-year",
          "type": "short",
          "question": "Vilket år tog frihetstiden slut genom Gustav III:s kupp?",
          "answer": "1772",
          "accept": [
            "1772"
          ],
          "explanation": "Kuppen 1772 markerar slutet på frihetstiden.",
          "chapter": 2,
          "simpleQuestion": "Vilket år tog frihetstiden slut genom Gustav III:s kupp?"
        },
        {
          "id": "king-coup",
          "type": "short",
          "question": "Vad kallas ett maktövertagande med tvång utanför vanliga politiska regler?",
          "answer": "Statskupp",
          "accept": [
            "Statskupp",
            "kupp"
          ],
          "explanation": "Gustav III använde militären när han tog makten.",
          "chapter": 2,
          "simpleQuestion": "Vad kallas det när någon tar makten med tvång utanför de vanliga reglerna?"
        },
        {
          "id": "king-death",
          "type": "short",
          "question": "Vilket år sköts Gustav III på en maskerad och dog senare?",
          "answer": "1792",
          "accept": [
            "1792"
          ],
          "explanation": "Gustav III sköts på operan 1792 och dog senare av skadorna.",
          "chapter": 2,
          "simpleQuestion": "Vilket år sköts Gustav III på en maskerad och dog senare?"
        },
        {
          "id": "king-allies",
          "type": "short",
          "question": "Vilka två länder samarbetade Sverige med mot Frankrike innan Ryssland bytte sida?",
          "answer": "Storbritannien och Ryssland",
          "accept": [
            "Storbritannien och Ryssland",
            "Ryssland och Storbritannien",
            "England och Ryssland",
            "Ryssland och England",
            "Storbritannien Ryssland",
            "Ryssland Storbritannien"
          ],
          "explanation": "Sverige samarbetade först med Storbritannien och Ryssland. När Ryssland slöt fred med Frankrike förändrades läget. Ryssland anföll Finland år 1808.",
          "chapter": 2,
          "simpleQuestion": "Sverige ville besegra Frankrike. Vilka två länder samarbetade Sverige med först?"
        },
        {
          "id": "king-revolution",
          "type": "short",
          "question": "I vilket land började revolutionen 1789?",
          "answer": "Frankrike",
          "accept": [
            "Frankrike",
            "frankrike"
          ],
          "explanation": "Revolutionen i Frankrike följdes av stora politiska förändringar och krig.",
          "chapter": 2,
          "simpleQuestion": "I vilket land började revolutionen 1789?"
        },
        {
          "id": "king-successor",
          "type": "short",
          "question": "Vilken kung regerade när Sverige förlorade Finland 1809?",
          "answer": "Gustav IV Adolf",
          "accept": [
            "Gustav IV Adolf",
            "gustav 4 adolf",
            "gustav den fjärde adolf"
          ],
          "explanation": "Gustav IV Adolf avsattes efter krigsförlusten.",
          "chapter": 2,
          "simpleQuestion": "Vem var kung när Sverige förlorade Finland år 1809?"
        },
        {
          "id": "king-finland",
          "type": "short",
          "question": "Till vilket land förlorade Sverige Finland och Åland 1809?",
          "answer": "Ryssland",
          "accept": [
            "Ryssland",
            "ryska riket"
          ],
          "explanation": "Finland och Åland blev delar av det ryska riket efter kriget.",
          "chapter": 2,
          "simpleQuestion": "Vilket land tog över Finland och Åland år 1809?"
        },
        {
          "id": "king-reason-1",
          "type": "chain",
          "stage": "journey",
          "question": "Förklara hur en kung kunde genomföra reformer och samtidigt minska friheten.",
          "steps": [
            {
              "answer": "förbjöd tortyr och genomförde reformer",
              "options": [
                "förbjöd tortyr och genomförde reformer",
                "gav genast alla lika rösträtt",
                "avskaffade alla straff"
              ],
              "connector": "Gustav III"
            },
            {
              "answer": "tog också mer makt och begränsade tryckfriheten",
              "options": [
                "tog också mer makt och begränsade tryckfriheten",
                "lämnade all makt till riksdagen",
                "förbjöd all kultur"
              ],
              "connector": "men"
            },
            {
              "answer": "kan samma regering ha både reformer och förtryck",
              "options": [
                "kan samma regering ha både reformer och förtryck",
                "är varje reform ett bevis på demokrati",
                "behöver maktfördelningen inte granskas"
              ],
              "connector": "Därför"
            }
          ],
          "requires": [
            "king-name",
            "king-year",
            "king-coup",
            "king-death",
            "king-allies",
            "king-revolution",
            "king-successor",
            "king-finland"
          ],
          "explanation": "Utvärdera konkreta förändringar och vilka som gynnades eller drabbades.",
          "chapter": 2,
          "simpleQuestion": "Förklara hur en kung kunde genomföra reformer och samtidigt minska friheten."
        },
        {
          "id": "king-reason-2",
          "type": "chain",
          "stage": "journey",
          "question": "Förklara hur Sverige förlorade Finland.",
          "steps": [
            {
              "answer": "Gustav IV Adolf stod mot Frankrike",
              "options": [
                "Gustav IV Adolf stod mot Frankrike",
                "Sverige blev allierat med Napoleon",
                "Finland redan var ett självständigt land"
              ],
              "connector": "När"
            },
            {
              "answer": "Ryssland och Frankrike slöt fred",
              "options": [
                "Ryssland och Frankrike slöt fred",
                "Ryssland lämnade alla krig",
                "alla svenska soldater fick semester"
              ],
              "connector": "förändrades läget när"
            },
            {
              "answer": "anföll Ryssland Finland och Sverige förlorade kriget",
              "options": [
                "anföll Ryssland Finland och Sverige förlorade kriget",
                "blev Ryssland en del av Sverige",
                "fick Sverige tillbaka alla områden"
              ],
              "connector": "och därefter"
            }
          ],
          "requires": [
            "king-name",
            "king-year",
            "king-coup",
            "king-death",
            "king-allies",
            "king-revolution",
            "king-successor",
            "king-finland"
          ],
          "explanation": "Sverige hamnade på en svår sida i stormakternas krig och förlorade Finland och Åland.",
          "chapter": 2,
          "simpleQuestion": "Förklara hur Sverige förlorade Finland."
        },
        {
          "id": "king-reason-3",
          "type": "chain",
          "stage": "master",
          "question": "Ett porträtt visar kungen som hjälte. En tidning kritiserar hans krig. Bygg ett sätt att undersöka bilden av kungen.",
          "steps": [
            {
              "answer": "vara gjort för att framställa kungen som mäktig",
              "options": [
                "vara gjort för att framställa kungen som mäktig",
                "bevisa att alla älskade honom",
                "visa alla krigets följder"
              ],
              "connector": "Porträttet kan"
            },
            {
              "answer": "ge ett annat perspektiv men behöver också granskas",
              "options": [
                "ge ett annat perspektiv men behöver också granskas",
                "alltid vara helt neutral",
                "ersätta alla andra källor"
              ],
              "connector": "Tidningen kan"
            },
            {
              "answer": "jämför vi syfte och innehåll med fler källor",
              "options": [
                "jämför vi syfte och innehåll med fler källor",
                "väljer vi automatiskt porträttet",
                "avgör färgerna vem som har rätt"
              ],
              "connector": "Därför"
            }
          ],
          "requires": [
            "king-name",
            "king-year",
            "king-coup",
            "king-death",
            "king-allies",
            "king-revolution",
            "king-successor",
            "king-finland"
          ],
          "explanation": "Kungaporträtt och texter är källor med olika syften. Ingen ensam källa ger hela bilden.",
          "chapter": 2,
          "simpleQuestion": "Ett porträtt visar kungen som hjälte. En tidning kritiserar hans krig. Bygg ett sätt att undersöka bilden av kungen."
        }
      ]
    }
  ],
  "sources": [
    {
      "label": "Underlag: lärarens fotograferade kapitel, arbetsbok och lärarguide. Sidreferenser finns vid varje arbetsplats.",
      "url": "https://andersljungvik.github.io/uppdrag-1700/"
    },
    {
      "label": "Roediger & Karpicke (2006), Test-Enhanced Learning",
      "url": "https://doi.org/10.1111/j.1467-9280.2006.01693.x"
    },
    {
      "label": "Soderstrom, Kerr & Bjork (2016), Retrieval and Spacing",
      "url": "https://doi.org/10.1177/0956797615617778"
    }
  ],
  "concepts": [
    {
      "term": "frihetstiden",
      "mission": "power",
      "chapter": 1,
      "question": "power-era"
    },
    {
      "term": "riksrådet",
      "mission": "power",
      "chapter": 1,
      "question": "power-council"
    },
    {
      "term": "Ostindiska kompaniet",
      "mission": "trade",
      "chapter": 1,
      "question": "trade-company"
    },
    {
      "term": "grundlag",
      "mission": "power",
      "chapter": 1,
      "question": "power-law"
    },
    {
      "term": "barnhus",
      "mission": "ideas",
      "chapter": 1,
      "question": "ideas-shelter"
    },
    {
      "term": "hattar och mössor",
      "mission": "power",
      "chapter": 1,
      "question": "power-parties"
    },
    {
      "term": "stora daldansen",
      "mission": "power",
      "chapter": 1,
      "question": "power-rebellion"
    },
    {
      "term": "tryckfrihet",
      "mission": "press",
      "chapter": 1,
      "question": "press-freedom"
    },
    {
      "term": "offentlighetsprincipen",
      "mission": "press",
      "chapter": 1,
      "question": "press-open"
    },
    {
      "term": "vetenskap",
      "mission": "nature",
      "chapter": 1,
      "question": "nature-science"
    },
    {
      "term": "upplysningen",
      "mission": "ideas",
      "chapter": 2,
      "question": "ideas-enlighten"
    },
    {
      "term": "religionsfrihet",
      "mission": "ideas",
      "chapter": 2,
      "question": "ideas-faith"
    },
    {
      "term": "skifte",
      "mission": "farm",
      "chapter": 2,
      "question": "farm-reform"
    },
    {
      "term": "fabriker",
      "mission": "farm",
      "chapter": 2,
      "question": "farm-factory"
    },
    {
      "term": "kultur",
      "mission": "ideas",
      "chapter": 2,
      "question": "ideas-culture"
    },
    {
      "term": "koloni",
      "mission": "trade",
      "chapter": 2,
      "question": "trade-colonydef"
    },
    {
      "term": "Saint Barthélemy",
      "mission": "trade",
      "chapter": 2,
      "question": "trade-colony"
    },
    {
      "term": "slavhandel",
      "mission": "trade",
      "chapter": 2,
      "question": "trade-slavetrade"
    }
  ],
  "goals": [
    "Varför kallas tiden mellan 1719 och 1772 för frihetstiden?",
    "Hur påverkades Sverige av att fler människor lärde sig läsa?",
    "Hur förlorade Sverige Finland?"
  ]
};
