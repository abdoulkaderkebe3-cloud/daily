import { useEffect, useState } from "react";
import { useAppContexte } from "../Contexte/AppContexte";

const EcranBienvenue = ({ onTermine }) => {
  const { theme } = useAppContexte();
  const [phase, setPhase] = useState("entree"); // entree → visible → sortie

  useEffect(() => {
    // Entrée : 500ms
    const t1 = setTimeout(() => setPhase("visible"), 500);
    // Sortie : après 2s
    const t2 = setTimeout(() => setPhase("sortie"), 2000);
    // Terminer : après la sortie 
    const t3 = setTimeout(() => onTermine(), 2700);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  const logoSrc = theme === "dark"
  ? `${import.meta.env.BASE_URL}logo-viso-logo.svg`
  : `${import.meta.env.BASE_URL}logo-viso-noir.svg`;

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      zIndex: 9999,
      background: "var(--bg)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: "24px",
      opacity: phase === "entree" ? 0 : phase === "sortie" ? 0 : 1,
      transform: phase === "entree"
        ? "scale(0.9)"
        : phase === "sortie"
        ? "scale(1.05)"
        : "scale(1)",
      transition: "opacity 0.5s ease, transform 0.5s ease",
    }}>
      <img
        src={logoSrc}
        alt="Viso Studio"
        style={{
          width: "160px",
          height: "auto",
          animation: phase === "visible" ? "pulse 1s ease-in-out infinite alternate" : "none",
        }}
      />

      <style>{`
        @keyframes pulse {
          from { transform: scale(1); opacity: 0.9; }
          to   { transform: scale(1.05); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default EcranBienvenue;