import axios from "axios";

const API_URL = "http://localhost:3001";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getEvents = async () => {
  try {
    const response = await api.get("/events");
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar eventos:", error);
    throw error;
  }
};

export const getAuthEvents = async (token: string) => {
  try {
    const response = await api.get("/events-auth", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar eventos autenticados:", error);
    throw error;
  }
};

export const createEvent = async (eData: Record<string, unknown>) => {
  try {
    const response = await api.post("/events", eData);
    return response.data;
  } catch (error) {
    console.error("Erro ao criar evento:", error);
    throw error;
  }
};

export const updateEvent = async (eId: string, eData: Record<string, unknown>) => {
  try {
    const response = await api.put(`/events/${eId}`, eData);
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar evento:", error);
    throw error;
  }
};

export const deleteEvent = async (eId: string) => {
  try {
    await api.delete(`/events/${eId}`);
    return { message: "Evento deletado com sucesso" };
  } catch (error) {
    console.error("Erro ao deletar evento:", error);
    throw error;
  }
};

export const authenticateUser = async (email: string, password: string) => {
  try {
    const response = await api.post("/auth", { email, password });
    return response.data;
  } catch (error) {
    console.error("Erro ao autenticar usuário:", error);
    throw error;
  }
};

export default api;
