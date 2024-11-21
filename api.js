/* eslint-disable prettier/prettier */
import axios from 'axios';

// Configura la URL base de tu servidor
const API_BASE_URL = 'http://10.0.2.2:3009'; // Usa localhost para Android Emulator o IP real para dispositivos físicos

const api = axios.create({
baseURL: API_BASE_URL,
});

export const sendNotification = async (email, alias, remainingDays) => {
try {
const response = await api.post('/send-notification', {
    email,
    alias,
    remainingDays,
});
return response.data;
} catch (error) {
console.error('Error enviando notificación:', error);
throw error;
}
};

export default api;
