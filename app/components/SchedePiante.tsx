'use client';

import React, { useState } from 'react';
import { ChevronLeft, Search, Send, ChevronDown, ChevronUp } from 'lucide-react';

// ─── TIPI ────────────────────────────────────────────────────────────────────
type Scheda = {
  id: string;
  nome: string;
  tipo: 'ulivo' | 'agrumi';
  emoji: string;
  origine: string;
  uso: string;
  tagLine: string;
  caratteristiche: string;
  frutto: string;
  piantumazione: string;
  irrigazione: string;
  coltivazione: string;
  potatura: string;
  concimazione: string;
  clima: string;
  malattie: string;
  curiosita: string;
};

// ─── DATI SCHEDE ─────────────────────────────────────────────────────────────
const schede: Scheda[] = [
  // ── ULIVI ──────────────────────────────────────────────────────────────────
  {
    id: 'frantoio',
    nome: 'Frantoio',
    tipo: 'ulivo',
    emoji: '🫒',
    origine: 'Toscana (Lucca, Pistoia, Pisa)',
    uso: 'Olio extravergine di oliva',
    tagLine: 'La cultivar italiana più diffusa nel mondo — olio fruttato, elegante e corposo.',
    caratteristiche: 'Pianta di vigoria medio-elevata con portamento espanso e chioma folta. Albero molto longevo e produttivo, con elevata adattabilità a diversi climi e terreni. Ottimo impollinatore, ma necessita di impollinatori per massimizzare la resa (Leccino, Pendolino).',
    frutto: 'Oliva piccola (2-2,5 g), forma ellissoidale, maturazione tardiva (novembre-dicembre). Resa in olio eccellente: 20-23%. Olio di colore verde intenso con note fruttate di media-alta intensità, sentori di carciofo, mandorla e erba fresca. Amaro e piccante pronunciati.',
    piantumazione: 'Periodo ideale: primavera (marzo-aprile) o autunno (ottobre). Spaziatura consigliata in campo: 5-7 metri tra le piante. Buca di impianto: almeno il doppio della zolla. Aggiungere compost maturo sul fondo.',
    irrigazione: 'Pianta resistente alla siccità una volta adulta. Nei primi 2-3 anni irrigare regolarmente (ogni 7-10 giorni in estate). Piante adulte in piena terra: irrigazione di soccorso nei mesi più caldi (luglio-agosto). In vaso: 2-3 volte a settimana in estate, 1 volta al mese in autunno/primavera.',
    coltivazione: 'Predilige terreno calcareo, ben drenato, con pH 6-8. Ottima adattabilità anche a terreni poveri e declivi. Esposizione in pieno sole (minimo 6 ore al giorno). Distanza minima dal muro: 3 metri.',
    potatura: 'Potatura di produzione: febbraio-marzo, prima della ripresa vegetativa. Rimuovere rami secchi, malati e quelli che crescono verso l\'interno. Mantenere la chioma aperta "a vaso" per favorire luce e arieggiamento. Potatura leggera dopo la raccolta per rimuovere rami esauriti.',
    concimazione: 'Primavera (marzo-aprile): concime azotato per stimolare la vegetazione. Autunno (ottobre-novembre): fosforo e potassio per rafforzare la pianta. Consigliato stallatico pellettato o compost maturo. Ogni 2-3 anni aggiungere sostanza organica al terreno.',
    clima: 'Ottima resistenza al caldo e alla siccità. Tollera temperature fino a -7°C se l\'abbassamento è graduale. Sensibile ai geli improvvisi. Ideale per zone a clima mediterraneo.',
    malattie: 'Mosca dell\'olivo (Bactrocera oleae): la principale minaccia. Prevenire con trappole attrattive. Occhio di pavone: macchie circolari fogliari, trattare con rame. Rogna: noduli su rami, rimuovere e disinfettare. Cocciniglia: olio bianco minerale o neem.',
    curiosita: 'Il Frantoio è la cultivar italiana più coltivata nel mondo. È presente anche in California, Australia, Argentina e Sudafrica. Il suo nome deriva dall\'uso diretto nelle "frantoi" — era la varietà preferita dai produttori di olio per la sua resa costante.',
  },
  {
    id: 'leccino',
    nome: 'Leccino',
    tipo: 'ulivo',
    emoji: '🫒',
    origine: 'Toscana',
    uso: 'Olio extravergine di oliva',
    tagLine: 'La cultivar più resistente e diffusa d\'Italia — delicata, fruttata e adattabile ovunque.',
    caratteristiche: 'Pianta di vigoria elevata, portamento pendulo caratteristico con rami lunghi e arcuati. Alta produttività e grande adattabilità climatica. Ottimo impollinatore per altre cultivar. Notevolmente resistente alle malattie, specialmente alla Xylella fastidiosa.',
    frutto: 'Oliva media (2-3 g), forma ovale-allungata, maturazione precoce (ottobre-novembre). Resa in olio 16-20%. Olio dal colore giallo-verde, fruttato delicato, con sentori di mandorla e mela matura. Amaro e piccante lievi — profilo gustativo morbido e gentile.',
    piantumazione: 'Periodo ideale: primavera (marzo-aprile) o autunno. Distanza in campo: 5-6 metri. Ottima scelta per reimpianti in zone colpite da Xylella. Si adatta facilmente anche a terreni non ideali.',
    irrigazione: 'Buona resistenza alla siccità. Irrigazioni di soccorso in estate per i primi 3 anni. Piante adulte: in media 2-3 irrigazioni nei mesi estivi più caldi. In vaso: annaffiare quando il terreno è asciutto in superficie.',
    coltivazione: 'Altamente adattabile a diversi tipi di terreno. Cresce bene anche in zone collinari e in terreni argillosi. Predilige il pieno sole. Una delle poche cultivar adatte anche alle zone più fredde dell\'areale olivicolo italiano.',
    potatura: 'Potatura annuale in febbraio-marzo. Data la tendenza all\'alternanza di produzione, la potatura regolare è fondamentale per mantenere costante la resa. Sfoltire bene la chioma per favorire la penetrazione della luce.',
    concimazione: 'Come da schema generale: azoto in primavera, fosforo-potassio in autunno. Risponde bene alla concimazione organica con compost.',
    clima: 'Eccellente resistenza al freddo tra le cultivar italiane: sopporta fino a -10°C. Ottima anche nelle zone più settentrionali dell\'olivicoltura italiana. Tollerante al vento.',
    malattie: 'Resistente alla Xylella fastidiosa (battere che ha devastato gli ulivi pugliesi). Sensibile alla mosca dell\'olivo. Buona resistenza generale alle malattie fungine.',
    curiosita: 'Il Leccino è la cultivar italiana più coltivata in assoluto, presente in quasi tutte le regioni. La sua resistenza alla Xylella lo ha reso protagonista dei reimpianti nel Salento devastato dall\'epidemia. Il nome deriva dal termine "leccio" per la somiglianza delle foglie.',
  },
  {
    id: 'moraiolo',
    nome: 'Moraiolo',
    tipo: 'ulivo',
    emoji: '🫒',
    origine: 'Toscana / Umbria',
    uso: 'Olio extravergine di oliva — alta qualità',
    tagLine: 'Olio intenso, ricco di polifenoli e antiossidanti — tra i più pregiati d\'Italia.',
    caratteristiche: 'Pianta di vigoria medio-ridotta, chioma compatta. Autosterile: necessita obbligatoriamente di impollinatori (Frantoio, Pendolino, Maurino). Produzione alternante (anni abbondanti alternati ad anni scarsi). Rusticità elevata, si adatta bene alle zone collinari.',
    frutto: 'Oliva piccola (1,5-2 g), forma sferica, colore nero corvino a maturazione. Maturazione precoce (ottobre-novembre). Resa in olio 18-22%. Olio eccezionale: intensamente fruttato, amaro e piccante pronunciati, altissimo contenuto di polifenoli e vitamina E.',
    piantumazione: 'Piantare sempre in abbinamento con almeno un impollinatore (1 Frantoio ogni 4-5 Moraiolo). Periodo: primavera o autunno. Distanza: 5-6 metri. Ideale per zone collinari 200-600 m s.l.m.',
    irrigazione: 'Buona resistenza alla siccità. Irrigazione di soccorso utile in luglio-agosto. Sensibile ai ristagni idrici — evitare terreni mal drenati.',
    coltivazione: 'Preferisce terreni calcarei, ben drenati, in posizione collinare. Necessita di buona esposizione solare. Evitare zone con forte rischio di gelate tardive primaverili che danneggiano la fioritura.',
    potatura: 'Potatura biennale o annuale leggera. Intervento in febbraio-marzo. La tendenza all\'alternanza si gestisce con potature calibrate: più intensa nell\'anno di carica abbondante.',
    concimazione: 'Risponde molto bene alla concimazione bilanciata. Importante l\'apporto di boro per migliorare l\'allegagione e ridurre l\'alternanza produttiva.',
    clima: 'Resistenza al freddo media (-7/-8°C). Sensibile ai ritorni di gelo in fioritura. Ottimale in zone con inverni freschi ed estate calda — tipicamente zone collinari toscane e umbre.',
    malattie: 'Suscettibile alla mosca dell\'olivo. Discreta resistenza all\'occhio di pavone. Monitorare regolarmente durante la fruttificazione.',
    curiosita: 'Il Moraiolo è considerato la cultivar che produce l\'olio di maggiore qualità aromatica in Italia. L\'olio DOP Umbria e il DOP Toscano prevedono una quota minima di Moraiolo. I suoi altissimi polifenoli lo rendono uno degli oli più salutari in commercio.',
  },
  {
    id: 'koroneiki',
    nome: 'Koroneiki',
    tipo: 'ulivo',
    emoji: '🫒',
    origine: 'Grecia (Peloponneso)',
    uso: 'Olio extravergine di oliva — altissima qualità',
    tagLine: 'La regina degli ulivi greci — olio tra i più ricchi di antiossidanti al mondo.',
    caratteristiche: 'Pianta di vigoria media, portamento espanso. Alta produttività e buona costanza produttiva. Molto utilizzata nei nuovi impianti superintensivi. Tendenza alla vigoria elevata che richiede potature frequenti negli impianti intensivi.',
    frutto: 'Oliva molto piccola (0,5-1,5 g), forma ovale, maturazione tardiva (novembre-dicembre). Resa in olio eccellente: 22-27%. Olio di straordinaria qualità: fruttato intenso, amaro e piccante decisi, altissimo contenuto di polifenoli. Conservabilità ottima.',
    piantumazione: 'Adatta a impianti tradizionali e superintensivi. Distanza impianto tradizionale: 6-7 m. Impianto superintensivo: 1,5 x 4 m. Periodo: primavera. Attenzione: sensibile al freddo, non adatta alle zone più fredde.',
    irrigazione: 'Resistente alla siccità. In impianti intensivi l\'irrigazione a goccia aumenta notevolmente la produttività. Irrigare regolarmente nei primi 2 anni di impianto.',
    coltivazione: 'Adatta a zone a clima mediterraneo caldo. Preferisce terreni drenati e soleggiati. Ottima per zone costiere e sub-costiere. Non adatta a zone con gelate frequenti.',
    potatura: 'Potatura annuale in febbraio-marzo. Negli impianti superintensivi la gestione della chioma è critica — intervenire più frequentemente. Mantenere la chioma aperta e ben illuminata.',
    concimazione: 'Schema classico: azoto in primavera, fosforo-potassio in autunno. In impianti irrigui può beneficiare di fertirrigazione regolare.',
    clima: 'Sensibile al freddo: danni seri sotto -5/-6°C. Ottimale in zone costiere mediterranee con inverni miti. Tollera bene il caldo secco estivo.',
    malattie: 'Suscettibile alla mosca dell\'olivo più di altre cultivar. Monitoraggio e trattamenti preventivi fondamentali. Buona resistenza alle malattie fungine.',
    curiosita: 'In Grecia la Koroneiki rappresenta il 50% di tutti gli ulivi coltivati. L\'olio greco, famoso per i suoi benefici salutari, è prodotto principalmente da questa varietà. Studi scientifici hanno dimostrato che il suo olio ha uno dei più alti contenuti di oleocantale — il composto anti-infiammatorio dell\'olio d\'oliva.',
  },
  {
    id: 'coratina',
    nome: 'Coratina',
    tipo: 'ulivo',
    emoji: '🫒',
    origine: 'Puglia (provincia di Bari)',
    uso: 'Olio extravergine di oliva — alta qualità',
    tagLine: 'L\'olio più potente d\'Italia — record mondiale di polifenoli e antiossidanti.',
    caratteristiche: 'Pianta vigorosa e di grandi dimensioni, portamento espanso. Alta e costante produttività. Tra le cultivar con maggiore resa in olio. Tende all\'alternanza produttiva se non ben gestita. Autofertile, non necessita di impollinatori.',
    frutto: 'Oliva media-grande (4-5 g), leggermente asimmetrica. Maturazione tardiva (novembre-dicembre). Resa in olio: 18-24%. Olio dal profilo intensissimo: amaro e piccante molto pronunciati, altissimo contenuto di polifenoli. Non per tutti i palati ma di straordinario valore nutrizionale.',
    piantumazione: 'Distanza: 6-8 metri. Periodo: primavera o autunno. Adatta a grandi impianti. Richiede terreni profondi per ospitare l\'apparato radicale molto sviluppato.',
    irrigazione: 'Eccellente resistenza alla siccità — una delle più resistenti tra le cultivar italiane. Irrigazione utile ma non indispensabile nelle zone con precipitazioni superiori a 500 mm/anno.',
    coltivazione: 'Preferisce terreni profondi, calcarei, ben drenati. Ottima in pianura e collina bassa. Clima caldo-asciutto ideale. Zona di elezione: l\'alta Murgia pugliese.',
    potatura: 'Potatura ogni 2 anni in febbraio-marzo. Data la vigoria elevata, potature più decise per contenere la chioma e stimolare la fruttificazione sui rami nuovi.',
    concimazione: 'Risponde bene alla concimazione organica. In suoli poveri, integrare con concimi minerali bilanciati NPK. Importante il boro per ridurre l\'alternanza.',
    clima: 'Ottima resistenza al caldo e alla siccità. Tollera freddo fino a -8°C. Clima ideale: mediterraneo caldo con estati secche e inverni miti-freschi.',
    malattie: 'Suscettibile alla mosca dell\'olivo. Relativamente resistente alle malattie fungine. Monitorare la rogna dell\'olivo.',
    curiosita: 'La Coratina ha vinto numerosi premi internazionali come miglior olio monocultivar. Il suo olio è ricercatissimo dagli appassionati per la sua intensità. Il nome deriva da Corato, comune pugliese nella città metropolitana di Bari.',
  },
  {
    id: 'nocellara',
    nome: 'Nocellara del Belice',
    tipo: 'ulivo',
    emoji: '🫒',
    origine: 'Sicilia (Valle del Belice, Agrigento-Trapani)',
    uso: 'Duplice attitudine: olive da tavola e olio extravergine',
    tagLine: 'L\'oliva siciliana più famosa — eccellente sia in tavola che come olio.',
    caratteristiche: 'Pianta di vigoria media, portamento espanso con chioma ampia. Produttività elevata e costante. La varietà siciliana più apprezzata a livello internazionale. DOP Valle del Belice. Richiede impollinatori (Biancolilla, Cerasuola).',
    frutto: 'Oliva grande (5-8 g), forma ellissoidale, buccia verde che vira al giallo-arancio. Polpa abbondante e succosa, sapore dolce e aromatico. Resa in olio 18-22%. Olio fruttato medio-intenso con note di pomodoro verde, erbe selvatiche e mandorla.',
    piantumazione: 'Distanza: 6-8 metri. Periodo: primavera (marzo-aprile) o autunno. Necessita di impollinatori: piantare 1 impollinatore ogni 5-6 piante di Nocellara.',
    irrigazione: 'Resistente alla siccità ma risponde molto bene all\'irrigazione: aumenta la pezzatura del frutto. Irrigare in luglio-agosto per ottenere frutti più grandi e migliore qualità.',
    coltivazione: 'Preferisce zone costiere e sub-costiere siciliane. Adatta anche ad altre regioni del Sud Italia. Terreno: calcareo, ben drenato. Esposizione soleggiata.',
    potatura: 'Potatura annuale in febbraio-marzo. Mantenere la chioma arieggiata per ridurre umidità e malattie fungine.',
    concimazione: 'Schema classico primavera-autunno. Per ottenere olive da tavola di grande pezzatura, aumentare leggermente l\'apporto di potassio.',
    clima: 'Adatta al clima siciliano e del Sud Italia. Tollera il caldo estivo. Sensibile ai geli forti: evitare zone con temperature inferiori a -5°C.',
    malattie: 'Sensibile all\'antracnosi (Colletotrichum) — malattia fungina che danneggia i frutti. Monitorare in autunno con tempo umido. Trattamenti preventivi con rame.',
    curiosita: 'La Nocellara del Belice è l\'oliva italiana più consumata come oliva da tavola. È prodotta con il metodo tradizionale siciliano "verde in salamoia". Il presidio Slow Food la tutela come eccellenza gastronomica italiana.',
  },
  {
    id: 'taggiasca',
    nome: 'Taggiasca',
    tipo: 'ulivo',
    emoji: '🫒',
    origine: 'Liguria (Imperia, Taggia)',
    uso: 'Olive da tavola e olio extravergine — DOP Riviera Ligure',
    tagLine: 'Piccola, delicata e aromatica — l\'oliva ligure per eccellenza.',
    caratteristiche: 'Pianta di vigoria media-ridotta, portamento espanso e piangente. Molto decorativa, adatta anche a giardini ornamentali. Produttività buona e relativamente costante. Buona resistenza alle malattie.',
    frutto: 'Oliva piccola (1,5-3 g), forma ovale, matura da verde a viola-nero. Polpa tenera e oleosa con sapore dolce e delicato. Resa in olio 20-26%. Olio dal profilo delicato: fruttato leggero con note di mandorla, fiori e frutta matura. Bassi livelli di amaro e piccante.',
    piantumazione: 'Distanza: 5-6 metri. Periodo: primavera o autunno. Adatta sia a impianti tradizionali che a terrazze e giardini. Ideale anche in vaso grande (Ø 60-80 cm).',
    irrigazione: 'Moderata resistenza alla siccità. In Liguria beneficia delle piogge costanti. In zone più aride, irrigare regolarmente in estate.',
    coltivazione: 'Si adatta bene a terreni declivi e terrazzati. Ottima per zone costiere con clima mite. Cresce anche in zone più fredde rispetto ad altre cultivar meridionali.',
    potatura: 'Potatura leggera annuale in febbraio-marzo. Il portamento naturale è già armonioso — interventi moderati per mantenere la forma.',
    concimazione: 'Concimazione leggera con fertilizzanti organici. Evitare eccessi di azoto che favoriscono la crescita vegetativa a scapito della produzione.',
    clima: 'Buona resistenza al freddo rispetto ad altre cultivar meridionali (fino a -8°C). Adatta alle zone costiere del Centro-Nord. Teme i venti freddi e secchi.',
    malattie: 'Buona resistenza generale. Monitorare la mosca dell\'olivo e l\'occhio di pavone.',
    curiosita: 'La Taggiasca è la cultivar preferita dagli chef per le olive da tavola grazie al suo sapore dolce e la polpa tenera. È l\'ingrediente principale della famosa "pasta alla ligure" e della riviera di Ponente. Sott\'olio o in salamoia, è un\'eccellenza gastronomica italiana riconosciuta.',
  },
  {
    id: 'bosana',
    nome: 'Bosana',
    tipo: 'ulivo',
    emoji: '🫒',
    origine: 'Sardegna',
    uso: 'Olio extravergine di oliva — DOP Sardegna',
    tagLine: 'La cultivar sarda per eccellenza — olio robusto con carattere mediterraneo autentico.',
    caratteristiche: 'Pianta molto vigorosa e longeva, con portamento espanso. La varietà più diffusa in Sardegna. Alta produttività ma con tendenza all\'alternanza. Radici molto profonde — ottima resistenza alla siccità. Autofertile.',
    frutto: 'Oliva media (2-4 g), forma ovale. Maturazione tardiva (novembre-dicembre). Resa in olio 16-22%. Olio di carattere deciso: fruttato medio-intenso, amaro e piccante pronunciati, con note di erbe aromatiche mediterranee e cardo.',
    piantumazione: 'Distanza: 6-8 metri. Periodo: autunno (ottobre-novembre) nelle zone più calde, primavera nelle zone interne. Adatta perfettamente al clima sardo.',
    irrigazione: 'Eccellente resistenza alla siccità — tra le più resistenti. In Sardegna spesso coltivata in asciutto. L\'irrigazione estiva migliora la resa e riduce l\'alternanza.',
    coltivazione: 'Adatta a tutti i tipi di terreno sardo: calcareo, granitico, argilloso. Preferisce zone collinari ventilate. Tipica delle zone di Sassari e della Gallura.',
    potatura: 'Potatura biennale in febbraio-marzo. La vigorìa elevata richiede interventi decisi per contenere la chioma e favorire la fruttificazione.',
    concimazione: 'Nei terreni granitici sardi spesso poveri: importante la concimazione organica con compost. Azoto in primavera, potassio in autunno.',
    clima: 'Perfettamente adattata al clima sardo: caldo e siccitoso in estate, mite in inverno. Resistenza al freddo media (fino a -7°C). Ottima resistenza al vento.',
    malattie: 'Buona resistenza generale. Monitorare la mosca dell\'olivo in autunno. Attenzione alla rogna nelle potature.',
    curiosita: 'La Bosana è la cultivar dominante in Sardegna e fa parte dell\'identità culturale dell\'isola. Gli ulivi di Bosana multisecolari nei territori di Villacidro, Luras e Sassari sono tra i più antichi d\'Europa. L\'olio sardo DOP è riconosciuto tra i migliori d\'Italia.',
  },
  {
    id: 'pendolino',
    nome: 'Pendolino',
    tipo: 'ulivo',
    emoji: '🫒',
    origine: 'Toscana',
    uso: 'Olio extravergine — principalmente impollinatore',
    tagLine: 'Il grande impollinatore — indispensabile in ogni uliveto ben progettato.',
    caratteristiche: 'Pianta di vigoria media con portamento caratteristicamente pendulo (da cui il nome). Eccellente produttore di polline — il migliore impollinatore per Frantoio, Moraiolo e Leccino. Ottima produttività propria, ma il suo ruolo principale è come impollinatore.',
    frutto: 'Oliva piccola, maturazione precoce. Resa in olio 16-18%. Olio delicato e aromatico con note floreali.',
    piantumazione: 'Si pianta principalmente come impollinatore: 1 Pendolino ogni 6-8 piante della cultivar principale. Ideale nel mix con Frantoio e Moraiolo.',
    irrigazione: 'Come per le altre cultivar toscane: irrigazione di soccorso in estate per piante giovani.',
    coltivazione: 'Stesse esigenze delle cultivar toscane. Ottimo come albero ornamentale per il suo portamento piangente.',
    potatura: 'Potatura annuale leggera. Il portamento pendulo è naturale e caratteristico — non modificarlo eccessivamente.',
    concimazione: 'Schema classico primavera-autunno.',
    clima: 'Buona resistenza al freddo (fino a -8°C). Adatto a tutto l\'areale olivicolo italiano.',
    malattie: 'Resistenza buona alle principali malattie. Monitorare la mosca dell\'olivo.',
    curiosita: 'Senza il Pendolino molti degli uliveti toscani più famosi non potrebbero produrre. I produttori di olio DOP Toscano lo inseriscono obbligatoriamente come componente impollinatore per garantire la qualità della produzione.',
  },
  {
    id: 'carolea',
    nome: 'Carolea',
    tipo: 'ulivo',
    emoji: '🫒',
    origine: 'Calabria',
    uso: 'Duplice attitudine: olive da tavola e olio',
    tagLine: 'La regina calabrese — grande oliva da tavola e ottimo olio del Sud Italia.',
    caratteristiche: 'Pianta molto vigorosa con chioma ampia. Alta produttività e buona costanza. La più diffusa in Calabria, seconda regione italiana per produzione di olio. Adatta a diversi ambienti calabresi, dalla costa alla collina.',
    frutto: 'Oliva grande (4-6 g), forma ovale. Duplice attitudine: raccolta verde per tavola (settembre-ottobre) o nera per olio (novembre-dicembre). Resa in olio 15-20%. Olio dal gusto bilanciato: fruttato medio, amaro e piccante di media intensità.',
    piantumazione: 'Distanza: 6-8 metri. Periodo: primavera o autunno. Adatta a tutti i tipi di terreno calabresi.',
    irrigazione: 'Buona resistenza alla siccità. Irrigazione estiva migliora la qualità delle olive da tavola.',
    coltivazione: 'Ottima adattabilità a diversi terreni e microclimi. Preferisce zone collinari 100-500 m s.l.m. Buona resistenza al vento.',
    potatura: 'Potatura annuale in febbraio-marzo. Data la vigoria, interventi decisi per mantenere la forma e stimolare la produzione sui rami nuovi.',
    concimazione: 'Risponde bene alla concimazione bilanciata organico-minerale.',
    clima: 'Adatta al clima calabrese: caldo in estate, miti inverni. Tollera freddo fino a -7/-8°C. Ottima resistenza al caldo.',
    malattie: 'Suscettibile alla mosca dell\'olivo. Attenzione all\'antracnosi nelle stagioni umide.',
    curiosita: 'La Carolea è la cultivar più rappresentata nella tradizione gastronomica calabrese. Le olive verdi schiacciate in salamoia sono un\'eccellenza regionale. La zona di Lamezia Terme (CZ) è il cuore della coltivazione.',
  },

  // ── AGRUMI ─────────────────────────────────────────────────────────────────
  {
    id: 'tarocco',
    nome: 'Tarocco',
    tipo: 'agrumi',
    emoji: '🍊',
    origine: 'Sicilia (Piana di Catania)',
    uso: 'Arancia da tavola — la più pregiata d\'Italia',
    tagLine: 'L\'arancia rossa più dolce e aromatica — simbolo dell\'eccellenza agrumicola siciliana.',
    caratteristiche: 'Albero di vigoria media, portamento eretto-espanso. Foglie lucide e profumate. Produttività elevata e costante. La varietà di arancia rossa più diffusa e apprezzata in Sicilia. IGP Arancia Rossa di Sicilia.',
    frutto: 'Frutto medio-grande (200-280 g), forma ovale-sferica. Buccia di spessore medio, aranciata con striature rosse. Polpa color rosso rubino intenso, succosa e dolcissima, quasi priva di semi. Maturazione: gennaio-marzo. Ricchissima di antociani e vitamina C.',
    piantumazione: 'Periodo: primavera (marzo-aprile) quando non c\'è più rischio di gelo. Buca: 60x60x60 cm con drenaggio sul fondo. Distanza: 4-5 metri tra le piante. Substrato: terriccio per agrumi misto a sabbia.',
    irrigazione: 'Irrigazione regolare, fondamentale per la qualità del frutto. In estate: ogni 4-7 giorni. Primavera e autunno: ogni 10-15 giorni. In vaso: quando il terreno è asciutto in superficie ma mai lasciare seccare completamente.',
    coltivazione: 'Preferisce zone costiere siciliane con escursione termica notte-giorno (favorisce la pigmentazione rossa). Terreno: sciolto, fertile, ben drenato. pH 6-7. Esposizione pieno sole. Distanza da muri: almeno 3 metri.',
    potatura: 'Potatura di formazione nei primi 3 anni per dare struttura all\'albero. Potatura di produzione leggera ogni anno in marzo-aprile dopo la raccolta: rimuovere rami secchi, succhioni e rami che crescono verso l\'interno.',
    concimazione: 'Concimazione specifica per agrumi (ricca di azoto, ferro, manganese). Tre apportazioni: marzo (azoto), giugno (estiva bilanciata), settembre (potassio-fosforo). In vaso: concime liquido per agrumi ogni 2 settimane in primavera-estate.',
    clima: 'Sensibile al gelo: danni seri sotto -3/-4°C. Ideale in zone con inverni miti (>5°C). Teme i venti freddi. In zone a rischio gelo proteggere con telo invernale.',
    malattie: 'Cocciniglia (trattare con olio bianco minerale). Afidi (insetticidi naturali o sapone di Marsiglia). Mal secco (fungo): eliminare i rami colpiti. Clorosi ferrica in terreni alcalini: somministrare ferro chelato.',
    curiosita: 'Il Tarocco è considerato una delle arance più buone al mondo. Il colore rosso è causato dagli antociani, pigmenti con potente azione antiossidante. Studi scientifici dimostrano che il succo di Tarocco contiene più antiossidanti del mirtillo.',
  },
  {
    id: 'sanguinello',
    nome: 'Sanguinello',
    tipo: 'agrumi',
    emoji: '🍊',
    origine: 'Sicilia',
    uso: 'Arancia rossa da tavola — IGP Arancia Rossa di Sicilia',
    tagLine: 'Arancia rossa dal gusto intenso — buccia con striature rosse caratteristiche.',
    caratteristiche: 'Albero di vigoria medio-elevata, portamento espanso. Produttività elevata e alternante. Varietà tra le più resistenti al freddo tra le arance rosse. Fioritura primaverile molto profumata.',
    frutto: 'Frutto medio (150-200 g), forma ovale. Buccia arancio con striature rosse esterne. Polpa rosso intensa, sapore agrodolce con leggero retrogusto amaro. Pochi semi. Maturazione: febbraio-aprile (più tardivo del Tarocco). Alto contenuto di vitamina C.',
    piantumazione: 'Periodo: primavera. Distanza: 4-5 metri. Substrato drenante essenziale. Consigliato in zone con escursione termica accentuata.',
    irrigazione: 'Come il Tarocco: regolare in estate, ridurre in inverno. Evitare ristagni idrici.',
    coltivazione: 'Adatto a climi lievemente più freddi rispetto al Tarocco. Terreno fertile e ben drenato. Pieno sole.',
    potatura: 'Potatura leggera annuale dopo la raccolta (aprile-maggio). Rimuovere i rami secchi e sfoltire la chioma.',
    concimazione: 'Schema specifico per agrumi con tre apporti annuali. In vaso: fertirrigazione ogni 2 settimane in stagione vegetativa.',
    clima: 'Leggermente più resistente al freddo rispetto al Tarocco (fino a -5°C). Adatto anche a zone sub-costiere meridionali.',
    malattie: 'Come gli altri agrumi: cocciniglia, afidi, mal secco. Monitorare regolarmente.',
    curiosita: 'Il Sanguinello è la varietà di arancia rossa con la pigmentazione più intensa e duratura: mantiene il colore rosso anche a temperatura ambiente, a differenza del Tarocco che sbiadisce fuori dal freddo.',
  },
  {
    id: 'limone-liscia',
    nome: 'Limone di Siracusa (Femminello)',
    tipo: 'agrumi',
    emoji: '🍋',
    origine: 'Sicilia (Siracusa)',
    uso: 'Limone da tavola — IGP Limone di Siracusa',
    tagLine: 'Il limone italiano per eccellenza — profumato, succoso e produttivo tutto l\'anno.',
    caratteristiche: 'Albero di vigoria elevata, portamento espanso e spinoso. Particolarità unica: produce frutti 3-4 volte all\'anno (primofiore, bianchetto, bastardo, verdello). Produttività eccezionale. La cultivar Femminello è la più diffusa in Sicilia.',
    frutto: 'Frutto medio-grande (100-150 g), forma ovale-allungata con papilla apicale. Buccia gialla, profumatissima. Polpa succosa con alto contenuto di succo e vitamina C. Semi presenti ma in numero limitato. Buccia ricca di oli essenziali pregiati.',
    piantumazione: 'Periodo: primavera, quando non c\'è rischio di gelo. Buca profonda (60 cm) con terriccio specifico per agrumi. Distanza: 4-5 metri. Evitare assolutamente zone con gelate invernali.',
    irrigazione: 'Necessita di irrigazione regolare per la produzione continua. Estate: ogni 4-5 giorni. Primavera-autunno: ogni 8-10 giorni. In vaso: mantenere il substrato leggermente umido, mai secco.',
    coltivazione: 'Necessita di zone a clima molto mite (inverni > 5°C). Terreno fertile, ben drenato, pH 6-7. Pieno sole. Proteggerlo dal vento freddo. Ideale in zone costiere.',
    potatura: 'Potatura leggera dopo ogni raccolta. Rimuovere i succhioni vigorosi alla base, i rami secchi e sfoltire la chioma. Non potare mai pesantemente il limone.',
    concimazione: 'Pianta molto esigente: concimazione mensile in primavera-estate con fertilizzante per agrumi. Importante il ferro per evitare la clorosi (foglie gialle). In autunno: potassio e fosforo.',
    clima: 'Molto sensibile al freddo: danni già a -2°C. Proteggere con telo termico in caso di gelate. In Sardegna: adatto alle zone costiere del Campidano e del Sulcis.',
    malattie: 'Afidi (trattare con piretro naturale o sapone di potassio). Cocciniglia. Mal secco (Phoma): eliminare i rami colpiti e disinfettare. Clorosi ferrica: somministrare ferro chelato ogni 30 giorni.',
    curiosita: 'Il Limone di Siracusa IGP è tra i più pregiati al mondo per l\'altissimo contenuto di succo (superiore al 30%) e di vitamina C. I cuochi stellati preferiscono la sua buccia per la concentrazione straordinaria di oli essenziali.',
  },
  {
    id: 'limone-amalfi',
    nome: 'Limone di Amalfi (Sfusato Amalfitano)',
    tipo: 'agrumi',
    emoji: '🍋',
    origine: 'Campania (Costa di Amalfi)',
    uso: 'Limone da tavola e liquori — IGP Limone Costa d\'Amalfi',
    tagLine: 'Il limone gigante della Costiera — protagonista del limoncello artigianale.',
    caratteristiche: 'Albero di vigoria elevata, portamento espanso. Frutto tra i più grandi tra i limoni italiani. Produzione principalmente nel periodo primaverile-estivo. Coltivato tradizionalmente sui terrazzamenti della Costiera Amalfitana.',
    frutto: 'Frutto grande-grandissimo (200-400 g), forma allungata-fusiforme. Buccia spessa e profumatissima, giallo intenso. Polpa succosa e aromatica, con buccia poco amara. La buccia è la parte più pregiata — ideale per il limoncello artigianale.',
    piantumazione: 'Periodo: primavera. Distanza: 4-6 metri. Necessita di terrazzamenti in zone declivi. Substrato ricco e ben drenato.',
    irrigazione: 'Irrigazione regolare. Beneficia dell\'umidità costiera. In zone secche, irrigare più frequentemente.',
    coltivazione: 'Adatta a zone costiere tirreniche. Preferisce climi miti con umidità. Poco adatta alle zone siccitose della Sardegna interna.',
    potatura: 'Potatura leggera annuale. Mantenere la forma naturale.',
    concimazione: 'Come per tutti gli agrumi: tre apporti annuali specifici.',
    clima: 'Sensibile al freddo come tutti i limoni. Zone costiere con inverni miti.',
    malattie: 'Come per tutti gli agrumi. Monitorare afidi e cocciniglia.',
    curiosita: 'Lo Sfusato Amalfitano è l\'ingrediente segreto del limoncello doc della Costiera Amalfitana. La sua buccia spessa e aromatica lo rende insostituibile per liquori e pasticceria. Presidio Slow Food.',
  },
  {
    id: 'clementina',
    nome: 'Clementina di Calabria',
    tipo: 'agrumi',
    emoji: '🍊',
    origine: 'Calabria',
    uso: 'Frutto da tavola — IGP Clementine di Calabria',
    tagLine: 'Dolce, senza semi e facilissima da sbucciare — la preferita dei bambini.',
    caratteristiche: 'Albero di vigoria medio-elevata, portamento espanso. Maturazione molto precoce (ottobre-novembre). La clementina è un ibrido naturale tra mandarino e arancio amaro. Pianta molto produttiva.',
    frutto: 'Frutto piccolo-medio (70-120 g), forma sferica appiattita. Buccia sottile, arancio brillante, facilissima da sbucciare. Polpa arancio, succosa e dolcissima, praticamente senza semi. Maturazione: ottobre-dicembre.',
    piantumazione: 'Periodo: primavera. Distanza: 4-5 metri. Substrato drenante. Ottima anche in vaso di grandi dimensioni (Ø 60 cm).',
    irrigazione: 'Irrigazione regolare in estate. Ridurre in autunno-inverno durante la maturazione del frutto per concentrare gli zuccheri.',
    coltivazione: 'Adatta al clima del Sud Italia. Terreno drenante, fertile. Pieno sole. Sensibile ai ristagni idrici.',
    potatura: 'Potatura leggera in primavera dopo la raccolta. Rimuovere rami secchi e sfoltire per arieggiare la chioma.',
    concimazione: 'Concimazione specifica per agrumi. Azoto in marzo-maggio, potassio-fosforo a settembre.',
    clima: 'Sensibile al freddo: proteggere sotto -3°C. Ottima nelle zone costiere calabresi e in Sicilia.',
    malattie: 'Cocciniglia mezzo grano di pepe: colonie bianche sui rami. Afidi sulla vegetazione giovane. Trattamenti con prodotti naturali.',
    curiosita: 'La Clementina di Calabria è stata la prima IGP europea nel settore degli agrumi. Il suo nome deriva dal missionario francese Padre Clément che la selezionò per primo in Algeria nel 1902.',
  },
  {
    id: 'arancia-navel',
    nome: 'Arancia Navel (Washington Navel)',
    tipo: 'agrumi',
    emoji: '🍊',
    origine: 'Brasile / California (diffusa mondialmente)',
    uso: 'Arancia da tavola — varietà senza semi',
    tagLine: 'L\'arancia senza semi più diffusa al mondo — dolce, grande e pratica.',
    caratteristiche: 'Albero vigoroso, produttivo, portamento espanso. Particolarità: il frutto presenta un "ombelico" (navel) sul fondo — è in realtà un piccolo frutto secondario abortito. Assenza di semi. Maturazione invernale.',
    frutto: 'Frutto grande (250-350 g), forma sferica con ombelico caratteristico sul polo opposto al peduncolo. Buccia spessa, aranciata, facile da sbucciare. Polpa succosa, dolcissima, senza semi. Maturazione: dicembre-marzo.',
    piantumazione: 'Come per le altre arance: primavera, distanza 4-5 m.',
    irrigazione: 'Irrigazione regolare. Sensibile alla siccità durante la formazione del frutto.',
    coltivazione: 'Adatta a tutto il Sud Italia. Zone costiere preferibili. Pieno sole.',
    potatura: 'Potatura leggera annuale in primavera.',
    concimazione: 'Schema classico per agrumi in tre apporti.',
    clima: 'Sensibile al gelo come tutte le arance. Proteggere sotto -3/-4°C.',
    malattie: 'Come per tutti gli agrumi. Attenzione alla cocciniglia.',
    curiosita: 'La Washington Navel è l\'arancia senza semi più consumata al mondo. L\'ombelico visibile è il residuo di un secondo frutto che cresce internamente. Non produce polline fertilee — si propaga solo per innesto.',
  },
  {
    id: 'mandarino',
    nome: 'Mandarino Tardivo di Ciaculli',
    tipo: 'agrumi',
    emoji: '🍊',
    origine: 'Sicilia (Palermo)',
    uso: 'Frutto da tavola — Presidio Slow Food',
    tagLine: 'Profumatissimo e inimitabile — il mandarino siciliano più ricercato.',
    caratteristiche: 'Albero di vigoria media, portamento espanso e molto ornamentale. Maturazione tardiva (gennaio-marzo). Tra i mandarini italiani più aromatici e pregiati.',
    frutto: 'Frutto medio (80-120 g), forma sferica appiattita. Buccia sottile e profumatissima, arancio intenso. Polpa succosa, dolce con piacevole acidità, semi presenti. Maturazione molto tardiva: gennaio-marzo.',
    piantumazione: 'Periodo: primavera. Distanza: 3-4 metri. Molto adatto anche in vaso.',
    irrigazione: 'Irrigazione regolare. In estate ogni 5-7 giorni. Ridurre in autunno.',
    coltivazione: 'Clima mite costiero. Terreno fertile e drenante. Adatta a tutto il Sud Italia.',
    potatura: 'Potatura leggera annuale dopo la raccolta (marzo-aprile).',
    concimazione: 'Come per tutti gli agrumi: tre apporti annuali.',
    clima: 'Sensibile al gelo. Zone costiere meridionali. Proteggere sotto -3°C.',
    malattie: 'Come per tutti gli agrumi.',
    curiosita: 'Il Tardivo di Ciaculli è un Presidio Slow Food per la sua straordinaria fragranza. La borgata di Ciaculli, alle porte di Palermo, è la sua patria d\'elezione. La buccia è così profumata che viene utilizzata in pasticceria e profumeria.',
  },
];

// ─── COMPONENTE ──────────────────────────────────────────────────────────────
export default function SchedePiante() {
  const [selectedScheda, setSelectedScheda] = useState<Scheda | null>(null);
  const [filterTipo, setFilterTipo] = useState<'tutti' | 'ulivo' | 'agrumi'>('tutti');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSections, setExpandedSections] = useState<string[]>(['caratteristiche', 'frutto']);

  const toggleSection = (section: string) => {
    setExpandedSections(prev =>
      prev.includes(section) ? prev.filter(s => s !== section) : [...prev, section]
    );
  };

  const handleWhatsApp = (scheda: Scheda) => {
    const testo = `🌿 *SCHEDA PIANTA — ${scheda.nome}*
*${scheda.tagLine}*

📍 *Origine:* ${scheda.origine}
🎯 *Uso:* ${scheda.uso}

🌱 *Caratteristiche:*
${scheda.caratteristiche}

${scheda.tipo === 'agrumi' ? '🍊' : '🫒'} *Il frutto:*
${scheda.frutto}

📅 *Piantumazione:*
${scheda.piantumazione}

💧 *Irrigazione:*
${scheda.irrigazione}

🌿 *Coltivazione:*
${scheda.coltivazione}

✂️ *Potatura:*
${scheda.potatura}

🌾 *Concimazione:*
${scheda.concimazione}

☀️ *Clima e resistenza:*
${scheda.clima}

⚠️ *Malattie e parassiti:*
${scheda.malattie}

💡 *Lo sapevi?*
${scheda.curiosita}

---
🫒 *Vivaio Santa Maria - Uta (CA)*
Per informazioni e acquisti contattaci su WhatsApp!`;

    const url = `https://wa.me/?text=${encodeURIComponent(testo)}`;
    window.open(url, '_blank');
  };

  const filteredSchede = schede.filter(s => {
    const matchTipo = filterTipo === 'tutti' || s.tipo === filterTipo;
    const matchSearch = s.nome.toLowerCase().includes(searchQuery.toLowerCase());
    return matchTipo && matchSearch;
  });

  const sections = [
    { key: 'caratteristiche', label: '🌱 Caratteristiche della pianta', value: selectedScheda?.caratteristiche },
    { key: 'frutto', label: `${selectedScheda?.tipo === 'agrumi' ? '🍊' : '🫒'} Il frutto`, value: selectedScheda?.frutto },
    { key: 'piantumazione', label: '📅 Piantumazione', value: selectedScheda?.piantumazione },
    { key: 'irrigazione', label: '💧 Irrigazione', value: selectedScheda?.irrigazione },
    { key: 'coltivazione', label: '🌿 Coltivazione e terreno', value: selectedScheda?.coltivazione },
    { key: 'potatura', label: '✂️ Potatura', value: selectedScheda?.potatura },
    { key: 'concimazione', label: '🌾 Concimazione', value: selectedScheda?.concimazione },
    { key: 'clima', label: '☀️ Clima e resistenza', value: selectedScheda?.clima },
    { key: 'malattie', label: '⚠️ Malattie e parassiti', value: selectedScheda?.malattie },
    { key: 'curiosita', label: '💡 Lo sapevi?', value: selectedScheda?.curiosita },
  ];

  // ── VISTA SCHEDA ───────────────────────────────────────────────────────────
  if (selectedScheda) {
    return (
      <div className="space-y-0">
        {/* Header scheda */}
        <div className="bg-white border-b border-stone-200 px-4 py-4 sm:px-6">
          <button onClick={() => setSelectedScheda(null)}
            className="flex items-center gap-1 text-stone-500 hover:text-stone-900 mb-3">
            <ChevronLeft className="h-5 w-5" /><span className="text-sm">Tutte le schede</span>
          </button>
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-4xl">{selectedScheda.emoji}</span>
                <div>
                  <h2 className="text-2xl font-semibold text-stone-900">{selectedScheda.nome}</h2>
                  <p className="text-sm text-stone-500">{selectedScheda.origine} · {selectedScheda.uso}</p>
                </div>
              </div>
              <p className="text-base text-stone-700 mt-2 italic">"{selectedScheda.tagLine}"</p>
            </div>
          </div>
        </div>

        {/* Sezioni accordion */}
        <div className="space-y-0 divide-y divide-stone-100">
          {sections.map(section => (
            <div key={section.key} className="bg-white">
              <button
                onClick={() => toggleSection(section.key)}
                className="w-full flex items-center justify-between px-4 py-4 sm:px-6 hover:bg-stone-50 transition-colors"
              >
                <span className="text-base font-medium text-stone-800">{section.label}</span>
                {expandedSections.includes(section.key)
                  ? <ChevronUp className="h-4 w-4 text-stone-400" />
                  : <ChevronDown className="h-4 w-4 text-stone-400" />
                }
              </button>
              {expandedSections.includes(section.key) && (
                <div className="px-4 pb-4 sm:px-6">
                  <p className="text-base text-stone-700 leading-relaxed">{section.value}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Pulsante WhatsApp fisso in basso */}
        <div className="sticky bottom-0 bg-white border-t border-stone-200 p-4 shadow-lg">
          <button
            onClick={() => handleWhatsApp(selectedScheda)}
            className="w-full flex items-center justify-center gap-3 rounded-xl bg-green-500 hover:bg-green-600 px-6 py-4 text-white font-semibold text-lg transition-colors shadow-md"
          >
            <Send className="h-5 w-5" />
            Invia scheda al cliente su WhatsApp
          </button>
        </div>
      </div>
    );
  }

  // ── LISTA SCHEDE ───────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-light text-stone-900">Schede Piante</h2>
        <p className="text-sm text-stone-500 mt-1">Seleziona una pianta per vedere la scheda completa e inviarla al cliente.</p>
      </div>

      {/* Filtri e ricerca */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
          <input type="text" placeholder="Cerca cultivar..." value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
        </div>
        <div className="flex gap-2">
          {(['tutti', 'ulivo', 'agrumi'] as const).map(tipo => (
            <button key={tipo} onClick={() => setFilterTipo(tipo)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filterTipo === tipo ? 'bg-amber-700 text-white' : 'border border-stone-300 text-stone-600 hover:bg-stone-50'}`}>
              {tipo === 'tutti' ? 'Tutti' : tipo === 'ulivo' ? '🫒 Ulivi' : '🍊 Agrumi'}
            </button>
          ))}
        </div>
      </div>

      {/* Griglia schede */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredSchede.map(scheda => (
          <button key={scheda.id} onClick={() => { setSelectedScheda(scheda); setExpandedSections(['caratteristiche', 'frutto']); }}
            className="text-left rounded-xl border border-stone-200 bg-white p-5 hover:shadow-md hover:border-amber-300 transition-all group">
            <div className="flex items-start gap-3 mb-3">
              <span className="text-4xl">{scheda.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-stone-900 group-hover:text-amber-800">{scheda.nome}</h3>
                <p className="text-xs text-stone-500 mt-0.5">{scheda.origine}</p>
              </div>
            </div>
            <p className="text-sm text-stone-600 italic leading-snug mb-3">"{scheda.tagLine}"</p>
            <div className="flex items-center justify-between">
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${scheda.tipo === 'ulivo' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                {scheda.uso.split('—')[0].trim()}
              </span>
              <span className="text-xs text-amber-700 font-medium group-hover:underline">Vedi scheda →</span>
            </div>
          </button>
        ))}
      </div>

      {filteredSchede.length === 0 && (
        <div className="rounded-lg border-2 border-dashed border-stone-200 p-10 text-center">
          <p className="text-stone-500">Nessuna scheda trovata.</p>
        </div>
      )}
    </div>
  );
}
