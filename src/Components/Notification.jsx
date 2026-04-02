
const Notification = ({ visible, message, type = "info" }) => {
  const icone = {
    succes: "ph-check-circle",
    erreur: "ph-warning-circle",
    info: "ph-info",
  }[type] ?? "ph-info";

  return (
    <div className={`notification ${type} ${visible ? "visible" : ""}`}>
      <i className={`ph ${icone}`} />
      <span>{message}</span>
    </div>
  );
};

export default Notification;
