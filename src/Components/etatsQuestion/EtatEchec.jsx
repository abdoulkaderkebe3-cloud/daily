import { useAppContexte } from "../../Contexte/AppContexte";

const EtatEchec = ({ reponseCorrecte, explication }) => {
  const { t } = useAppContexte();

  return (
    <div className="etat-resultat etat-echec">
      <div className="icone-resultat icone-echec">
        <i className="ph ph-x" />
      </div>
      <h3>{t("titre_echec")}</h3>

      <p className="label-bonne-reponse">La réponse était :</p>
      <p className="bonne-reponse">
        {reponseCorrecte || "..."}
      </p>

      <p style={{ opacity: 0.7, fontSize: "0.9rem", marginTop: "12px", fontStyle: "italic" }}>
        {explication || ""}
      </p>

      <p className="message-resultat">{t("msg_pas_loin")}</p>
    </div>
  );
};

export default EtatEchec;