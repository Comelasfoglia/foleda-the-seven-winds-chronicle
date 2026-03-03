import logoComelasfoglia from "@/assets/logo-comelasfoglia.png";

const ComelasfogliaFooter = () => (
  <footer className="mt-16 mb-8 flex flex-col items-center gap-2">
    <a href="https://www.comelasfoglia.com" target="_blank" rel="noopener noreferrer">
      <img src={logoComelasfoglia} alt="Comelasfoglia Studios" className="w-10 h-10 opacity-50 hover:opacity-80 transition-opacity" />
    </a>
    <span className="font-label text-sm text-muted-foreground/50 tracking-wider">
      © 2026{" "}
      <a href="https://www.comelasfoglia.com" target="_blank" rel="noopener noreferrer" className="hover:text-muted-foreground/80 transition-colors">
        Comelasfoglia Studios
      </a>
    </span>
  </footer>
);

export default ComelasfogliaFooter;
