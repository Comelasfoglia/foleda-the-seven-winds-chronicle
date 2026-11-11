// Indirizzo pubblico di Foleda su comelasfoglia.com.
export const URL_FOLEDA = "https://www.comelasfoglia.com/foleda/";

/** Percorso di un file della cartella public, valido sia su Lovable sia su comelasfoglia.com. */
export const pubblico = (file: string) => `${import.meta.env.BASE_URL}${file.replace(/^\//, "")}`;

/** Indirizzo della pagina iniziale dell'app, ovunque sia pubblicata. */
export const indirizzoApp = () => `${window.location.origin}${import.meta.env.BASE_URL}`;
