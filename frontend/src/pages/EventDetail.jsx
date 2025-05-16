import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

export default function EventDetail() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [avis, setAvis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deck, setDeck] = useState('');
  const [positif, setPositif] = useState(true);
  const [commentaire, setCommentaire] = useState('');
  const [user, setUser] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const eventResponse = await axios.get(`http://localhost:8000/api/events/${id}/`);
        setEvent(eventResponse.data);
        setLoading(false);

        const avisResponse = await axios.get(`http://localhost:8000/api/events/${id}/avis/`);
        setAvis(avisResponse.data);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const res = await axios.get("http://127.0.0.1:8000/api/get_user/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data.user);
      } catch (error) {
        console.error("Erreur lors de la récupération de l'utilisateur :", error);
      }
    };

    const checkRegistration = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const res = await axios.get(`http://localhost:8000/api/inscriptions/check/${id}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setIsRegistered(res.data.isRegistered);
        if (res.data.isRegistered) {
          setMessage('Vous êtes déjà inscrit à cet événement.');
        }
      } catch (error) {
        console.error("Erreur lors de la vérification de l'inscription :", error);
      }
    };

    fetchUser();
    fetchEvent();
    checkRegistration();
  }, [id]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleInscriptionSubmit = async (e) => {
    e.preventDefault();
    if (isRegistered) {
      setMessage('Vous êtes déjà inscrit à cet événement.');
      return;
    }

    const formData = new FormData();
    formData.append('event', id);
    formData.append('player', user.id);
    formData.append('deck', deck);

    try {
      const response = await axios.post('http://localhost:8000/api/inscriptions/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'X-CSRFToken': 'your_csrf_token_here'
        }
      });
      console.log('Inscription créée :', response.data);
      setDeck('');
      setMessage('Inscription réussie!');
      setIsRegistered(true);
    } catch (error) {
      if (error.response) {
        console.error('Erreur:', error.response.data);
        setMessage('Erreur lors de l\'inscription.');
      } else {
        console.error('Erreur inconnue:', error.message);
        setMessage('Erreur inconnue lors de l\'inscription.');
      }
    }
  };

  const handleAvisSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('event', id);
    formData.append('positif', positif);
    formData.append('commentaire', commentaire);
    formData.append('author', user.id);

    try {
      const response = await axios.post('http://localhost:8000/api/avis/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'X-CSRFToken': 'your_csrf_token_here'
        }
      });
      console.log('Avis créé :', response.data);
      setCommentaire('');
      setPositif(true);
      setMessage('Avis soumis avec succès!');
    } catch (error) {
      if (error.response) {
        console.error('Erreur:', error.response.data);
        setMessage('Erreur lors de la soumission de l\'avis.');
      } else {
        console.error('Erreur inconnue:', error.message);
        setMessage('Erreur inconnue lors de la soumission de l\'avis.');
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
      {user ? (
        <>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Create Avis</h2>
            <form onSubmit={handleAvisSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Positif</label>
                <input
                  type="checkbox"
                  checked={positif}
                  onChange={(e) => setPositif(e.target.checked)}
                  className="mr-2" />
                <span>Positif</span>
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Commentaire</label>
                <textarea
                  value={commentaire}
                  onChange={(e) => setCommentaire(e.target.value)}
                  placeholder="Commentaire"
                  className="w-full p-2 border rounded" />
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
                <label className="block text-gray-700 mb-2">Deck URL</label>
                <input
                  type="url"
                  value={deck}
                  onChange={(e) => setDeck(e.target.value)}
                  placeholder="Lien vers le deck"
                  className="w-full p-2 border rounded" />
              </div>
              <button
                type="submit"
                disabled={isRegistered}
                className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-gray-400"
              >
                S'inscrire
              </button>
            </form>
          </div>
        </>
      ) : null}

      {message && <div className="text-center py-4 text-green-500">{message}</div>}
    </div>
  );
}
