import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import CreateEventModal from '../components/CreateEventModal';
import CreateArticleModal from '../components/CreateArticleModal';
import UserInscriptions from '../components/UserInscriptions';
import UserCreatedEvents from '../components/UserCreatedEvents';
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

  // State for event creation modal
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [nom, setNom] = useState('');
  const [description, setDescription] = useState('');
  const [bracketLevel, setBracketLevel] = useState('1');
  const [format, setFormat] = useState('commander');
  const [bannerImg, setBannerImg] = useState(null);
  const [nombreParticipant, setNombreParticipant] = useState(0);
  const [date, setDate] = useState('');
  const [irl, setIrl] = useState(false);
  const [lieux, setLieux] = useState('');

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
        console.error("Erreur lors de la récupération de l'utilisateur :", error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
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

  const handleSubmitEvent = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('nom', nom);
    formData.append('description', description);
    formData.append('bracket_level', bracketLevel);
    formData.append('format', format);
    formData.append('banner_img', bannerImg);
    formData.append('nombre_participant_max', nombreParticipant);
    formData.append('date', date);
    formData.append('IRL', irl);
    formData.append('lieux', lieux);
    formData.append('author', user.id);

    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.post('http://localhost:8000/api/events/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        }
      });
      console.log('Event créé :', response.data);
      setMessage('Événement créé avec succès!');
      setModalIsOpen(false);
    } catch (error) {
      if (error.response) {
        console.error('Erreur:', error.response.data);
        setMessage('Erreur lors de la création de l\'événement.');
      } else {
        console.error('Erreur inconnue:', error.message);
        setMessage('Erreur inconnue lors de la création de l\'événement.');
      }
    }
  };

  const [refreshToggle, setRefreshToggle] = useState(false);

  const handleEventCreated = () => {
    setRefreshToggle(prev => !prev); // toggle force un effet useEffect
  };

  if (loading) return <div className="text-center py-4">Loading...</div>;
  if (error) return <div className="text-center py-4 text-red-500">Error: {error}</div>;
  if (!user) return <div className="text-center py-4">No user found</div>;

  return (
    <div className="flex justify-center">
      {/* Sidebar */}
      <div className="w-1/4 bg-gray-100 p-4 h-screen">
        <h1 className="text-2xl font-bold mb-4">Profil</h1>
        <button onClick={() => navigate("/")} className="bg-blue-500 text-white px-4 py-2 rounded mr-2">Home</button>
        {editMode ? (
          <form onSubmit={handleSubmitProfile} className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-2">Nom d'utilisateur</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Prénom</label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Nom</label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
              Mettre à jour le profil
            </button>
          </form>
        ) : (
          <div className="max-w-md mx-auto bg-white shadow-lg rounded-xl p-6 flex flex-col items-center space-y-4 h-3/4">
            {/* Avatar dans un carré arrondi */}
            <div className="w-40 h-40 rounded-lg overflow-hidden border-4 border-gray-200">
                <img
                src={`https://api.dicebear.com/9.x/rings/svg?seed=${user.username}`}
                alt="avatar"
                className="w-full h-full object-cover"
                />
            </div>

            {/* Infos utilisateur */}
            <div className="text-center space-y-1">
                <p className="text-gray-700">
                <span className="font-semibold">Nom d'utilisateur :</span> {user.username}
                </p>
                <p className="text-gray-700">
                <span className="font-semibold">Email :</span> {user.email}
                </p>
                <p className="text-gray-700">
                <span className="font-semibold">Prénom :</span> {user.first_name}
                </p>
                <p className="text-gray-700">
                <span className="font-semibold">Nom :</span> {user.last_name}
                </p>
            </div>

            {/* Bouton en bas */}
            <div className="w-full pt-4">
                <button
                onClick={() => setEditMode(true)}
                className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition"
                >
                ✏️ Modifier le profil
                </button>
            </div>
        </div>
        )}
      </div>

      {/* Dashboard */}
      <div className="w-3/4 p-4">
        <h1 className="text-2xl font-bold mb-4">Tableau de Bord</h1>
        <div className='w-1/4 flex justify-between'>
            {user.roles && user.roles.includes('Organisateur') && (
            <button
                onClick={() => setEventModalIsOpen(true)}
                className="bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-600"
            >
                Créer un Événement
            </button>
            )}

            {user.roles && user.roles.includes('Redacteur') && (
            <button
                onClick={() => setArticleModalIsOpen(true)}
                className="bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-600"
            >
                Créer un Article
            </button>
            )}
        </div>

        {user.roles && user.roles.includes('Organisateur') && <UserCreatedEvents refreshToggle={refreshToggle} />}

        {/* User Inscriptions */}
        <UserInscriptions user={user} />

        {/* Modal for event creation */}
        <CreateEventModal
          isOpen={eventModalIsOpen}
          onRequestClose={() => setEventModalIsOpen(false)}
          user={user}
          onEventCreated={handleEventCreated}
        />

        {/* Modal for article creation */}
        <CreateArticleModal
          isOpen={articleModalIsOpen}
          onRequestClose={() => setArticleModalIsOpen(false)}
          user={user}
        />
      </div>

      {message && <div className="text-center py-4 text-green-500">{message}</div>}
    </div>
  );
}
