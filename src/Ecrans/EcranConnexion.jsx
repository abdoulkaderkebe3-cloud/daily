import { useState, useEffect, useRef } from "react";
import { useAppContexte } from "../Contexte/AppContexte";

const LogoGoogle = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.64 9.20455C17.64 8.56636 17.5827 7.95273 17.4764 7.36364H9V10.845H13.8436C13.635 11.97 13.0009 12.9232 12.0477 13.5614V15.8195H14.9564C16.6582 14.2527 17.64 11.9455 17.64 9.20455Z" fill="#4285F4"/>
    <path d="M9 18C11.43 18 13.4673 17.1941 14.9564 15.8195L12.0477 13.5614C11.2418 14.1014 10.2109 14.4205 9 14.4205C6.65591 14.4205 4.67182 12.8373 3.96409 10.71H0.957275V13.0418C2.43818 15.9832 5.48182 18 9 18Z" fill="#34A853"/>
    <path d="M3.96409 10.71C3.78409 10.17 3.68182 9.59318 3.68182 9C3.68182 8.40682 3.78409 7.83 3.96409 7.29V4.95818H0.957275C0.347727 6.17318 0 7.54773 0 9C0 10.4523 0.347727 11.8268 0.957275 13.0418L3.96409 10.71Z" fill="#FBBC05"/>
    <path d="M9 3.57955C10.3214 3.57955 11.5077 4.03364 12.4405 4.92545L15.0218 2.34409C13.4632 0.891818 11.4259 0 9 0C5.48182 0 2.43818 2.01682 0.957275 4.95818L3.96409 7.29C4.67182 5.16273 6.65591 3.57955 9 3.57955Z" fill="#EA4335"/>
  </svg>
);

const MessageErreur = ({ message, succes }) => {
  if (!message) return null;
  return (
    <div className={`message-erreur ${succes ? "succes" : "erreur-secousse"}`}>
      <i className={`ph ${succes ? "ph-check-circle" : "ph-warning-circle"}`} />
      <span>{message}</span>
    </div>
  );
};

const EcranConnexion = ({ onConnexion, onInscriptionInitiate, onInscriptionVerify, onMotDePasseOublieInitiate, onMotDePasseOublieVerify }) => {
  const { t, theme, basculerTheme, langue, basculerLangue } = useAppContexte();
  const codeRef = useRef(null);

  // Modes possibles: "login", "register_init", "register_verify", "forgot_init", "forgot_verify"
  const [mode, setMode] = useState("login");
  
  const [erreur, setErreur]                   = useState("");
  const [messageSucces, setMessageSucces]     = useState("");
  const [errors, setErrors]                   = useState({});
  const [chargement, setChargement]           = useState(false);
  
  const [pseudo, setPseudo]                   = useState("");
  const [identite, setIdentite]               = useState(""); // Sert d'email ou username
  const [motDePasse, setMotDePasse]           = useState("");
  const [code, setCode]                       = useState("");
  const [voirMotDePasse, setVoirMotDePasse]   = useState(false);

  // Auto-focus sur le champ code quand on change d'étape
  useEffect(() => {
    if ((mode === "register_verify" || mode === "forgot_verify") && codeRef.current) {
      codeRef.current.focus();
    }
  }, [mode]);

  const reinitialiserChamps = (nouveauMode) => {
    setMode(nouveauMode);
    setErrors({});
    setErreur("");
    setMessageSucces("");
    if (nouveauMode === "login" || nouveauMode === "register_init" || nouveauMode === "forgot_init") {
      setMotDePasse("");
      setCode("");
    }
  };

  const validerFormulaire = () => {
    const nouveauxErrors = {};
    if (mode === "register_init") {
      if (!pseudo.trim()) nouveauxErrors.pseudo = true;
      if (!identite.trim() || !identite.includes("@")) nouveauxErrors.identite = true;
      if (!motDePasse || motDePasse.trim().length < 8) nouveauxErrors.motDePasse = true;
    } else if (mode === "register_verify") {
      if (!code.trim()) nouveauxErrors.code = true;
    } else if (mode === "forgot_init") {
      if (!identite.trim() || !identite.includes("@")) nouveauxErrors.identite = true;
    } else if (mode === "forgot_verify") {
      if (!code.trim()) nouveauxErrors.code = true;
      if (!motDePasse || motDePasse.trim().length < 8) nouveauxErrors.motDePasse = true;
    } else {
      if (!identite.trim()) nouveauxErrors.identite = true;
      if (!motDePasse.trim()) nouveauxErrors.motDePasse = true;
    }

    setErrors(nouveauxErrors);
    return Object.keys(nouveauxErrors).length === 0;
  };

  const traduireErreur = (err) => {
    const status = err.response?.status;
    const msg    = err.response?.data?.message;

    if (status === 401) return t("err_identifiants") || "Identifiants ou code incorrects.";
    if (status === 400) {
      if (Array.isArray(msg)) {
        if (msg.some(m => m.includes("password"))) return t("err_mdp_invalide") || "Mot de passe invalide.";
        if (msg.some(m => m.includes("email")))    return t("err_email_invalide") || "Email invalide.";
      }
      return t("err_donnees") || "Données incorrectes.";
    }
    if (status === 409) return t("err_compte_existe") || "Ce compte existe déjà.";
    if (status === 404) return t("err_non_trouve") || "Compte non trouvé.";
    return t("err_generique") || "Une erreur est survenue.";
  };

  const gererSoumission = async () => {
    if (!validerFormulaire()) {
      setErreur(t("err_remplir_champs") || "Veuillez remplir tous les champs.");
      // Trigger shake
      const div = document.querySelector(".message-erreur");
      if (div) {
        div.classList.remove("erreur-secousse");
        void div.offsetWidth; // trigger reflow
        div.classList.add("erreur-secousse");
      }
      return;
    }

    setErreur("");
    setMessageSucces("");
    setChargement(true);
    try {
      if (mode === "register_init") {
        await onInscriptionInitiate({ pseudo, identite, motDePasse });
        setMessageSucces(t("msg_otp_envoye"));
        setMode("register_verify"); // Utilisation directe sans cleanup identite
      } else if (mode === "register_verify") {
        await onInscriptionVerify({ email: identite, code });
      } else if (mode === "forgot_init") {
        await onMotDePasseOublieInitiate(identite);
        setMessageSucces(t("msg_reset_envoye"));
        setMode("forgot_verify");
      } else if (mode === "forgot_verify") {
        await onMotDePasseOublieVerify({ email: identite, code, newPassword: motDePasse });
        setMessageSucces(t("msg_mdp_change"));
        reinitialiserChamps("login");
      } else {
        await onConnexion({ identite, motDePasse });
      }
    } catch (err) {
      setErreur(traduireErreur(err));
    } finally {
      setChargement(false);
    }
  };

  const renvoyerCode = async () => {
    setChargement(true);
    setErreur("");
    try {
      if (mode === "register_verify") {
        await onInscriptionInitiate({ pseudo, identite, motDePasse });
      } else if (mode === "forgot_verify") {
        await onMotDePasseOublieInitiate(identite);
      }
      setMessageSucces(t("msg_otp_envoye") || "Code renvoyé !");
    } catch (err) {
      setErreur(traduireErreur(err));
    } finally {
      setChargement(false);
    }
  };

  const gererTouche = (e) => { if (e.key === "Enter") gererSoumission(); };

  const redirigerVersGoogle = () => {
    // Utilisation de l'URL absolue du backend Render pour éviter les problèmes de proxy en production
    window.location.href = "https://daily-muse-letb.onrender.com/auth/google";
  };

  let titre = t("titre_connexion");
  let btnTexte = t("btn_connexion");
  if (mode.startsWith("register")) {
    titre = t("titre_inscription");
    btnTexte = mode === "register_verify" ? t("btn_verifier_creer") : t("btn_inscription");
  } else if (mode.startsWith("forgot")) {
    titre = t("titre_oublie");
    btnTexte = mode === "forgot_verify" ? t("btn_reinitialiser") : t("btn_envoyer_code");
  }

  return (
    <div className="ecran-connexion">
      <div className="carte-connexion">

        <div className="logo-connexion">
          <i className="ph ph-asterisk-simple" />
        </div>

        <h1 className="titre-app">{t("nom_app")}</h1>
        <p className="sous-titre">Viso Studio Community</p>

        <h2 className="titre-formulaire">{titre}</h2>

        <div className="formulaire-connexion">
          <MessageErreur message={erreur} />
          <MessageErreur message={messageSucces} succes={true} />

          {/* Etape 1 Inscription */}
          {mode === "register_init" && (
            <input
              type="text"
              placeholder={t("ph_pseudo")}
              value={pseudo}
              onChange={(e) => {
                 setPseudo(e.target.value);
                 if (errors.pseudo) setErrors(prev => ({ ...prev, pseudo: false }));
              }}
              onKeyDown={gererTouche}
              autoComplete="username"
              className={errors.pseudo ? "input-erreur" : ""}
            />
          )}

          {/* Email / Username */}
          {(mode === "login" || mode === "register_init" || mode === "forgot_init") && (
            <input
              type={mode === "login" ? "text" : "email"}
              placeholder={mode === "login" ? t("ph_identite") : "Email"}
              value={identite}
              onChange={(e) => {
                 setIdentite(e.target.value);
                 if (errors.identite) setErrors(prev => ({ ...prev, identite: false }));
              }}
              onKeyDown={gererTouche}
              autoComplete={mode === "login" ? "username" : "email"}
              className={errors.identite ? "input-erreur" : ""}
            />
          )}

          {/* Code (OTP) */}
          {(mode === "register_verify" || mode === "forgot_verify") && (
            <input
              ref={codeRef}
              type="text"
              placeholder={t("ph_code_otp")}
              value={code}
              onChange={(e) => {
                 setCode(e.target.value);
                 if (errors.code) setErrors(prev => ({ ...prev, code: false }));
              }}
              onKeyDown={gererTouche}
              className={errors.code ? "input-erreur" : ""}
            />
          )}

          {/* Mot de passe */}
          {(mode === "login" || mode === "register_init" || mode === "forgot_verify") && (
            <div style={{ position: "relative", marginBottom: "15px" }}>
              <input
                type={voirMotDePasse ? "text" : "password"}
                placeholder={mode === "forgot_verify" ? t("ph_nouveau_mot_de_passe") : t("ph_mot_de_passe")}
                value={motDePasse}
                onChange={(e) => {
                   setMotDePasse(e.target.value);
                   if (errors.motDePasse) setErrors(prev => ({ ...prev, motDePasse: false }));
                }}
                onKeyDown={gererTouche}
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                style={{ marginBottom: 0, paddingRight: "50px" }}
                className={errors.motDePasse ? "input-erreur" : ""}
              />
              <button
                type="button"
                onClick={() => setVoirMotDePasse((v) => !v)}
                className="btn-voir-mdp"
                style={{
                  position: "absolute",right: "14px",top: "50%",transform: "translateY(-50%)",width: "auto",padding: "0",
                  background: "transparent",border: "none",color: "var(--texte)",opacity: 0.5,fontSize: "1.1rem"
                }}
              >
                <i className={`ph ${voirMotDePasse ? "ph-eye-slash" : "ph-eye"}`} />
              </button>
            </div>
          )}

          {(mode === "register_init" || mode === "forgot_verify") && (
            <p style={{ fontSize: "0.75rem", opacity: 0.5, marginTop: "-8px", marginBottom: "12px", textAlign: "left" }}>
              {t("h_huit_caracteres")}
            </p>
          )}

          <button
            type="button"
            disabled={chargement}
            onClick={gererSoumission}
          >
            {chargement ? <i className="ph ph-circle-notch icone-spin-petit" /> : btnTexte}
          </button>
          
          {mode === "login" && (
            <>
              <div className="separate-divider">
                <span>OU</span>
              </div>
              
              <button
                type="button"
                className="btn-google"
                onClick={redirigerVersGoogle}
              >
                <div className="google-icon-wrapper">
                  <LogoGoogle />
                </div>
                <span className="google-button-text">{t("btn_google")}</span>
              </button>
              
              <div style={{ textAlign: "center", width: "100%", marginTop: "15px" }}>
                <span className="lien-bascule" onClick={() => reinitialiserChamps("forgot_init")} style={{ display: "inline-block", textDecoration: "none" }}>
                  {t("mot_de_passe_oublie")}
                </span>
              </div>
            </>
          )}
        </div>

        <p className="lien-bascule" onClick={() => reinitialiserChamps(mode.startsWith("register") ? "login" : "register_init")} style={{ marginTop: mode === "login" ? "10px" : "20px" }}>
          {mode.startsWith("register") ? t("deja_un_compte") : t("pas_de_compte")}
        </p>

        {mode.startsWith("forgot") && (
          <p className="lien-bascule" onClick={() => reinitialiserChamps("login")}>
            {t("retour_connexion")}
          </p>
        )}

        {(mode === "register_verify" || mode === "forgot_verify") && (
           <div style={{ marginTop: "15px", display: "flex", flexDirection: "column", gap: "8px" }}>
              <span className="lien-bascule" onClick={() => setMode(mode === "register_verify" ? "register_init" : "forgot_init")}>
                 <i className="ph ph-arrow-left" style={{ marginRight: "5px" }} />
                 Modifier les informations
              </span>
              <span className="lien-bascule" onClick={renvoyerCode} style={{ color: "var(--accent)", fontWeight: "600", opacity: 1 }}>
                 Renvoyer le code
              </span>
           </div>
        )}

        <div className="controles-bas">
          <button type="button" onClick={basculerTheme} className="btn-icone">
            <i className={`ph ${theme === "dark" ? "ph-sun" : "ph-moon"}`} />
          </button>
          <button type="button" onClick={basculerLangue} className="btn-icone">
            <i className="ph ph-globe" />
            <span className="indicateur-langue">{langue?.toUpperCase() || "FR"}</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default EcranConnexion;