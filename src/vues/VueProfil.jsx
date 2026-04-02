import { useState, useEffect } from "react";
import { useAppContexte } from "../Contexte/AppContexte";
import EnteteProfi from "../Components/EnteteProfi";
import Parametres from "../Components/Parametres";
import ZoneCadeaux from "../Components/ZoneCadeaux";
import CommunityFooter from "../Components/CommunityFooter";
import api, { obtenirStatsUtilisateur } from "../services/api";

const VueProfil = ({ onDeconnexion }) => {
  const { t, afficherNotification, setDonneesUtilisateur, donneesUtilisateur } = useAppContexte();
  const [modeEdition, setModeEdition] = useState(false);

  useEffect(() => {
    if (!donneesUtilisateur?.id) return;

    obtenirStatsUtilisateur(donneesUtilisateur.id)
      .then((stats) => {
        setDonneesUtilisateur((prev) => {
          const misAJour = { ...prev, ...stats };
          localStorage.setItem("utilisateur", JSON.stringify(misAJour));
          return misAJour;
        });
      })
      .catch((err) => {
        console.error("Erreur refresh stats profil:", err);
      });
  }, [donneesUtilisateur?.id, setDonneesUtilisateur]);

  const gererUtiliserCode = async (code) => {
    try {
      const { data } = await api.post("/codes-cadeaux/utiliser", { code });
      afficherNotification(t("msg_code_ok"), "succes");
      // Mettre à jour les points dans l'UI
      if (data.user) {
        setDonneesUtilisateur(prev => ({ ...prev, total_score: data.user.total_score }));
      }
    } catch (err) {
      const msg = err.response?.data?.message || t("msg_code_invalide");
      afficherNotification(msg, "erreur");
    }
  };

  const gererDeconnexion = async () => {
    try {
      await onDeconnexion();
    } catch {
      afficherNotification("Erreur lors de la déconnexion", "erreur");
    }
  };

  return (
    <section className="vue vue-profil">
      <EnteteProfi 
        modeEdition={modeEdition} 
        setModeEdition={setModeEdition} 
      />
      
      {!modeEdition ? (
        <>
          <ZoneCadeaux onUtiliserCode={gererUtiliserCode} />
          <Parametres onDeconnexion={onDeconnexion} />
          <CommunityFooter />
        </>
      ) : (
        /* Bouton déconnexion proéminent en mode édition (Image 3) */
        <div className="carte bento-logout">
          <button 
            className="btn-rouge-large" 
            onClick={gererDeconnexion} 
            type="button"
          >
            {t("btn_deconnexion")?.toUpperCase() || "SE DÉCONNECTER"}
          </button>
        </div>
      )}
    </section>
  );
};

export default VueProfil;