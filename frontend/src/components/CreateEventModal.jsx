// CreateEventModal.js
import React, { useState } from 'react';
import Modal from 'react-modal';
import axios from 'axios';

Modal.setAppElement('#root');

const CreateEventModal = ({ isOpen, onRequestClose, user, onEventCreated }) => {
  const [nom, setNom] = useState('');
  const [description, setDescription] = useState('');
  const [bracketLevel, setBracketLevel] = useState('1');
  const [format, setFormat] = useState('commander');
  const [bannerImg, setBannerImg] = useState(null);
  const [nombreParticipant, setNombreParticipant] = useState(0);
  const [date, setDate] = useState('');
  const [irl, setIrl] = useState(false);
  const [lieux, setLieux] = useState('');
  const [message, setMessage] = useState('');

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
      if (onEventCreated) {
        onEventCreated(); // ⚡️ Appelle la fonction pour rafraîchir la liste
      }
      onRequestClose();
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

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Créer un Événement"
    >
      <h2 className="text-2xl font-bold mb-4">Créer un Événement</h2>
      <form onSubmit={handleSubmitEvent} className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-2">Nom</label>
          <input
            type="text"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Nom"
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-2">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Description"
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-2">Niveau de Bracket</label>
          <select
            value={bracketLevel}
            onChange={(e) => setBracketLevel(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="1">Niveau 1</option>
            <option value="2">Niveau 2</option>
            <option value="3">Niveau 3</option>
            <option value="4">Niveau 4</option>
            <option value="5">Niveau 5</option>
          </select>
        </div>
        <div>
          <label className="block text-gray-700 mb-2">Format</label>
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="commander">Commander</option>
            <option value="modern">Modern</option>
            <option value="standard">Standard</option>
          </select>
        </div>
        <div>
          <label className="block text-gray-700 mb-2">Image de la bannière</label>
          <input
            type="file"
            onChange={(e) => setBannerImg(e.target.files[0])}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-2">Nombre de Participants Maximum</label>
          <input
            type="number"
            value={nombreParticipant}
            onChange={(e) => setNombreParticipant(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Nombre de participants"
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-2">Date</label>
          <input
            type="datetime-local"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-2">
            <input
              type="checkbox"
              checked={irl}
              onChange={(e) => setIrl(e.target.checked)}
              className="mr-2"
            />
            IRL
          </label>
        </div>
        <div>
          <label className="block text-gray-700 mb-2">Lieux</label>
          <input
            type="text"
            value={lieux}
            onChange={(e) => setLieux(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Lieux"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-600"
        >
          Créer l'événement
        </button>
      </form>
      {message && <div className="text-center py-4 text-green-500">{message}</div>}
    </Modal>
  );
};

export default CreateEventModal;
