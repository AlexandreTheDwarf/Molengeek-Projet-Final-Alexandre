import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import EditEventModal from '../components/EditEventModal';
import ManageInscriptionsModal from '../components/ManageInscriptionsModal';

const filterEventsByDate = (events, showArchived) => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  return events.filter(event => {
    const eventDate = new Date(event.date);
    const eventDay = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());

    return showArchived ? eventDay < today : eventDay >= today;
  });
};

const UserCreatedEvents = ({ refreshToggle }) => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [manageModalOpen, setManageModalOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [showArchived, setShowArchived] = useState(false);

  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const res = await axios.get("http://127.0.0.1:8000/api/get_user_events/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const filteredEvents = filterEventsByDate(res.data, showArchived);
      setEvents(filteredEvents);
    } catch (error) {
      console.error("Erreur lors de la récupération des événements créés :", error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [refreshToggle, showArchived]);

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
    fetchEvents();
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

  const isEventPast = (eventDate) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const eventDay = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());

    return eventDay < today;
  };

  if (events.length === 0) return null;

  return (
    <div className="mt-6">
      <h2 className="text-xl font-bold mb-2">Mes événements organisés</h2>
      <button
        onClick={() => setShowArchived(!showArchived)}
        className="mb-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
      >
        {showArchived ? 'Voir les événements à venir' : 'Voir les événements passés'}
      </button>
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
            {!isEventPast(new Date(event.date)) && (
              <>
                <button
                  onClick={() => openEditModal(event)}
                  className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500"
                >
                  ✏️ Modifier
                </button>
                <button
                  onClick={() => openManageModal(event.id)}
                  className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                >
                  👥 Gérer les inscriptions
                </button>
              </>
            )}
            <button
              onClick={() => handleDelete(event.id)}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              🗑 Supprimer
            </button>
          </div>
        </div>
      ))}

      <EditEventModal
        isOpen={editModalOpen}
        onRequestClose={() => setEditModalOpen(false)}
        event={selectedEvent}
        onUpdated={handleUpdated}
      />

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
