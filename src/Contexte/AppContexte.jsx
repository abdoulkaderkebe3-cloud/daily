import { createContext, useContext, useState, useEffect, useCallback } from "react";
import traductions from "../Traductions/traductions";

// Identité unique du contexte déclarée ici pour éviter les problèmes de modules
const AppContexte = createContext(null);

export const useAppContexte = () => {
  const contexte = useContext(AppContexte);
  if (!contexte) {
    throw new Error("useAppContexte doit être utilisé dans AppFournisseur");
  }
  return contexte;
};

export const AppFournisseur = ({ children }) => {

  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "dark");

  const basculerTheme = useCallback(() => {
    setTheme((t) => {
      const nouveau = t === "dark" ? "light" : "dark";
      localStorage.setItem("theme", nouveau);
      return nouveau;
    });
  }, []);

  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
  }, [theme]);

  const [langue, setLangue] = useState(() => localStorage.getItem("langue") || "fr");

  const basculerLangue = useCallback(() => {
    setLangue((l) => {
      const nouvelle = l === "fr" ? "en" : "fr";
      localStorage.setItem("langue", nouvelle);
      return nouvelle;
    });
  }, []);

  const t = useCallback(
    (cle) => traductions[langue]?.[cle] ?? cle,
    [langue]
  );

  const [donneesUtilisateur, setDonneesUtilisateur] = useState(null);

  useEffect(() => {
    const utilisateurSauvegarde = localStorage.getItem("utilisateur");
    if (utilisateurSauvegarde) {
      try {
        setDonneesUtilisateur(JSON.parse(utilisateurSauvegarde));
      } catch {
        setDonneesUtilisateur(false);
      }
    } else {
      setDonneesUtilisateur(false);
    }
  }, []);

  const [notification, setNotification] = useState({
    visible: false, message: "", type: "succes",
  });

  const afficherNotification = useCallback((message, type = "succes") => {
    setNotification({ visible: true, message, type });
    setTimeout(() => setNotification((n) => ({ ...n, visible: false })), 3000);
  }, []);

  const [vueActive, setVueActive] = useState("accueil");

  const changerVue = useCallback((vue) => {
    if (navigator.vibrate) navigator.vibrate(10);
    setVueActive(vue);
  }, []);

  const [imageZoomee, setImageZoomee] = useState(null);

  const valeur = {
    theme, basculerTheme,
    langue, basculerLangue, t,
    donneesUtilisateur, setDonneesUtilisateur,
    notification, afficherNotification,
    vueActive, changerVue,
    imageZoomee, setImageZoomee,
  };

  return (
    <AppContexte.Provider value={valeur}>
      {children}
    </AppContexte.Provider>
  );
};

export { AppContexte };