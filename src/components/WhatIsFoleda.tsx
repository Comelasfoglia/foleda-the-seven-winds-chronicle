import { useState } from "react";
import { HelpCircle, X } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

const WhatIsFoleda = () => {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      {/* Desktop */}
      <button
        onClick={() => { setOpen(true); setExpanded(false); }}
        className="hidden md:flex items-center gap-1.5 font-label text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded"
      >
        <HelpCircle size={15} />
        Cos'è Folëda?
      </button>
      {/* Mobile */}
      <button
        onClick={() => { setOpen(true); setExpanded(false); }}
        className="md:hidden text-muted-foreground hover:text-foreground transition-colors p-2"
        aria-label="Cos'è Folëda?"
      >
        <HelpCircle size={18} />
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg bg-background border-border max-h-[85vh] overflow-y-auto">
          <DialogTitle className="font-display text-xl text-primary text-center">
            Cos'è Folëda?
          </DialogTitle>

          <div className="space-y-4 text-sm text-foreground/90 leading-relaxed font-body">
            <p>
              Sette venti, sette spiriti, una Torre senza porte e un Re che nessuno ha mai visto.
              La Piana dei Sette Venti è il mondo di Folëda, un gioco di ruolo da tavolo dove il
              folklore incontra la fantasia e ogni regione ha le proprie regole, i propri segreti e
              il proprio modo di non rispondere alle domande. Si gioca con i dadi, le storie e le
              persone sedute al tavolo. Il resto lo decide il vento.
            </p>

            {!expanded && (
              <button
                onClick={() => setExpanded(true)}
                className="text-primary hover:text-primary/80 font-label text-sm transition-colors"
              >
                Scopri di più →
              </button>
            )}

            <div
              className="overflow-hidden transition-all duration-500 ease-out"
              style={{ maxHeight: expanded ? '500px' : '0px', opacity: expanded ? 1 : 0 }}
            >
              <div className="space-y-4 pt-1">
                <p>
                  Attorno alla Torre, una Città con quattro quartieri e quattro porte. Attorno alla
                  Città, otto regioni — picchi di ghiaccio dove il tempo si ferma, foreste dove il
                  vento fa dispetti, paludi dove i fulmini sono una benedizione, un deserto abitato
                  da robot che scrivono poesie incomprensibili e ci credono davvero. A Sud, qualcosa
                  che tutti chiamano il Vuoto e di cui nessuno parla volentieri.
                </p>
                <p>
                  Folëda è un mondo da esplorare con i dadi, le storie e le persone sedute al tuo
                  tavolo. Ogni avventura è diversa. Ogni regione ha le sue regole. Il vento cambia
                  direzione, e con lui cambia tutto il resto.
                </p>
              </div>
            </div>

            <div className="border-t border-border/40 pt-3 mt-4">
              <p className="text-xs text-muted-foreground">
                Folëda è un gioco Comelasfoglia, scritto da Simone Terenziani e illustrato da Davide Gerardi.
              </p>
              <a
                href="mailto:info@comelasfoglia.com"
                className="text-xs text-primary hover:text-primary/80 transition-colors mt-1 inline-block"
              >
                Vuoi saperne di più?
              </a>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default WhatIsFoleda;
