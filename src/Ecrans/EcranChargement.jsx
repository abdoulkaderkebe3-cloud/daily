import React from 'react'
import { useAppContexte } from "../Contexte/AppContexte";
export default function EcranChargement() {
const { t } = useAppContexte();
  return (
    <div className="ecran-chargement">
      <i className="ph ph-asterisk-simple icone-spin" />
      <h1 className="titre-app">{t("nom_app")}</h1>
      <p className="texte-chargement">Connexion...</p>
    </div>
  )
}
