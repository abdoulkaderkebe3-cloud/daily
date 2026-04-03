import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

// AUTH
export const connexion = async ({ identite, motDePasse }) => {
  const { data } = await api.post("/auth/login", {
    username: identite,
    password: motDePasse,
  });
  return data;
};

export const inscriptionInitiate = async ({ pseudo, identite, motDePasse }) => {
  const { data } = await api.post("/auth/register/initiate", {
    username: pseudo,
    email: identite,
    password: motDePasse,
  });
  return data;
};

export const inscriptionVerify = async ({ email, code }) => {
  const { data } = await api.post("/auth/register/verify", {
    email,
    code,
  });
  return data;
};

export const motDePasseOublieInitiate = async (email) => {
  const { data } = await api.post("/auth/password/forgot", {
    email,
  });
  return data;
};

export const motDePasseOublieVerify = async ({ email, code, newPassword }) => {
  const { data } = await api.post("/auth/password/reset", {
    email,
    code,
    newPassword,
  });
  return data;
};

export const deconnexion = async () => {
  try { await api.post("/auth/logout"); } catch {}
  finally { localStorage.removeItem("utilisateur"); }
};

export const skiperQuestion = async (userId) => {
  const { data } = await api.post("/questions/skip", { userId });
  return data;
};

//  QUESTION DU JOUR
export const obtenirQuestionDuJour = async (userId) => {
  const { data } = await api.get(`/questions/today/${userId}`);
  return data;
};

export const soumettreReponse = async ({ userId, questionId, reponse }) => {
  const { data } = await api.post("/questions/answer", {
    userId,
    questionId,
    userInput: reponse,
  });
  return data;
};

// UTILISATEURS
export const obtenirUtilisateurs = async (page = 1, limite = 10) => {
  const { data } = await api.get("/users", { params: { page, limit: limite } });
  // L'API peut renvoyer { users: [...], total, page, totalPages }
  // ou directement un tableau — on normalise les deux cas
  if (Array.isArray(data)) {
    return { users: data, totalPages: 1, page: 1 };
  }
  return data;
};

export const obtenirUtilisateur = async (id) => {
  const { data } = await api.get(`/users/${id}`);
  return data;
};

export const obtenirStatsUtilisateur = async (id) => {
  const { data } = await api.get(`/users/${id}/stats`);
  return data;
};

export const mettreAJourUtilisateur = async (id, modifications) => {
  const { data } = await api.patch(`/users/${id}`, modifications);
  return data;
};

export const supprimerUtilisateur = async (id) => {
  const { data } = await api.delete(`/users/${id}`);
  return data;
};


export const obtenirQuestions = async () => {
  const { data } = await api.get("/questions");
  return data;
};

export const creerQuestion = async (question) => {
  const { data } = await api.post("/questions", question);
  return data;
};

export const mettreAJourQuestion = async (id, modifications) => {
  const { data } = await api.patch(`/questions/${id}`, modifications);
  return data;
};

export const supprimerQuestion = async (id) => {
  const { data } = await api.delete(`/questions/${id}`);
  return data;
};

export default api;