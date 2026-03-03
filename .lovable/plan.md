

# Cambio Font — Almendra (titoli) + Literata (corpo)

## Cosa cambia

1. **Google Fonts** in `index.html`: sostituire Cormorant Garamond con **Almendra** (400, 700, italic) e EB Garamond con **Literata** (400, 500, 600, italic)
2. **Tailwind config** (`tailwind.config.ts`): aggiornare `fontFamily.display` → Almendra, `fontFamily.body` → Literata
3. **CSS** (`src/index.css`): aggiornare i riferimenti nei selettori `body`, `h1-h6`, `.font-display`, `.font-body`

Lato mantiene il suo ruolo per label/navigazione.

