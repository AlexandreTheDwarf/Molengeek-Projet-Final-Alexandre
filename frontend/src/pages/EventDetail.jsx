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

    if (!user) {
      setMessage("Vous devez être connecté pour vous inscrire.");
      return;
    }

    if (isRegistered) {
      setMessage('Vous êtes déjà inscrit à cet événement.');
      return;
    }

    if (event.nombre_participant >= event.nombre_participant_max) {
      setMessage("Désolé, l'événement est complet.");
      return;
    }

    const formData = new FormData();
    formData.append('event', id);
    formData.append('player', user.id);
    formData.append('deck', deck);

    try {
      const token = localStorage.getItem("access_token"); // récupère le token

      const response = await axios.post('http://localhost:8000/api/inscriptions/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}` // 🔥 AJOUT DU TOKEN
        }
      });

      console.log('Inscription créée :', response.data);
      setDeck('');
      setMessage('Inscription réussie!');
      setIsRegistered(true);
    } catch (error) {
      console.error('Erreur:', error.response?.data || error.message);
      setMessage('Erreur lors de l\'inscription.');
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
      console.error('Erreur:', error.response?.data || error.message);
      setMessage('Erreur lors de la soumission de l\'avis.');
    }
  };

  if (loading) return <div className="text-center py-4">Chargement...</div>;
  if (error) return <div className="text-center py-4 text-red-500">Erreur : {error}</div>;
  if (!event) return <div className="text-center py-4">Événement introuvable</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="bg-mana-white text-mana-black border border-mana-gold shadow-magic p-6 rounded-lg mb-6">
        <h1 className="text-3xl font-bold font-magic text-mana-gold mb-4">{event.nom}</h1>
        <img src={event.banner_img} alt={event.nom} className="w-full h-64 object-cover rounded mb-4 border border-mana-gold" />
        <p className="text-lg mb-2">{event.description}</p>
        <p className="text-mana-purple"><span className="font-magic font-semibold">Auteur:</span> {event.author.username}</p>
        <p className="text-mana-purple"><span className="font-magic font-semibold">Format:</span> {event.format}</p>
        {event.format == "commander" ? <p className="text-mana-purple"><span className="font-magic font-semibold">Bracket:</span> {event.bracket_level}</p> : ''}
        <p className="text-mana-purple"><span className="font-magic font-semibold">Participants:</span> {event.nombre_participant} / {event.nombre_participant_max}</p>
        <p className="text-mana-purple"><span className="font-magic font-semibold">Date:</span> {formatDate(event.date)}</p>
        <p className="text-mana-purple"><span className="font-magic font-semibold">{event.IRL ? 'IRL' : 'En Ligne'}</span> {event.IRL ? 'Oui' : ''}</p>
        {event.IRL ? '<p className="text-mana-purple"><span className="font-magic font-semibold">Lieu:</span> {event.lieux}</p>' : ''}
      </div>

      <div className="bg-mana-white border border-mana-gold shadow-magic p-6 rounded-lg mb-6">
        <h2 className="text-2xl font-bold font-magic text-mana-gold mb-4">Avis</h2>
        <div className="space-y-4">
          {avis.length === 0 ? (
            <p className="text-center text-mana-purple font-magic italic">Pas d'avis, soyez le premier à en laisser un !</p>
          ) : (
            avis.map(avi => (
              <div key={avi.id} className="p-4 border border-mana-gold rounded-lg">
                <p className="text-mana-purple"><span className="font-magic">Auteur:</span> {avi.author}</p>
                <p className="text-mana-purple"><span className="font-magic">Note:</span> {avi.positif ? 'Positif' : 'Négatif'}</p>
                <p className="text-mana-purple"><span className="font-magic">Commentaire:</span> {avi.commentaire}</p>
                <p className="text-mana-purple"><span className="font-magic">Posté le:</span> {formatDate(avi.date_poste)}</p>
              </div>
            ))
          )}
        </div>
      </div>

      {user && (
        <>
          <div className="bg-mana-white border border-mana-gold shadow-magic p-6 rounded-lg mb-6">
            <h2 className="text-2xl font-bold font-magic text-mana-gold mb-4">Donner un avis</h2>
            <form onSubmit={handleAvisSubmit} className="space-y-4">
              <label className="text-mana-purple font-magic">
                <input
                  type="checkbox"
                  checked={positif}
                  onChange={(e) => setPositif(e.target.checked)}
                  className="mr-2"
                />
                Avis positif ?
              </label>
              <textarea
                value={commentaire}
                onChange={(e) => setCommentaire(e.target.value)}
                placeholder="Votre commentaire..."
                className="w-full p-2 border border-mana-gold rounded text-mana-black"
              />
              <button
                type="submit"
                className="bg-mana-gold text-mana-black font-magic px-4 py-2 rounded shadow-magic hover:bg-mana-purple hover:text-mana-white transition"
              >
                Soumettre l'avis
              </button>
            </form>
          </div>

          <div className="bg-mana-white border border-mana-gold shadow-magic p-6 rounded-lg mb-6">
            <h2 className="text-2xl font-bold font-magic text-mana-gold mb-4">Inscription</h2>

            {(event.nombre_participant >= event.nombre_participant_max || isRegistered) ? (
              <div className="text-center text-mana-gold bg-mana-black rounded font-magic py-4 mt-4">
                <span>
                  {event.nombre_participant >= event.nombre_participant_max 
                    ? "Désolé, l'événement est complet." 
                    : "Vous êtes déjà inscrit à cet événement."}
                </span>
              </div>
            ) : (
              <form onSubmit={handleInscriptionSubmit} className="space-y-4">
                <div>
                  <label className="block text-mana-purple font-magic mb-2">Lien vers votre deck</label>
                  <input
                    type="url"
                    value={deck}
                    onChange={(e) => setDeck(e.target.value)}
                    placeholder="URL du deck"
                    className="w-full p-2 border border-mana-gold rounded text-mana-black"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="bg-mana-gold text-mana-black font-magic px-4 py-2 rounded shadow-magic hover:bg-mana-purple hover:text-mana-white transition"
                >
                  S'inscrire
                </button>
              </form>
            )}
          </div>
        </>
      )}
    </div>
  );
}