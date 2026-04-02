import { useState } from "react";
import { useAppContexte } from "../../Contexte/AppContexte";

const EtatActif = ({ question, categorie, onSoumettre }) => {
  const { t } = useAppContexte();
  const [reponse, setReponse]       = useState("");
  const [chargement, setChargement] = useState(false);

  const gererSoumission = async () => {
    if (!reponse.trim()) return;
    setChargement(true);
    try {
      await onSoumettre({ reponse });
    } finally {
      setChargement(false);
      setReponse("");
    }
  };

  const gererTouche = (e) => {
    if (e.key === "Enter") gererSoumission();
  };

  return (
    <div className="etat-actif">
      {categorie && (
        <span className="tag-categorie">{categorie}</span>
      )}

      <p className="texte-question">
        {question || "Chargement..."}
      </p>

      <div className="zone-reponse">
        <input
          type="text"
          placeholder={t("ph_reponse")}
          value={reponse}
          onChange={(e) => setReponse(e.target.value)}
          onKeyDown={gererTouche}
          disabled={chargement}
          autoComplete="off"
        />
        <button
          onClick={gererSoumission}
          disabled={chargement || !reponse.trim()}
        >
          {chargement
            ? <i className="ph ph-circle-notch icone-spin-petit" />
            : t("btn_valider")
          }
        </button>
      </div>
    </div>
  );
};

export default EtatActif;