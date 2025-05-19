import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';

Modal.setAppElement('#root');

const ManageInscriptionsModal = ({ isOpen, onRequestClose, eventId, onInscriptionsUpdated }) => {
  const [inscriptions, setInscriptions] = useState([]);
  const [eventData, setEventData] = useState(null); // Pour récupérer les infos de l'event
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEventData = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const res = await axios.get(`http://127.0.0.1:8000/api/events/${eventId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEventData(res.data);
    } catch (err) {
      console.error("Erreur lors du chargement de l'événement :", err);
    }
  };

  const fetchInscriptions = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const res = await axios.get(`http://127.0.0.1:8000/api/events/${eventId}/inscriptions/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setInscriptions(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (eventId && isOpen) {
      setLoading(true);
      fetchEventData();
      fetchInscriptions();
    }
  }, [eventId, isOpen]);

  const handleUpdateInscriptionStatus = async (inscriptionId, newStatus) => {
    try {
      const token = localStorage.getItem("access_token");
      await axios.patch(`http://127.0.0.1:8000/api/inscriptions/${inscriptionId}/`, { etat: newStatus }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Rafraîchir les inscriptions dans la modale
      fetchInscriptions();

      // Notifier le parent que quelque chose a changé
      if (onInscriptionsUpdated) {
        onInscriptionsUpdated();
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error);
    }
  };

  const filteredInscriptions = inscriptions.filter(inscription =>
    filterStatus === 'all' || inscription.etat === filterStatus
  );

  const isFull = eventData && eventData.nombre_participant >= eventData.nombre_participant_max;

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Gérer les inscriptions"
      className="max-w-2xl mx-auto mt-20 bg-white p-6 rounded shadow-lg outline-none"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start"
    >
      <h2 className="text-2xl font-bold mb-4">👥 Gérer les Inscriptions</h2>

      {loading ? (
        <p>Chargement...</p>
      ) : error ? (
        <p className="text-red-500">Erreur : {error}</p>
      ) : (
        <>
          {/* Suppression du compteur pour alléger l'affichage */}
          {/* <p className={`mb-4 font-semibold ${
            isFull ? 'text-red-600' : 'text-green-600'
          }`}>
            📊 Places utilisées : {eventData.nombre_participant} / {eventData.nombre_participant_max}
          </p> */}

          <div className="mb-4">
            <label htmlFor="filterStatus" className="mr-2 font-semibold">Filtrer par statut :</label>
            <select
              id="filterStatus"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border rounded px-2 py-1"
            >
              <option value="all">Tous</option>
              <option value="en_attente">En attente</option>
              <option value="valide">Validé</option>
              <option value="refuse">Refusé</option>
            </select>
          </div>

          {filteredInscriptions.length === 0 ? (
            <p className="text-gray-600 italic">Aucune inscription pour ce filtre 💡</p>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
              {filteredInscriptions.map((inscription) => (
                <div key={inscription.id} className="bg-gray-50 p-4 rounded shadow-sm">
                  <p><strong>Utilisateur :</strong> {inscription.player.username}</p>
                  <p><strong>Deck :</strong> {inscription.deck}</p>
                  <p><strong>Statut :</strong> {inscription.etat}</p>
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => handleUpdateInscriptionStatus(inscription.id, 'valide')}
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                    >
                      ✅ Valider
                    </button>
                    <button
                      onClick={() => handleUpdateInscriptionStatus(inscription.id, 'refuse')}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      ❌ Refuser
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      <div className="mt-6 text-right">
        <button
          onClick={onRequestClose}
          className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
        >
          Fermer
        </button>
      </div>
    </Modal>
  )};

  export default ManageInscriptionsModal;

