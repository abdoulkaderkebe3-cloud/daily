import { useState, useEffect } from "react";
import { useAppContexte } from "../../Contexte/AppContexte";

const EtatActif = ({ question, categorie, onSoumettre }) => {
  const { t } = useAppContexte();
  const [reponse, setReponse]       = useState("");
  const [chargement, setChargement] = useState(false);
  const [tempsRestant, setTempsRestant] = useState(15);

  useEffect(() => {
    if (chargement) return;

    if (tempsRestant <= 0) {
      // Temps écoulé, on soumet automatiquement une chaîne vide
      setChargement(true);
      onSoumettre({ reponse: "" }).finally(() => {
        setChargement(false);
        setReponse("");
      });
      return;
    }

    const interval = setInterval(() => {
      setTempsRestant((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [tempsRestant, chargement, onSoumettre]);

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
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
        {categorie && (
          <span className="tag-categorie">{categorie}</span>
        )}
        <span style={{ fontWeight: "bold", color: tempsRestant <= 5 ? "var(--couleur-rouge)" : "var(--couleur-texte)" }}>
          ⏳ {tempsRestant}s
        </span>
      </div>

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