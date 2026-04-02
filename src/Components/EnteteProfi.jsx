import { useRef, useState } from "react";
import { useAppContexte } from "../Contexte/AppContexte";
import api, { mettreAJourUtilisateur } from "../services/api";
import logo1 from "../../public/svg-1er.svg";
import logo2 from "../../public/svg-2eme.svg";
import logo3 from "../../public/svg-3eme.svg";

const EnteteProfi = ({ modeEdition, setModeEdition }) => {
  const { t, donneesUtilisateur, setDonneesUtilisateur, afficherNotification, setImageZoomee } = useAppContexte();
  const inputFichier = useRef(null);

  const [enTrainDeModifierPseudo, setEnTrainDeModifierPseudo] = useState(false);
  const [nouveauPseudo, setNouveauPseudo] = useState(donneesUtilisateur?.username || "");

  const pseudo    = donneesUtilisateur?.username    ?? "Utilisateur";
  const points    = donneesUtilisateur?.total_score ?? 0;
  const rang      = donneesUtilisateur?.rang        ?? "N/A";
  const avatar    = donneesUtilisateur?.photoProfil;
  const avatarSrc = avatar || `https://api.dicebear.com/7.x/notionists/svg?seed=${pseudo}`;

  const medailles = {
    1: <img src={logo1} alt="1er"  style={{ width: "24px", height: "24px" }} />,
    2: <img src={logo2} alt="2ème" style={{ width: "24px", height: "24px" }} />,
    3: <img src={logo3} alt="3ème" style={{ width: "24px", height: "24px" }} />,
  };

  const formaterRang = (r) => {
    if (r === "N/A" || r === undefined) return "N/A";
    const n = Number(r);
    if (medailles[n]) return medailles[n];
    return n === 1 ? "1er" : `${n}ème`;
  };

  const gererChangementPhoto = async (e) => {
    const fichier = e.target.files[0];
    if (!fichier) return;

    const formData = new FormData();
    formData.append("file", fichier);

    try {
      const { data } = await api.patch(
        `/users/${donneesUtilisateur.id}/photo-profil`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const utilisateurMisAJour = { ...donneesUtilisateur, photoProfil: data.user.photoProfil };
      localStorage.setItem("utilisateur", JSON.stringify(utilisateurMisAJour));
      setDonneesUtilisateur(utilisateurMisAJour);
      afficherNotification("Photo mise à jour !", "succes");
    } catch {
      afficherNotification("Erreur lors de l'upload", "erreur");
    }
  };

  const gererSupprimerPhoto = async () => {
    if (!window.confirm("Supprimer votre photo de profil ?")) return;
    try {
      await api.delete(`/users/${donneesUtilisateur.id}/photo-profil`);
      const utilisateurMisAJour = { ...donneesUtilisateur, photoProfil: null };
      localStorage.setItem("utilisateur", JSON.stringify(utilisateurMisAJour));
      setDonneesUtilisateur(utilisateurMisAJour);
      afficherNotification("Photo supprimée", "succes");
    } catch {
      afficherNotification("Erreur suppression", "erreur");
    }
  };

  const gererMiseAJourPseudo = async () => {
    if (!nouveauPseudo.trim() || nouveauPseudo === pseudo) {
      setEnTrainDeModifierPseudo(false);
      return;
    }

    try {
      const data = await mettreAJourUtilisateur(donneesUtilisateur.id, { username: nouveauPseudo });
      const utilisateurMisAJour = { ...donneesUtilisateur, username: data.username || nouveauPseudo };
      localStorage.setItem("utilisateur", JSON.stringify(utilisateurMisAJour));
      setDonneesUtilisateur(utilisateurMisAJour);
      setEnTrainDeModifierPseudo(false);
      afficherNotification("Pseudo mis à jour !", "succes");
    } catch {
      afficherNotification("Erreur lors de la mise à jour", "erreur");
    }
  };

  return (
    <div className="carte entete-profil">
      
      {/* Icone Retour (Mode édition seulement) */}
      {modeEdition && (
        <button 
          className="btn-retour-haut" 
          onClick={() => setModeEdition(false)}
          title="Retour"
        >
          <i className="ph ph-caret-left" />
        </button>
      )}

      {/* Icone mode édition générale / photo */}
      <button 
        className={`btn-edition-haut ${modeEdition ? 'actif' : ''}`} 
        onClick={() => setModeEdition(!modeEdition)}
        title={modeEdition ? "Valider les modifications" : "Modifier le profil"}
      >
        <i className={`ph ${modeEdition ? 'ph-check' : 'ph-pencil-simple'}`} />
      </button>

      {/* Avatar avec icone appareil photo */}
      <div
        className="avatar-container"
        onClick={() => modeEdition ? inputFichier.current?.click() : setImageZoomee(avatarSrc)}
        style={{ cursor: "pointer" }}
      >
        <img
          src={avatarSrc}
          alt={`Avatar de ${pseudo}`}
          className="avatar-grand"
        />
        {modeEdition && (
          <div className="badge-camera" title="Changer la photo">
            <i className="ph ph-camera" />
          </div>
        )}
      </div>

      {/* Input fichier caché */}
      <input
        ref={inputFichier}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={gererChangementPhoto}
      />

      {/* Pseudo avec icone édition */}
      <div className="zone-pseudo">
        {modeEdition && enTrainDeModifierPseudo ? (
          <div className="input-pseudo-container">
            <input 
              className="input-pseudo"
              value={nouveauPseudo}
              onChange={(e) => setNouveauPseudo(e.target.value)}
              onBlur={gererMiseAJourPseudo}
              onKeyDown={(e) => e.key === "Enter" && gererMiseAJourPseudo()}
              autoFocus
            />
          </div>
        ) : (
          <h2 className="pseudo-profil" onClick={() => modeEdition && setEnTrainDeModifierPseudo(true)}>
            {pseudo} {modeEdition && <i className="ph ph-pencil-simple" style={{ fontSize: "0.8em", opacity: 0.5, marginLeft: "4px" }} />}
          </h2>
        )}
      </div>

      <div className="separation-profil" />

      {/* Stats compactes (Image 2) */}
      <div className="stats-profil-container">
        <div className="stat-item">
          <span className="stat-label">Points</span>
          <span className="stat-valeur">{points}</span>
        </div>
        <div className="stat-separateur" />
        <div className="stat-item">
          <span className="stat-label">Rang</span>
          <span className="stat-valeur" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "4px" }}>
            {formaterRang(rang)}
          </span>
        </div>
      </div>

      {/* Options supplémentaires en mode édition */}
      {modeEdition && (
        <div style={{ marginTop: "20px", display: "flex", gap: "10px", justifyContent: "center" }}>
          {donneesUtilisateur?.photoProfil && (
            <button onClick={gererSupprimerPhoto} className="btn-secondaire-petit btn-danger-petit">
              <i className="ph ph-trash" /> {t("btn_supprimer_photo") || "Supprimer photo"}
            </button>
          )}
        </div>
      )}

    </div>
  );
};

export default EnteteProfi;