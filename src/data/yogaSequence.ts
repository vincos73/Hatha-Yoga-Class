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
  speechScript: string; // The exact text spoken by the teacher, containing " | " to separate maintenance and exit
  isHarvardCore?: boolean;
}

export const YOGA_SEQUENCE: YogaStep[] = [
  {
    id: "integrazione_sukhasana",
    title: "Posizione di Integrazione",
    asanaName: "Sukhasana (Posizione Semplice)",
    category: "integrazione",
    categoryLabel: "Integrazione",
    side: "entrambi",
    isHarvardCore: true,
    description: {
      entrata: "Siediti comodo sul tappetino a gambe incrociate. Se senti tensione alle anche, utilizza un cuscino o un blocco per sollevare i glutei. Raddrizza la colonna vertebrale immaginando un filo che allunga delicatamente la testa verso l'alto. Appoggia i palmi delle mani sulle ginocchia, rivolti verso l'alto per aprirti alla pratica.",
      mantenimento: "Mantenimento guidato (15 secondi): Chiudi gli occhi e porta l'attenzione al respiro naturale. Inspira profondamente... senti l'addome che si espande... espira... rilassa le spalle lontano dalle orecchie... rimani qui, sei forte e calmo... ancora un respiro profondo... unisci mente e corpo in questa centratura iniziale.",
      uscita: "Fai un respiro profondo dal naso ed espira del tutto dalla bocca con un sospiro. Riapri lentamente gli occhi, mantenendo lo sguardo morbido, per iniziare i movimenti."
    },
    speechScript: "Siediti in una posizione comoda a gambe incrociate sul tappetino. Raddrizza la colonna vertebrale immaginando un filo che ti allunga verso l'alto. Appoggia le mani sulle ginocchia con i palmi rivolti al cielo. Chiudi dolcemente gli occhi per iniziare la pratica. Ora portiamo l'attenzione al respiro nel mantenimento guidato. Inspira profondamente... senti l'addome che si espande... espira... rilassa le spalle lontano dalle orecchie... Inspira profondamente... allunga la colonna verso il cielo... espira... senti i glutei che si radicano a terra... rimani qui, sei forte e concentrato... Inspira profondamente... senti l'aria fresca che entra... espira lentamente, lasciando andare ogni tensione... inspira... espira... ancora un respiro profondo, assapora questo istante... | E ora, per uscire dalla posizione, fai un ultimo respiro profondo ed espira completamente dalla bocca. Riapri lentamente gli occhi, mantenendo lo sguardo morbido."
  },
  {
    id: "riscaldamento_gatto_mucca",
    title: "Riscaldamento 1",
    asanaName: "Marjariasana - Bitilasana (Gatto-Mucca)",
    category: "riscaldamento",
    categoryLabel: "Riscaldamento",
    side: "entrambi",
    isHarvardCore: true,
    description: {
      entrata: "Portati a quattro zampe in posizione di quadrupedia. Posiziona le mani direttamente sotto le spalle con di dita ben aperte, e le ginocchia direttamente sotto le anche distanti quanto il bacino. Schiena piatta e collo in linea.",
      mantenimento: "Mantenimento guidato (15 secondi): Sincronizza il movimento al respiro. Inspirando inarca la schiena, solleva il coccige e guarda verso il soffitto aprendo il petto. Espirando arrotonda la colonna spingendo via il pavimento con le mani, risucchia l'ombelico e porta il mento allo sterno. Inspira profondamente... inarca ed allunga l'addome... espira... rilassa le spalle e curva la colonna verso l'alto... rimani presente nel flusso.",
      uscita: "Espirando, ritorna dolcemente con la schiena dritta in posizione neutra parallela al suolo, stabilizzando il bacino."
    },
    speechScript: "Portati a quattro zampe in posizione di quadrupedia. Posiziona i polsi sotto le spalle e le ginocchia sotto le anche, alla larghezza del bacino. Mantieni la schiena parallela al suolo. Ora iniziamo il riscaldamento dinamico. Inspirando inarca la schiena, solleva il coccige, apri il petto in avanti e guarda verso l'alto... Espirando arrotonda la colonna verso il soffitto, spingi via il pavimento con le mani, risucchia l'ombelico e porta il mento al petto... Inspira profondamente... senti l'addome che si espande e la schiena che si inarca dolcemente... espira... rilassa le spalle e curva la colonna verso il cielo, allungando ogni vertebra... Rimani qui in movimento, sei forte e flessibile... Inspira... espira... ancora un respiro profondo seguendo il flusso della colonna... | Espirando, ritorna lentamente con la schiena dritta in posizione neutra, stabilizzando il bacino."
  },
  {
    id: "riscaldamento_balasana",
    title: "Posizione del Bambino",
    asanaName: "Balasana (Posizione del Bambino)",
    category: "riscaldamento",
    categoryLabel: "Riscaldamento",
    side: "entrambi",
    isHarvardCore: true,
    description: {
      entrata: "Dalla quadrupedia, unisci gli alluci e allarga le ginocchia alla larghezza del tappetino. Spingi il bacino indietro appoggiando i glutei sui talloni. Cammina con le mani in avanti e appoggia la fronte a terra.",
      mantenimento: "Mantenimento guidato (15 secondi): Abbandona tutto il peso del busto e della testa alla terra. Inspira profondamente... senti la colonna che si allunga... espira... rilassa le spalle e lascia che il petto si apra verso il tappetino... rimani qui, respira con calma e lasciati andare... allenta ogni sforzo muscolare.",
      uscita: "Inspirando premi leggermente i palmi a terra e solleva lentamente il busto, ritornando a quattro zampe in quadrupedia."
    },
    speechScript: "Dalla quadrupedia, unisci gli alluci e allarga le ginocchia quanto il tappetino. Spingi il bacino indietro appoggiando i glutei sui talloni. Allunga le braccia in avanti sul tappetino e appoggia delicatamente la fronte a terra, entrando in Balasana. Iniziamo il mantenimento guidato. Inspira profondamente dal naso... senti l'aria che espande la schiena e la zona lombare... espira... rilascia ogni tensione verso il basso... Inspira lentamente... senti il petto che si fa pesante... espira... rilassa le spalle, i gomiti e le mani a terra... rimani qui, sei al sicuro e rilassato... respira con calma e consapevolezza... ancora un respiro profondo... | Inspirando premi leggermente i palmi a terra e solleva lentamente il busto, riportando la colonna eretta ed il peso al centro."
  },
  {
    id: "riscaldamento_cane",
    title: "Cane a Faccia in Giù",
    asanaName: "Adho Mukha Svanasana (Cane a Faccia in Giù)",
    category: "riscaldamento",
    categoryLabel: "Riscaldamento",
    side: "entrambi",
    isHarvardCore: true,
    description: {
      entrata: "Inizia a quattro zampe. Sposta le mani leggermente in avanti, punta i piedi ed inspirando solleva le ginocchia da terra. Espirando spingi il bacino in alto e indietro, allungando le gambe e la schiena fino a formare una V rovesciata.",
      mantenimento: "Mantenimento guidato (15 secondi): Spingi forte con i palmi delle mani per allungare tutta la schiena. Rilassa il collo e la testa. Inspira profondamente... solleva il coccige verso il cielo... espira... spingi i talloni verso il pavimento... mantieni le ginocchia flesse se senti tensione... respira con calma.",
      uscita: "Espirando lentamente, piega le ginocchia e riportale dolcemente a terra, tornando in quadrupedia."
    },
    speechScript: "Dalla quadrupedia, sposta le mani leggermente in avanti rispetto alle spalle. Punta i piedi a terra ed, inspirando, solleva le ginocchia da terra. Espirando spingi il bacino indietro e verso l'alto, formando una V rovesciata. Tieni la testa rilassata tra le braccia. Entriamo nel Cane a Faccia in Giù. Iniziamo il mantenimento guidato. Inspira profondamente... spingi forte le mani a terra per allungare la colonna... espira... cerca di stendere le gambe spingendo i talloni verso la terra... Inspira... senti il coccige che sale verso il soffitto... espira... allarga le spalle lontano dalle orecchie... rimani qui, sei forte e centrato... respira... ancora un respiro profondo... | Espirando lentamente, piega le ginocchia e riportale dolcemente a terra, tornando in quadrupedia con la schiena neutra."
  },
  {
    id: "riscaldamento_sufi",
    title: "Riscaldamento 2",
    asanaName: "Rotazioni Sufi (Busto)",
    category: "riscaldamento",
    categoryLabel: "Riscaldamento",
    side: "entrambi",
    description: {
      entrata: "Torna a sederti a gambe incrociate sul tappetino in una posizione comoda e stabile. Appoggia saldamente le mani sulle ginocchia per darti supporto durante il movimento.",
      mantenimento: "Mantenimento guidato (15 secondi): Inizia a ruotare il busto compiendo dei cerchi sopra il bacino. Inspirando spingi il petto in avanti e a sinistra aprendo il cuore. Espirando arrotonda la schiena indietro e a destra, contraendo l'addome. Inspira profondamente... senti l'addome che si espande in avanti... espira... rilassa le spalle all'indietro... senti il massaggio interno e la stabilità delle anche.",
      uscita: "Rallenta gradualmente i cerchi concentrici fino a fermarti del tutto al centro, con la schiena perfettamente eretta."
    },
    speechScript: "Ritorna a sederti a gambe incrociate sul tappetino. Appoggia le mani sulle ginocchia per darti stabilità. Iniziamo a ruotare il busto. Inspirando, spingi il petto in avanti e verso sinistra, aprendo il cuore... Espirando, arrotonda la schiena all'indietro e verso destra, risucchiando l'ombelico. Inspira profondamente... senti l'addome che si espande in avanti... espira... rilassa le spalle all'indietro... senti il massaggio gentile ai tuoi organi interni... rimani qui, sei forte e in armonia... inspira profondamente... espira... muoviti in modo fluido e costante... inspira... espira... ancora un respiro profondo nel cerchio... | Rallenta gradualmente le rotazioni fino a fermarti al centro, con la schiena dritta ed eretta."
  },
  {
    id: "riscaldamento_collo_spalle",
    title: "Riscaldamento 3",
    asanaName: "Circonduzioni Collo e Spalle",
    category: "riscaldamento",
    categoryLabel: "Riscaldamento",
    side: "entrambi",
    description: {
      entrata: "Rimani seduto a gambe incrociate. Lascia scendere le braccia rilassate lungo i fianchi o appoggia delicatamente i palmi delle mani sulle cosce. Abbassa le spalle lontano dalle orecchie.",
      mantenimento: "Mantenimento guidato (15 secondi): Muovi le spalle e il collo lentamente. Inspirando solleva le spalle alle orecchie, espirando ruotale indietro lasciandole scendere. Poi inclina l'orecchio sinistro verso la spalla sinistra, espirando porta il mento al petto, e inspirando porta l'orecchio destro alla spalla destra. Inspira profondamente... senti il collo allungarsi... espira... rilassa le spalle verso il basso.",
      uscita: "Ferma i movimenti riportando delicatamente la testa in asse al centro e le spalle completamente rilassate verso il basso."
    },
    speechScript: "Rimani seduto a gambe incrociate. Lascia scendere le braccia rilassate lungo i fianchi o appoggia i palmi sulle cosce. Iniziamo a sciogliere il collo e le spalle. Inspirando, solleva le spalle verso le orecchie, espirando ruotale all'indietro e lasciale scendere. Ora inclina la testa portando l'orecchio sinistro alla spalla sinistra, ed espirando lascia scivolare il mento al petto. Inspirando, porta l'orecchio destro alla spalla destra. Inspira profondamente... senti il collo che si allunga... espira... rilassa le spalle verso il basso... rilascia ogni tensione accumulata... rimani qui, respira... Inspira... espira... senti lo spazio che si crea nella zona cervicale... ancora un respiro profondo... | Riporta delicatamente la testa in asse al centro e rilassa le spalle verso il basso."
  },
  {
    id: "riscaldamento_mezzaluna",
    title: "Riscaldamento in Piedi 1",
    asanaName: "Allungamento Laterale in Piedi (Mezzaluna)",
    category: "riscaldamento",
    categoryLabel: "Riscaldamento",
    side: "entrambi",
    description: {
      entrata: "Alzati in piedi con i piedi uniti o larghi quanto le anche, il peso ben distribuito. Inspirando allunga le braccia sopra la testa e unisci i palmi, oppure intreccia le dita con gli indici distesi verso l'alto.",
      mantenimento: "Mantenimento guidato (15 secondi): Espirando inclina il busto verso destra mantenendo entrambi i fianchi lunghi, poi inspira per tornare al centro ed espira inclinandoti a sinistra. Inspira profondamente... allungati verso l'alto... espira... inclinati mantenendo i piedi ben radicati... senti il fianco che si apre e respira nello spazio creato.",
      uscita: "Inspirando torna al centro con le braccia verso l'alto, poi espirando lascia scendere lentamente le braccia lungo i fianchi."
    },
    speechScript: "Alzati in piedi con i piedi uniti o larghi quanto le anche, e il peso distribuito in modo uniforme sulle piante. Inspirando, allunga le braccia sopra la testa e unisci i palmi, oppure intreccia le dita lasciando gli indici distesi verso l'alto. Senti tutto il corpo che si allunga dalla terra al cielo. Espirando, inclina lentamente il busto verso destra, mantenendo entrambi i fianchi lunghi e i piedi ben radicati. Inspira profondamente... torna al centro allungandoti ancora verso l'alto... espira... inclinati ora verso sinistra, come una mezzaluna... senti il fianco destro che si apre... Inspira profondamente... risali al centro... espira... ripeti dolcemente verso destra, respirando nello spazio che si crea tra le costole... inspira... torna su... espira... ancora una volta a sinistra, con calma... ancora un respiro profondo... | Inspirando, torna al centro con le braccia allungate verso l'alto. Espirando, lascia scendere lentamente le braccia lungo i fianchi."
  },
  {
    id: "riscaldamento_spalle",
    title: "Riscaldamento in Piedi 2",
    asanaName: "Apertura delle Spalle in Piedi",
    category: "riscaldamento",
    categoryLabel: "Riscaldamento",
    side: "entrambi",
    description: {
      entrata: "Rimani in piedi con i piedi larghi quanto le anche e le braccia rilassate lungo i fianchi. Ammorbidisci le ginocchia e allunga la colonna verso l'alto.",
      mantenimento: "Mantenimento guidato (15 secondi): Inspirando disegna ampi cerchi con le braccia portandole in alto, espirando lasciale scendere dietro di te. Dopo alcuni cerchi, intreccia le mani dietro la schiena e, inspirando, apri il petto allontanando le nocche dal corpo. Inspira profondamente... apri il cuore... espira... rilassa le spalle lontano dalle orecchie.",
      uscita: "Sciogli l'intreccio delle mani e lascia tornare le braccia morbide lungo i fianchi, sentendo le spalle più libere e leggere."
    },
    speechScript: "Rimani in piedi con i piedi larghi quanto le anche e le braccia rilassate lungo i fianchi. Ammorbidisci le ginocchia e allunga la colonna verso l'alto. Iniziamo a sciogliere le spalle. Inspirando, porta le braccia in avanti e in alto disegnando un grande cerchio, ed espirando lasciale scendere all'indietro e in basso. Continua così, ampi cerchi lenti che seguono il ritmo del respiro. Inspira profondamente... le braccia salgono... espira... le braccia scendono dietro di te, aprendo il petto... ancora una volta, con calma... Ora ferma i cerchi e intreccia le dita delle mani dietro la schiena. Inspirando, allontana dolcemente le nocche dal corpo e apri il petto verso l'alto. Inspira profondamente... senti le spalle che si aprono e il cuore che si solleva... espira... rilassa le spalle lontano dalle orecchie, senza forzare... rimani qui, respira nello spazio del petto... ancora un respiro profondo... | Sciogli delicatamente l'intreccio delle mani e lascia tornare le braccia morbide lungo i fianchi. Senti le spalle più libere e leggere."
  },
  {
    id: "riscaldamento_bambola",
    title: "Riscaldamento in Piedi 3",
    asanaName: "Uttanasana Dolce (Bambola di Pezza)",
    category: "riscaldamento",
    categoryLabel: "Riscaldamento",
    side: "entrambi",
    description: {
      entrata: "In piedi con i piedi larghi quanto le anche, piega leggermente le ginocchia. Espirando piegati in avanti partendo dalle anche e lascia cadere il busto verso il basso, completamente abbandonato.",
      mantenimento: "Mantenimento guidato (15 secondi): Lascia pendere la testa e le braccia verso terra, oppure afferra i gomiti opposti con le mani. Le ginocchia restano morbide. Inspira profondamente... senti la colonna che si allunga per gravità... espira... lascia andare la testa, il collo, le spalle... se vuoi dondola dolcemente da un lato all'altro.",
      uscita: "Piega bene le ginocchia e, inspirando, risali molto lentamente srotolando la colonna una vertebra alla volta. La testa è l'ultima a risalire."
    },
    speechScript: "Rimani in piedi con i piedi larghi quanto le anche e piega leggermente le ginocchia. Espirando, piegati lentamente in avanti partendo dalle anche e lascia cadere il busto verso il basso, come una bambola di pezza. Lascia pendere liberamente la testa e le braccia verso terra, oppure afferra i gomiti opposti con le mani. Le ginocchia restano sempre morbide: qui non serve toccare terra, serve solo lasciar andare. Inspira profondamente... senti la colonna che si allunga dolcemente grazie alla gravità... espira... abbandona completamente la testa, il collo e le spalle... Inspira profondamente... se ti fa piacere, dondola piano il busto da un lato all'altro... espira... senti la parte posteriore delle gambe che si scioglie... rimani qui, appeso e leggero... respira con calma... ancora un respiro profondo... | Piega bene le ginocchia e, inspirando, risali molto lentamente srotolando la colonna una vertebra alla volta. La testa risale per ultima, e con lei ritrovi il tuo equilibrio in piedi."
  },
  {
    id: "piedi_tadasana",
    title: "Posizione in Piedi 1",
    asanaName: "Tadasana (Posizione della Montagna)",
    category: "in piedi",
    categoryLabel: "Posizioni in Piedi",
    side: "entrambi",
    isHarvardCore: true,
    description: {
      entrata: "Portati in piedi all'inizio del tappetino. Unisci gli alluci lasciando i talloni leggermente separati. Rilassa le braccia lungo i fianchi con i palmi rivolti in avanti. Mantieni la colonna eretta.",
      mantenimento: "Mantenimento guidato (15 secondi): Distribuisci il peso in modo omogeneo sui piedi. Attiva le gambe, solleva le rotule, allinea il bacino e solleva lo sterno. Inspira profondamente... allunga la colonna verso il cielo... espira... rilassa le spalle lontano dalle orecchie... rimani qui, sei forte e stabile come una montagna... senti la connessione con la terra sotto i tuoi piedi.",
      uscita: "Rilassa leggermente le ginocchia e mantieni lo stato di calma mentale, preparandoti alla posizione successiva."
    },
    speechScript: "Portati in piedi all'inizio del tappetino. Unisci gli alluci e mantieni i talloni leggermente separati. Rilassa le braccia lungo i fianchi con i palmi rivolti in avanti. Troviamo stabilità in Tadasana. Distribuisci il peso in modo uniforme sulla pianta dei piedi. Attiva le cosce e allinea il bacino. Inspira profondamente... senti l'addome che si espande... espira... rilassa le spalle e spingile lontano dalle orecchie... allunga la colonna verso il cielo... rimani qui, sei forte e radicato come una montagna... Inspira profondamente... percepisci la tua stabilità... espira... rilassati mantenendo la posa eretta... inspira... espira... ancora un respiro profondo... | Rilassa dolcemente la tensione delle gambe, mantenendo la mente concentrata e calma."
  },
  {
    id: "piedi_saluto_sole",
    title: "Mezzo Saluto al Sole",
    asanaName: "Ardha Surya Namaskara (Saluto al Sole Semplificato)",
    category: "in piedi",
    categoryLabel: "Posizioni in Piedi",
    side: "entrambi",
    description: {
      entrata: "Parti in piedi in Tadasana, con i piedi larghi quanto le anche e le mani unite davanti al petto. È la versione semplificata del Saluto al Sole, tutta in piedi, perfetta per iniziare: le ginocchia possono restare sempre morbide.",
      mantenimento: "Mantenimento guidato: Un flusso dolce guidato dal respiro, ripetuto per due cicli: inspirando le braccia salgono al cielo, espirando ci si piega in avanti con le ginocchia morbide, inspirando si solleva il busto a metà allungando la schiena, espirando si scende di nuovo, e inspirando si risale fino a distendersi verso l'alto.",
      uscita: "Espirando riporta le mani unite davanti al cuore e ferma il movimento. Senti il calore e l'energia che il flusso ha risvegliato nel corpo."
    },
    speechScript: "Parti in piedi con i piedi larghi quanto le anche e le mani unite davanti al petto. Praticheremo un Saluto al Sole semplificato, tutto in piedi, guidato dal respiro. Le ginocchia possono restare sempre leggermente piegate. Iniziamo il primo ciclo. Inspirando, allunga le braccia in avanti e in alto verso il cielo, aprendo il petto... Espirando, piegati lentamente in avanti partendo dalle anche, con le ginocchia morbide, e lascia scendere le mani verso terra... Inspirando, solleva il busto a metà, allungando la schiena in avanti con le mani appoggiate sugli stinchi... Espirando, lasciati scendere di nuovo verso il basso, morbido... Inspirando, risali lentamente con tutto il busto e distendi le braccia verso il cielo... Espirando, riporta le mani unite davanti al cuore... Secondo ciclo, ancora più fluido. Inspira e sali con le braccia verso l'alto... espira e piegati in avanti, abbandonando la testa... inspira e allunga la schiena a metà... espira e scendi di nuovo... inspira e risali fino in cima, allungandoti tutto verso il sole... espira e torna con le mani al cuore... Rimani un istante fermo e senti il respiro che si è fatto più vivo... | Mantieni le mani unite davanti al cuore e fai un ultimo respiro profondo. Senti il calore e l'energia che questo flusso ha risvegliato nel tuo corpo."
  },
  {
    id: "piedi_guerriero2_sinistro",
    title: "Posizione in Piedi 2 (Lato Sinistro)",
    asanaName: "Virabhadrasana II (Guerriero II - Lato Sinistro)",
    category: "in piedi",
    categoryLabel: "Posizioni in Piedi",
    side: "sinistro",
    isHarvardCore: true,
    description: {
      entrata: "Da Tadasana, fai un grande passo indietro con il piede destro (circa un metro). Ruota il piede destro in fuori di 90 gradi. Piega il ginocchio sinistro tenendolo allineato sopra la caviglia sinistra. Estendi le braccia parallele al suolo all'altezza delle spalle, guardando oltre la mano sinistra.",
      mantenimento: "Mantenimento guidato (15 secondi): Inspira profondamente... allunga le braccia in direzioni opposte creando spazio... espira... scendi leggermente con il bacino radicando i piedi a terra... rimani qui, sei forte e concentrato... tieni il busto verticale... senti l'addome espandersi... espira... rilassa le spalle... mantieni fiero lo sguardo.",
      uscita: "Inspirando, distendi la gamba sinistra, abbassa delicatamente le braccia lungo i fianchi e unisci i piedi all'inizio del tappetino."
    },
    speechScript: "Da Tadasana, fai un grande passo indietro con il piede destro. Ruota il piede destro in fuori di 90 gradi. Piega il ginocchio sinistro in modo che sia allineato sopra la caviglia sinistra. Solleva le braccia parallele al pavimento, allineate alle spalle, e rivolgi lo sguardo fiero oltre la mano sinistra. Manteniamo la posizione del Guerriero II sul lato sinistro. Inspira profondamente... senti l'addome che si espande... espira... rilassa le spalle ed entra più profondamente nella posa... rimani qui, sei forte e stabile... attiva le braccia stendendole in direzioni opposte... Inspira profondamente... espira... radica bene il piede destro dietro... senti l'energia del guerriero... ancora un respiro profondo... | Per uscire, inspirando distendi la gamba sinistra, abbassa lentamente le braccia e unisci i piedi all'inizio del tappetino."
  },
  {
    id: "piedi_guerriero2_destro",
    title: "Posizione in Piedi 2 (Lato Destro)",
    asanaName: "Virabhadrasana II (Guerriero II - Lato Destro)",
    category: "in piedi",
    categoryLabel: "Posizioni in Piedi",
    side: "destro",
    isHarvardCore: true,
    description: {
      entrata: "Da Tadasana, fai un grande passo indietro con il piede sinistro. Ruota il piede sinistro in fuori di 90 gradi. Piega il ginocchio destro tenendolo allineato sopra la caviglia destra. Estendi le braccia parallele al suolo all'altezza delle spalle, guardando oltre la mano destra.",
      mantenimento: "Mantenimento guidato (15 secondi): Inspira profondamente... senti l'addome che si espande... espira... rilassa le spalle ed affonda dolcemente con il bacino... rimani qui, sei forte... tieni le braccia attive e stabili... espira... mantieni il busto ben centrato... percepisci la tua forza interiore.",
      uscita: "Inspirando, distendi la gamba destra, abbassa delicatamente le braccia lungo i fianchi e unisci i piedi all'inizio del tappetino."
    },
    speechScript: "Da Tadasana, fai un grande passo indietro con il piede sinistro. Ruota il piede sinistro in fuori di 90 gradi. Piega il ginocchio destro in modo che sia allineato sopra la caviglia destra. Solleva le braccia parallele al pavimento, allineate alle spalle, e guarda fiero oltre la mano destra. Manteniamo la posizione del Guerriero II sul lato destro. Inspira profondamente... senti l'addome che si espande... espira... rilassa le spalle ed affonda con il bacino... rimani qui, sei forte... allunga le dita delle mani... Inspira profondamente... espira... mantieni il busto ben centrato... percepisci la forza e la determinazione nel tuo corpo... ancora un respiro profondo... | Inspirando distendi la gamba destra, abbassa le braccia e unisci i piedi all'inizio del tappetino."
  },
  {
    id: "piedi_triangolo_sinistro",
    title: "Posizione in Piedi 3 (Lato Sinistro)",
    asanaName: "Trikonasana (Posizione del Triangolo - Lato Sinistro)",
    category: "in piedi",
    categoryLabel: "Posizioni in Piedi",
    side: "sinistro",
    isHarvardCore: true,
    description: {
      entrata: "Divarica le gambe lateralmente a circa un metro. Ruota il piede sinistro in fuori di 90 gradi e il destro leggermente in dentro di 15 gradi. Estendi le braccia lateralmente, parallele al suolo. Allungati verso sinistra e fletti il busto scendendo con la mano sulla tibia o su un blocco. Allunga il braccio destro al soffitto.",
      mantenimento: "Mantenimento guidato (15 secondi): Inspira profondamente... apri il petto verso l'alto... espira... rilassa le spalle ed allunga entrambi i lati del busto... rimani qui, sei forte... spingi bene i piedi a terra... senti l'allungamento profondo nel fianco destro... respira con calma e consapevolezza.",
      uscita: "Inspirando, attiva l'addome e solleva il busto tornando eretto al centro. Ruota i piedi paralleli."
    },
    speechScript: "Divarica le gambe a circa un metro di distanza. Ruota il piede sinistro in fuori di 90 gradi e il piede destro leggermente in dentro. Estendi le braccia lateralmente, parallele al suolo. Inspirando allungati verso sinistra e, espirando, fletti il busto portando la mano sinistra sulla tibia o su un blocco. Solleva il braccio destro al soffitto, guardando verso l'alto. Manteniamo il Triangolo sul lato sinistro. Inspira profondamente... senti il petto che si apre... espira... rilassa le spalle ed allunga entrambi i lati del busto... rimani qui, sei forte... spingi bene i piedi a terra... Inspira profondamente... espira... senti l'allungamento diagonale... mantieni l'allineamento delle anche... ancora un respiro profondo... | Per uscire, inspirando attiva i muscoli addominali e solleva il busto tornando al centro, poi ruota i piedi paralleli."
  },
  {
    id: "piedi_triangolo_destro",
    title: "Posizione in Piedi 3 (Lato Destro)",
    asanaName: "Trikonasana (Posizione del Triangolo - Lato Destro)",
    category: "in piedi",
    categoryLabel: "Posizioni in Piedi",
    side: "destro",
    isHarvardCore: true,
    description: {
      entrata: "Con le gambe divaricate, ruota il piede destro in fuori di 90 gradi e il sinistro in dentro di 15 gradi. Estendi le braccia lateralmente. Allungati verso destra e fletti il busto scendendo con la mano destra sulla tibia o sulla caviglia. Allunga il braccio sinistro verso il cielo.",
      mantenimento: "Mantenimento guidato (15 secondi): Inspira profondamente... senti l'addome espandersi... espira... rilassa le spalle allontanandole dalle orecchie... rimani qui, sei forte... non fare cadere la spalla sinistra in avanti... mantieni il petto aperto... senti l'allungamento e respira.",
      uscita: "Inspirando, attiva gli obliqui per risalire con il busto. Abbassa le braccia e unisci i piedi in Tadasana."
    },
    speechScript: "Con le gambe divaricate, ruota il piede destro in fuori di 90 gradi and il sinistro leggermente in dentro. Estendi le braccia lateralmente. Inspirando allungati verso destra e, espirando, fletti il busto scendendo con la mano destra sulla tibia o sulla caviglia. Allunga il braccio sinistro verso il cielo e rivolgi lo sguardo alla mano in alto. Manteniamo il Triangolo sul lato destro. Inspira profondamente... senti l'addome che si espande... espira... rilassa le spalle allontanandole dalle orecchie... rimani qui, sei forte... non far cadere il petto in avanti... Inspira profondamente... espira... percepisci lo spazio nel fianco sinistro... espandi il cuore... ancora un respiro profondo... | Inspirando usa la forza dell'addome per risalire con il busto. Abbassa le braccia e unisci i piedi all'inizio del tappetino."
  },
  {
    id: "equilibrio_albero_sinistro",
    title: "Posizione di Equilibrio 1 (Lato Sinistro)",
    asanaName: "Vrksasana (Posizione dell'Albero - Lato Sinistro)",
    category: "equilibrio",
    categoryLabel: "Posizioni di Equilibrio",
    side: "sinistro",
    isHarvardCore: true,
    description: {
      entrata: "Inizia in Tadasana. Sposta il peso sul piede destro, radicandoti a terra. Piega il ginocchio sinistro in fuori e solleva il piede appoggiando la pianta all'interno della coscia destra o sul polpaccio (evitando il ginocchio). Porta le mani giunte davanti al petto.",
      mantenimento: "Mantenimento guidato (15 secondi): Trova un punto fisso davanti a te per mantenere l'equilibrio. Inspira profondamente... allunga la colonna... espira... rilassa le spalle ed il viso... rimani qui, sei forte e radicato come un albero stabile... respira con consapevolezza ad ogni oscillazione.",
      uscita: "Espirando, abbassa lentamente le mani al petto, poi rilascia il piede sinistro a terra tornando in Tadasana."
    },
    speechScript: "Inizia in Tadasana. Sposta il peso del corpo sul piede destro. Piega il ginocchio sinistro in fuori, solleva il piede sinistro e appoggia la pianta all'interno della coscia destra o sul polpaccio, evitando il ginocchio. Unisci le mani davanti al petto. Manteniamo l'Albero radicato sul piede destro, piegando il sinistro. Trova un punto fisso davanti a te per l'equilibrio. Inspira profondamente... senti la colonna che si allunga... espira... rilassa le spalle ed ammorbidisci il viso... rimani qui, sei forte e stabile... visualizza le radici che scendono dal tuo piede... Inspira profondamente... se vuoi, solleva le braccia oltre la testa come rami... espira... mantieni la concentrazione... inspira... espira... ancora un respiro profondo... | Espirando, riabbassa lentamente le mani al petto, poi rilascia il piede sinistro a terra tornando in Tadasana."
  },
  {
    id: "equilibrio_albero_destro",
    title: "Posizione di Equilibrio 1 (Lato Destro)",
    asanaName: "Vrksasana (Posizione dell'Albero - Lato Destro)",
    category: "equilibrio",
    categoryLabel: "Posizioni di Equilibrio",
    side: "destro",
    isHarvardCore: true,
    description: {
      entrata: "Inizia in Tadasana. Sposta il peso sul piede sinistro. Piega il ginocchio destro in fuori e solleva il piede appoggiando la pianta all'interno della coscia o del polpaccio sinistro. Porta le mani giunte davanti al petto.",
      mantenimento: "Mantenimento guidato (15 secondi): Fissa lo sguardo in avanti. Inspira profondamente... cresci con la testa... espira... rilassa le spalle ed allinea i fianchi... rimani qui, sei forte... spingi il piede destro contro la coscia... respira profondamente per stabilizzare il corpo.",
      uscita: "Espirando, abbassa le braccia, rilascia il piede destro a terra e sciogli delicatamente le gambe."
    },
    speechScript: "Inizia in Tadasana. Sposta il peso del corpo sul piede sinistro. Piega il ginocchio destro in fuori, solleva il piede destro e appoggia la pianta all'interno della coscia o del polpaccio sinistro. Unisci le mani davanti al petto. Manteniamo l'Albero radicato sul piede sinistro, piegando il destro. Fissa lo sguardo in avanti. Inspira profondamente... senti l'addome che si espande... espira... rilassa le spalle ed allinea i fianchi... rimani qui, sei forte... spingi il piede contro la coscia... Inspira profondamente... allunga i rami del tuo albero verso il cielo... espira... mantieni la calma interiore... inspira... espira... ancora un respiro profondo... | Espirando, abbassa le braccia, rilascia il piede destro a terra e sciogli delicatamente le caviglie."
  },
  {
    id: "equilibrio_guerriero3_sinistro",
    title: "Posizione di Equilibrio 2 (Lato Sinistro)",
    asanaName: "Virabhadrasana III (Guerriero III - Lato Sinistro)",
    category: "equilibrio",
    categoryLabel: "Posizioni di Equilibrio",
    side: "sinistro",
    description: {
      entrata: "In piedi sul piede destro, mani giunte al petto. Allunga la colonna ed inclinati in avanti sollevando la gamba sinistra tesa indietro, fino ad allineare gamba e busto paralleli al pavimento. Fianchi squadrati rivolti a terra.",
      mantenimento: "Mantenimento guidato (15 secondi): Inspira profondamente... allunga la testa in avanti ed il tallone sinistro indietro creando una linea retta... espira... attiva l'addome... rimani qui, sei forte e concentrato... respira con calma controllando le piccole oscillazioni.",
      uscita: "Inspirando, con controllo e lentezza, solleva il busto e riporta il piede sinistro a terra accanto al destro."
    },
    speechScript: "In piedi sul piede destro. Porta le mani giunte davanti al petto. Inspirando allunga la colonna ed, espirando, inclina il busto in avanti mentre sollevi la gamba sinistra tesa all'indietro, portando il corpo parallelo al pavimento. Manteniamo il Guerriero III radicato sulla gamba destra. Inspira profondamente... allunga la testa in avanti e il tallone sinistro all'indietro... espira... allinea i fianchi rivolti verso il basso... rimani qui, sei forte e concentrato... mantieni l'addome attivo per sostenere la zona lombare... Inspira profondamente... espira... controlla le micro-oscillazioni della caviglia... senti la tua forza... ancora un respiro profondo... | Inspirando, con controllo e lentezza, risali con il busto e riporta il piede sinistro a terra accanto al destro."
  },
  {
    id: "equilibrio_guerriero3_destro",
    title: "Posizione di Equilibrio 2 (Lato Destro)",
    asanaName: "Virabhadrasana III (Guerriero III - Lato Destro)",
    category: "equilibrio",
    categoryLabel: "Posizioni di Equilibrio",
    side: "destro",
    description: {
      entrata: "In piedi sul piede sinistro, mani giunte al petto. Allunga la colonna ed inclinati in avanti sollevando la gamba destra tesa indietro, fino a portarle parallele al suolo. Spingi forte il tallone destro indietro.",
      mantenimento: "Mantenimento guidato (15 secondi): Inspira profondamente... allunga tutto il corpo... espira... rilassa le spalle ed allinea i fianchi... rimani qui, sei forte... tieni lo sguardo fermo a terra... senti l'addome attivo... mantieni la concentrazione costante.",
      uscita: "Inspirando, con controllo, ritorna in posizione eretta e poggia il piede destro a terra in modo fluido."
    },
    speechScript: "In piedi sul piede sinistro. Porta le mani giunte al petto. Inspirando allunga la colonna ed, espirando, fletti il busto in avanti sollevando contemporaneamente la gamba destra tesa all'indietro, parallela al pavimento. Manteniamo il Guerriero III radicato sulla gamba sinistra. Inspira profondamente... allunga tutto il corpo in linee opposte... espira... rilassa le spalle lontano dalle orecchie... rimani qui, sei forte... mantieni lo sguardo fisso a terra... Inspira profondamente... espira... spingi forte il tallone destro indietro con il piede a martello... respira con consapevolezza... ancora un respiro profondo... | Inspirando, torna con il busto eretto e poggia il piede destro a terra in modo fluido e controllato."
  },
  {
    id: "torsione_matsyendra_sinistro",
    title: "Torsione (Lato Sinistro)",
    asanaName: "Ardha Matsyendrasana (Mezza Torsione - Lato Sinistro)",
    category: "torsione",
    categoryLabel: "Torsione",
    side: "sinistro",
    description: {
      entrata: "Siediti con le gambe distese. Piega il ginocchio destro a terra portando il tallone al gluteo sinistro. Piega la gamba sinistra e scavalca la destra, poggiando il piede all'esterno del ginocchio destro. Porta la mano sinistra dietro la schiena.",
      mantenimento: "Mantenimento guidato (15 secondi): Abbraccia il ginocchio sinistro col braccio destro. Inspira profondamente... raddrizza la colonna eretta... espira... ruota delicatamente il busto a sinistra oltre la spalla... rimani qui, sei forte... senti il massaggio all'addome ad ogni respiro.",
      uscita: "Espirando, ruota dolcemente la testa e il busto in avanti. Sciogli la posizione delle gambe e distendile."
    },
    speechScript: "Siediti sul tappetino con le gambe distese in avanti. Piega la gamba destra portando il tallone all'esterno del gluteo sinistro. Piega la gamba sinistra e scavalca la destra, appoggiando il piede sinistro a terra. Porta la mano sinistra a terra dietro la colonna e abbraccia il ginocchio sinistro con il braccio destro. Manteniamo la torsione verso sinistra. Inspira profondamente... allunga bene la colonna vertebrale verso l'alto... espira... ruota delicatamente il busto a sinistra guardando oltre la spalla... rimani qui, sei forte... mantieni entrambi gli ischi a terra... Inspira profondamente... crea spazio tra le vertebre... espira... intensifica la torsione dall'addome... senti il massaggio interno... ancora un respiro profondo... | Per uscire, espirando ruota delicatamente la testa e il busto in avanti, sciogli la posizione e distendi le gambe."
  },
  {
    id: "torsione_matsyendra_destro",
    title: "Torsione (Lato Destro)",
    asanaName: "Ardha Matsyendrasana (Mezza Torsione - Lato Destro)",
    category: "torsione",
    categoryLabel: "Torsione",
    side: "destro",
    description: {
      entrata: "Siediti con le gambe distese. Piega la gamba sinistra portando il tallone all'esterno del gluteo destro. Piega la gamba destra scavalcando la sinistra, poggiando il piede a terra. Porta la mano destra dietro la schiena.",
      mantenimento: "Mantenimento guidato (15 secondi): Abbraccia il ginocchio destro con il braccio sinistro. Inspira profondamente... allunga la colonna... espira... ruota il busto a destra guardando oltre la spalla destra... rimani qui, sei forte... rilassa le spalle ed allinea la posa.",
      uscita: "Espirando, ritorna lentamente con il busto al centro, sciogli la posizione delle gambe e rilassale."
    },
    speechScript: "Siediti sul tappetino. Piega la gamba sinistra portando il tallone all'esterno del gluteo destro. Piega la gamba destra scavalcando la sinistra, poggiando la pianta del piede a terra. Porta la mano destra dietro la schiena e abbraccia il ginocchio destro con il braccio sinistro. Manteniamo la torsione verso destra. Inspira profondamente... allunga la schiena verso il cielo... espira... ruota il busto a destra guardando oltre la spalla destra... rimani qui, sei forte... rilassa le spalle... Inspira profondamente... senti l'addome che preme contro la coscia... espira... rilassa le spalle... senti l'allungamento e la purificazione della colonna... ancora un respiro profondo... | Espirando, ritorna lentamente con il busto al centro, sciogli la posizione delle gambe e rilassale."
  },
  {
    id: "piegamento_cobra",
    title: "Piegamento all'Indietro",
    asanaName: "Bhujangasana (Posizione del Cobra)",
    category: "piegamento",
    categoryLabel: "Piegamenti all'Indietro",
    side: "entrambi",
    isHarvardCore: true,
    description: {
      entrata: "Sdraiati sulla pancia a terra. Unisci le gambe con i dorsi dei piedi appoggiati a terra. Posiziona le mani sotto le spalle con i gomiti piegati e stretti vicino ai fianchi del busto.",
      mantenimento: "Mantenimento guidato (15 secondi): Inspirando premi il pube a terra e solleva dolcemente testa e petto, usando i muscoli spinali senza sforzare le mani. Inspira profondamente... apri il cuore... espira... rilassa le spalle lontano dalle orecchie... gomiti piegati vicino al corpo... rimani qui, sei forte... respira profondamente.",
      uscita: "Espirando lentamente, riabbassa il petto e la fronte a terra. Appoggia una guancia sul tappetino e rilassati."
    },
    speechScript: "Sdraiati a pancia in giù sul tappetino. Unisci le gambe con i dorsi dei piedi appoggiati a terra. Posiziona i palmi delle mani sotto le spalle con i gomiti piegati e stretti vicino ai fianchi. Entriamo nel Cobra. Inspirando, premi il pube a terra e solleva delicatamente la testa e il petto, usando i muscoli della schiena senza spingere sulle mani. Inspira profondamente... senti l'addome che si espande contro il suolo... espira... rilassa le spalle lontano dalle orecchie... rimani qui, sei forte... mantieni il collo lungo in asse... Inspira profondamente... apri il cuore in avanti... espira... tieni i gomiti vicini al corpo... respira con consapevolezza... ancora un respiro profondo... | Espirando lentamente, riabbassa il petto e la fronte a terra, appoggia una guancia sul tappetino e rilassati."
  },
  {
    id: "piegamento_locusta",
    title: "Rafforzamento Dorsale",
    asanaName: "Salabhasana (Posizione della Locusta)",
    category: "piegamento",
    categoryLabel: "Piegamenti all'Indietro",
    side: "entrambi",
    isHarvardCore: true,
    description: {
      entrata: "Sdraiati sulla pancia con le gambe unite e i dorsi dei piedi a terra. Distendi le braccia lungo i fianchi con i palmi rivolti verso l'alto. Appoggia la fronte o il mento al tappetino.",
      mantenimento: "Mantenimento guidato (15 secondi): Inspirando solleva contemporaneamente la testa, il petto, le braccia e le gambe da terra, allungandoti in avanti e indietro come una locusta. Inspira profondamente... allunga le braccia verso i piedi... espira... mantieni il collo in linea con la colonna... rimani qui, senti i muscoli della schiena che lavorano... respira con calma.",
      uscita: "Espirando riabbassa lentamente petto, braccia e gambe a terra. Appoggia una guancia sul tappetino e lascia che la schiena si rilassi completamente."
    },
    speechScript: "Sdraiati a pancia in giù sul tappetino con le gambe unite e i dorsi dei piedi appoggiati a terra. Distendi le braccia lungo i fianchi con i palmi rivolti verso l'alto e appoggia la fronte al tappetino. Entriamo nella Locusta, una posizione che rinforza tutta la schiena. Inspirando, solleva contemporaneamente la testa, il petto, le braccia e le gambe da terra. Allunga le braccia all'indietro verso i piedi e mantieni lo sguardo verso il basso per proteggere il collo. Inspira profondamente... senti tutta la catena posteriore attiva... espira... allungati in avanti con il petto e indietro con le dita dei piedi... rimani qui, sei forte e stabile... Inspira profondamente... solleva ancora un centimetro il petto... espira... mantieni le gambe attive senza irrigidire il viso... respira con calma... ancora un respiro profondo... | Espirando, riabbassa lentamente il petto, le braccia e le gambe a terra. Appoggia una guancia sul tappetino e lascia che tutta la schiena si rilassi."
  },
  {
    id: "piegamento_ponte",
    title: "Posizione del Ponte",
    asanaName: "Setu Bandhasana (Posizione del Ponte)",
    category: "piegamento",
    categoryLabel: "Piegamenti all'Indietro",
    side: "entrambi",
    isHarvardCore: true,
    description: {
      entrata: "Sdraiati sulla schiena con le ginocchia piegate e le piante dei piedi a terra parallele, aperte alla larghezza delle anche. Posiziona i talloni vicini ai glutei, in modo da poterli sfiorare con le dita delle mani.",
      mantenimento: "Mantenimento guidato (15 secondi): Inspirando premi con forza i piedi e le braccia a terra per sollevare il bacino verso l'alto. Se riesci, intreccia le dita sotto la schiena per aprire maggiormente le spalle ed il petto. Inspira profondamente... solleva l'addome ed il torace... espira... tieni le ginocchia parallele senza farle allargare... rimani qui, sei forte... respira regolarmente.",
      uscita: "Sciogli l'intreccio delle mani ed, espirando lentamente, srotola la colonna vertebrale a terra una vertebra alla volta, riappoggiando il bacino."
    },
    speechScript: "Sdraiati sulla schiena con le ginocchia piegate e le piante dei piedi a terra, larghi quanto il bacino. Avvicina i talloni ai glutei in modo da poterli sfiorare con le dita. Tieni le braccia lungo i fianchi con i palmi rivolti a terra. Inspirando premi forte i piedi e solleva il bacino verso l'alto. Se riesci, intreccia le dita sotto la schiena per aprire maggiormente le spalle. Iniziamo il mantenimento guidato. Inspira profondamente... senti l'addome che sale... espira... spingi sulle cosce e mantieni le ginocchia parallele... Inspira... espandi il petto... espira... rilassa il collo e la gola, ma mantieni forte la spinta dei glutei e dei piedi... senti l'energia fluire nella colonna... ancora un respiro profondo... | Sciogli delicatamente l'intreccio delle mani ed, espirando lentamente, srotola la colonna una vertebra alla volta fino a riappoggiare il bacino sul tappetino."
  },
  {
    id: "apertura_farfalla",
    title: "Apertura delle Anche",
    asanaName: "Baddha Konasana (Posizione della Farfalla)",
    category: "apertura_anche",
    categoryLabel: "Apertura delle Anche",
    side: "entrambi",
    description: {
      entrata: "Portati seduto con la schiena dritta. Piega le ginocchia, unisci le piante dei piedi davanti a te e avvicina i talloni al pube. Afferra saldamente i piedi o le caviglie con le mani.",
      mantenimento: "Mantenimento guidato (15 secondi): Mantieni la colonna allungata ed il petto aperto. Lascia scendere le ginocchia lateralmente per gravità. Inspira profondamente... espandi l'addome... espira... rilassa l'interno coscia e sblocca le anche... rimani qui, morbido e rilassato... respira profondamente.",
      uscita: "Aiutandoti con le mani sotto le ginocchia, richiudile delicatamente e distendi le gambe in avanti per sciogliere."
    },
    speechScript: "Portati in posizione seduta con la schiena dritta. Piega le ginocchia, unisci le piante dei piedi davanti a te e avvicina i talloni al bacino. Afferra i piedi con le mani. Manteniamo la posizione della Farfalla per aprire le anche. Lascia scendere le ginocchia verso l'esterno. Inspira profondamente... allunga la colonna verso l'alto... espira... lascia che le ginocchia scendano per gravità... rimani qui, rilassa l'interno delle cosce... Inspira profondamente... senti l'addome che si espande... espira... rilascia ogni tensione accumulata nel bacino... rimani morbido e ricettivo... respira... ancora un respiro profondo... | Per uscire, aiutandoti con le mani sotto le ginocchia, richiudile delicatamente e distendi lentamente le gambe in avanti."
  },
  {
    id: "piegamento_avanti_seduto",
    title: "Piegamento in Avanti",
    asanaName: "Paschimottanasana (Piegamento in Avanti da Seduto)",
    category: "piegamento",
    categoryLabel: "Piegamento in Avanti",
    side: "entrambi",
    isHarvardCore: true,
    description: {
      entrata: "Siediti a terra con le gambe distese in avanti e unite. Fletti le punte dei piedi verso di te. Se la parte bassa della schiena tende a incurvarsi, piega leggermente le ginocchia o siediti su un cuscino. Inspira e allunga le braccia verso l'alto.",
      mantenimento: "Mantenimento guidato (15 secondi): Espirando piegati in avanti partendo dalle anche, mantenendo la schiena lunga, e appoggia le mani dove arrivano: cosce, stinchi o piedi. Inspira profondamente... allunga la colonna in avanti... espira... lasciati scendere dolcemente senza forzare... rimani qui, senti l'allungamento dietro le gambe... respira con calma.",
      uscita: "Inspirando risali lentamente con la schiena dritta, srotolandoti vertebra dopo vertebra fino a tornare seduto eretto."
    },
    speechScript: "Siediti a terra con le gambe distese in avanti e unite, con le punte dei piedi flesse verso di te. Se senti la parte bassa della schiena incurvarsi, piega leggermente le ginocchia oppure siediti sul bordo di un cuscino. Inspirando, allunga le braccia verso l'alto e senti la colonna che si estende. Espirando, piegati lentamente in avanti partendo dalle anche, come se il petto volesse raggiungere le dita dei piedi. Appoggia le mani dove arrivano senza forzare: sulle cosce, sugli stinchi o sui piedi. Inspira profondamente... allunga la colonna in avanti... espira... lascia che il busto scenda dolcemente verso le gambe... rimani qui, senti l'allungamento lungo tutta la parte posteriore del corpo... Inspira profondamente... crea spazio tra le vertebre... espira... rilassa la testa e il collo, abbandona ogni resistenza... respira con calma... ancora un respiro profondo... | Inspirando, risali lentamente srotolando la colonna vertebra dopo vertebra, fino a tornare seduto con la schiena eretta."
  },
  {
    id: "defaticamento_apanasana",
    title: "Defaticamento 1",
    asanaName: "Apanasana (Ginocchia al Petto)",
    category: "defaticamento",
    categoryLabel: "Defaticamento",
    side: "entrambi",
    description: {
      entrata: "Sdraiati sulla schiena. Piega le ginocchia e portale al petto. Abbraccia le ginocchia o le tibie con le mani, intrecciando le dita.",
      mantenimento: "Mantenimento guidato (15 secondi): Mantieni tutta la colonna e la testa a terra. Inspira profondamente... l'addome preme sulle cosce... espira... premi dolcemente le ginocchia al petto allungando la zona lombare... rimani qui in ascolto... rilassa spalle e collo... respira lentamente.",
      uscita: "Espirando, rilascia la presa delle mani e appoggia i piedi a terra tenendo le ginocchia piegate."
    },
    speechScript: "Sdraiati sulla schiena a terra. Piega le ginocchia e portale al petto, abbracciando le gambe con le mani. Manteniamo Apanasana per allungare la schiena. Inspira profondamente... senti l'addome che si espande contro le cosce... espira... premi dolcemente le ginocchia al petto rilassando la zona lombare... rimani qui... senti tutta la colonna ben appoggiata a terra... Inspira profondamente... espira... rilassa completamente le spalle e la nuca... puoi dondolare leggermente a destra e sinistra per un massaggio... inspira... espira... ancora un respiro profondo... | Ferma il dondolio ed, espirando, rilascia la presa delle mani appoggiando le piante dei piedi a terra con le ginocchia piegate."
  },
  {
    id: "defaticamento_torsione_sinistra",
    title: "Defaticamento 2 (Lato Sinistro)",
    asanaName: "Supta Matsyendrasana (Torsione da Sdraiati - Lato Sinistro)",
    category: "defaticamento",
    categoryLabel: "Defaticamento",
    side: "sinistro",
    description: {
      entrata: "Sdraiato sulla schiena, apri le braccia a croce con i palmi a terra. Porta le ginocchia al petto e lasciale cadere unite verso sinistra. Ruota la testa a destra.",
      mantenimento: "Mantenimento guidato (15 secondi): Mantieni la spalla destra appoggiata a terra. Inspira profondamente... espira... lascia che le ginocchia scendano per gravità... rimani qui... rilassati completamente senza alcuno sforzo muscolare... respira passivamente.",
      uscita: "Inspirando, riporta lentamente le ginocchia e la testa al centro, riallineando il bacino."
    },
    speechScript: "Sdraiato sulla schiena, apri le braccia a croce all'altezza delle spalle, con i palmi rivolti a terra. Porta le ginocchia al petto e lasciale cadere unite verso il lato sinistro del corpo, ruotando la testa a destra. Manteniamo la torsione passiva a sinistra. Inspira profondamente... espira... lascia che la gravità faccia scendere le ginocchia a terra... rimani qui, rilassato... mantieni la spalla destra ancorata al suolo... Inspira profondamente... senti l'addome che si solleva dolcemente... espira... rilascia ogni sforzo fisico lasciandoti andare... inspira... espira... ancora un respiro profondo... | Inspirando, riporta lentamente le ginocchia e la testa al centro, riallineando il bacino."
  },
  {
    id: "defaticamento_torsione_destra",
    title: "Defaticamento 2 (Lato Destro)",
    asanaName: "Supta Matsyendrasana (Torsione da Sdraiati - Lato Destro)",
    category: "defaticamento",
    categoryLabel: "Defaticamento",
    side: "destro",
    description: {
      entrata: "Con le ginocchia al centro e le braccia a croce, lascia cadere le ginocchia unite verso destra. Ruota la testa a sinistra.",
      mantenimento: "Mantenimento guidato (15 secondi): Tieni la spalla sinistra rilassata a terra. Inspira profondamente... senti il respiro che massaggia la colonna... espira... rilassa il corpo nel tappetino... rimani in ascolto... lascia andare le ultime tensioni.",
      uscita: "Inspirando, riporta le ginocchia e la testa al centro. Poi distendi le gambe lungo il tappetino."
    },
    speechScript: "Con le braccia a croce e le ginocchia piegate al centro, lascia cadere delicatamente le ginocchia unite verso il lato destro del corpo, ruotando la testa a sinistra. Manteniamo la torsione passiva a destra. Inspira profondamente... espira... rilassa la spalla sinistra verso il pavimento... rimani qui... abbandona tutto il peso del corpo... Inspira profondamente... senti il respiro che massaggia la colonna... espira... lascia andare ogni ultima tensione... percepisci la quiete che si diffonde... ancora un respiro profondo... | Inspirando, riporta le ginocchia e la testa al centro. Poi distendi le gambe lungo il tappetino ed allunga le braccia."
  },
  {
    id: "defaticamento_gambe_al_muro",
    title: "Gambe al Muro",
    asanaName: "Viparita Karani (Posizione delle Gambe al Muro)",
    category: "defaticamento",
    categoryLabel: "Defaticamento",
    side: "entrambi",
    isHarvardCore: true,
    description: {
      entrata: "Porta il tappetino vicino a una parete. Siediti di fianco al muro, poi sdraiati sulla schiena facendo oscillare le gambe verso l'alto, appoggiandole distese contro la parete. I glutei possono restare a qualche centimetro dal muro. Distendi le braccia lungo i fianchi e chiudi gli occhi.",
      mantenimento: "Mantenimento guidato (15 secondi): Lascia che il muro sostenga completamente il peso delle gambe. Inspira profondamente... senti le gambe che si svuotano e si alleggeriscono... espira... abbandona il bacino e la schiena alla terra... rimani qui, non c'è nulla da fare... respira con calma.",
      uscita: "Piega le ginocchia verso il petto, girati dolcemente su un fianco e prenditi qualche istante prima di risalire a sederti con calma."
    },
    speechScript: "Porta il tappetino vicino a una parete. Siediti di fianco al muro e poi, con un movimento dolce, sdraiati sulla schiena facendo oscillare le gambe verso l'alto fino ad appoggiarle distese contro la parete. Va benissimo se i glutei restano a qualche centimetro dal muro. Distendi le braccia lungo i fianchi con i palmi verso l'alto e chiudi gli occhi. Questa è Viparita Karani, una posizione rigenerante che favorisce il ritorno della circolazione e calma profondamente il sistema nervoso. Lascia che il muro sostenga tutto il peso delle gambe. Inspira profondamente... senti le gambe che si svuotano e diventano leggere... espira... abbandona il bacino e tutta la schiena alla terra... Inspira profondamente... senti l'addome che si solleva morbido... espira... rilascia le spalle, la gola, il viso... rimani qui, non c'è nulla da fare e nessun posto dove andare... respira con calma... ancora un respiro profondo... | Piega lentamente le ginocchia verso il petto, girati dolcemente su un fianco e riposa qualche istante prima di risalire a sederti con calma."
  },
  {
    id: "rilassamento_savasana",
    title: "Rilassamento Finale",
    asanaName: "Savasana (Posizione del Cadavere)",
    category: "rilassamento",
    categoryLabel: "Rilassamento Finale",
    side: "entrambi",
    isHarvardCore: true,
    description: {
      entrata: "Sdraiati comodamente sulla schiena a terra. Divarica leggermente le gambe lasciando cadere i piedi verso l'esterno. Allontana le braccia dal corpo a circa 30 gradi con i palmi all'insù. Chiudi gli occhi.",
      mantenimento: "Mantenimento guidato (15 secondi): Abbandona il peso alla terra. Inspira profondamente... espira con un sospiro liberatorio dalla bocca... rilassa talloni, polpacci, cosce e bacino... allenta addome, petto e spalle... rimani immobile in una quiete totale.",
      uscita: "Muovi lentamente le dita di mani e piedi. Stirati, piega le ginocchia e girati sul fianco destro prima di risalire a sederti con calma."
    },
    speechScript: "Sdraiati sulla schiena per il rilassamento finale. Divarica leggermente le gambe lasciando cadere i piedi verso l'esterno. Allontana le braccia dal corpo con i palmi rivolti all'insù. Rimaniamo in Savasana. Chiudi gli occhi. Inspira profondamente dal naso ed espira con un lungo sospiro liberatorio dalla bocca, abbandonando tutto il corpo alla terra. Inspira profondamente... espira... senti i talloni, i polpacci e le cosce farsi pesanti... rilassa il bacino e l'addome... Inspira profondamente... espira... rilassa il petto, le spalle, le braccia e le mani... allenta la tensione del collo e della gola... rilassa la mandibola, gli occhi e la fronte... Tutto il tuo corpo è ora immobile e rilassato, in una quiete profonda... lasciati andare... | Ora fai un respiro profondo, muovi lentamente le dita delle mani e dei piedi, stirati e girati sul fianco destro prima di tornare a sederti."
  },
  {
    id: "respirazione_sama_vritti",
    title: "Pranayama",
    asanaName: "Sama Vritti (Respirazione Quadrata)",
    category: "respirazione",
    categoryLabel: "Esercizio di Respirazione",
    side: "entrambi",
    description: {
      entrata: "Siediti in una comoda posa yoga eretta. Appoggia le mani sulle ginocchia e chiudi gli occhi. Rilassa le spalle.",
      mantenimento: "Mantenimento guidato: Respirazione in 4 fasi di eguale durata (4 secondi ciascuna): inspira, trattieni pieno, espira, trattieni vuoto. La guida vocale accompagnerà l'utente per 5 cicli completi di respiro.",
      uscita: "Terminato l'ultimo ciclo a vuoto, rilascia il controllo e ritorna al tuo respiro naturale, godendo della calma mentale."
    },
    speechScript: "Siediti in una posizione yoga comoda con la schiena dritta. Appoggia le mani sulle ginocchia e chiudi gli occhi. Praticheremo Sama Vritti, la respirazione quadrata, per calmare la mente e bilanciare il sistema nervoso. Ogni fase del respiro durerà 4 secondi. Svuota completamente i polmoni. Iniziamo il primo ciclo: Inspira per 4, 3, 2, 1... trattieni a polmoni pieni per 4, 3, 2, 1... espira lentamente per 4, 3, 2, 1... trattieni a polmoni vuoti per 4, 3, 2, 1. Secondo ciclo: Inspira profondamente per 4, 3, 2, 1... trattieni il respiro per 4, 3, 2, 1... espira rilasciando tutto per 4, 3, 2, 1... trattieni a vuoto per 4, 3, 2, 1. Terzo ciclo: Inspira con calma per 4, 3, 2, 1... trattieni stabili per 4, 3, 2, 1... espira dolcemente per 4, 3, 2, 1... trattieni a vuoto per 4, 3, 2, 1. Quarto ciclo: Inspira espandendo l'addome per 4, 3, 2, 1... trattieni in pace per 4, 3, 2, 1... espira liberando la mente per 4, 3, 2, 1... trattieni a vuoto per 4, 3, 2, 1. Quinto ciclo: Inspira energia per 4, 3, 2, 1... trattieni con consapevolezza per 4, 3, 2, 1... espira sciogliendo le ultime tensioni per 4, 3, 2, 1... trattieni a vuoto per 4, 3, 2, 1. | Rilascia ora ogni controllo sul respiro. Ritorna a respirare in modo spontaneo. Osserva la calma e la centratura mentale."
  },
  {
    id: "meditazione_guida",
    title: "Meditazione Guidata",
    asanaName: "Scansione Corporea (Body Scan)",
    category: "meditazione",
    categoryLabel: "Meditazione Guidata",
    side: "entrambi",
    description: {
      entrata: "Rimani seduto eretto in silenzio, oppure sdraiati comodamente in Savasana per abbandonare il corpo a terra. Chiudi gli occhi.",
      mantenimento: "Mantenimento guidato: Lasciati guidare in una scansione corporea dettagliata che porterà consapevolezza ed rilassamento progressivo a ogni singola parte del corpo, partendo dalla testa fino alle dita dei piedi.",
      uscita: "Riprendi dolcemente contatto con l'esterno. Respira profondamente, muovi le dita e riapri gli occhi con calma. Namastè."
    },
    speechScript: "Rimani seduto in silenzio con la schiena dritta, oppure se preferisci sdraiati di nuovo nella comoda posa di Savasana. Chiudi dolcemente gli occhi. Iniziamo il nostro viaggio di meditazione e consapevolezza con un body scan profondo. Porta l'attenzione alla sommità della testa. Senti la pelle del cranio che si distende e si rilassa... Scendi alla fronte, ammorbidisci lo spazio tra le sopracciglia... Rilassa le palpebre, le guance, le labbra e lascia cadere la lingua all'interno della bocca, rilasciando completamente la mandibola... Senti il collo e la gola che si rilassano, lasciando che le spalle scivolino pesanti verso la terra... Porta l'attenzione alla spalla sinistra, scendi lungo il braccio, il gomito, il polso, il palmo della mano sinistra e ad ogni singolo dito, rilassandoli uno ad uno... Ora sposta l'attenzione alla spalla destra, scendi lungo il braccio, il gomito, il polso, il palmo della mano destra e ad ogni dito... Senti il petto aprirsi, e l'addome muoversi morbido, cullato dal tuo respiro naturale... Scendi al bacino, rilassa le anche e le natiche appoggiate a terra... Rilassa la coscia sinistra, il ginocchio, il polpaccio, la caviglia, la pianta del piede sinistro e tutte le dita... Ora rilassa la coscia destra, il ginocchio, il polpaccio, la caviglia, il piede destro e tutte le dita... Tutto il tuo corpo, dalla testa ai piedi, è ora rilassato e pervaso da una luce calda, calma e silenziosa. Sei tutt'uno con questa pace interiore... Rimani in questo stato di silenzio per qualche istante... | Molto delicatamente, riporta la consapevolezza al tuo respiro. Senti la vita che scorre in te. Fai un respiro profondo, muovi le dita e, quando ti senti pronto, riapri dolcemente gli occhi portando questa pace nella tua giornata. Namastè."
  },
  {
    id: "meditazione_respiro",
    title: "Meditazione del Respiro",
    asanaName: "Consapevolezza del Respiro (Mindfulness)",
    category: "meditazione",
    categoryLabel: "Meditazione Guidata",
    side: "entrambi",
    isHarvardCore: true,
    description: {
      entrata: "Siediti in una posizione comoda con la schiena eretta ma non rigida, su un cuscino o una sedia. Appoggia le mani sulle cosce e chiudi dolcemente gli occhi.",
      mantenimento: "Mantenimento guidato: Una meditazione di consapevolezza ancorata al respiro naturale: osserva l'aria che entra ed esce senza modificarla e, ogni volta che la mente si distrae, riportala gentilmente al respiro, senza giudizio.",
      uscita: "Riporta l'attenzione ai suoni intorno a te e al contatto del corpo con il suolo. Fai un respiro profondo e riapri gli occhi con calma."
    },
    speechScript: "Siediti in una posizione comoda con la schiena eretta ma non rigida, su un cuscino o anche su una sedia. Appoggia le mani sulle cosce e chiudi dolcemente gli occhi. Praticheremo una meditazione di consapevolezza del respiro. Non devi cambiare nulla: semplicemente osserva il tuo respiro naturale, così com'è. Porta l'attenzione alle narici... senti l'aria fresca che entra... e l'aria tiepida che esce... Osserva l'addome che si solleva a ogni inspirazione... e si abbassa a ogni espirazione... Non guidare il respiro, lascialo libero, e limitati a osservarlo con curiosità... Se arriva un pensiero, va bene: è normale, è ciò che fanno le menti. Notalo con gentilezza, senza giudicarti, e riporta semplicemente l'attenzione al respiro... Il respiro è la tua ancora: ogni volta che ti accorgi di esserti allontanato, quello è un momento di consapevolezza, e puoi tornare a casa... Rimani così, presente, un respiro dopo l'altro... l'aria che entra... l'aria che esce... nient'altro da fare, nessun posto dove andare... Continua a osservare in silenzio per qualche istante... | Ora, dolcemente, allarga l'attenzione ai suoni intorno a te e al contatto del corpo con il suolo. Fai un respiro profondo e, quando ti senti pronto, riapri lentamente gli occhi, portando questa presenza con te."
  },
  {
    id: "meditazione_gentilezza",
    title: "Meditazione della Gentilezza",
    asanaName: "Metta (Gentilezza Amorevole)",
    category: "meditazione",
    categoryLabel: "Meditazione Guidata",
    side: "entrambi",
    isHarvardCore: true,
    description: {
      entrata: "Siediti in una posizione comoda con la schiena eretta, su un cuscino o una sedia. Appoggia una mano sul cuore se ti è gradito, e chiudi dolcemente gli occhi.",
      mantenimento: "Mantenimento guidato: Una meditazione di gentilezza amorevole: ripeterai mentalmente auguri di benessere prima verso te stesso, poi verso una persona cara, e infine verso tutti gli esseri, lasciando che ogni frase risuoni nel cuore.",
      uscita: "Lascia andare le frasi e rimani qualche istante nella sensazione di calore. Fai un respiro profondo e riapri gli occhi con calma."
    },
    speechScript: "Siediti in una posizione comoda con la schiena eretta, su un cuscino o su una sedia. Se ti è gradito, appoggia una mano sul cuore, e chiudi dolcemente gli occhi. Praticheremo la meditazione della gentilezza amorevole. Porta l'attenzione al centro del petto e fai qualche respiro naturale... Ora rivolgi questi auguri a te stesso, ripetendoli mentalmente con me, lasciando che ogni frase risuoni senza fretta... Che io possa essere sereno... Che io possa essere in salute... Che io possa vivere con leggerezza e gentilezza verso me stesso... Osserva le sensazioni che nascono nel petto, qualunque esse siano... Ora porta alla mente una persona a cui vuoi bene. Immagina il suo volto, e rivolgile gli stessi auguri... Che tu possa essere sereno... Che tu possa essere in salute... Che tu possa vivere con leggerezza... Senti il calore che accompagna questi pensieri... Infine, lascia che questa gentilezza si espanda oltre, verso tutte le persone della tua vita e verso tutti gli esseri... Che tutti possano essere sereni... Che tutti possano essere in salute... Che tutti possano vivere in pace... Rimani qualche istante in questo spazio di calore e apertura... | Lascia andare dolcemente le frasi e rimani nella sensazione che hanno lasciato. Fai un respiro profondo e, quando ti senti pronto, riapri lentamente gli occhi, portando questa gentilezza con te nella tua giornata."
  }
];

export function getSequenceForDuration(durationMin: number, allSteps: YogaStep[]): YogaStep[] {
  // Resolve ids preserving THEIR order (not catalog order), so each list
  // controls the actual flow of the session and entry cues can match the
  // position the previous pose ends in.
  const byIds = (ids: string[]) =>
    ids
      .map(id => allSteps.find(s => s.id === id))
      .filter((s): s is YogaStep => s !== undefined);

  if (durationMin <= 10) {
    const ids = [
      "integrazione_sukhasana",
      "riscaldamento_gatto_mucca",
      "piedi_tadasana",
      "piegamento_cobra",
      "rilassamento_savasana",
      "meditazione_guida"
    ];
    return byIds(ids);
  }
  if (durationMin <= 15) {
    // Essentials only (~10 poses): centering, spine warm-up, one gentle
    // dynamic flow, standing strength, one backbend + counterpose, then a
    // short breath meditation instead of the long body scan.
    const ids = [
      "integrazione_sukhasana",
      "riscaldamento_gatto_mucca",
      "piedi_tadasana",
      "piedi_saluto_sole",
      "piedi_guerriero2_sinistro",
      "piedi_guerriero2_destro",
      "piegamento_cobra",
      "defaticamento_apanasana",
      "rilassamento_savasana",
      "meditazione_respiro"
    ];
    return byIds(ids);
  }
  if (durationMin <= 20) {
    const ids = [
      "integrazione_sukhasana",
      "riscaldamento_gatto_mucca",
      "piedi_tadasana",
      "piedi_guerriero2_sinistro",
      "piedi_guerriero2_destro",
      "equilibrio_albero_sinistro",
      "equilibrio_albero_destro",
      "piegamento_cobra",
      "defaticamento_apanasana",
      "rilassamento_savasana",
      "respirazione_sama_vritti",
      "meditazione_guida"
    ];
    return byIds(ids);
  }
  if (durationMin <= 30) {
    // Balanced full arc (~17 poses): seated + standing warm-up, dynamic
    // flow, standing strength, balance (tree, Harvard's fall-prevention
    // staple), backbend with its forward-fold counterpose, hips, cool-down,
    // then the full closing block. Triangle pair is reserved for 45 min.
    const ids = [
      "integrazione_sukhasana",
      "riscaldamento_collo_spalle",
      "riscaldamento_gatto_mucca",
      "riscaldamento_mezzaluna",
      "piedi_tadasana",
      "piedi_saluto_sole",
      "piedi_guerriero2_sinistro",
      "piedi_guerriero2_destro",
      "equilibrio_albero_sinistro",
      "equilibrio_albero_destro",
      "piegamento_cobra",
      "piegamento_avanti_seduto",
      "apertura_farfalla",
      "defaticamento_apanasana",
      "rilassamento_savasana",
      "respirazione_sama_vritti",
      "meditazione_guida"
    ];
    return byIds(ids);
  }
  if (durationMin <= 45) {
    // Complete curated practice (~27 poses, ~90s each): full warm-up chain
    // with a natural floor-to-standing transition (down dog -> mezzaluna,
    // whose entry cue is "alzati in piedi"), standing/balance block, all
    // three backbends with
    // forward-fold counterpose, seated twists, restorative inversion, and
    // the long closing block. Deliberately excluded (Builder-only): Warrior
    // III (too demanding for a guided beginner class), supine twists
    // (covered by the seated pair), sufi rolls and the standing shoulder
    // opener (overlap with other warm-ups), Metta meditation.
    const ids = [
      "integrazione_sukhasana",
      "riscaldamento_collo_spalle",
      "riscaldamento_gatto_mucca",
      "riscaldamento_balasana",
      "riscaldamento_cane",
      "riscaldamento_mezzaluna",
      "riscaldamento_bambola",
      "piedi_tadasana",
      "piedi_saluto_sole",
      "piedi_guerriero2_sinistro",
      "piedi_guerriero2_destro",
      "piedi_triangolo_sinistro",
      "piedi_triangolo_destro",
      "equilibrio_albero_sinistro",
      "equilibrio_albero_destro",
      "piegamento_cobra",
      "piegamento_locusta",
      "piegamento_ponte",
      "piegamento_avanti_seduto",
      "apertura_farfalla",
      "torsione_matsyendra_sinistro",
      "torsione_matsyendra_destro",
      "defaticamento_apanasana",
      "defaticamento_gambe_al_muro",
      "rilassamento_savasana",
      "respirazione_sama_vritti",
      "meditazione_guida"
    ];
    return byIds(ids);
  }
  return allSteps;
}
