import { useState } from 'react';
import axios from 'axios';

export default function CreateAvis() {
  const [eventId, setEventId] = useState('');
  const [positif, setPositif] = useState(true);
  const [commentaire, setCommentaire] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('event', eventId);
    formData.append('positif', positif);
    formData.append('commentaire', commentaire);
    formData.append('author', 1); // temporairement en dur

    try {
      const response = await axios.post('http://localhost:8000/api/avis/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'X-CSRFToken': 'your_csrf_token_here' // Include CSRF token if needed
        }
      });
      console.log('Avis créé :', response.data);
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
      <label>
        <input type="checkbox" checked={positif} onChange={(e) => setPositif(e.target.checked)} />
        Positif
      </label>
      <textarea value={commentaire} onChange={(e) => setCommentaire(e.target.value)} placeholder="Commentaire" />
      <button type="submit">Soumettre l'avis</button>
    </form>
  );
}
