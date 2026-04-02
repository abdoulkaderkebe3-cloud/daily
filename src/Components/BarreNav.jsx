import { useAppContexte } from "../Contexte/AppContexte";

// Données des boutons de navigation
const boutons = [
  { vue: "accueil",    icone: "ph-pencil-simple", cleTraduction: "nav_defi"       },
  { vue: "classement", icone: "ph-trophy",         cleTraduction: "nav_classement" },
  { vue: "profil",     icone: "ph-user",           cleTraduction: "nav_profil"     },
];

// Composant
const BarreNav = () => {
  const { t, vueActive, changerVue } = useAppContexte();

  return (
    <nav className="barre-nav">
      {boutons.map(({ vue, icone, cleTraduction }) => (
        <button
          key={vue}
          className={`btn-nav ${vueActive === vue ? "actif" : ""}`}
          onClick={() => changerVue(vue)}
          aria-label={t(cleTraduction)}
          aria-current={vueActive === vue ? "page" : undefined}
        >
          <i className={`ph ${icone}`} />
          <span>{t(cleTraduction)}</span>
        </button>
      ))}
    </nav>
  );
};

export default BarreNav;
