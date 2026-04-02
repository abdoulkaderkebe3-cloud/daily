import EtatActif from "./etatsQuestion/EtatActif";
import EtatSucces from "./etatsQuestion/EtatSucces";
import EtatEchec from "./etatsQuestion/EtatEchec";

// etat → "actif" | "succes" | "echec"
const CarteQuestion = ({
  etat = "actif",
  question,
  categorie,
  reponseCorrecte,
  explication,
  onSoumettre,
  onPartager,
}) => {
  return (
    <div className="carte carte-question">
      <button
        className="btn-partage"
        onClick={onPartager}
        aria-label="Partager la question"
      >
        <i className="ph ph-share-network" />
      </button>

      {etat === "actif" && (
        <EtatActif
          question={question}
          categorie={categorie}
          onSoumettre={onSoumettre}
        />
      )}

      {etat === "succes" && <EtatSucces />}

      {etat === "echec" && (
        <EtatEchec
          reponseCorrecte={reponseCorrecte}
          explication={explication}
        />
      )}
    </div>
  );
};

export default CarteQuestion;