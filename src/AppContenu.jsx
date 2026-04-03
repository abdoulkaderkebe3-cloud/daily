import { useState } from "react";
import { useAppContexte } from "./Contexte/AppContexte";
import EcranChargement from "./Ecrans/EcranChargement";
import EcranConnexion from "./Ecrans/EcranConnexion";
import EcranApp from "./Ecrans/EcranApp";
import EcranBienvenue from "./Ecrans/EcranBienvenue";
import Notification from "./Components/Notification";
import { connexion, inscriptionInitiate, inscriptionVerify, motDePasseOublieInitiate, motDePasseOublieVerify, deconnexion } from "./services/api";
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

  const gererInscriptionInitiate = async ({ pseudo, identite, motDePasse }) => {
    await inscriptionInitiate({ pseudo, identite, motDePasse });
  };

  const gererInscriptionVerify = async ({ email, code }) => {
    const data = await inscriptionVerify({ email, code });
    const utilisateur = data.user;
    localStorage.setItem("utilisateur", JSON.stringify(utilisateur));
    setAfficherBienvenue(true);
    setTimeout(() => {
      setDonneesUtilisateur(utilisateur);
    }, 2700);
  };

  const gererMotDePasseOublieInitiate = async (email) => {
    await motDePasseOublieInitiate(email);
  };

  const gererMotDePasseOublieVerify = async ({ email, code, newPassword }) => {
    await motDePasseOublieVerify({ email, code, newPassword });
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
          onInscriptionInitiate={gererInscriptionInitiate}
          onInscriptionVerify={gererInscriptionVerify}
          onMotDePasseOublieInitiate={gererMotDePasseOublieInitiate}
          onMotDePasseOublieVerify={gererMotDePasseOublieVerify}
        />
      )}

      {donneesUtilisateur && (
        <EcranApp onDeconnexion={gererDeconnexion} />
      )}
    </>
  );
};

export default AppContenu;