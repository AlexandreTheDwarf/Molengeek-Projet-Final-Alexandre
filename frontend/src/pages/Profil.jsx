import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import CreateEventModal from '../components/CreateEventModal';
import CreateArticleModal from '../components/CreateArticleModal';
import UserInscriptions from '../components/UserInscriptions';
import UserCreatedEvents from '../components/UserCreatedEvents';
import UserCreatedArticles from '../components/UserCreatedArticles';
import { useNavigate } from "react-router-dom";

Modal.setAppElement('#root');

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
  });

  const [eventModalIsOpen, setEventModalIsOpen] = useState(false);
  const [articleModalIsOpen, setArticleModalIsOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const res = await axios.get("http://127.0.0.1:8000/api/get_user/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data.user);
        setFormData({
          username: res.data.user.username,
          email: res.data.user.email,
          first_name: res.data.user.first_name,
          last_name: res.data.user.last_name,
        });
        setLoading(false);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          navigate('/login', { state: { message: 'Désolé, veuillez vous reconnecter.' } });
        } else {
          console.error("Erreur lors de la récupération de l'utilisateur :", error);
          setError(error.message);
          setLoading(false);
        }
      }
    };

    fetchUser();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({...formData, [name]: value});
  };

  const handleSubmitProfile = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("access_token");
      const res = await axios.put("http://127.0.0.1:8000/api/update_user/", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data.user);
      setEditMode(false);
      setMessage('Profil mis à jour avec succès!');
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'utilisateur :", error);
      setMessage('Erreur lors de la mise à jour du profil.');
    }
  };

  const [refreshToggle, setRefreshToggle] = useState(false);
  const [refreshArticlesToggle, setRefreshArticlesToggle] = useState(false);

  const handleEventCreated = () => setRefreshToggle(prev => !prev);
  const handleArticleCreatedOrUpdated = () => setRefreshArticlesToggle(prev => !prev);

  if (loading) return <div className="text-mana-gold text-center py-6 font-magic text-lg animate-pulse">Chargement... ✨</div>;
  if (error) return <div className="text-red-600 text-center py-6 font-magic text-lg">Erreur : {error}</div>;
  if (!user) return <div className="text-mana-red text-center py-6 font-magic text-lg">Utilisateur introuvable</div>;

  return (
    <div className="flex flex-col md:flex-row font-magic bg-mana-black min-h-screen text-mana-white">
      {/* Sidebar */}
      <aside className="w-full md:w-1/4 bg-mana-gold p-6 rounded-lg shadow-magic flex flex-col items-center space-y-6 border border-mana-gold">
        <h1 className="text-3xl font-extrabold tracking-wide drop-shadow-md mb-6">Profil</h1>

        {editMode ? (
          <form onSubmit={handleSubmitProfile} className="w-full space-y-5">
            <label className="block">
              <span className="text-mana-gold mb-1 block">Nom d'utilisateur</span>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="w-full rounded-md border border-mana-gold bg-mana-black px-3 py-2 focus:outline-none focus:ring-2 focus:ring-mana-gold text-mana-white"
                required
              />
            </label>

            <label className="block">
              <span className="text-mana-gold mb-1 block">Email</span>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full rounded-md border border-mana-gold bg-mana-black px-3 py-2 focus:outline-none focus:ring-2 focus:ring-mana-gold text-mana-white"
                required
              />
            </label>

            <label className="block">
              <span className="text-mana-gold mb-1 block">Prénom</span>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleInputChange}
                className="w-full rounded-md border border-mana-gold bg-mana-black px-3 py-2 focus:outline-none focus:ring-2 focus:ring-mana-gold text-mana-white"
              />
            </label>

            <label className="block">
              <span className="text-mana-gold mb-1 block">Nom</span>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleInputChange}
                className="w-full rounded-md border border-mana-gold bg-mana-black px-3 py-2 focus:outline-none focus:ring-2 focus:ring-mana-gold text-mana-white"
              />
            </label>

            <button
              type="submit"
              className="w-full bg-mana-green hover:bg-mana-blue text-mana-white font-bold py-3 rounded-lg shadow-magic transition-all duration-300"
            >
              Mettre à jour le profil
            </button>
          </form>
        ) : (
          <div className="w-full bg-mana-black bg-opacity-50 rounded-xl p-6 flex flex-col items-center shadow-magic border border-mana-gold">
            <div className="w-40 h-40 rounded-lg overflow-hidden border-4 border-mana-gold mb-5">
              <img
                src={`https://api.dicebear.com/9.x/rings/svg?seed=${user.username}`}
                alt="avatar"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="text-center space-y-2">
              <p><span className="font-bold text-mana-gold">Nom d'utilisateur :</span> {user.username}</p>
              <p><span className="font-bold text-mana-gold">Email :</span> {user.email}</p>
              <p><span className="font-bold text-mana-gold">Prénom :</span> {user.first_name}</p>
              <p><span className="font-bold text-mana-gold">Nom :</span> {user.last_name}</p>
              {message && <div className="mt-4 text-green-400 font-semibold">{message}</div>}
            </div>

            <button
              onClick={() => setEditMode(true)}
              className="mt-6 w-full bg-mana-green hover:bg-mana-blue text-mana-white font-bold py-3 rounded-lg shadow-magic transition-all duration-300"
            >
              ✏️ Modifier le profil
            </button>
          </div>
        )}
      </aside>

      {/* Dashboard */}
      <main className="w-full md:w-3/4 p-8 bg-mana-black bg-opacity-70 rounded-lg ml-0 md:ml-6 shadow-magic border border-mana-gold">
        <h1 className="text-3xl font-extrabold text-mana-gold mb-6 tracking-wider drop-shadow-md">Tableau de Bord</h1>

        <div className="flex flex-wrap gap-4 mb-6">
          {user.roles && user.roles.includes('Organisateur') && (
            <button
              onClick={() => setEventModalIsOpen(true)}
              className="bg-mana-purple hover:bg-mana-blue text-mana-white font-bold py-2 px-5 rounded-lg shadow-magic transition-colors duration-300"
            >
              Créer un Événement
            </button>
          )}

          {user.roles && user.roles.includes('Redacteur') && (
            <button
              onClick={() => setArticleModalIsOpen(true)}
              className="bg-mana-purple hover:bg-mana-blue text-mana-white font-bold py-2 px-5 rounded-lg shadow-magic transition-colors duration-300"
            >
              Créer un Article
            </button>
          )}
        </div>

        {user.roles && user.roles.includes('Redacteur') && (
          <UserCreatedArticles refreshToggle={refreshArticlesToggle} />
        )}

        {user.roles && user.roles.includes('Organisateur') && (
          <UserCreatedEvents
            refreshToggle={refreshToggle}
            onArticleCreated={handleArticleCreatedOrUpdated}
            user={user}
          />
        )}

        <UserInscriptions user={user} />

        <CreateEventModal
          isOpen={eventModalIsOpen}
          onRequestClose={() => setEventModalIsOpen(false)}
          user={user}
          onEventCreated={handleEventCreated}
        />

        <CreateArticleModal
          isOpen={articleModalIsOpen}
          onRequestClose={() => setArticleModalIsOpen(false)}
          user={user}
          onArticleCreated={handleArticleCreatedOrUpdated}
        />
      </main>
    </div>
  );
}
