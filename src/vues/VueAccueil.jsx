import { useState, useEffect, useRef, useCallback } from "react";
import confetti from "canvas-confetti";
import { useAppContexte } from "../Contexte/AppContexte";
import CarteQuestion from "../Components/CarteQuestion";
import BadgeStreak from "../Components/BadgeStreak";
import { obtenirQuestionDuJour, soumettreReponse, skiperQuestion, obtenirStatsUtilisateur } from "../services/api";

const VueAccueil = () => {
  const { t, donneesUtilisateur, setDonneesUtilisateur, afficherNotification } = useAppContexte();

  const userId = donneesUtilisateur?.id;

  const [question, setQuestion]               = useState("");
  const [questionId, setQuestionId]           = useState("");
  const [categorie, setCategorie]             = useState("");
  const [reponseCorrecte, setReponseCorrecte] = useState("");
  const [explication, setExplication]         = useState("");
  const [chargement, setChargement]           = useState(true);
  const [etat, setEtat]                       = useState("actif");

  const chargementFait = useRef(false);

  useEffect(() => {
    if (!userId || chargementFait.current) return;
    chargementFait.current = true;

    obtenirQuestionDuJour(userId)
      .then((data) => {
        if (data.alreadyPlayed) {
          const dernierEtat = localStorage.getItem("etat_" + userId) || "succes";
          if (dernierEtat === "echec") {
            setReponseCorrecte(localStorage.getItem("rep_" + userId) || "");
            setExplication(localStorage.getItem("expl_" + userId) || "");
          }
          setEtat(dernierEtat);
        } else {
          setQuestion(data.content   || "");
          setQuestionId(data.id      || "");
          setCategorie(data.category || "");
          setEtat("actif");
        }
      })
      .catch(() => {})
      .finally(() => setChargement(false));
  }, [userId]);

  const gererSoumission = useCallback(async ({ reponse }) => {
    try {
      const data = await soumettreReponse({ userId, questionId, reponse });

      if (data.newTotalScore !== undefined) {
        const u = JSON.parse(localStorage.getItem("utilisateur") || "{}");
        u.total_score = data.newTotalScore;
        localStorage.setItem("utilisateur", JSON.stringify(u));
      }

      const rep  = data.correctAnswer || "";
      const expl = data.explanation   || "";

      if (data.isCorrect) {
        localStorage.setItem("etat_" + userId, "succes");
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 }, colors: ["#000000", "#ffffff", "#10b981", "#f59e0b"] });
        afficherNotification(`Correct ! +${data.pointsEarned} pts`, "succes");
        setEtat("succes");

        // Rafraîchir les stats de l'utilisateur
        try {
          const stats = await obtenirStatsUtilisateur(userId);
          const utilisateurMisAJour = { ...donneesUtilisateur, ...stats };
          localStorage.setItem("utilisateur", JSON.stringify(utilisateurMisAJour));
          setDonneesUtilisateur(utilisateurMisAJour);
        } catch (e) {
          console.error("Erreur rafraîchissement stats:", e);
        }
      } else {
        localStorage.setItem("etat_" + userId, "echec");
        localStorage.setItem("rep_"  + userId, rep);
        localStorage.setItem("expl_" + userId, expl);
        setReponseCorrecte(rep);
        setExplication(expl);
        afficherNotification("Mauvaise réponse !", "erreur");
        setEtat("echec");
      }

      return data;
    } catch {
      afficherNotification("Une erreur est survenue, réessaie.", "erreur");
    }
  }, [userId, questionId]);

  const gererSkip = useCallback(async () => {
    try {
      const data = await skiperQuestion(userId);
      setQuestion(data.content   || "");
      setQuestionId(data.id      || "");
      setCategorie(data.category || "");
      setEtat("actif");
      afficherNotification("Nouvelle question !", "succes");
    } catch (err) {
      afficherNotification(
        err.response?.status === 403
          ? "Tu as déjà passé aujourd'hui !"
          : "Impossible de passer pour l'instant.",
        "erreur"
      );
    }
  }, [userId]);

  const gererPartage = useCallback(() => {
    const texte = `Le Daily Muse m'a mis en difficulté aujourd'hui\n❓ « ${question} »\nCurieux de voir si tu t'en sors mieux que moi ! On compare nos scores ?\ndaily-hazel.vercel.app`;
    
    if (navigator.share) {
      navigator.share({ title: "The Daily Muse", text: texte });
    } else {
      navigator.clipboard.writeText(texte);
      afficherNotification("Copié !", "succes");
    }
  }, [question]);

  return (
    <section className="vue vue-accueil">
      <div className="entete-accueil">
        <h2 className="titre-vue">{t("titre_enigme")}</h2>
        <BadgeStreak streak={donneesUtilisateur?.streak ?? 0} />
      </div>

      {chargement ? (
        <div className="carte" style={{ textAlign: "center", padding: "60px 20px" }}>
          <i className="ph ph-circle-notch icone-spin" style={{ fontSize: "40px", opacity: 0.5 }} />
        </div>
      ) : (
        <CarteQuestion
          etat={etat}
          question={question}
          categorie={categorie}
          reponseCorrecte={reponseCorrecte}
          explication={explication}
          onSoumettre={gererSoumission}
          onPartager={gererPartage}
          onSkip={gererSkip}
        />
      )}
    </section>
  );
};

export default VueAccueil;