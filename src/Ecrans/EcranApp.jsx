import { memo } from "react";
import { useAppContexte } from "../Contexte/AppContexte";
import BarreNav from "../Components/BarreNav";
import VueAccueil from "../vues/VueAccueil";
import VueClassement from "../vues/VueClassement";
import VueProfil from "../vues/VueProfil";

// Mémoïsation pour éviter les re-renders inutiles
const VueAccueilMemo = memo(VueAccueil);

const EcranApp = ({ onDeconnexion }) => {
  const { vueActive } = useAppContexte();

  return (
    <div className="ecran-app">
      <BarreNav />
      <main className="contenu-principal">
        {vueActive === "accueil"    && <VueAccueilMemo />}
        {vueActive === "classement" && <VueClassement />}
        {vueActive === "profil"     && <VueProfil onDeconnexion={onDeconnexion} />}
      </main>
    </div>
  );
};

export default EcranApp;