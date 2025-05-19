import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import EditEventModal from '../components/EditEventModal';
import ManageInscriptionsModal from '../components/ManageInscriptionsModal';

const UserCreatedEvents = ({ refreshToggle }) => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [manageModalOpen, setManageModalOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);

  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const res = await axios.get("http://127.0.0.1:8000/api/get_user_events/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEvents(res.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des événements créés :", error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [refreshToggle]);

  const openEditModal = (event) => {
    setSelectedEvent(event);
    setEditModalOpen(true);
  };

  const openManageModal = (eventId) => {
    setSelectedEventId(eventId);
    setManageModalOpen(true);
  };

  const handleUpdated = () => {
    fetchEvents();
    setEditModalOpen(false);
  };

  const handleInscriptionsUpdated = () => {
    fetchEvents(); // recharge les événements avec les nouvelles données
  };

  const handleDelete = async (eventId) => {
    const confirmDelete = window.confirm("Es-tu sûr·e de vouloir supprimer cet événement ?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("access_token");
      await axios.delete(`http://127.0.0.1:8000/api/events/${eventId}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEvents(events.filter(e => e.id !== eventId));
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
    }
  };

  if (events.length === 0) return null;

  return (
    <div className="mt-6">
      <h2 className="text-xl font-bold mb-2">Mes événements organisés</h2>
      {events.map(event => (
        <div key={event.id} className="bg-white p-4 mb-2 rounded shadow">
          <p className="text-gray-700">
            <span className="font-semibold">Nom :</span>{' '}
            <Link to={`/events/${event.id}`} className="text-blue-600 hover:underline">{event.nom}</Link>
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">Date :</span>{' '}
            {new Date(event.date).toLocaleDateString()}
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">Inscriptions :</span>{' '}
            {event.nombre_participant} / {event.nombre_participant_max}
          </p>
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => openEditModal(event)}
              className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500"
            >
              ✏️ Modifier
            </button>
            <button
              onClick={() => handleDelete(event.id)}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              🗑 Supprimer
            </button>
            <button
              onClick={() => openManageModal(event.id)}
              className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
            >
              👥 Gérer les inscriptions
            </button>
          </div>
        </div>
      ))}

      {/* Modale d'édition d'événement */}
      <EditEventModal
        isOpen={editModalOpen}
        onRequestClose={() => setEditModalOpen(false)}
        event={selectedEvent}
        onUpdated={handleUpdated}
      />

      {/* Modale de gestion des inscriptions */}
      <ManageInscriptionsModal
        isOpen={manageModalOpen}
        onRequestClose={() => setManageModalOpen(false)}
        eventId={selectedEventId}
        onInscriptionsUpdated={handleInscriptionsUpdated}
      />
    </div>
  );
};

export default UserCreatedEvents;
