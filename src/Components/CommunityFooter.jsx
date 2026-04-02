import { useAppContexte } from "../Contexte/AppContexte";

const CommunityFooter = () => {
  const { afficherNotification } = useAppContexte();

  const gererRejoindreCommunaute = () => {
    window.open("https://whatsapp.com/channel/0029Vb6avN0InlqWut6HV70k", "_blank");
  };

  const gererParrainage = async () => {
    const texte = "Rejoins-moi sur The Daily Muse pour relever le défi quotidien ! 💡";
    
    if (navigator.share) {
      try {
        await navigator.share({ title: "The Daily Muse", text: texte, url: "https://daily-hazel.vercel.app" });
      } catch (err) {
        // L'utilisateur a annulé le partage
        return;
      }
    } else {
      navigator.clipboard.writeText(texte + "\nhttps://daily-hazel.vercel.app");
      afficherNotification("Lien de parrainage copié !", "succes");
    }
  };

  return (
    <div className="footer-profil">
      <button 
        className="btn-communaute" 
        onClick={gererRejoindreCommunaute}
        type="button"
      >
        Rejoindre la communauté
      </button>

      <button 
        className="btn-parrainer" 
        onClick={gererParrainage}
        type="button"
      >
        <i className="ph ph-share-network" />
        <span>Parrainer un ami</span>
      </button>
    </div>
  );
};

export default CommunityFooter;
