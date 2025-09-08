// Soubor: src/lib/api/client.ts
// Popis: Vytvoření centrální instance axiosu pro komunikaci s API.

import axios from 'axios';

// Vytvoříme instanci axiosu s přednastavenou base URL.
// Používáme proměnnou prostředí, což je best practice.
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;
