import { useState } from "react";
import { useAppContexte } from "../Contexte/AppContexte";

// ZoneCadeaux 
// Permet à l'utilisateur de saisir un code cadeau pour gagner des points.
//
// Props :
//   onUtiliserCode → async (code) : callback backend pour valider le code

const ZoneCadeaux = ({ onUtiliserCode }) => {
  const { t, afficherNotification } = useAppContexte();

  const [code, setCode]           = useState("");
  const [chargement, setChargement] = useState(false);

  const gererUtilisation = async () => {
    const codeNettoye = code.trim().toUpperCase();
    if (!codeNettoye) return;

    setChargement(true);
    try {
      await onUtiliserCode(codeNettoye);
      setCode("");
    } catch (err) {
      // Les messages d'erreur sont gérés dans le callback backend
      // qui appellera afficherNotification directement
      console.error("Erreur code cadeau :", err);
    } finally {
      setChargement(false);
    }
  };

  const gererTouche = (e) => {
    if (e.key === "Enter") gererUtilisation();
  };

  return (
    <div className="carte">
      <h3 className="titre-carte">{t("titre_zone_cadeaux")}</h3>

      <div className="zone-code">
        <input
          type="text"
          placeholder={t("ph_code")}
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          onKeyDown={gererTouche}
          disabled={chargement}
          maxLength={20}
          autoComplete="off"
          autoCapitalize="characters"
        />
        <button
          onClick={gererUtilisation}
          disabled={chargement || !code.trim()}
          type="button"
        >
          {chargement
            ? <i className="ph ph-circle-notch icone-spin-petit" />
            : t("btn_utiliser")
          }
        </button>
      </div>
    </div>
  );
};

export default ZoneCadeaux;
