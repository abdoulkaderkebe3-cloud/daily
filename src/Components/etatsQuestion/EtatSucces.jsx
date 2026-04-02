import { useAppContexte } from "../../Contexte/AppContexte";

const EtatSucces = () => {
  const { t } = useAppContexte();

  return (
    <div className="etat-resultat etat-succes">
      <div className="icone-resultat icone-succes">
        <i className="ph ph-check" />
      </div>
      <h3>{t("titre_succes")}</h3>
      <p className="message-resultat">{t("msg_revenir")}</p>
    </div>
  );
};

export default EtatSucces;