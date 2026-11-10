/* Source-linked retrieval cards from curriculum/classroom.mjs, chapters 1–4. */
(function(){
'use strict';
if(window.__INTEGRATED_CHAPTER!==4)return;
const cards=[
 {
  "id": "material4-sos-frihetstid",
  "chapter": 1,
  "topic": "material-sos-frihetstid",
  "place": "archive",
  "rank": 0,
  "kind": "fields",
  "reviewOnly": true,
  "prompt": "Vad kallas perioden 1719–1772 i Sverige?",
  "fields": [
   {
    "label": "Ditt svar",
    "answers": [
     "Frihetstiden"
    ],
    "sample": "Frihetstiden",
    "options": [
     "Frihetstiden",
     "Stormaktstiden",
     "Gustavianska tiden"
    ]
   }
  ],
  "model": "Frihetstiden.",
  "hint": "Frihetstiden.",
  "source": "Bra att veta – 1700-talets Sverige · 1; Ord och begrepp – 1700-talets Sverige (pdf (1).pdf) · 1; Elevernas arbetsbok s. 24–39 · 1",
  "drill": {
   "prompt": "Vad kallas perioden 1719–1772 i Sverige?",
   "answers": [
    "Frihetstiden"
   ],
   "sample": "Frihetstiden"
  }
 },
 {
  "id": "material4-sos-riksdag",
  "chapter": 1,
  "topic": "material-sos-riksdag",
  "place": "archive",
  "rank": 0,
  "kind": "fields",
  "reviewOnly": true,
  "prompt": "Vilken församling fick mer makt när kungens makt minskade?",
  "fields": [
   {
    "label": "Ditt svar",
    "answers": [
     "Riksdagen",
     "riksdagen och riksrådet"
    ],
    "sample": "Riksdagen",
    "options": [
     "Riksdagen",
     "Riksrådet",
     "Kungliga hovet"
    ]
   }
  ],
  "model": "Riksdagen.",
  "hint": "Riksdagen.",
  "source": "Bra att veta – 1700-talets Sverige · 1; Bedömningsstöd del 1 · 1; Elevernas arbetsbok s. 24–39 · 1",
  "drill": {
   "prompt": "Vilken församling fick mer makt när kungens makt minskade?",
   "answers": [
    "Riksdagen",
    "riksdagen och riksrådet"
   ],
   "sample": "Riksdagen"
  }
 },
 {
  "id": "material4-sos-riksrad",
  "chapter": 1,
  "topic": "material-sos-riksrad",
  "place": "archive",
  "rank": 0,
  "kind": "fields",
  "reviewOnly": true,
  "prompt": "Vad kallades den grupp som fungerade ungefär som en regering?",
  "fields": [
   {
    "label": "Ditt svar",
    "answers": [
     "Riksrådet"
    ],
    "sample": "Riksrådet",
    "options": [
     "Riksrådet",
     "Riksdagen",
     "Kungliga hovet"
    ]
   }
  ],
  "model": "Riksrådet.",
  "hint": "Riksrådet.",
  "source": "Bra att veta – 1700-talets Sverige · 1; Ord och begrepp – 1700-talets Sverige (pdf (1).pdf) · 1",
  "drill": {
   "prompt": "Vad kallades den grupp som fungerade ungefär som en regering?",
   "answers": [
    "Riksrådet"
   ],
   "sample": "Riksrådet"
  }
 },
 {
  "id": "material4-sos-grundlag",
  "chapter": 1,
  "topic": "material-sos-grundlag",
  "place": "archive",
  "rank": 0,
  "kind": "fields",
  "reviewOnly": true,
  "prompt": "Vad heter en extra viktig lag som är svår att ändra och kan ange hur landet styrs?",
  "fields": [
   {
    "label": "Ditt svar",
    "answers": [
     "Grundlag"
    ],
    "sample": "Grundlag",
    "options": [
     "Grundlag",
     "Förordning",
     "Riksdagsbeslut"
    ]
   }
  ],
  "model": "Grundlag.",
  "hint": "Grundlag.",
  "source": "Bra att veta – 1700-talets Sverige · 1; Ord och begrepp – 1700-talets Sverige (pdf (1).pdf) · 1; Prov – 1700-talets Sverige del 1 · 3c; Elevernas arbetsbok s. 24–39 · 4a",
  "drill": {
   "prompt": "Vad heter en extra viktig lag som är svår att ändra och kan ange hur landet styrs?",
   "answers": [
    "Grundlag"
   ],
   "sample": "Grundlag"
  }
 },
 {
  "id": "material4-sos-stand",
  "chapter": 1,
  "topic": "material-sos-stand",
  "place": "archive",
  "rank": 0,
  "kind": "fields",
  "reviewOnly": true,
  "prompt": "Vilka fyra stånd var representerade i riksdagen?",
  "fields": [
   {
    "label": "Ditt svar",
    "answers": [
     "Adel, präster, borgare och bönder",
     "adel präster borgare bönder",
     "adeln prästerna borgarna och bönderna",
     "adel, präster, borgare och bönder",
     "adel, präster, bönder och borgare",
     "adel, borgare, präster och bönder",
     "adel, borgare, bönder och präster",
     "adel, bönder, präster och borgare",
     "adel, bönder, borgare och präster",
     "präster, adel, borgare och bönder",
     "präster, adel, bönder och borgare",
     "präster, borgare, adel och bönder",
     "präster, borgare, bönder och adel",
     "präster, bönder, adel och borgare",
     "präster, bönder, borgare och adel",
     "borgare, adel, präster och bönder",
     "borgare, adel, bönder och präster",
     "borgare, präster, adel och bönder",
     "borgare, präster, bönder och adel",
     "borgare, bönder, adel och präster",
     "borgare, bönder, präster och adel",
     "bönder, adel, präster och borgare",
     "bönder, adel, borgare och präster",
     "bönder, präster, adel och borgare",
     "bönder, präster, borgare och adel",
     "bönder, borgare, adel och präster",
     "bönder, borgare, präster och adel",
     "adeln, prästerna, borgarna och bönderna",
     "adeln, prästerna, bönderna och borgarna",
     "adeln, borgarna, prästerna och bönderna",
     "adeln, borgarna, bönderna och prästerna",
     "adeln, bönderna, prästerna och borgarna",
     "adeln, bönderna, borgarna och prästerna",
     "prästerna, adeln, borgarna och bönderna",
     "prästerna, adeln, bönderna och borgarna",
     "prästerna, borgarna, adeln och bönderna",
     "prästerna, borgarna, bönderna och adeln",
     "prästerna, bönderna, adeln och borgarna",
     "prästerna, bönderna, borgarna och adeln",
     "borgarna, adeln, prästerna och bönderna",
     "borgarna, adeln, bönderna och prästerna",
     "borgarna, prästerna, adeln och bönderna",
     "borgarna, prästerna, bönderna och adeln",
     "borgarna, bönderna, adeln och prästerna",
     "borgarna, bönderna, prästerna och adeln",
     "bönderna, adeln, prästerna och borgarna",
     "bönderna, adeln, borgarna och prästerna",
     "bönderna, prästerna, adeln och borgarna",
     "bönderna, prästerna, borgarna och adeln",
     "bönderna, borgarna, adeln och prästerna",
     "bönderna, borgarna, prästerna och adeln"
    ],
    "sample": "Adel, präster, borgare och bönder",
    "options": [
     "Adel, präster, borgare och bönder",
     "Adel, präster, soldater och bönder",
     "Adel, präster, borgare och ämbetsmän"
    ]
   }
  ],
  "model": "Adel, präster, borgare och bönder.",
  "hint": "Adel, präster, borgare och bönder.",
  "source": "Bra att veta – 1700-talets Sverige · 1; Prov – 1700-talets Sverige del 1 · 3a",
  "drill": {
   "prompt": "Vilka fyra stånd var representerade i riksdagen?",
   "answers": [
    "Adel, präster, borgare och bönder",
    "adel präster borgare bönder",
    "adeln prästerna borgarna och bönderna",
    "adel, präster, borgare och bönder",
    "adel, präster, bönder och borgare",
    "adel, borgare, präster och bönder",
    "adel, borgare, bönder och präster",
    "adel, bönder, präster och borgare",
    "adel, bönder, borgare och präster",
    "präster, adel, borgare och bönder",
    "präster, adel, bönder och borgare",
    "präster, borgare, adel och bönder",
    "präster, borgare, bönder och adel",
    "präster, bönder, adel och borgare",
    "präster, bönder, borgare och adel",
    "borgare, adel, präster och bönder",
    "borgare, adel, bönder och präster",
    "borgare, präster, adel och bönder",
    "borgare, präster, bönder och adel",
    "borgare, bönder, adel och präster",
    "borgare, bönder, präster och adel",
    "bönder, adel, präster och borgare",
    "bönder, adel, borgare och präster",
    "bönder, präster, adel och borgare",
    "bönder, präster, borgare och adel",
    "bönder, borgare, adel och präster",
    "bönder, borgare, präster och adel",
    "adeln, prästerna, borgarna och bönderna",
    "adeln, prästerna, bönderna och borgarna",
    "adeln, borgarna, prästerna och bönderna",
    "adeln, borgarna, bönderna och prästerna",
    "adeln, bönderna, prästerna och borgarna",
    "adeln, bönderna, borgarna och prästerna",
    "prästerna, adeln, borgarna och bönderna",
    "prästerna, adeln, bönderna och borgarna",
    "prästerna, borgarna, adeln och bönderna",
    "prästerna, borgarna, bönderna och adeln",
    "prästerna, bönderna, adeln och borgarna",
    "prästerna, bönderna, borgarna och adeln",
    "borgarna, adeln, prästerna och bönderna",
    "borgarna, adeln, bönderna och prästerna",
    "borgarna, prästerna, adeln och bönderna",
    "borgarna, prästerna, bönderna och adeln",
    "borgarna, bönderna, adeln och prästerna",
    "borgarna, bönderna, prästerna och adeln",
    "bönderna, adeln, prästerna och borgarna",
    "bönderna, adeln, borgarna och prästerna",
    "bönderna, prästerna, adeln och borgarna",
    "bönderna, prästerna, borgarna och adeln",
    "bönderna, borgarna, adeln och prästerna",
    "bönderna, borgarna, prästerna och adeln"
   ],
   "sample": "Adel, präster, borgare och bönder"
  }
 },
 {
  "id": "material4-sos-bonder-inflytande",
  "chapter": 1,
  "topic": "material-sos-bonder-inflytande",
  "place": "archive",
  "rank": 0,
  "kind": "fields",
  "reviewOnly": true,
  "prompt": "Vilket stånd fick inte vara med och välja riksrådets medlemmar?",
  "fields": [
   {
    "label": "Ditt svar",
    "answers": [
     "Bönderna",
     "bönder"
    ],
    "sample": "Bönderna",
    "options": [
     "Bönderna",
     "Borgarna",
     "Prästerna"
    ]
   }
  ],
  "model": "Bönderna.",
  "hint": "Bönderna.",
  "source": "Bedömningsstöd del 1 · 2; Lärarguide – Frihetstiden · facit s.65 fråga 3; Elevernas arbetsbok s. 24–39 · 4c",
  "drill": {
   "prompt": "Vilket stånd fick inte vara med och välja riksrådets medlemmar?",
   "answers": [
    "Bönderna",
    "bönder"
   ],
   "sample": "Bönderna"
  }
 },
 {
  "id": "material4-sos-kompani",
  "chapter": 1,
  "topic": "material-sos-kompani",
  "place": "archive",
  "rank": 0,
  "kind": "fields",
  "reviewOnly": true,
  "prompt": "Vilket svenskt handelsbolag skickade skepp till Kina?",
  "fields": [
   {
    "label": "Ditt svar",
    "answers": [
     "Ostindiska kompaniet",
     "svenska ostindiska kompaniet"
    ],
    "sample": "Ostindiska kompaniet",
    "options": [
     "Ostindiska kompaniet",
     "Svenska Afrikakompaniet",
     "Svenska Västindiska handelsbolaget"
    ]
   }
  ],
  "model": "Ostindiska kompaniet.",
  "hint": "Ostindiska kompaniet.",
  "source": "Bra att veta – 1700-talets Sverige · 2; Ord och begrepp – 1700-talets Sverige (pdf (1).pdf) · 1; Prov – 1700-talets Sverige del 1 · 2; Elevernas arbetsbok s. 24–39 · 3",
  "drill": {
   "prompt": "Vilket svenskt handelsbolag skickade skepp till Kina?",
   "answers": [
    "Ostindiska kompaniet",
    "svenska ostindiska kompaniet"
   ],
   "sample": "Ostindiska kompaniet"
  }
 },
 {
  "id": "material4-sos-kina",
  "chapter": 1,
  "topic": "material-sos-kina",
  "place": "archive",
  "rank": 0,
  "kind": "fields",
  "reviewOnly": true,
  "prompt": "Till vilket land seglade Ostindiska kompaniets skepp för att handla?",
  "fields": [
   {
    "label": "Ditt svar",
    "answers": [
     "Kina"
    ],
    "sample": "Kina",
    "options": [
     "Kina",
     "Indien",
     "Japan"
    ]
   }
  ],
  "model": "Kina.",
  "hint": "Kina.",
  "source": "Bra att veta – 1700-talets Sverige · 2",
  "drill": {
   "prompt": "Till vilket land seglade Ostindiska kompaniets skepp för att handla?",
   "answers": [
    "Kina"
   ],
   "sample": "Kina"
  }
 },
 {
  "id": "material4-sos-goteborg",
  "chapter": 1,
  "topic": "material-sos-goteborg",
  "place": "archive",
  "rank": 0,
  "kind": "fields",
  "reviewOnly": true,
  "prompt": "Från vilken svensk stad seglade kompaniets skepp?",
  "fields": [
   {
    "label": "Ditt svar",
    "answers": [
     "Göteborg"
    ],
    "sample": "Göteborg",
    "options": [
     "Göteborg",
     "Stockholm",
     "Karlskrona"
    ]
   }
  ],
  "model": "Göteborg.",
  "hint": "Göteborg.",
  "source": "Bra att veta – 1700-talets Sverige · 2",
  "drill": {
   "prompt": "Från vilken svensk stad seglade kompaniets skepp?",
   "answers": [
    "Göteborg"
   ],
   "sample": "Göteborg"
  }
 },
 {
  "id": "material4-sos-kompanivaror",
  "chapter": 1,
  "topic": "material-sos-kompanivaror",
  "place": "archive",
  "rank": 0,
  "kind": "fields",
  "reviewOnly": true,
  "prompt": "Vilka tre varor köpte kompaniet i Kina enligt texten?",
  "fields": [
   {
    "label": "Ditt svar",
    "answers": [
     "Te, siden och porslin",
     "te siden porslin",
     "porslin siden och te",
     "siden te och porslin",
     "te porslin och siden",
     "porslin te och siden",
     "siden porslin och te"
    ],
    "sample": "Te, siden och porslin",
    "options": [
     "Te, siden och porslin",
     "Te, bomull och kryddor",
     "Kaffe, socker och tobak"
    ]
   }
  ],
  "model": "Te, siden och porslin.",
  "hint": "Te, siden och porslin.",
  "source": "Bra att veta – 1700-talets Sverige · 2; Prov – 1700-talets Sverige del 1 · 1a",
  "drill": {
   "prompt": "Vilka tre varor köpte kompaniet i Kina enligt texten?",
   "answers": [
    "Te, siden och porslin",
    "te siden porslin",
    "porslin siden och te",
    "siden te och porslin",
    "te porslin och siden",
    "porslin te och siden",
    "siden porslin och te"
   ],
   "sample": "Te, siden och porslin"
  }
 },
 {
  "id": "material4-sos-grundlag-svarandrad",
  "chapter": 1,
  "topic": "material-sos-grundlag-svarandrad",
  "place": "archive",
  "rank": 0,
  "kind": "fields",
  "reviewOnly": true,
  "prompt": "Vad skiljer en grundlag från en vanlig lag när man vill ändra den?",
  "fields": [
   {
    "label": "Ditt svar",
    "answers": [
     "Den är svårare att ändra",
     "svårare att ändra",
     "svår att ändra",
     "mycket svår att ändra"
    ],
    "sample": "Den är svårare att ändra",
    "options": [
     "Den är svårare att ändra",
     "Den ändras av en enda minister",
     "Den ändras automatiskt varje år"
    ]
   }
  ],
  "model": "Den är svårare att ändra.",
  "hint": "Den är svårare att ändra.",
  "source": "Bra att veta – 1700-talets Sverige · 1; Bedömningsstöd del 1 · 2; Prov – 1700-talets Sverige del 1 · 3c; Elevernas arbetsbok s. 24–39 · 4b",
  "drill": {
   "prompt": "Vad skiljer en grundlag från en vanlig lag när man vill ändra den?",
   "answers": [
    "Den är svårare att ändra",
    "svårare att ändra",
    "svår att ändra",
    "mycket svår att ändra"
   ],
   "sample": "Den är svårare att ändra"
  }
 },
 {
  "id": "material4-sos-barnhus",
  "chapter": 2,
  "topic": "material-sos-barnhus",
  "place": "archive",
  "rank": 0,
  "kind": "fields",
  "reviewOnly": true,
  "prompt": "Vad kallades hus där barn utan någon som kunde ta hand om dem fick bo?",
  "fields": [
   {
    "label": "Ditt svar",
    "answers": [
     "Barnhus"
    ],
    "sample": "Barnhus",
    "options": [
     "Barnhus",
     "Fattighus",
     "Arbetshus"
    ]
   }
  ],
  "model": "Barnhus.",
  "hint": "Barnhus.",
  "source": "Bra att veta – 1700-talets Sverige · 3; Ord och begrepp – 1700-talets Sverige (pdf (1).pdf) · 1; Elevernas arbetsbok s. 24–39 · 7",
  "drill": {
   "prompt": "Vad kallades hus där barn utan någon som kunde ta hand om dem fick bo?",
   "answers": [
    "Barnhus"
   ],
   "sample": "Barnhus"
  }
 },
 {
  "id": "material4-sos-barnhus-arbete",
  "chapter": 2,
  "topic": "material-sos-barnhus-arbete",
  "place": "archive",
  "rank": 0,
  "kind": "fields",
  "reviewOnly": true,
  "prompt": "Vad tvingades barnen på barnhus göra under långa dagar?",
  "fields": [
   {
    "label": "Ditt svar",
    "answers": [
     "Arbeta",
     "arbeta hårt",
     "hårt arbete"
    ],
    "sample": "Arbeta"
   }
  ],
  "model": "Arbeta.",
  "hint": "Arbeta.",
  "source": "Bra att veta – 1700-talets Sverige · 3; Bedömningsstöd del 1 · 4; Elevernas arbetsbok s. 24–39 · 7b",
  "drill": {
   "prompt": "Vad tvingades barnen på barnhus göra under långa dagar?",
   "answers": [
    "Arbeta",
    "arbeta hårt",
    "hårt arbete"
   ],
   "sample": "Arbeta"
  }
 },
 {
  "id": "material4-sos-aga",
  "chapter": 2,
  "topic": "material-sos-aga",
  "place": "archive",
  "rank": 0,
  "kind": "fields",
  "reviewOnly": true,
  "prompt": "Vilket ord betyder att slå någon för att straffa eller uppfostra?",
  "fields": [
   {
    "label": "Ditt svar",
    "answers": [
     "Aga"
    ],
    "sample": "Aga",
    "options": [
     "Aga",
     "Förmaning",
     "Böter"
    ]
   }
  ],
  "model": "Aga.",
  "hint": "Aga.",
  "source": "Prov – 1700-talets Sverige del 1 · 6; Elevernas arbetsbok s. 24–39 · 5",
  "drill": {
   "prompt": "Vilket ord betyder att slå någon för att straffa eller uppfostra?",
   "answers": [
    "Aga"
   ],
   "sample": "Aga"
  }
 },
 {
  "id": "material4-sos-kolt",
  "chapter": 2,
  "topic": "material-sos-kolt",
  "place": "archive",
  "rank": 0,
  "kind": "fields",
  "reviewOnly": true,
  "prompt": "Vad kallades ett plagg som liknade en lång skjorta?",
  "fields": [
   {
    "label": "Ditt svar",
    "answers": [
     "Kolt"
    ],
    "sample": "Kolt",
    "options": [
     "Kolt",
     "Livstycke",
     "Kappa"
    ]
   }
  ],
  "model": "Kolt.",
  "hint": "Kolt.",
  "source": "Prov – 1700-talets Sverige del 1 · 6",
  "drill": {
   "prompt": "Vad kallades ett plagg som liknade en lång skjorta?",
   "answers": [
    "Kolt"
   ],
   "sample": "Kolt"
  }
 },
 {
  "id": "material4-sos-oakta",
  "chapter": 2,
  "topic": "material-sos-oakta",
  "place": "archive",
  "rank": 0,
  "kind": "fields",
  "reviewOnly": true,
  "prompt": "Vilket nedsättande ord användes om barn som föddes utanför äktenskapet?",
  "fields": [
   {
    "label": "Ditt svar",
    "answers": [
     "Oäkta"
    ],
    "sample": "Oäkta",
    "options": [
     "Oäkta",
     "Föräldralös",
     "Omyndig"
    ]
   }
  ],
  "model": "Oäkta var dåtidens nedsättande benämning. Den beskriver inte ett barns värde.",
  "hint": "Oäkta var dåtidens nedsättande benämning. Den beskriver inte ett barns värde.",
  "source": "Prov – 1700-talets Sverige del 1 · 6; Grundboken s. 82–83 · 83",
  "drill": {
   "prompt": "Vilket nedsättande ord användes om barn som föddes utanför äktenskapet?",
   "answers": [
    "Oäkta"
   ],
   "sample": "Oäkta"
  }
 },
 {
  "id": "material4-sos-skampale",
  "chapter": 2,
  "topic": "material-sos-skampale",
  "place": "archive",
  "rank": 0,
  "kind": "fields",
  "reviewOnly": true,
  "prompt": "Vad kallades platsen där en person kunde ställas för att skämmas inför andra?",
  "fields": [
   {
    "label": "Ditt svar",
    "answers": [
     "Skampåle"
    ],
    "sample": "Skampåle",
    "options": [
     "Skampåle",
     "Spöpåle",
     "Straffstock"
    ]
   }
  ],
  "model": "Skampåle.",
  "hint": "Skampåle.",
  "source": "Prov – 1700-talets Sverige del 1 · 6",
  "drill": {
   "prompt": "Vad kallades platsen där en person kunde ställas för att skämmas inför andra?",
   "answers": [
    "Skampåle"
   ],
   "sample": "Skampåle"
  }
 },
 {
  "id": "material4-sos-ogift-straff",
  "chapter": 2,
  "topic": "material-sos-ogift-straff",
  "place": "archive",
  "rank": 0,
  "kind": "fields",
  "reviewOnly": true,
  "prompt": "Vilken sorts straff kunde en ogift kvinna som fick barn få, utöver böter?",
  "fields": [
   {
    "label": "Ditt svar",
    "answers": [
     "Skamstraff",
     "stå och skämmas i kyrkan",
     "skämmas i kyrkan"
    ],
    "sample": "Skamstraff"
   }
  ],
  "model": "Skamstraff.",
  "hint": "Skamstraff.",
  "source": "Bedömningsstöd del 1 · 2–3; Prov – 1700-talets Sverige del 1 · 4a; Elevernas arbetsbok s. 24–39 · 6",
  "drill": {
   "prompt": "Vilken sorts straff kunde en ogift kvinna som fick barn få, utöver böter?",
   "answers": [
    "Skamstraff",
    "stå och skämmas i kyrkan",
    "skämmas i kyrkan"
   ],
   "sample": "Skamstraff"
  }
 },
 {
  "id": "material4-sos-hattar-mossor",
  "chapter": 3,
  "topic": "material-sos-hattar-mossor",
  "place": "archive",
  "rank": 0,
  "kind": "fields",
  "reviewOnly": true,
  "prompt": "Vad hette de två politiska grupperna i riksdagen?",
  "fields": [
   {
    "label": "Ditt svar",
    "answers": [
     "Hattar och mössor",
     "hattarna och mössorna"
    ],
    "sample": "Hattar och mössor",
    "options": [
     "Hattar och mössor",
     "Hattar och västar",
     "Mössor och rockar"
    ]
   }
  ],
  "model": "Hattar och mössor.",
  "hint": "Hattar och mössor.",
  "source": "Bra att veta – 1700-talets Sverige · 1; Ord och begrepp – 1700-talets Sverige (pdf (1).pdf) · 1; Prov – 1700-talets Sverige del 1 · 6; Elevernas arbetsbok s. 24–39 · 8",
  "drill": {
   "prompt": "Vad hette de två politiska grupperna i riksdagen?",
   "answers": [
    "Hattar och mössor",
    "hattarna och mössorna"
   ],
   "sample": "Hattar och mössor"
  }
 },
 {
  "id": "material4-sos-hattar-krig",
  "chapter": 3,
  "topic": "material-sos-hattar-krig",
  "place": "archive",
  "rank": 0,
  "kind": "fields",
  "reviewOnly": true,
  "prompt": "Vilken grupp ville starta krig mot Ryssland?",
  "fields": [
   {
    "label": "Ditt svar",
    "answers": [
     "Hattarna",
     "hattar"
    ],
    "sample": "Hattarna",
    "options": [
     "Hattarna",
     "Mössorna",
     "Böndernas stånd"
    ]
   }
  ],
  "model": "Hattarna.",
  "hint": "Hattarna.",
  "source": "Lärarguide – Krig eller fred? · Hattar och mössor; Elevernas arbetsbok s. 24–39 · 8",
  "drill": {
   "prompt": "Vilken grupp ville starta krig mot Ryssland?",
   "answers": [
    "Hattarna",
    "hattar"
   ],
   "sample": "Hattarna"
  }
 },
 {
  "id": "material4-sos-hattar-frankrike",
  "chapter": 3,
  "topic": "material-sos-hattar-frankrike",
  "place": "archive",
  "rank": 0,
  "kind": "fields",
  "reviewOnly": true,
  "prompt": "Vilket land ville hattarna samarbeta med?",
  "fields": [
   {
    "label": "Ditt svar",
    "answers": [
     "Frankrike"
    ],
    "sample": "Frankrike",
    "options": [
     "Frankrike",
     "Storbritannien",
     "Ryssland"
    ]
   }
  ],
  "model": "Frankrike.",
  "hint": "Frankrike.",
  "source": "Lärarguide – Krig eller fred? · Hattar och mössor; Elevernas arbetsbok s. 24–39 · 8",
  "drill": {
   "prompt": "Vilket land ville hattarna samarbeta med?",
   "answers": [
    "Frankrike"
   ],
   "sample": "Frankrike"
  }
 },
 {
  "id": "material4-sos-mossor-england",
  "chapter": 3,
  "topic": "material-sos-mossor-england",
  "place": "archive",
  "rank": 0,
  "kind": "fields",
  "reviewOnly": true,
  "prompt": "Vilket land ville mössorna samarbeta med?",
  "fields": [
   {
    "label": "Ditt svar",
    "answers": [
     "England",
     "Storbritannien"
    ],
    "sample": "England",
    "options": [
     "England",
     "Frankrike",
     "Spanien"
    ]
   }
  ],
  "model": "England.",
  "hint": "England.",
  "source": "Lärarguide – Krig eller fred? · Hattar och mössor; Elevernas arbetsbok s. 24–39 · 8",
  "drill": {
   "prompt": "Vilket land ville mössorna samarbeta med?",
   "answers": [
    "England",
    "Storbritannien"
   ],
   "sample": "England"
  }
 },
 {
  "id": "material4-sos-ryssland-1741",
  "chapter": 3,
  "topic": "material-sos-ryssland-1741",
  "place": "archive",
  "rank": 0,
  "kind": "fields",
  "reviewOnly": true,
  "prompt": "Mot vilket land började Sverige kriga 1741?",
  "fields": [
   {
    "label": "Ditt svar",
    "answers": [
     "Ryssland"
    ],
    "sample": "Ryssland",
    "options": [
     "Ryssland",
     "Danmark",
     "Preussen"
    ]
   }
  ],
  "model": "Ryssland.",
  "hint": "Ryssland.",
  "source": "Bra att veta – 1700-talets Sverige · 2; Lärarguide – Krig eller fred? · Krig eller fred; Elevernas arbetsbok s. 24–39 · 9",
  "drill": {
   "prompt": "Mot vilket land började Sverige kriga 1741?",
   "answers": [
    "Ryssland"
   ],
   "sample": "Ryssland"
  }
 },
 {
  "id": "material4-sos-daldans",
  "chapter": 3,
  "topic": "material-sos-daldans",
  "place": "archive",
  "rank": 0,
  "kind": "fields",
  "reviewOnly": true,
  "prompt": "Vad kallas böndernas uppror och marsch från Dalarna till Stockholm?",
  "fields": [
   {
    "label": "Ditt svar",
    "answers": [
     "Stora daldansen",
     "den stora daldansen"
    ],
    "sample": "Stora daldansen"
   }
  ],
  "model": "Stora daldansen.",
  "hint": "Stora daldansen.",
  "source": "Bra att veta – 1700-talets Sverige · 2; Ord och begrepp – 1700-talets Sverige (pdf (1).pdf) · 1; Elevernas arbetsbok s. 24–39 · 10",
  "drill": {
   "prompt": "Vad kallas böndernas uppror och marsch från Dalarna till Stockholm?",
   "answers": [
    "Stora daldansen",
    "den stora daldansen"
   ],
   "sample": "Stora daldansen"
  }
 },
 {
  "id": "material4-sos-budkavle",
  "chapter": 3,
  "topic": "material-sos-budkavle",
  "place": "archive",
  "rank": 0,
  "kind": "fields",
  "reviewOnly": true,
  "prompt": "Vad hette föremålet som skickades mellan människor för att sprida ett meddelande?",
  "fields": [
   {
    "label": "Ditt svar",
    "answers": [
     "Budkavle"
    ],
    "sample": "Budkavle",
    "options": [
     "Budkavle",
     "Sigillbrev",
     "Protokoll"
    ]
   }
  ],
  "model": "Budkavle.",
  "hint": "Budkavle.",
  "source": "Prov – 1700-talets Sverige del 1 · 7; Bedömningsstöd del 1 · 5",
  "drill": {
   "prompt": "Vad hette föremålet som skickades mellan människor för att sprida ett meddelande?",
   "answers": [
    "Budkavle"
   ],
   "sample": "Budkavle"
  }
 },
 {
  "id": "material4-sos-adolf-fredrik",
  "chapter": 3,
  "topic": "material-sos-adolf-fredrik",
  "place": "archive",
  "rank": 0,
  "kind": "fields",
  "reviewOnly": true,
  "prompt": "Vilken svensk kung fick Ryssland vara med och bestämma att Sverige skulle få?",
  "fields": [
   {
    "label": "Ditt svar",
    "answers": [
     "Adolf Fredrik"
    ],
    "sample": "Adolf Fredrik",
    "options": [
     "Adolf Fredrik",
     "Fredrik I",
     "Gustav III"
    ]
   }
  ],
  "model": "Adolf Fredrik.",
  "hint": "Adolf Fredrik.",
  "source": "Bra att veta – 1700-talets Sverige · 2; Elevernas arbetsbok s. 24–39 · 9",
  "drill": {
   "prompt": "Vilken svensk kung fick Ryssland vara med och bestämma att Sverige skulle få?",
   "answers": [
    "Adolf Fredrik"
   ],
   "sample": "Adolf Fredrik"
  }
 },
 {
  "id": "material4-sos-david",
  "chapter": 3,
  "topic": "material-sos-david",
  "place": "archive",
  "rank": 0,
  "kind": "fields",
  "reviewOnly": true,
  "prompt": "Vilken soldat i materialet vägrade att skjuta på bönderna?",
  "fields": [
   {
    "label": "Ditt svar",
    "answers": [
     "David Hedenquist",
     "David",
     "Hedenquist"
    ],
    "sample": "David Hedenquist",
    "options": [
     "David Hedenquist",
     "Anders Celsius",
     "Jacob Johan Anckarström"
    ]
   }
  ],
  "model": "David Hedenquist.",
  "hint": "David Hedenquist.",
  "source": "Bra att veta – 1700-talets Sverige · 2",
  "drill": {
   "prompt": "Vilken soldat i materialet vägrade att skjuta på bönderna?",
   "answers": [
    "David Hedenquist",
    "David",
    "Hedenquist"
   ],
   "sample": "David Hedenquist"
  }
 },
 {
  "id": "material4-sos-tryckfrihet",
  "chapter": 4,
  "topic": "material-sos-tryckfrihet",
  "place": "archive",
  "rank": 0,
  "kind": "fields",
  "reviewOnly": true,
  "prompt": "Vad kallas friheten att skriva och sprida tryckta texter?",
  "fields": [
   {
    "label": "Ditt svar",
    "answers": [
     "Tryckfrihet"
    ],
    "sample": "Tryckfrihet",
    "options": [
     "Tryckfrihet",
     "Yttrandefrihet",
     "Offentlighetsprincipen"
    ]
   }
  ],
  "model": "Tryckfrihet.",
  "hint": "Tryckfrihet.",
  "source": "Prov – 1700-talets Sverige del 1 · 6; Ord och begrepp – 1700-talets Sverige (pdf (1).pdf) · 1; Elevernas arbetsbok s. 24–39 · 12",
  "drill": {
   "prompt": "Vad kallas friheten att skriva och sprida tryckta texter?",
   "answers": [
    "Tryckfrihet"
   ],
   "sample": "Tryckfrihet"
  }
 },
 {
  "id": "material4-sos-censur",
  "chapter": 4,
  "topic": "material-sos-censur",
  "place": "archive",
  "rank": 0,
  "kind": "fields",
  "reviewOnly": true,
  "prompt": "Vilket ord betyder att de styrande kan granska och stoppa en text innan den trycks?",
  "fields": [
   {
    "label": "Ditt svar",
    "answers": [
     "Censur"
    ],
    "sample": "Censur",
    "options": [
     "Censur",
     "Källkritik",
     "Tryckfrihet"
    ]
   }
  ],
  "model": "Censur.",
  "hint": "Censur.",
  "source": "Prov – 1700-talets Sverige del 1 · 6",
  "drill": {
   "prompt": "Vilket ord betyder att de styrande kan granska och stoppa en text innan den trycks?",
   "answers": [
    "Censur"
   ],
   "sample": "Censur"
  }
 },
 {
  "id": "material4-sos-offentlighet",
  "chapter": 4,
  "topic": "material-sos-offentlighet",
  "place": "archive",
  "rank": 0,
  "kind": "fields",
  "reviewOnly": true,
  "prompt": "Vilken princip ger människor rätt att läsa myndigheters handlingar och beslut?",
  "fields": [
   {
    "label": "Ditt svar",
    "answers": [
     "Offentlighetsprincipen"
    ],
    "sample": "Offentlighetsprincipen",
    "options": [
     "Offentlighetsprincipen",
     "Tryckfrihetsförordningen",
     "Censurförordningen"
    ]
   }
  ],
  "model": "Offentlighetsprincipen.",
  "hint": "Offentlighetsprincipen.",
  "source": "Prov – 1700-talets Sverige del 1 · 6; Ord och begrepp – 1700-talets Sverige (pdf (1).pdf) · 1; Elevernas arbetsbok s. 24–39 · 12",
  "drill": {
   "prompt": "Vilken princip ger människor rätt att läsa myndigheters handlingar och beslut?",
   "answers": [
    "Offentlighetsprincipen"
   ],
   "sample": "Offentlighetsprincipen"
  }
 },
 {
  "id": "material4-sos-katekesen",
  "chapter": 4,
  "topic": "material-sos-katekesen",
  "place": "archive",
  "rank": 0,
  "kind": "fields",
  "reviewOnly": true,
  "prompt": "Vad hette läroboken om det viktigaste i kristendomen?",
  "fields": [
   {
    "label": "Ditt svar",
    "answers": [
     "Katekesen"
    ],
    "sample": "Katekesen",
    "options": [
     "Katekesen",
     "Psalmboken",
     "Husförhörslängden"
    ]
   }
  ],
  "model": "Katekesen.",
  "hint": "Katekesen.",
  "source": "Prov – 1700-talets Sverige del 1 · 6",
  "drill": {
   "prompt": "Vad hette läroboken om det viktigaste i kristendomen?",
   "answers": [
    "Katekesen"
   ],
   "sample": "Katekesen"
  }
 },
 {
  "id": "material4-sos-kyrkan-lasning",
  "chapter": 4,
  "topic": "material-sos-kyrkan-lasning",
  "place": "archive",
  "rank": 0,
  "kind": "fields",
  "reviewOnly": true,
  "prompt": "Vilken institution hade fått uppgiften att lära alla barn läsa?",
  "fields": [
   {
    "label": "Ditt svar",
    "answers": [
     "Kyrkan",
     "svenska kyrkan"
    ],
    "sample": "Kyrkan",
    "options": [
     "Kyrkan",
     "Riksdagen",
     "Skråna"
    ]
   }
  ],
  "model": "Kyrkan.",
  "hint": "Kyrkan.",
  "source": "Lärarguide – Nya tider, nya tankar · facit s.80 fråga 1",
  "drill": {
   "prompt": "Vilken institution hade fått uppgiften att lära alla barn läsa?",
   "answers": [
    "Kyrkan",
    "svenska kyrkan"
   ],
   "sample": "Kyrkan"
  }
 },
 {
  "id": "material4-sos-vetenskap",
  "chapter": 4,
  "topic": "material-sos-vetenskap",
  "place": "archive",
  "rank": 0,
  "kind": "fields",
  "reviewOnly": true,
  "prompt": "Vad kallas kunskap som kommer fram genom forskning?",
  "fields": [
   {
    "label": "Ditt svar",
    "answers": [
     "Vetenskap"
    ],
    "sample": "Vetenskap",
    "options": [
     "Vetenskap",
     "Filosofi",
     "Folktro"
    ]
   }
  ],
  "model": "Vetenskap.",
  "hint": "Vetenskap.",
  "source": "Ord och begrepp – 1700-talets Sverige (pdf (1).pdf) · 1; Bra att veta – 1700-talets Sverige · 3",
  "drill": {
   "prompt": "Vad kallas kunskap som kommer fram genom forskning?",
   "answers": [
    "Vetenskap"
   ],
   "sample": "Vetenskap"
  }
 },
 {
  "id": "material4-sos-linne",
  "chapter": 4,
  "topic": "material-sos-linne",
  "place": "archive",
  "rank": 0,
  "kind": "fields",
  "reviewOnly": true,
  "prompt": "Vilken forskare delade in växter och djur och gav dem latinska namn?",
  "fields": [
   {
    "label": "Ditt svar",
    "answers": [
     "Carl von Linné",
     "Linné",
     "Carl Linné",
     "von Linné"
    ],
    "sample": "Carl von Linné",
    "options": [
     "Carl von Linné",
     "Anders Celsius",
     "Carl Wilhelm Scheele"
    ]
   }
  ],
  "model": "Carl von Linné.",
  "hint": "Carl von Linné.",
  "source": "Bra att veta – 1700-talets Sverige · 3; Bedömningsstöd del 1 · 6; Elevernas arbetsbok s. 24–39 · 14",
  "drill": {
   "prompt": "Vilken forskare delade in växter och djur och gav dem latinska namn?",
   "answers": [
    "Carl von Linné",
    "Linné",
    "Carl Linné",
    "von Linné"
   ],
   "sample": "Carl von Linné"
  }
 },
 {
  "id": "material4-sos-latin",
  "chapter": 4,
  "topic": "material-sos-latin",
  "place": "archive",
  "rank": 0,
  "kind": "fields",
  "reviewOnly": true,
  "prompt": "På vilket språk gav Linné växter och djur namn?",
  "fields": [
   {
    "label": "Ditt svar",
    "answers": [
     "Latin"
    ],
    "sample": "Latin",
    "options": [
     "Latin",
     "Grekiska",
     "Franska"
    ]
   }
  ],
  "model": "Latin.",
  "hint": "Latin.",
  "source": "Bra att veta – 1700-talets Sverige · 3; Bedömningsstöd del 1 · 6; Elevernas arbetsbok s. 24–39 · 14b",
  "drill": {
   "prompt": "På vilket språk gav Linné växter och djur namn?",
   "answers": [
    "Latin"
   ],
   "sample": "Latin"
  }
 },
 {
  "id": "material4-sos-celsius",
  "chapter": 4,
  "topic": "material-sos-celsius",
  "place": "archive",
  "rank": 0,
  "kind": "fields",
  "reviewOnly": true,
  "prompt": "Vilken forskare ligger bakom systemet för temperaturskalan som nämns i texten?",
  "fields": [
   {
    "label": "Ditt svar",
    "answers": [
     "Anders Celsius",
     "Celsius"
    ],
    "sample": "Anders Celsius",
    "options": [
     "Anders Celsius",
     "Carl von Linné",
     "Carl Wilhelm Scheele"
    ]
   }
  ],
  "model": "Anders Celsius.",
  "hint": "Anders Celsius.",
  "source": "Bra att veta – 1700-talets Sverige · 3; Bedömningsstöd del 1 · 6; Elevernas arbetsbok s. 24–39 · 13",
  "drill": {
   "prompt": "Vilken forskare ligger bakom systemet för temperaturskalan som nämns i texten?",
   "answers": [
    "Anders Celsius",
    "Celsius"
   ],
   "sample": "Anders Celsius"
  }
 },
 {
  "id": "material4-sos-scheele",
  "chapter": 4,
  "topic": "material-sos-scheele",
  "place": "archive",
  "rank": 0,
  "kind": "fields",
  "reviewOnly": true,
  "prompt": "Vilken apotekare forskade i kemi och upptäckte syre i luften?",
  "fields": [
   {
    "label": "Ditt svar",
    "answers": [
     "Carl Wilhelm Scheele",
     "Scheele",
     "Carl Vilhelm Scheele"
    ],
    "sample": "Carl Wilhelm Scheele",
    "options": [
     "Carl Wilhelm Scheele",
     "Anders Celsius",
     "Carl von Linné"
    ]
   }
  ],
  "model": "Carl Wilhelm Scheele.",
  "hint": "Carl Wilhelm Scheele.",
  "source": "Bedömningsstöd del 1 · 6; Elevernas arbetsbok s. 24–39 · 13",
  "drill": {
   "prompt": "Vilken apotekare forskade i kemi och upptäckte syre i luften?",
   "answers": [
    "Carl Wilhelm Scheele",
    "Scheele",
    "Carl Vilhelm Scheele"
   ],
   "sample": "Carl Wilhelm Scheele"
  }
 },
 {
  "id": "material4-sos-syre",
  "chapter": 4,
  "topic": "material-sos-syre",
  "place": "archive",
  "rank": 0,
  "kind": "fields",
  "reviewOnly": true,
  "prompt": "Vilken gas i luften förknippas med Scheeles upptäckt?",
  "fields": [
   {
    "label": "Ditt svar",
    "answers": [
     "Syre"
    ],
    "sample": "Syre",
    "options": [
     "Syre",
     "Kväve",
     "Koldioxid"
    ]
   }
  ],
  "model": "Syre.",
  "hint": "Syre.",
  "source": "Bedömningsstöd del 1 · 6; Elevernas arbetsbok s. 24–39 · 13",
  "drill": {
   "prompt": "Vilken gas i luften förknippas med Scheeles upptäckt?",
   "answers": [
    "Syre"
   ],
   "sample": "Syre"
  }
 },
 {
  "id": "material4-sos-ekeblad",
  "chapter": 4,
  "topic": "material-sos-ekeblad",
  "place": "archive",
  "rank": 0,
  "kind": "fields",
  "reviewOnly": true,
  "prompt": "Vem blev den första kvinnan i Vetenskapsakademien?",
  "fields": [
   {
    "label": "Ditt svar",
    "answers": [
     "Eva Ekeblad",
     "Ekeblad"
    ],
    "sample": "Eva Ekeblad",
    "options": [
     "Eva Ekeblad",
     "Anna Maria Lenngren",
     "Hedvig Charlotta Nordenflycht"
    ]
   }
  ],
  "model": "Eva Ekeblad.",
  "hint": "Eva Ekeblad.",
  "source": "Bra att veta – 1700-talets Sverige · 3; Elevernas arbetsbok s. 24–39 · 15",
  "drill": {
   "prompt": "Vem blev den första kvinnan i Vetenskapsakademien?",
   "answers": [
    "Eva Ekeblad",
    "Ekeblad"
   ],
   "sample": "Eva Ekeblad"
  }
 },
 {
  "id": "material4-sos-potatis",
  "chapter": 4,
  "topic": "material-sos-potatis",
  "place": "archive",
  "rank": 0,
  "kind": "fields",
  "reviewOnly": true,
  "prompt": "Vilken växt undersökte Eva Ekeblad?",
  "fields": [
   {
    "label": "Ditt svar",
    "answers": [
     "Potatis",
     "potatisen"
    ],
    "sample": "Potatis",
    "options": [
     "Potatis",
     "Rovor",
     "Vete"
    ]
   }
  ],
  "model": "Potatis.",
  "hint": "Potatis.",
  "source": "Bra att veta – 1700-talets Sverige · 3; Bedömningsstöd del 1 · 6; Elevernas arbetsbok s. 24–39 · 15",
  "drill": {
   "prompt": "Vilken växt undersökte Eva Ekeblad?",
   "answers": [
    "Potatis",
    "potatisen"
   ],
   "sample": "Potatis"
  }
 },
 {
  "id": "material4-sos-potatismjol",
  "chapter": 4,
  "topic": "material-sos-potatismjol",
  "place": "archive",
  "rank": 0,
  "kind": "fields",
  "reviewOnly": true,
  "prompt": "Vad kunde man göra av potatis, utöver brännvin, enligt Ekeblads forskning?",
  "fields": [
   {
    "label": "Ditt svar",
    "answers": [
     "Mjöl",
     "potatismjöl"
    ],
    "sample": "Mjöl",
    "options": [
     "Mjöl",
     "Socker",
     "Salt"
    ]
   }
  ],
  "model": "Mjöl.",
  "hint": "Mjöl.",
  "source": "Bedömningsstöd del 1 · 6; Elevernas arbetsbok s. 24–39 · 15c",
  "drill": {
   "prompt": "Vad kunde man göra av potatis, utöver brännvin, enligt Ekeblads forskning?",
   "answers": [
    "Mjöl",
    "potatismjöl"
   ],
   "sample": "Mjöl"
  }
 },
 {
  "id": "material4-sos-potatis-ursprung",
  "chapter": 4,
  "topic": "material-sos-potatis-ursprung",
  "place": "archive",
  "rank": 0,
  "kind": "fields",
  "reviewOnly": true,
  "prompt": "Från vilken världsdel kom potatisen ursprungligen?",
  "fields": [
   {
    "label": "Ditt svar",
    "answers": [
     "Sydamerika"
    ],
    "sample": "Sydamerika",
    "options": [
     "Sydamerika",
     "Nordamerika",
     "Asien"
    ]
   }
  ],
  "model": "Sydamerika.",
  "hint": "Sydamerika.",
  "source": "Prov – 1700-talets Sverige del 1 · 1a; Lärarguide – Nya tider, nya tankar · Jonas Alströmer",
  "drill": {
   "prompt": "Från vilken världsdel kom potatisen ursprungligen?",
   "answers": [
    "Sydamerika"
   ],
   "sample": "Sydamerika"
  }
 },
 {
  "id": "material4-sos-vetenskapsakademi",
  "chapter": 4,
  "topic": "material-sos-vetenskapsakademi",
  "place": "archive",
  "rank": 0,
  "kind": "fields",
  "reviewOnly": true,
  "prompt": "Vilken akademi bildades 1739 för att sprida forskning?",
  "fields": [
   {
    "label": "Ditt svar",
    "answers": [
     "Kungliga Vetenskapsakademien",
     "Vetenskapsakademien"
    ],
    "sample": "Kungliga Vetenskapsakademien",
    "options": [
     "Kungliga Vetenskapsakademien",
     "Svenska Akademien",
     "Kungliga Vitterhetsakademien"
    ]
   }
  ],
  "model": "Kungliga Vetenskapsakademien.",
  "hint": "Kungliga Vetenskapsakademien.",
  "source": "Prov – 1700-talets Sverige del 1 · 9a; Lärarguide – Nya tider, nya tankar · Jonas Alströmer",
  "drill": {
   "prompt": "Vilken akademi bildades 1739 för att sprida forskning?",
   "answers": [
    "Kungliga Vetenskapsakademien",
    "Vetenskapsakademien"
   ],
   "sample": "Kungliga Vetenskapsakademien"
  }
 },
 {
  "id": "material4-sos-tryckfrihet-forst",
  "chapter": 4,
  "topic": "material-sos-tryckfrihet-forst",
  "place": "archive",
  "rank": 0,
  "kind": "fields",
  "reviewOnly": true,
  "prompt": "Vilket land var först i världen med tryckfrihet enligt provets påstående?",
  "fields": [
   {
    "label": "Ditt svar",
    "answers": [
     "Sverige"
    ],
    "sample": "Sverige"
   }
  ],
  "model": "Sverige.",
  "hint": "Sverige.",
  "source": "Prov – 1700-talets Sverige del 1 · 1a",
  "drill": {
   "prompt": "Vilket land var först i världen med tryckfrihet enligt provets påstående?",
   "answers": [
    "Sverige"
   ],
   "sample": "Sverige"
  }
 },
 {
  "id": "material4-tsar",
  "chapter": 3,
  "topic": "material-tsar",
  "place": "archive",
  "rank": 0,
  "kind": "fields",
  "reviewOnly": true,
  "prompt": "Vilket ord är den ryska motsvarigheten till kejsare?",
  "fields": [
   {
    "label": "Titeln",
    "answers": [
     "tsar"
    ],
    "sample": "tsar",
    "options": [
     "Tsar",
     "Riksråd",
     "Stånd"
    ]
   }
  ],
  "model": "Tsar är den ryska motsvarigheten till kejsare.",
  "hint": "Tänk på den ryska härskartiteln.",
  "source": "Prov – 1700-talets Sverige del 1 · 1a",
  "drill": {
   "prompt": "Vilket ord är den ryska motsvarigheten till kejsare?",
   "answers": [
    "tsar"
   ],
   "sample": "tsar"
  }
 }
];
const ids=new Set(window.UPPDRAG_RECALL_BANK.map(t=>t.id));for(const t of cards)if(!ids.has(t.id))window.UPPDRAG_RECALL_BANK.push(t);
window.UPPDRAG_CH4_MATERIAL_REVIEW=cards.map(t=>t.id);
})();
