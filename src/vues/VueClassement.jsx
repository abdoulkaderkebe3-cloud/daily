import { useState, useEffect, useCallback } from "react";
import { useAppContexte } from "../Contexte/AppContexte";
import { obtenirUtilisateurs } from "../services/api";
import logo1 from "../../public/svg-1er.svg";
import logo2 from "../../public/svg-2eme.svg";
import logo3 from "../../public/svg-3eme.svg";

const LIMITE = 10;

const VueClassement = () => {
  const { t, donneesUtilisateur, setImageZoomee } = useAppContexte();

  const [classement, setClassement] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur]         = useState(false);
  const [page, setPage]             = useState(1);

  const chargerClassement = useCallback(async (p) => {
    setChargement(true);
    setErreur(false);
    try {
      const rep = await obtenirUtilisateurs(p, LIMITE);
      // Supporte tableau brut ou objet paginé { users/data: [...] }
      const liste = Array.isArray(rep)
        ? rep
        : rep.users ?? rep.data ?? [];
      setClassement(Array.isArray(liste) ? liste : []);
    } catch {
      setErreur(true);
    } finally {
      setChargement(false);
    }
  }, []);

  useEffect(() => {
    chargerClassement(page);
  }, [page, chargerClassement]);

  const medailles = {
    1: <img src={logo1} alt="1er"  style={{ width: "32px", height: "32px" }} />,
    2: <img src={logo2} alt="2ème" style={{ width: "32px", height: "32px" }} />,
    3: <img src={logo3} alt="3ème" style={{ width: "32px", height: "32px" }} />,
  };

  const offsetRang      = (page - 1) * LIMITE;
  // Page suivante dispo si on a reçu exactement LIMITE items
  const aPageSuivante   = classement.length === LIMITE;
  const aPagePrecedente = page > 1;

  return (
    <section className="vue vue-classement">
      <h2 className="titre-vue">{t("titre_classement")}</h2>

      <div className="carte carte-sans-padding">
        {chargement ? (
          <div style={{ textAlign: "center", padding: "40px" }}>
            <i className="ph ph-circle-notch icone-spin" style={{ fontSize: "32px", opacity: 0.5 }} />
          </div>
        ) : erreur ? (
          <div style={{ textAlign: "center", padding: "40px 20px" }}>
            <i className="ph ph-trophy" style={{ fontSize: "48px", opacity: 0.2, marginBottom: "12px", display: "block" }} />
            <p style={{ opacity: 0.5, fontSize: "0.9rem" }}>Le classement sera bientôt disponible.</p>
          </div>
        ) : classement.length === 0 ? (
          <p className="texte-vide">Aucun joueur pour l'instant</p>
        ) : (
          classement.map((joueur, index) => {
            const rang   = offsetRang + index + 1;
            const estMoi = joueur.id === donneesUtilisateur?.id;

            return (
              <div
                key={joueur.id}
                className={`item-classement ${estMoi ? "item-classement--moi" : ""}`}
              >
                <span className="rang" style={{ display: "flex", alignItems: "center" }}>
                  {medailles[rang] ?? `#${rang}`}
                </span>
                <img
                  src={joueur.photoProfil || `https://api.dicebear.com/7.x/notionists/svg?seed=${joueur.username}`}
                  alt={joueur.username}
                  className="avatar-petit"
                  onClick={() => setImageZoomee(joueur.photoProfil || `https://api.dicebear.com/7.x/notionists/svg?seed=${joueur.username}`)}
                  style={{ cursor: "pointer" }}
                />
                <span className="pseudo">{joueur.username}</span>
                <span className="points">{joueur.total_score} pts</span>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination — toujours visible quand il y a des utilisateurs */}
      {!erreur && classement.length > 0 && (
        <div className="pagination-classement">
          <button
            className="btn-pagination"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={!aPagePrecedente || chargement}
            aria-label="Page précédente"
          >
            <i className="ph ph-caret-left" />
            <span>Précédent</span>
          </button>

          <span className="pagination-info">Page {page}</span>

          <button
            className="btn-pagination"
            onClick={() => setPage((p) => p + 1)}
            disabled={!aPageSuivante || chargement}
            aria-label="Page suivante"
          >
            <span>Suivant</span>
            <i className="ph ph-caret-right" />
          </button>
        </div>
      )}
    </section>
  );
};

export default VueClassement;