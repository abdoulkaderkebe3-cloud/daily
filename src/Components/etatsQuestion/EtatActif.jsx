import { useState, useEffect, useRef } from "react";
import { useAppContexte } from "../../Contexte/AppContexte";

const EtatActif = ({ question, categorie, onSoumettre }) => {
  const { t } = useAppContexte();
  const [reponse, setReponse]       = useState("");
  const [chargement, setChargement] = useState(false);
  const [tempsRestant, setTempsRestant] = useState(15);
  const autoSoumis = useRef(false);

  useEffect(() => {
    if (chargement) return;

    if (tempsRestant <= 0 && !autoSoumis.current) {
      autoSoumis.current = true;
      setChargement(true);
      onSoumettre({ reponse: "Temps écoulé" }).finally(() => {
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
          <span className="tag-categorie" style={{ marginBottom: 0 }}>{categorie}</span>
        )}
        <span style={{ 
          fontWeight: "bold", 
          fontSize: "1.1rem",
          color: tempsRestant <= 5 ? "var(--couleur-erreur, red)" : "var(--texte, inherit)",
          marginLeft: categorie ? "auto" : "0", 
          display: "inline-block" 
        }}>
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