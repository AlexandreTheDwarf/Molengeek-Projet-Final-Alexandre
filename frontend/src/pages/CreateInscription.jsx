import { useState } from 'react';
import axios from 'axios';

export default function CreateInscription() {
  const [eventId, setEventId] = useState('');
  const [playerId, setPlayerId] = useState('');
  const [deck, setDeck] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('event', eventId);
    formData.append('player', playerId);
    formData.append('deck', deck);

    try {
      const response = await axios.post('http://localhost:8000/api/inscriptions/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'X-CSRFToken': 'your_csrf_token_here' // Include CSRF token if needed
        }
      });
      console.log('Inscription créée :', response.data);
    } catch (error) {
      if (error.response) {
        console.error('Erreur:', error.response.data);
      } else {
        console.error('Erreur inconnue:', error.message);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="number" value={eventId} onChange={(e) => setEventId(e.target.value)} placeholder="ID de l'événement" />
      <input type="number" value={playerId} onChange={(e) => setPlayerId(e.target.value)} placeholder="ID du joueur" />
      <input type="url" value={deck} onChange={(e) => setDeck(e.target.value)} placeholder="Lien vers le deck" />
      <button type="submit">S'inscrire</button>
    </form>
  );
}
