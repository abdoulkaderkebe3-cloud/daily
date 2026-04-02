import { useAppContexte } from "../Contexte/AppContexte";

const ImageZoom = () => {
  const { imageZoomee, setImageZoomee } = useAppContexte();

  if (!imageZoomee) return null;

  return (
    <div className="image-zoom-overlay" onClick={() => setImageZoomee(null)}>
      <div className="image-zoom-conteneur" onClick={(e) => e.stopPropagation()}>
        <button 
          className="btn-fermer-zoom" 
          onClick={() => setImageZoomee(null)}
          aria-label="Fermer"
        >
          <i className="ph ph-x" />
        </button>
        <img src={imageZoomee} alt="Zoom" className="image-zoom-grande" />
      </div>
    </div>
  );
};

export default ImageZoom;
