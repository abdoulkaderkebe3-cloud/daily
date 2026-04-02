import { useState, useEffect } from "react";
import { useAppContexte } from "../Contexte/AppContexte";

// ─── Parametres ───────────────────────────────────────────────────────────────
// Contient : installation PWA, notifications, thème, langue, déconnexion.
//
// Props :
//   onDeconnexion → async () : callback backend pour déconnecter l'utilisateur

const Parametres = ({ onDeconnexion }) => {
  const {
    t,
    theme, basculerTheme,
    langue, basculerLangue,
    afficherNotification,
  } = useAppContexte();

  // PWA Install
  const [promptInstall, setPromptInstall] = useState(null);
  const [estIos, setEstIos] = useState(false);

  useEffect(() => {
    // Détection iOS
    const ios = /iphone|ipad|ipod/.test(navigator.userAgent.toLowerCase());
    const standalone = window.navigator.standalone;
    setEstIos(ios && !standalone);

    // Capture de l'événement d'installation Android/Chrome
    const gererPrompt = (e) => {
      e.preventDefault();
      setPromptInstall(e);
    };
    window.addEventListener("beforeinstallprompt", gererPrompt);
    return () => window.removeEventListener("beforeinstallprompt", gererPrompt);
  }, []);

  const installerPWA = async () => {
    if (!promptInstall) return;
    promptInstall.prompt();
    const { outcome } = await promptInstall.userChoice;
    if (outcome === "accepted") setPromptInstall(null);
  };

  //Notifications
  const activerNotifications = async () => {
    if (!("Notification" in window)) {
      afficherNotification(t("msg_notifs_non_supportees"), "erreur");
      return;
    }
    try {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        afficherNotification(t("msg_notifs_activees"), "succes");
      } else {
        afficherNotification(t("msg_notifs_bloquees"), "erreur");
      }
    } catch {
      afficherNotification("Erreur", "erreur");
    }
  };

  // Déconnexion
  const gererDeconnexion = async () => {
    try {
      await onDeconnexion();
    } catch {
      afficherNotification("Erreur lors de la déconnexion", "erreur");
    }
  };

  return (
    <div className="carte">
      <h3 className="titre-carte">{t("titre_parametres")}</h3>

      {/* Installation PWA — Android */}
      {promptInstall && (
        <div className="ligne-pwa">
          <span>{t("invite_installation")}</span>
          <button className="btn-petit" onClick={installerPWA} type="button">
            {t("btn_installer")}
          </button>
        </div>
      )}

      {/* Guide installation iOS */}
      {estIos && (
        <div className="guide-ios">
          <strong>{t("titre_guide_ios")}</strong>
          <br />
          <span>{t("texte_guide_ios")}</span>
        </div>
      )}

      {/* Notifications */}
      <div className="ligne-parametre">
        <span style={{ fontSize: '0.9rem', lineHeight: '1.2' }}>Notifications /<br/>Rappels</span>
        <button
          className="btn-pill btn-neutre"
          onClick={activerNotifications}
          type="button"
        >
          <i className="ph ph-bell" />
          <span style={{ fontSize: '0.7rem' }}>ACTIVER</span>
        </button>
      </div>

      {/* Thème */}
      <div className="ligne-parametre">
        <span>{t("lbl_theme")}</span>
        <button
          className="btn-pill btn-neutre"
          onClick={basculerTheme}
          type="button"
          aria-label="Changer le thème"
        >
          <i className={`ph ${theme === "dark" ? "ph-moon" : "ph-sun"}`} />
        </button>
      </div>

      {/* Langue */}
      <div className="ligne-parametre">
        <span>{t("lbl_langue")}</span>
        <button
          className="btn-pill btn-neutre"
          onClick={basculerLangue}
          type="button"
          aria-label="Changer la langue"
        >
          <i className="ph ph-translate" />
          <span style={{ fontSize: '0.75rem', fontWeight: '700' }}>{langue.toUpperCase()}</span>
        </button>
      </div>

      {/* Déconnexion */}
      <div className="ligne-parametre" style={{ marginTop: '10px' }}>
        <span style={{ color: '#ef4444', fontSize: '0.9rem', lineHeight: '1.2' }}>Zone de<br/>danger</span>
        <button
          className="btn-pill btn-danger-rouge"
          onClick={gererDeconnexion}
          type="button"
        >
          <span style={{ fontSize: '0.7rem', fontWeight: '800' }}>SE DÉCONNECTER</span>
        </button>
      </div>

    </div>
  );
};

export default Parametres;
