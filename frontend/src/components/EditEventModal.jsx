import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'axios';

Modal.setAppElement('#root');

const EditEventModal = ({ isOpen, onRequestClose, event, onUpdated }) => {
  const [formData, setFormData] = useState({
    nom: '',
    description: '',
    bracket_level: '1',
    format: 'commander',
    nombre_participant_max: 2,
    date: '',
    IRL: false,
    lieux: '',
  });

  useEffect(() => {
    if (event) {
      setFormData({
        nom: event.nom,
        description: event.description,
        bracket_level: event.bracket_level,
        format: event.format,
        nombre_participant_max: event.nombre_participant_max,
        date: event.date?.slice(0, 16), // format compatible avec input datetime-local
        IRL: event.IRL,
        lieux: event.lieux || '',
      });
    }
  }, [event]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('access_token');
      const payload = {
        ...formData,
        author: event.author,
      };
      await axios.put(`http://localhost:8000/api/events/${event.id}/`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });
      onUpdated();
      onRequestClose();
    } catch (err) {
      if (err.response) {
        console.error('Erreur lors de la modification de l’événement:', err.response.data);
      } else {
        console.error('Erreur inconnue:', err.message);
      }
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Modifier l'événement"
      className="max-w-lg mx-auto mt-20 p-6 bg-mana-gold rounded-lg border-2 border-mana-gold shadow-magic outline-none"
      overlayClassName="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-start z-50"
    >
      <h2 className="text-2xl font-magic font-bold mb-6 text-mana-black drop-shadow-md">
        ✨ Modifier l’événement ✨
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4 text-mana-black">
        <input
          name="nom"
          value={formData.nom}
          onChange={handleChange}
          className="w-full p-3 rounded border border-mana-gold bg-mana-white text-mana-black placeholder-mana-black/70 focus:outline-none focus:ring-2 focus:ring-mana-gold"
          placeholder="Nom"
          required
        />
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full p-3 rounded border border-mana-gold bg-mana-white text-mana-black placeholder-mana-black/70 focus:outline-none focus:ring-2 focus:ring-mana-gold"
          placeholder="Description"
          rows={4}
          required
        />
        <select
          name="bracket_level"
          value={formData.bracket_level}
          onChange={handleChange}
          className="w-full p-3 rounded border border-mana-gold bg-mana-white text-mana-black focus:outline-none focus:ring-2 focus:ring-mana-gold"
        >
          <option value="1">Niveau 1</option>
          <option value="2">Niveau 2</option>
          <option value="3">Niveau 3</option>
          <option value="4">Niveau 4</option>
          <option value="5">Niveau 5</option>
        </select>
        <select
          name="format"
          value={formData.format}
          onChange={handleChange}
          className="w-full p-3 rounded border border-mana-gold bg-mana-white text-mana-black focus:outline-none focus:ring-2 focus:ring-mana-gold"
        >
          <option value="commander">Commander</option>
          <option value="modern">Modern</option>
          <option value="standard">Standard</option>
          <option value="draft">Draft</option>
          <option value="sealed">Sealed</option>
        </select>
        <input
          type="number"
          name="nombre_participant_max"
          value={formData.nombre_participant_max}
          onChange={handleChange}
          min={1}
          className="w-full p-3 rounded border border-mana-gold bg-mana-white text-mana-black placeholder-mana-black/70 focus:outline-none focus:ring-2 focus:ring-mana-gold"
          required
        />
        <input
          type="datetime-local"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="w-full p-3 rounded border border-mana-gold bg-mana-white text-mana-black placeholder-mana-black/70 focus:outline-none focus:ring-2 focus:ring-mana-gold"
          required
        />
        <label className="flex items-center gap-3 text-mana-black font-semibold">
          <input
            type="checkbox"
            name="IRL"
            checked={formData.IRL}
            onChange={handleChange}
            className="w-5 h-5 text-mana-gold focus:ring-mana-gold border border-mana-gold rounded"
          />
          Événement en présentiel
        </label>
        {formData.IRL && (
          <input
            name="lieux"
            value={formData.lieux}
            onChange={handleChange}
            className="w-full p-3 rounded border border-mana-gold bg-mana-white text-mana-black placeholder-mana-black/70 focus:outline-none focus:ring-2 focus:ring-mana-gold"
            placeholder="Adresse"
            required
          />
        )}
        <button
          type="submit"
          className="w-full py-3 rounded bg-mana-black text-mana-gold hover:bg-mana-green/90 hover:text-mana-black font-magic font-bold hover:brightness-110 transition"
        >
          💾 Sauvegarder
        </button>
      </form>
    </Modal>
  );
};

export default EditEventModal;
