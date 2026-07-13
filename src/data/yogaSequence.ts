export interface YogaStep {
  id: string;
  title: string;
  category: 'integrazione' | 'riscaldamento' | 'in piedi' | 'equilibrio' | 'torsione' | 'piegamento' | 'apertura_anche' | 'defaticamento' | 'rilassamento' | 'respirazione' | 'meditazione';
  categoryLabel: string;
  asanaName?: string;
  side?: 'sinistro' | 'destro' | 'entrambi';
  description: {
    entrata: string;
    mantenimento: string;
    uscita: string;
  };
  speechScript: string; // The exact text spoken by the teacher
}

export const YOGA_SEQUENCE: YogaStep[] = [
  {
    id: "integrazione_sukhasana",
    title: "Posizione di Integrazione",
    asanaName: "Sukhasana (Posizione Semplice)",
    category: "integrazione",
    categoryLabel: "Integrazione",
    side: "entrambi",
    description: {
      entrata: "Siediti comodo a gambe incrociate sul tappetino. Se senti tensione alle anche, usa un cuscino o un blocco sotto i glutei. Raddrizza la colonna vertebrale immaginando un filo che ti tira verso l'alto dalla sommità del capo. Appoggia delicatamente le mani sulle ginocchia, con i palmi rivolti verso l'alto in segno di apertura.",
      mantenimento: "Chiudi dolcemente gli occhi. Porta la tua attenzione all'interno. Osserva il ritmo naturale del tuo respiro senza modificarlo. Ad ogni inspirazione senti l'addome che si espande, ad ogni espirazione senti le spalle che si rilassano lontano dalle orecchie. Rimani qui, centrato ed in ascolto del tuo corpo e della tua mente in questo inizio di pratica.",
      uscita: "Fai un respiro profondo dal naso ed espira completamente dalla bocca. Riapri lentamente gli occhi, mantenendo lo sguardo morbido, e preparati a muovere il corpo."
    },
    speechScript: "Siediti comodo a gambe incrociate. Raddrizza la colonna vertebrale, appoggia le mani sulle ginocchia con i palmi rivolti verso l'alto. Chiudi delicatamente gli occhi. Inspira profondamente dal naso... espira lentamente... Senti il corpo che si radica a terra... Inspira, solleva la corona del capo verso l'alto... Espira, rilascia le tensioni dalle spalle... Continua a respirare regolarmente, portando l'attenzione al momento presente... Inspira... ed espira... Rimani qui, in ascolto del tuo respiro naturale... unisci mente e corpo... ancora un respiro profondo... Riapri lentamente gli occhi, muovi le dita delle mani e preparati per la pratica."
  },
  {
    id: "riscaldamento_gatto_mucca",
    title: "Riscaldamento 1",
    asanaName: "Marjariasana - Bitilasana (Gatto-Mucca)",
    category: "riscaldamento",
    categoryLabel: "Riscaldamento",
    side: "entrambi",
    description: {
      entrata: "Portati a quattro zampe in posizione di quadrupedia. Posiziona le mani direttamente sotto le spalle con le dita ben aperte, e le ginocchia direttamente sotto le anche, distanti quanto il bacino. Mantieni la colonna vertebrale neutra parallela al pavimento.",
      mantenimento: "Sincronizza il movimento con il respiro. Inspirando inarca delicatamente la schiena, solleva il coccige, apri il petto in avanti e rivolgi lo sguardo verso l'alto. Espirando, arrotonda la colonna verso il soffitto, spingi via il pavimento con le mani, risucchia l'ombelico e porta il mento verso lo sterno.",
      uscita: "Espirando, ritorna lentamente con la schiena dritta in posizione neutra, stabilizzando il bacino."
    },
    speechScript: "Portati a quattro zampe. Polsi sotto le spalle, ginocchia sotto le anche. Colonna vertebrale in posizione neutra. Inspira profondamente, inarca la schiena, solleva il petto e lo sguardo verso l'alto... Espira lentamente, arrotonda la colonna verso il soffitto, spingi il mento verso lo sterno... Inspira, apri il cuore, senti l'addome che si espande... Espira, risucchia l'ombelico, rilascia le spalle... Continua con il tuo ritmo... Inspira, entra nella mucca... Espira, entra nel gatto... Senti la flessibilità che fluisce nella tua schiena... Ritorna lentamente con la schiena in posizione neutra e piatta."
  },
  {
    id: "riscaldamento_sufi",
    title: "Riscaldamento 2",
    asanaName: "Rotazioni Sufi (Busto)",
    category: "riscaldamento",
    categoryLabel: "Riscaldamento",
    side: "entrambi",
    description: {
      entrata: "Torna a sederti a gambe incrociate in una posizione comoda e stabile. Appoggia le mani sulle ginocchia per avere supporto.",
      mantenimento: "Inizia a creare dei cerchi con il busto sopra il bacino. Inspirando, spingi il petto in avanti e verso sinistra, aprendo il cuore. Espirando, arrotonda la schiena all'indietro e verso destra, risucchiando leggermente l'ombelico. Rendi il movimento fluido, come se stessi massaggiando i tuoi organi interni.",
      uscita: "Rallenta gradualmente i cerchi fino a fermarti al centro, con la schiena perfettamente eretta."
    },
    speechScript: "Torna a sederti a gambe incrociate in una posizione comoda. Appoggia le mani sulle ginocchia. Inspira mentre porti il petto in avanti e a sinistra... ed espira mentre arrotondi la schiena indietro e a destra... Inspira profondamente, espandendo il petto... Espira, rilassando le spalle e la colonna... Crea dei cerchi fluidi e armoniosi... Inspira in avanti... espira all'indietro... Senti il calore che si genera nella zona pelvica e lombare... continua a ruotare con consapevolezza... Rallenta il movimento fino a fermarti al centro, con la schiena ben dritta."
  },
  {
    id: "riscaldamento_collo_spalle",
    title: "Riscaldamento 3",
    asanaName: "Circonduzioni Collo e Spalle",
    category: "riscaldamento",
    categoryLabel: "Riscaldamento",
    side: "entrambi",
    description: {
      entrata: "Rimani in posizione seduta a gambe incrociate. Lascia scendere le braccia rilassate lungo i fianchi o appoggia delicatamente i palmi sulle cosce. Abbassa le spalle lontano dalle orecchie.",
      mantenimento: "Fai dei movimenti lenti e controllati. Inspirando solleva le spalle verso le orecchie, espirando ruotale all'indietro e lasciale scendere. Poi, inclina delicatamente la testa portando l'orecchio sinistro verso la spalla sinistra, espirando lascia scivolare il mento al petto, e inspirando porta l'orecchio destro alla spalla destra.",
      uscita: "Ferma il movimento riportando la testa in asse al centro e le spalle rilassate verso il basso."
    },
    speechScript: "Rimani seduto. Rilassa le braccia lungo il corpo o appoggiale delicatamente sulle cosce. Inspira, solleva le spalle verso le orecchie... espira, lasciale cadere all'indietro ruotandole... Inspira, porta l'orecchio sinistro verso la spalla sinistra... espira, lascia scendere il mento al petto... Inspira, porta l'orecchio destro alla spalla destra... espira, ritorna... Senti la tensione che si scioglie... Inspira profondo... espira, rilassa il collo... Rimani presente ad ogni sensazione... Riporta la testa in asse e le spalle rilassate verso il basso."
  },
  {
    id: "piedi_tadasana",
    title: "Posizione in Piedi 1",
    asanaName: "Tadasana (Posizione della Montagna)",
    category: "in piedi",
    categoryLabel: "Posizioni in Piedi",
    side: "entrambi",
    description: {
      entrata: "Portati in piedi all'inizio del tappetino. Unisci gli alluci e mantieni i talloni leggermente separati, oppure tieni i piedi paralleli distanti quanto il bacino. Rilassa le braccia lungo i fianchi con i palmi rivolti leggermente in avanti.",
      mantenimento: "Distribuisci il peso equamente sui quattro angoli del piede. Attiva le cosce, solleva le rotule, allinea il bacino e solleva il petto. Inspira ed allunga la colonna vertebrale verso l'alto; espira e rilascia le spalle verso il basso, sentendo il radicamento con la Terra e la stabilità indistruttibile di una montagna.",
      uscita: "Rilassa leggermente le ginocchia e mantieni lo stato di calma ed equilibrio."
    },
    speechScript: "Portati in piedi all'inizio del tappetino. Piedi uniti o leggermente separati, braccia lungo i fianchi con i palmi in avanti. Inspira, solleva le dita dei piedi e poggiale una ad una, radicatoti al suolo... Espira, distribuisci il peso in modo uniforme... Inspira, allunga la colonna verso l'alto, attiva le cosce... Espira, rilassa le spalle lontano dalle orecchie... Sei forte e stabile come una montagna... Inspira, senti l'aria che riempie il petto... Espira, lascia andare ogni tensione residua... respira qui... Mantieni la centratura e rilassa leggermente la posizione dei piedi."
  },
  {
    id: "piedi_guerriero2_sinistro",
    title: "Posizione in Piedi 2 (Lato Sinistro)",
    asanaName: "Virabhadrasana II (Guerriero II)",
    category: "in piedi",
    categoryLabel: "Posizioni in Piedi",
    side: "sinistro",
    description: {
      entrata: "Da Tadasana, fai un grande passo indietro con il piede destro (circa un metro e venti). Ruota il piede destro in fuori di 90 gradi. Piega il ginocchio sinistro in modo che sia esattamente sopra la caviglia sinistra, parallelo al bordo esterno del tappetino. Allinea i talloni.",
      mantenimento: "Inspirando, solleva le braccia parallele al pavimento, allineate con le spalle. Espirando scendi con il bacino. Rivolgi lo sguardo fiero oltre le dita della mano sinistra. Mantieni il busto verticale e centrato, forte e stabile come un guerriero concentrato.",
      uscita: "Inspirando, distendi la gamba sinistra, abbassa lentamente le braccia lungo i fianchi e unisci i piedi all'inizio del tappetino."
    },
    speechScript: "Fai un grande passo indietro con il piede destro. Ruota il piede destro di 90 gradi. Piega il ginocchio sinistro a 90 gradi, sopra la caviglia sinistra. Estendi le braccia parallele al pavimento, guardando oltre la mano sinistra. Inspira profondamente... allunga le braccia in direzioni opposte... Espira, scendi leggermente più basso con il bacino... Inspira, tieni il busto centrato e forte... Espira, rilassa le spalle... Rimani qui, sei forte e concentrato... Senti l'energia che fluisce attraverso le dita della mano sinistra... Inspira... espira, consolida la tua stabilità... ancora un respiro profondo... Inspira, distendi la gamba sinistra, abbassa le braccia e unisci i piedi."
  },
  {
    id: "piedi_guerriero2_destro",
    title: "Posizione in Piedi 2 (Lato Destro)",
    asanaName: "Virabhadrasana II (Guerriero II)",
    category: "in piedi",
    categoryLabel: "Posizioni in Piedi",
    side: "destro",
    description: {
      entrata: "Da Tadasana, fai un grande passo indietro con il piede sinistro. Ruota il piede sinistro in fuori di 90 gradi. Piega il ginocchio destro in modo che sia esattamente sopra la caviglia destra, puntando in avanti. Allinea i talloni.",
      mantenimento: "Inspirando, solleva le braccia parallele al pavimento. Espirando scendi con il bacino. Rivolgi lo sguardo fiero oltre le dita della mano destra. Mantieni il busto perfettamente centrale ed allineato, respirando in modo calmo e regolare.",
      uscita: "Inspirando, distendi la gamba destra, abbassa le braccia lungo i fianchi e unisci i piedi all'inizio del tappetino."
    },
    speechScript: "Fai un grande passo indietro con il piede sinistro. Ruota il piede sinistro di 90 gradi. Piega il ginocchio destro a 90 gradi, sopra la caviglia destra. Estendi le braccia parallele al pavimento, guardando oltre la mano destra. Inspira profondamente... allunga le braccia... Espira, scendi con il bacino, radicando il piede sinistro a terra... Inspira, senti la forza nelle gambe... Espira, ammorbidisci il viso e le spalle... Rimani immobile nel tuo guerriero interiore... Inspira... senti l'addome che si espande... Espira... lascia andare ogni dubbio... sei forte... un ultimo respiro profondo... Inspira, distendi la gamba destra, abbassa le braccia e unisci i piedi all'inizio del tappetino."
  },
  {
    id: "piedi_triangolo_sinistro",
    title: "Posizione in Piedi 3 (Lato Sinistro)",
    asanaName: "Trikonasana (Posizione del Triangolo)",
    category: "in piedi",
    categoryLabel: "Posizioni in Piedi",
    side: "sinistro",
    description: {
      entrata: "Divarica le gambe lateralmente a circa un metro di distanza. Ruota il piede sinistro in fuori di 90 gradi, e il piede destro leggermente in dentro di 15 gradi. Estendi le braccia lateralmente, parallele al suolo, con i palmi rivolti verso il basso.",
      mantenimento: "Inspirando, allungati il più possibile verso sinistra sopra la gamba sinistra. Espirando, fletti il busto lateralmente portando la mano sinistra sulla tibia, sulla caviglia o su un blocco. Solleva il braccio destro verticalmente verso il soffitto, allineando le spalle. Se comodo, guarda la mano destra.",
      uscita: "Inspirando, attiva i muscoli addominali e solleva il busto tornando al centro. Ruota i piedi paralleli."
    },
    speechScript: "Divarica le gambe. Ruota il piede sinistro in fuori di 90 gradi e il destro leggermente in dentro. Estendi le braccia ai lati. Allungati verso sinistra e scendi con la mano sinistra sulla tibia o su un blocco, sollevando il braccio destro al soffitto. Inspira profondamente... espandi il petto verso l'alto... Espira, mantieni la posizione stendendo bene entrambi i lati del busto... Inspira, guarda verso la mano destra se non hai problemi al collo... Espira, rilassa le spalle lontano dalle orecchie... Senti l'allungamento profondo... Rimani forte, respira con consapevolezza... Inspira... ed espira... ancora una respirazione completa... Inspira, attiva l'addome e risali con il busto. Abbassa le braccia."
  },
  {
    id: "piedi_triangolo_destro",
    title: "Posizione in Piedi 3 (Lato Destro)",
    asanaName: "Trikonasana (Posizione del Triangolo)",
    category: "in piedi",
    categoryLabel: "Posizioni in Piedi",
    side: "destro",
    description: {
      entrata: "Con le gambe divaricate, ruota il piede destro in fuori di 90 gradi, e il piede sinistro leggermente in dentro di 15 gradi. Estendi le braccia lateralmente parallele al suolo.",
      mantenimento: "Inspirando, allungati verso destra sopra la gamba destra. Espirando, fletti il busto lateralmente scendendo con la mano destra sulla tibia o sulla caviglia. Allunga il braccio sinistro verso il soffitto. Mantieni il petto ben aperto ed evita di far cadere la spalla in avanti.",
      uscita: "Inspirando, usa gli obliqui per risalire. Abbassa le braccia e unisci i piedi all'inizio del tappetino."
    },
    speechScript: "Ruota il piede destro in fuori di 90 gradi e il sinistro leggermente in dentro. Estendi le braccia ai lati. Allungati verso destra e scendi con la mano destra sulla tibia o su un blocco, sollevando il braccio sinistro al soffitto. Inspira... allunga la colonna vertebrale... Espira, radicati con entrambi i piedi... Inspira, apri la spalla sinistra indietro... Espira, mantieni il bacino allineato... Senti l'apertura e lo spazio che crei nel corpo... Inspira profondamente... espira lentamente... rimani qui, in perfetto equilibrio... ancora un respiro... Inspira, usa la forza dell'addome per risalire. Abbassa le braccia e unisci i piedi."
  },
  {
    id: "equilibrio_albero_sinistro",
    title: "Posizione di Equilibrio 1 (Lato Sinistro)",
    asanaName: "Vrksasana (Posizione dell'Albero)",
    category: "equilibrio",
    categoryLabel: "Posizioni di Equilibrio",
    side: "sinistro",
    description: {
      entrata: "Inizia in Tadasana. Sposta lentamente il peso del corpo sul piede destro, radicatoti profondamente a terra. Solleva il piede sinistro, piega il ginocchio in fuori e appoggia la pianta del piede sulla parte interna della coscia destra, o sul polpaccio. Evita assolutamente la zona del ginocchio.",
      mantenimento: "Porta le mani giunte davanti al petto in Anjali Mudra. Trova un punto fisso (Drishti) davanti a te per aiutarti a mantenere la stabilità. Inspirando, se ti senti stabile, allunga le braccia sopra la testa. Respira con calma, visualizzando delle radici che si espandono sotto il tuo piede destro.",
      uscita: "Espirando, riabbassa lentamente le mani al petto, poi rilascia il piede sinistro a terra tornando in Tadasana."
    },
    speechScript: "Radicati sul piede destro. Solleva il piede sinistro e appoggia la pianta all'interno della coscia destra (o sul polpaccio, evitando il ginocchio). Porta le mani giunte davanti al petto. Inspira profondamente... allunga la colonna, trova un punto fisso davanti a te... Espira, stabilizza l'equilibrio... Inspira, se vuoi solleva le braccia sopra la testa come i rami di un albero... Espira, rilassa le spalle e il viso... Rimani concentrato, sei radicato e stabile... Inspira, senti l'addome che si espande... Espira, lascia andare le oscillazioni... sei forte... respira... Espira, abbassa delicatamente le braccia e poi la gamba sinistra a terra."
  },
  {
    id: "equilibrio_albero_destro",
    title: "Posizione di Equilibrio 1 (Lato Destro)",
    asanaName: "Vrksasana (Posizione dell'Albero)",
    category: "equilibrio",
    categoryLabel: "Posizioni di Equilibrio",
    side: "destro",
    description: {
      entrata: "Inizia in Tadasana. Sposta il peso sul piede sinistro, attivando la gamba di terra. Piega il ginocchio destro in fuori e solleva il piede destro appoggiando la pianta all'interno della coscia o del polpaccio sinistro.",
      mantenimento: "Porta le mani unite al petto e fissa lo sguardo. Spingi delicatamente il tallone destro contro la coscia e la coscia contro il piede per creare stabilità. Ad ogni inspiro cresci verso l'alto; ad ogni espiro consolida il tuo radicamento.",
      uscita: "Espirando, abbassa le braccia, rilascia il piede destro a terra e sciogli delicatamente le caviglie."
    },
    speechScript: "Radicati sul piede sinistro. Solleva il piede destro e appoggia la pianta all'interno della coscia sinistra o sul polpaccio. Porta le mani giunte davanti al petto. Inspira... cresci verso l'alto con la testa... Espira, premi bene il piede sinistro a terra... Inspira, estendi le braccia verso il cielo... Espira, mantieni la stabilità interna... Senti la forza tranquilla della posizione... Inspira profondo... espira, rilassa i muscoli del viso... rimani immobile... un ultimo, profondo respiro... Espira, abbassa lentamente le mani e rilascia la gamba destra. Scuoti leggermente le gambe."
  },
  {
    id: "equilibrio_guerriero3_sinistro",
    title: "Posizione di Equilibrio 2 (Lato Sinistro)",
    asanaName: "Virabhadrasana III (Guerriero III)",
    category: "equilibrio",
    categoryLabel: "Posizioni di Equilibrio",
    side: "sinistro",
    description: {
      entrata: "In piedi sul piede destro. Porta le mani giunte davanti al petto. Inspirando allunga la colonna; espirando inizia a inclinare il busto in avanti mentre contemporaneamente sollevi la gamba sinistra tesa all'indietro.",
      mantenimento: "Porta il busto e la gamba sinistra paralleli al pavimento, formando una linea retta parallela al suolo. Spingi forte con il tallone sinistro all'indietro con il piede a martello. Mantieni le anche allineate, rivolte entrambe verso terra per proteggere la schiena.",
      uscita: "Inspirando, con controllo e lentezza, risali con il busto e riporta il piede sinistro a terra accanto al destro."
    },
    speechScript: "Radicati sul piede destro. Porta le mani ai fianchi o giunte al petto. Inspira, solleva la gamba sinistra all'indietro mentre fletti il busto in avanti, fino a renderli paralleli al pavimento. Inspira profondamente... allunga la testa in avanti e il tallone sinistro all'indietro... Espira, mantieni i fianchi allineati e rivolti verso il basso... Inspira, attiva l'addome per sostenere la schiena... Espira, mantieni l'equilibrio stabile... Rimani aqui, sei forte e concentrato... Inspira, senti l'aria che entra... Espira, rilascia la fatica... ancora un respiro profondo... Inspira, risali lentamente con il busto e appoggia il piede sinistro a terra."
  },
  {
    id: "equilibrio_guerriero3_destro",
    title: "Posizione di Equilibrio 2 (Lato Destro)",
    asanaName: "Virabhadrasana III (Guerriero III)",
    category: "equilibrio",
    categoryLabel: "Posizioni di Equilibrio",
    side: "destro",
    description: {
      entrata: "In piedi sul piede sinistro. Porta le mani unite al petto. Inspirando allunga la schiena; espirando fletti il busto in avanti sollevando contemporaneamente la gamba destra tesa all'indietro.",
      mantenimento: "Mantieni la gamba di terra forte (puoi piegare leggermente il ginocchio sinistro per stabilità). Allunga il corpo in direzioni opposte: la testa in avanti e il piede destro indietro. Respira in modo controllato, sentendo l'attivazione della parte posteriore del corpo.",
      uscita: "Inspirando, torna con il busto eretto e poggia il piede destro a terra in modo fluido e controllato."
    },
    speechScript: "Radicati sul piede sinistro. Porta le mani giunte al petto. Inspira, solleva la gamba destra all'indietro flettendo il busto in avanti parallelo al suolo. Inspira... allunga tutto il corpo come una linea retta... Espira, stabilizza la caviglia sinistra... Inspira, senti la forza posteriore della gamba destra attiva... Espira, mantieni lo sguardo fisso a terra... Sei in perfetto controllo... Inspira profondamente... espira lentamente... rimani saldo... un ultimo, consapevole respiro... Inspira, torna lentamente in posizione eretta e poggia il piede destro a terra."
  },
  {
    id: "torsione_matsyendra_sinistro",
    title: "Torsione (Lato Sinistro)",
    asanaName: "Ardha Matsyendrasana (Mezza Torsione dei Pesci)",
    category: "torsione",
    categoryLabel: "Torsione",
    side: "sinistro",
    description: {
      entrata: "Siediti sul tappetino con le gambe distese in avanti. Piega la gamba destra e porta il tallone destro all'esterno del gluteo sinistro. Piega la gamba sinistra e scavalca la destra, appoggiando la pianta del piede sinistro piatta all'esterno del ginocchio destro. Porta la mano sinistra a terra dietro la colonna.",
      mantenimento: "Inspirando, solleva il braccio destro verso l'alto allungando la colonna. Espirando, ruota il busto verso sinistra e abbraccia il ginocchio sinistro con il braccio destro (o posiziona il gomito destro all'esterno del ginocchio sinistro). Ad ogni inspiro allunga la schiena; ad ogni espiro intensifica la torsione guardando oltre la spalla sinistra.",
      uscita: "Espirando, ruota delicatamente la testa e il busto in avanti. Sciogli la posizione e distendi le gambe."
    },
    speechScript: "Siediti a terra con le gambe tese. Piega il ginocchio destro a terra. Piega il ginocchio sinistro e scavalca la gamba destra, appoggiando il piede sinistro all'esterno del ginocchio destro. Porta la mano sinistra dietro la schiena e abbraccia il ginocchio sinistro con il braccio destro. Inspira, allunga bene la colonna verso il cielo... Espira, ruota delicatamente il busto verso sinistra, guardando oltre la spalla... Inspira, crea spazio tra le vertebre... Espira, intensifica dolcemente la torsione partendo dall'addome... Senti il massaggio agli organi interni... Inspira profondo... espira, rilassa le spalle... rimani qui, presente nel respiro... Espira, ruota la testa e il busto al centro. Distendi le gambe."
  },
  {
    id: "torsione_matsyendra_destro",
    title: "Torsione (Lato Destro)",
    asanaName: "Ardha Matsyendrasana (Mezza Torsione dei Pesci)",
    category: "torsione",
    categoryLabel: "Torsione",
    side: "destro",
    description: {
      entrata: "Siediti a terra. Piega la gamba sinistra portando il tallone all'esterno del gluteo destro. Piega la gamba destra scavalcando la sinistra, poggiando il piede destro piatto a terra. Appoggia la mano destra dietro la schiena.",
      mantenimento: "Inspirando, solleva il braccio sinistro e allungati. Espirando, ruota il busto verso destra abbracciando il ginocchio destro con il braccio sinistro. Mantieni entrambi gli ischi ben appoggiati a terra per mantenere il bacino stabile.",
      uscita: "Espirando, ritorna con il busto al centro e distendi le gambe in avanti rilassandole."
    },
    speechScript: "Piega il ginocchio sinistro a terra. Piega il ginocchio destro e scavalca la gamba sinistra, appoggiando il piede destro all'esterno del ginocchio sinistro. Porta la mano destra dietro la schiena e abbraccia il ginocchio destro con il braccio sinistro. Inspira... raddrizza la schiena... Espira, ruota il busto verso destra... Inspira, espandi la cassa toracica... Espira, rilascia le tensioni muscolari mentre mantieni la torsione... Senti il corpo che si purifica... Inspira profondamente... espira lentamente... rimani forte ed elegante... ancora un respiro profondo... Espira, ritorna lentamente al centro e sciogli la posizione delle gambe."
  },
  {
    id: "piegamento_cobra",
    title: "Piegamento all'Indietro",
    asanaName: "Bhujangasana (Posizione del Cobra)",
    category: "piegamento",
    categoryLabel: "Piegamenti all'Indietro",
    side: "entrambi",
    description: {
      entrata: "Sdraiati sulla pancia a terra. Unisci le gambe con i dorsi dei piedi ben appoggiati sul tappetino. Posiziona i palmi delle mani a terra sotto le spalle, tenendo i gomiti piegati e ben stretti vicino ai fianchi del busto.",
      mantenimento: "Inspirando, premi attivamente il pube e i dorsi dei piedi a terra, e usa i muscoli della schiena per sollevare delicatamente la testa e il petto dal pavimento. Non spingere eccessivamente con le mani; la forza deve provenire dalla colonna. Mantieni le spalle rilassate e il collo lungo, guardando in avanti.",
      uscita: "Espirando lentamente, riabbassa il petto e la fronte a terra. Appoggia una guancia sul tappetino e rilassati."
    },
    speechScript: "Sdraiati sulla pancia. Piedi uniti con i dorsi appoggiati a terra. Posiziona le mani sotto le spalle, con i gomiti stretti vicino al busto. Inspira profondamente, premi il pube a terra e solleva delicatamente il petto, usando la forza della schiena senza spingere troppo sulle mani... Espira, rilassa le spalle lontano dalle orecchie... Gomiti piegati e vicini al corpo... Inspira, apri il cuore in avanti... Espira, mantieni il collo lungo in asse... Senti l'apertura gentile del petto... Inspira... espira, rimani qui, sei forte... ancora un respiro profondo... Espira, abbassa lentamente la fronte a terra e rilassa le braccia."
  },
  {
    id: "apertura_farfalla",
    title: "Apertura delle Anche",
    asanaName: "Baddha Konasana (Posizione della Farfalla)",
    category: "apertura_anche",
    categoryLabel: "Apertura delle Anche",
    side: "entrambi",
    description: {
      entrata: "Portati in posizione seduta con la schiena ben dritta. Piega le ginocchia, porta le piante dei piedi a contatto tra loro e avvicina i talloni quanto possibile al pube. Afferra saldamente i piedi o le caviglie con le mani.",
      mantenimento: "Mantieni la colonna ben allungata e il petto aperto. Lascia cadere le ginocchia verso l'esterno, permettendo alla forza di gravità di rilassare l'interno cosce e le articolazioni delle anche. Chiudi gli occhi e respira profondamente in questa zona, rilasciando ogni tensione ad ogni espirazione.",
      uscita: "Aiutandoti delicatamente con le mani sotto le cosce, richiudi le ginocchia e distendi lentamente le gambe davanti a te."
    },
    speechScript: "Portati seduto. Piega le ginocchia, unisci le piante dei piedi vicino al bacino e afferra i piedi con le mani. Lascia cadere le ginocchia verso l'esterno. Inspira, allunga la colonna vertebrale... Espira, lascia che le ginocchia scendano per gravità verso terra, rilassando le anche... Inspira, mantieni il petto aperto... Espira, rilassa l'interno coscia... Respira profondamente in questa apertura... Inspira, senti l'addome che si espande... Espira, rilascia ogni tensione emotiva accumulata nel bacino... rimani qui, morbido e ricettivo... ancora un respiro... Aiutandoti con le mani, richiudi delicatamente le ginocchia e distendi le gambe."
  },
  {
    id: "defaticamento_apanasana",
    title: "Defaticamento 1",
    asanaName: "Apanasana (Ginocchia al Petto)",
    category: "defaticamento",
    categoryLabel: "Defaticamento",
    side: "entrambi",
    description: {
      entrata: "Sdraiati comodamente sulla schiena. Piega le ginocchia e portale verso il petto. Abbraccia le tibie o le ginocchia con le mani, intrecciando le dita.",
      mantenimento: "Mantieni tutta la lunghezza della colonna e della nuca appoggiata a terra. Inspirando, lascia che l'addome si espanda contro le cosce; espirando premi dolcemente le ginocchia più vicine al petto, allungando dolcemente la zona lombare. Se vuoi, dondola dolcemente a destra e sinistra per massaggiare la schiena.",
      uscita: "Espirando, rilascia la presa delle mani, appoggia le piante dei piedi a terra mantenendo le ginocchia piegate."
    },
    speechScript: "Sdraiati sulla schiena. Piega le ginocchia e portale al petto. Abbracciale con le mani o le braccia. Inspira profondamente, espandendo l'addome contro le cosce... Espira, premi dolcemente le ginocchia più vicine al petto, allungando la zona lombare... Inspira, senti il massaggio naturale alla schiena... Espira, rilascia completamente le spalle e la nuca a terra... Puoi dondolare leggermente a destra e a sinistra per massaggiare la colonna... Inspira... ed espira... rimani qui, coccolato dal tuo respiro... Ferma il dondolio e rilassa la presa delle mani senza allungare le gambe."
  },
  {
    id: "defaticamento_torsione_sinistra",
    title: "Defaticamento 2 (Lato Sinistro)",
    asanaName: "Supta Matsyendrasana (Torsione da Sdraiati)",
    category: "defaticamento",
    categoryLabel: "Defaticamento",
    side: "sinistro",
    description: {
      entrata: "Sdraiato sulla schiena, apri le braccia lateralmente a croce all'altezza delle spalle, con i palmi rivolti a terra. Piega le ginocchia portandole al petto, poi lasciale cadere unite verso il lato sinistro del corpo. Ruota delicatamente la testa verso destra.",
      mantenimento: "Rilassa completamente le gambe a terra. Cerca di mantenere la spalla destra ben ancorata al tappetino. Ad ogni espirazione profonda, senti la colonna vertebrale rilassarsi in questa torsione passiva, lasciando andare ogni sforzo muscolare.",
      uscita: "Inspirando, riporta lentamente le ginocchia e la testa al centro, riallineando il bacino."
    },
    speechScript: "Sdraiato sulla schiena, apri le braccia a croce all'altezza delle spalle. Piega le ginocchia e lasciale cadere unite verso il lato sinistro, mentre ruoti la testa verso la mano destra. Inspira profondamente... espira, lascia che la gravità faccia scendere le ginocchia a terra... Inspira, senti l'allungamento diagonale lungo la colonna... Espira, rilassa la spalla destra verso il suolo... Rilascia ogni sforzo fisico... Inspira, l'addome si solleva... Espira, il corpo si fa pesante e rilassato... Rimani qui, ti stai defaticando... ancora un respiro profondo... Inspira, riporta le ginocchia e la testa al centro."
  },
  {
    id: "defaticamento_torsione_destra",
    title: "Defaticamento 2 (Lato Destro)",
    asanaName: "Supta Matsyendrasana (Torsione da Sdraiati)",
    category: "defaticamento",
    categoryLabel: "Defaticamento",
    side: "destro",
    description: {
      entrata: "Con le ginocchia piegate al centro e le braccia a croce, lascia cadere delicatamente entrambe le ginocchia verso il lato destro del corpo. Ruota dolcemente la testa a sinistra guardando la mano sinistra.",
      mantenimento: "Mantieni la spalla sinistra rilassata verso il pavimento. Chiudi gli occhi e abbandonati alla forza di gravità. Respira in modo passivo e profondo, assaporando la quiete e il rilascio di ogni tensione lombare.",
      uscita: "Inspirando, riporta le ginocchia e la testa al centro. Distendi le gambe lungo il tappetino."
    },
    speechScript: "Con le braccia aperte a croce, lascia cadere le ginocchia unite verso il lato destro, mentre ruoti la testa verso la mano sinistra. Inspira... senti il respiro che massaggia la colonna... Espira, rilassa la spalla sinistra a terra... Inspira, espanditi... Espira, abbandonati completamente al tappetino... Senti il rilassamento profondo che inizia a diffondersi... Inspira... espira, lascia andare l'ultima tensione... rimani in ascolto... ancora un respiro profondo... Inspira, riporta le ginocchia e la testa al centro. Distendi le gambe lungo il tappetino."
  },
  {
    id: "rilassamento_savasana",
    title: "Rilassamento Finale",
    asanaName: "Savasana (Posizione del Cadavere)",
    category: "rilassamento",
    categoryLabel: "Rilassamento Finale",
    side: "entrambi",
    description: {
      entrata: "Sdraiati sulla schiena a terra. Divarica leggermente le gambe lasciando che le punte dei piedi cadano morbide e spontanee verso l'esterno. Allontana le braccia dal corpo di circa 30 gradi, con i palmi delle mani rivolti verso l'alto. Trova la massima comodità.",
      mantenimento: "Chiudi delicatamente gli occhi. Fai un profondo inspiro dal naso ed espira con un lungo sospiro liberatorio dalla bocca, abbandonando tutto il peso del corpo alla terra. Smetti di controllare il respiro e lascia andare ogni pensiero. Senti ogni parte del corpo farsi pesante, immobile e pervasa da una profonda quiete rigenerante.",
      uscita: "Muovi delicatamente le dita dei piedi e delle mani. Fai un respiro più profondo, stirati con le braccia oltre la testa e piega le ginocchia. Girati sul fianco destro per qualche istante, e con calma aiutati con le mani per tornare in posizione seduta."
    },
    speechScript: "Sdraiati comodamente sulla schiena. Gambe leggermente divaricate, piedi che cadono morbidi verso l'esterno. Braccia lungo i fianchi, distanti dal busto, con i palmi rivolti verso l'alto. Inspira profondamente dal naso... ed espira con un sospiro liberatorio dalla bocca... Inspira di nuovo... espira e lascia andare tutto il peso del corpo alla terra... Senti i talloni, i polpacci, le cosce pesanti... Rilassa il bacino, l'addome, il petto... Rilassa le braccia, le spalle, il collo... Rilassa la mandibola, gli occhi e la fronte... Tutto il corpo è completamente rilassato... Rimani qui nel silenzio... Inizia a muovere lentamente le dita delle mani e dei piedi. Fai un respiro profondo, stirati e girati sul fianco destro prima di tornare a sederti."
  },
  {
    id: "respirazione_sama_vritti",
    title: "Pranayama",
    asanaName: "Sama Vritti (Respirazione Quadrata)",
    category: "respirazione",
    categoryLabel: "Esercizio di Respirazione",
    side: "entrambi",
    description: {
      entrata: "Siediti in una posizione yoga comoda (come Sukhasana), mantenendo la colonna ben dritta e le mani appoggiate in grembo o sulle ginocchia. Mantieni le spalle rilassate e gli occhi chiusi.",
      mantenimento: "Praticheremo Sama Vritti, la respirazione quadrata. Si compone di quattro fasi di eguale durata (4 secondi ciascuna): inspirazione, ritenzione a polmoni pieni, espirazione, ritenzione a polmoni vuoti. Segui il conteggio della voce calma per guidare ogni ciclo respiratorio, calmando istantaneamente il sistema nervoso e la mente.",
      uscita: "Terminato l'ultimo ciclo di ritenzione a polmoni vuoti, rilascia completamente il controllo e ritorna a respirare in modo spontaneo, osservando gli effetti di calma mentale."
    },
    speechScript: "Sediti in una posizione comoda con la schiena dritta. Praticheremo Sama Vritti, la respirazione quadrata, per calmare la mente e bilanciare il sistema nervoso. Ogni fase durerà 4 secondi. Svuota completamente i polmoni. Ora, inspiriamo per 4, 3, 2, 1... tratteniamo il respiro per 4, 3, 2, 1... ed espiriamo lentamente per 4, 3, 2, 1... tratteniamo a polmoni vuoti per 4, 3, 2, 1... Ancora insieme: inspiriamo profondamente per 4, 3, 2, 1... tratteniamo con calma per 4, 3, 2, 1... espiriamo rilasciando tutto per 4, 3, 2, 1... tratteniamo a vuoto per 4, 3, 2, 1... Continua così: inspira per 4, 3, 2, 1... tratteni per 4, 3, 2, 1... espira per 4, 3, 2, 1... tratteni per 4, 3, 2, 1... Senti l'equilibrio e la pace che questa respirazione quadrata porta nel tuo cuore. Fai un ultimo ciclo completo... e ritorna al tuo respiro naturale."
  },
  {
    id: "meditazione_guida",
    title: "Meditazione Guidata",
    asanaName: "Scansione Corporea (Body Scan)",
    category: "meditazione",
    categoryLabel: "Meditazione Guidata",
    side: "entrambi",
    description: {
      entrata: "Rimani seduto in silenzio con la schiena dritta e le braccia rilassate, oppure sdraiati nuovamente nella posizione di Savasana per abbandonarti completamente alla terra.",
      mantenimento: "Mantieni gli occhi delicatamente chiusi. Lasciati guidare dalla mia voce in una scansione corporea dettagliata, che porterà consapevolezza, rilassamento e luce a ogni singola parte del tuo corpo, dalla cima della testa fino alle dita dei piedi. Non devi fare nulla, solo ascoltare e lasciarti andare alla pace.",
      uscita: "Riprendi dolcemente contatto con l'ambiente esterno. Fai un respiro profondo, muovi lentamente le estremità del corpo e riapri gli occhi con un sorriso, portando questa sensazione di unione e pace nella tua giornata. Namastè."
    },
    speechScript: "Rimani seduto con gli occhi chiusi, oppure se preferisci sdraiati di nuovo in Savasana. Ora faremo un viaggio di consapevolezza corporea per accogliere pienamente i benefici della nostra pratica. Porta l'attenzione alla sommità della tua testa. Senti la pelle del cranio che si distende... Scendi alla fronte, ammorbidisci lo spazio tra le sopracciglia... Rilassa le palpebre, le guance, le labbra. Lascia cadere la lingua all'interno della bocca, rilasciando completamente la mandibola... Senti il collo che si rilassa e le spalle che scivolano pesanti verso la terra... Senti il braccio sinistro, il gomito, il polso, la mano sinistra e ogni singolo dito che si rilassa... Ora sposta l'attenzione al braccio destro, gomito, polso, mano destra e tutte le dita... Senti il petto aprirsi, e l'addome muoversi morbido a ogni respiro... Scendi al bacino, alle anche, senti le natiche appoggiate a terra... Rilassa la coscia sinistra, il ginocchio, la tibia, la caviglia, il piede sinistro fino alle dita... Ora rilassa la coscia destra, il ginocchio, il polfaccio, la caviglia, il piede destro e tutte le dita... Tutto il tuo corpo, dalla testa ai piedi, è ora una distesa di calma, luce e pace interiore... Rimani in questo stato di grazia per qualche istante... Ora, molto delicatamente, riporta la consapevolezza al respiro... Senti la vita che scorre in te. Fai un respiro profondo... e quando ti senti pronto, riapri dolcemente gli occhi, portando questa pace con te per il resto della giornata. Namastè."
  }
];
