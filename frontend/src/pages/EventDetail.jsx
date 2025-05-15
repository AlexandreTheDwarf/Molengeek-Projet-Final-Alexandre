import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

export default function EventDetail() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [avis, setAvis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [playerId, setPlayerId] = useState('');
  const [deck, setDeck] = useState('');
  const [positif, setPositif] = useState(true);
  const [commentaire, setCommentaire] = useState('');

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const eventResponse = await axios.get(`http://localhost:8000/api/events/${id}/`);
        setEvent(eventResponse.data);
        setLoading(false);

        // Fetch reviews related to the event
        const avisResponse = await axios.get(`http://localhost:8000/api/events/${id}/avis/`);
        setAvis(avisResponse.data);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleInscriptionSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('event', id); // Use the event ID from the URL
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

  const handleAvisSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('event', id); // Use the event ID from the URL
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

  if (loading) return <div className="text-center py-4">Loading...</div>;
  if (error) return <div className="text-center py-4 text-red-500">Error: {error}</div>;
  if (!event) return <div className="text-center py-4">No event found</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h1 className="text-3xl font-bold mb-4">{event.nom}</h1>
        <img src={event.banner_img} alt={event.nom} className="w-full h-64 object-cover rounded mb-4" />
        <p className="text-lg mb-2">{event.description}</p>
        <p className="text-gray-700 mb-2"><span className="font-semibold">Author:</span> {event.author}</p>
        <p className="text-gray-700 mb-2"><span className="font-semibold">Bracket Level:</span> {event.bracket_level}</p>
        <p className="text-gray-700 mb-2"><span className="font-semibold">Format:</span> {event.format}</p>
        <p className="text-gray-700 mb-2"><span className="font-semibold">Number of Participants:</span> {event.nombre_participant}</p>
        <p className="text-gray-700 mb-2"><span className="font-semibold">Date:</span> {formatDate(event.date)}</p>
        <p className="text-gray-700 mb-2"><span className="font-semibold">IRL:</span> {event.IRL ? 'Yes' : 'No'}</p>
        <p className="text-gray-700 mb-4"><span className="font-semibold">Location:</span> {event.lieux}</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-2xl font-bold mb-4">Reviews</h2>
        <div className="space-y-4">
          {avis.map(avi => (
            <div key={avi.id} className="p-4 border rounded-lg">
              <p className="text-gray-700 mb-1"><span className="font-semibold">Author:</span> {avi.author}</p>
              <p className="text-gray-700 mb-1"><span className="font-semibold">Positive:</span> {avi.positif ? 'Yes' : 'No'}</p>
              <p className="text-gray-700 mb-1"><span className="font-semibold">Comment:</span> {avi.commentaire}</p>
              <p className="text-gray-700"><span className="font-semibold">Date Posted:</span> {formatDate(avi.date_poste)}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Create Avis</h2>
        <form onSubmit={handleAvisSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Positif</label>
            <input
              type="checkbox"
              checked={positif}
              onChange={(e) => setPositif(e.target.checked)}
              className="mr-2"
            />
            <span>Positif</span>
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Commentaire</label>
            <textarea
              value={commentaire}
              onChange={(e) => setCommentaire(e.target.value)}
              placeholder="Commentaire"
              className="w-full p-2 border rounded"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
          >
            Soumettre l'avis
          </button>
        </form>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-2xl font-bold mb-4">Inscription</h2>
        <form onSubmit={handleInscriptionSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Player ID</label>
            <input
              type="number"
              value={playerId}
              onChange={(e) => setPlayerId(e.target.value)}
              placeholder="ID du joueur"
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Deck URL</label>
            <input
              type="url"
              value={deck}
              onChange={(e) => setDeck(e.target.value)}
              placeholder="Lien vers le deck"
              className="w-full p-2 border rounded"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            S'inscrire
          </button>
        </form>
      </div>
    </div>
  );
}
