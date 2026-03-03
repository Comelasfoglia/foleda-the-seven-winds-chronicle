

# Foleda — Hub Digitale per il GdR della Piana dei Sette Venti

## Panoramica
Un'app single-page immersiva che funge da portale digitale per Foleda, un gioco di ruolo da tavolo. L'estetica è quella di un tavolo da gioco di notte: legno scuro, luce calda, carte appoggiate, pagine che si sfogliano. Tutto in italiano, tutto front-end statico con dati da file JSON.

---

## Schermata 1 — La Soglia
- Logo Foleda al centro su sfondo indaco con texture legno e vignetting
- Frase evocativa in corsivo sotto il logo
- Hover sul logo: glow dorato + scale animata
- Click → fade-out verso le Tre Porte
- Footer "Comelasfoglia Studios"

## Schermata 2 — Le Tre Porte
- Tre card orizzontali (verticali su mobile) con aspetto da carte sul tavolo
- Ogni card ha glifo decorativo, titolo serif, sotto-titolo corsivo
- Hover: sollevamento, bordo oro più luminoso, glow
- Click → navigazione alla sezione corrispondente
- Barra di navigazione minimale (desktop: top bar, mobile: tab bar in basso)

## Sezione Esplora la Piana — Mappa Interattiva
- Immagine PNG della mappa come sfondo + overlay SVG con 9 zone cliccabili (8 regioni + centro)
- Hover: fill colorato della regione, le altre si scuriscono, tooltip con nome
- Click su regione → Modal Livello 1 con descrizione, griglia 3×2 dei sotto-luoghi, avventure, citazione spirito
- Click su sotto-luogo → Modal Livello 2 con dettaglio e navigazione prev/next tra i 6 luoghi
- La Città: 4 quartieri al posto della griglia standard
- Pulsante "Tira i Dadi" fisso: animazione dadi, d8 seleziona regione, d6 seleziona sotto-luogo, apertura diretta del modal

## Sezione Gioca un'Avventura
- Card verticali per ogni avventura con bordo sinistro colorato per regione
- Titolo, tipo, personaggio, frase evocativa, pulsante "Gioca →" (nuova tab)
- Link incrociati verso assessment e mappa

## Sezione Scopri Chi Sei — Assessment
- Intro evocativa con pulsante "Comincia"
- 16 domande una per schermata con progress bar oro
- 4 opzioni come card cliccabili, scelta immediata, transizione slide-left
- Pulsante "← Indietro" per tornare
- Sistema di scoring cumulativo su 8 personaggi
- Schermata risultato con pausa drammatica, nome in ciano, frase del personaggio
- Gestione parità (differenza < 3 punti)
- Link a avventura, regione, rifai test, condividi

## Design e Stile
- Palette: indaco profondo, crema/avorio, oro antico, ciano con parsimonia
- Texture legno pittorico a bassa opacità + vignetting radiale
- Font: Cormorant Garamond per titoli, EB Garamond per corpo, Lato per label
- Animazioni sottili e misurate (250-400ms)
- Responsive: desktop, tablet, mobile con modal full-screen e tab bar

## Dati JSON
- `regions.json` — regioni, descrizioni, colori, spiriti, sotto-luoghi
- `adventures.json` — avventure con dettagli
- `characters.json` — personaggi con frasi risultato
- `assessment.json` — 16 domande con scenari, opzioni e pesi

## Asset
- Placeholder per logo e mappa in `public/assets/`, facilmente sostituibili

