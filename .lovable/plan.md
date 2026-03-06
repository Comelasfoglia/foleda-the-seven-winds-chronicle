

# Piano: Effetto vento progressivo durante il test

## Idea

Durante la fase "questions" dell'assessment, le particelle di sfondo (MagicParticles) aumentano progressivamente in velocità, quantità e intensità — simulando un vento che soffia sempre più forte man mano che si avanza nelle 16 domande. Nella fase "reveal" il vento raggiunge il picco. Quando appare il risultato, tutto torna alla calma.

## Come funziona

**MagicParticles** riceve una prop opzionale `intensity` (0-1, default 0):
- `intensity = 0`: comportamento attuale (particelle lente, 60 count)
- `intensity = 1`: vento forte — particelle più numerose (~120), più veloci (speedX ×4-5, bias verso destra), più grandi, più luminose, con scie allungate
- Valori intermedi interpolano linearmente

**AssessmentSection** calcola l'intensità come `currentQ / totalQuestions` durante le domande, 1.0 durante "reveal", e 0 per "intro" e "result".

**Index.tsx** passa l'intensità da AssessmentSection a MagicParticles tramite stato condiviso (lifted state).

## Modifiche ai file

### 1. `src/pages/Index.tsx`
- Aggiungere stato `windIntensity` (number, 0-1)
- Passare `windIntensity` a `<MagicParticles intensity={windIntensity} />`
- Passare `onWindChange` callback a `<AssessmentSection>`

### 2. `src/components/MagicParticles.tsx`
- Accettare prop `intensity?: number` (default 0)
- Usare un `useRef` per tracciare l'intensity corrente (aggiornato via `useEffect`)
- Nel loop `draw()`, modulare in base all'intensity:
  - **Velocità**: `speedX` base + `intensity * 1.5` (bias verso destra = vento)
  - **Conteggio**: creare/rimuovere particelle per interpolare tra 60 e 120
  - **Opacità max**: da 0.6 a 0.85
  - **Size**: da base a base × 1.5
  - **Turbolenza**: aggiungere piccola oscillazione random proporzionale all'intensity
- Transizione smooth: i parametri cambiano gradualmente frame-by-frame

### 3. `src/components/AssessmentSection.tsx`
- Accettare prop `onWindChange?: (intensity: number) => void`
- Chiamare `onWindChange` quando cambia la fase o la domanda corrente:
  - `intro`: 0
  - `questions`: `(currentQ + 1) / totalQuestions` (da ~0.06 a 1.0)
  - `reveal`: 1.0
  - `result`: 0 (con un piccolo delay per transizione smooth)

## Effetto visivo risultante

- **Intro**: particelle calme, come nel resto dell'app
- **Domanda 1-4**: leggero movimento laterale, quasi impercettibile
- **Domanda 8-12**: particelle visibilmente più veloci, più numerose
- **Domanda 15-16**: vento forte, particelle che attraversano lo schermo rapidamente
- **"La Piana ha deciso"**: picco massimo, effetto drammatico
- **Risultato**: le particelle rallentano e tornano alla calma in ~1 secondo

