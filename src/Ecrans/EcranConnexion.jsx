import { useState } from "react";
import { useAppContexte } from "../Contexte/AppContexte";

const MessageErreur = ({ message }) => {
  if (!message) return null;
  return (
    <div className="message-erreur">
      <i className="ph ph-warning-circle" />
      <span>{message}</span>
    </div>
  );
};

const EcranConnexion = ({ onConnexion, onInscription, onMotDePasseOublie }) => {
  const { t, theme, basculerTheme, langue, basculerLangue } = useAppContexte();

  const [modeInscription, setModeInscription] = useState(false);
  const [erreur, setErreur]                   = useState("");
  const [errors, setErrors]                   = useState({});
  const [chargement, setChargement]           = useState(false);
  const [pseudo, setPseudo]                   = useState("");
  const [identite, setIdentite]               = useState("");
  const [motDePasse, setMotDePasse]           = useState("");
  const [voirMotDePasse, setVoirMotDePasse]   = useState(false);

  const basculerMode = () => {
    setModeInscription((m) => !m);
    setErrors({});
    setIdentite("");
    setPseudo("");
    setMotDePasse("");
  };

  const validerFormulaire = () => {
    const nouveauxErrors = {};
    if (modeInscription) {
      if (!pseudo.trim()) nouveauxErrors.pseudo = true;
      if (!identite.trim() || !identite.includes("@")) nouveauxErrors.identite = true;
      
      // Règles serveur : 8 car. min, Majuscule, Chiffre, Caractère spécial
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!passwordRegex.test(motDePasse)) nouveauxErrors.motDePasse = true;
    } else {
      if (!identite.trim()) nouveauxErrors.identite = true;
      if (!motDePasse.trim()) nouveauxErrors.motDePasse = true;
    }

    setErrors(nouveauxErrors);
    return Object.keys(nouveauxErrors).length === 0;
  };

  // Messages d'erreur user-friendly
  const traduireErreur = (err) => {
    const status = err.response?.status;
    const msg    = err.response?.data?.message;

    if (status === 401) return "Nom d'utilisateur ou mot de passe incorrect.";
    if (status === 400) {
      if (Array.isArray(msg)) {
        if (msg.some(m => m.includes("password"))) return "Le mot de passe doit contenir 8 caractères min, une majuscule, un chiffre et un caractère spécial.";
        if (msg.some(m => m.includes("email")))    return "Adresse email invalide.";
        if (msg.some(m => m.includes("username"))) return "Nom d'utilisateur invalide.";
      }
      return "Informations incorrectes, vérifie tes données.";
    }
    if (status === 409) return "Ce compte existe déjà.";
    if (status === 429) return "Trop de tentatives. Réessaie dans quelques minutes.";
    return "Une erreur est survenue. Réessaie.";
  };

  const gererSoumission = async () => {
    if (!validerFormulaire()) {
      setErreur("Veuillez remplir correctement tous les champs.");
      return;
    }

    setErreur("");
    setChargement(true);
    try {
      if (modeInscription) {
        await onInscription({ pseudo, identite, motDePasse });
      } else {
        await onConnexion({ identite, motDePasse });
      }
    } catch (err) {
      setErreur(traduireErreur(err));
    } finally {
      setChargement(false);
    }
  };

  const gererTouche = (e) => { if (e.key === "Enter") gererSoumission(); };

  return (
    <div className="ecran-connexion">
      <div className="carte-connexion">

        <div className="logo-connexion">
          <i className="ph ph-asterisk-simple" />
        </div>

        <h1 className="titre-app">{t("nom_app")}</h1>
        <p className="sous-titre">Viso Studio Community</p>

        <h2 className="titre-formulaire">
          {modeInscription ? t("titre_inscription") : t("titre_connexion")}
        </h2>

        <div className="formulaire-connexion">
          <MessageErreur message={erreur} />

          {modeInscription && (
            <input
              type="text"
              placeholder="Pseudo"
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

          <input
            type={modeInscription ? "email" : "text"}
            placeholder={modeInscription ? "Email" : "Nom d'utilisateur"}
            value={identite}
            onChange={(e) => {
               setIdentite(e.target.value);
               if (errors.identite) setErrors(prev => ({ ...prev, identite: false }));
            }}
            onKeyDown={gererTouche}
            autoComplete={modeInscription ? "email" : "username"}
            className={errors.identite ? "input-erreur" : ""}
          />

          {/* Champ mot de passe avec bouton voir/cacher */}
          <div style={{ position: "relative", marginBottom: "15px" }}>
            <input
              type={voirMotDePasse ? "text" : "password"}
              placeholder="Mot de passe"
              value={motDePasse}
              onChange={(e) => {
                 setMotDePasse(e.target.value);
                 if (errors.motDePasse) setErrors(prev => ({ ...prev, motDePasse: false }));
              }}
              onKeyDown={gererTouche}
              autoComplete={modeInscription ? "new-password" : "current-password"}
              style={{ marginBottom: 0, paddingRight: "50px" }}
              className={errors.motDePasse ? "input-erreur" : ""}
            />
            <button
              type="button"
              onClick={() => setVoirMotDePasse((v) => !v)}
              style={{
                position: "absolute",
                right: "14px",
                top: "50%",
                transform: "translateY(-50%)",
                width: "auto",
                padding: "4px",
                background: "transparent",
                border: "none",
                color: "var(--texte)",
                opacity: 0.5,
                fontSize: "1.1rem",
                cursor: "pointer",
              }}
            >
              <i className={`ph ${voirMotDePasse ? "ph-eye-slash" : "ph-eye"}`} />
            </button>
          </div>

          {modeInscription && (
            <p style={{ fontSize: "0.75rem", opacity: 0.5, marginTop: "-8px", marginBottom: "12px", textAlign: "left" }}>
              8 car. min · Majuscule · Chiffre · Caractère spécial
            </p>
          )}

          <button
            type="button"
            disabled={chargement}
            onClick={gererSoumission}
          >
            {chargement
              ? <i className="ph ph-circle-notch icone-spin-petit" />
              : modeInscription ? t("btn_inscription") : t("btn_connexion")
            }
          </button>
        </div>

        <p className="lien-bascule" onClick={basculerMode}>
          {modeInscription ? t("deja_un_compte") : t("pas_de_compte")}
        </p>

        <div className="controles-bas">
          <button type="button" onClick={basculerTheme} className="btn-icone">
            <i className={`ph ${theme === "dark" ? "ph-sun" : "ph-moon"}`} />
          </button>
          <button type="button" onClick={basculerLangue} className="btn-icone">
            <i className="ph ph-globe" />
            <span className="indicateur-langue">{langue.toUpperCase()}</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default EcranConnexion;