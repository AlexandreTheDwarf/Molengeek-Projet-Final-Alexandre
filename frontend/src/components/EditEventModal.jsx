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
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} contentLabel="Modifier l'événement">
      <h2 className="text-xl font-bold mb-4">Modifier l’événement</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input name="nom" value={formData.nom} onChange={handleChange} className="w-full p-2 border rounded" placeholder="Nom" />
        <textarea name="description" value={formData.description} onChange={handleChange} className="w-full p-2 border rounded" placeholder="Description" />
        <select name="bracket_level" value={formData.bracket_level} onChange={handleChange} className="w-full p-2 border rounded">
          <option value="1">Niveau 1</option>
          <option value="2">Niveau 2</option>
          <option value="3">Niveau 3</option>
          <option value="4">Niveau 4</option>
          <option value="5">Niveau 5</option>
        </select>
        <select name="format" value={formData.format} onChange={handleChange} className="w-full p-2 border rounded">
          <option value="commander">Commander</option>
          <option value="modern">Modern</option>
          <option value="standard">Standard</option>
        </select>
        <input type="number" name="nombre_participant_max" value={formData.nombre_participant_max} onChange={handleChange} className="w-full p-2 border rounded" />
        <input type="datetime-local" name="date" value={formData.date} onChange={handleChange} className="w-full p-2 border rounded" />
        <label className="flex items-center gap-2">
          <input type="checkbox" name="IRL" checked={formData.IRL} onChange={handleChange} />
          Événement en présentiel
        </label>
        {formData.IRL && (
          <input name="lieux" value={formData.lieux} onChange={handleChange} className="w-full p-2 border rounded" placeholder="Adresse" />
        )}
        <button type="submit" className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600">
          💾 Sauvegarder
        </button>
      </form>
    </Modal>
  );
};

export default EditEventModal;
