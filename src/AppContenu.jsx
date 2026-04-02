import { useState } from "react";
import { useAppContexte } from "./Contexte/AppContexte";
import EcranChargement from "./Ecrans/EcranChargement";
import EcranConnexion from "./Ecrans/EcranConnexion";
import EcranBienvenue from "./Ecrans/Ecranbienvenue ";
import EcranApp from "./Ecrans/EcranApp";
import Notification from "./Components/Notification";
import { connexion, inscription, deconnexion } from "./services/api";
import ImageZoom from "./Components/ImageZoom";

const AppContenu = () => {
  const { donneesUtilisateur, setDonneesUtilisateur, notification } = useAppContexte();
  const [afficherBienvenue, setAfficherBienvenue] = useState(false);

  const gererConnexion = async ({ identite, motDePasse }) => {
    const data = await connexion({ identite, motDePasse });
    const utilisateur = data.user;
    localStorage.setItem("utilisateur", JSON.stringify(utilisateur));
    setAfficherBienvenue(true); // ← afficher l'animation
    setTimeout(() => {
      setDonneesUtilisateur(utilisateur);
    }, 2700); // ← attendre la fin de l'animation
  };

  const gererInscription = async ({ pseudo, identite, motDePasse }) => {
    const data = await inscription({ pseudo, identite, motDePasse });
    const utilisateur = data.user;
    localStorage.setItem("utilisateur", JSON.stringify(utilisateur));
    setAfficherBienvenue(true);
    setTimeout(() => {
      setDonneesUtilisateur(utilisateur);
    }, 2700);
  };

  const gererMotDePasseOublie = async (email) => {
    // TODO : route à confirmer avec le backend
  };

  const gererDeconnexion = async () => {
    await deconnexion();
    setDonneesUtilisateur(false);
  };

  return (
    <>
      <Notification
        visible={notification.visible}
        message={notification.message}
        type={notification.type}
      />

      <ImageZoom />

      {/* Animation bienvenue après connexion */}
      {afficherBienvenue && (
        <EcranBienvenue onTermine={() => setAfficherBienvenue(false)} />
      )}

      {donneesUtilisateur === null && <EcranChargement />}

      {donneesUtilisateur === false && !afficherBienvenue && (
        <EcranConnexion
          onConnexion={gererConnexion}
          onInscription={gererInscription}
          onMotDePasseOublie={gererMotDePasseOublie}
        />
      )}

      {donneesUtilisateur && (
        <EcranApp onDeconnexion={gererDeconnexion} />
      )}
    </>
  );
};

export default AppContenu;