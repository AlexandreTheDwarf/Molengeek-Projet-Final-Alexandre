import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';

Modal.setAppElement('#root');

const ManageInscriptionsModal = ({ isOpen, onRequestClose, eventId, onInscriptionsUpdated }) => {
  const [inscriptions, setInscriptions] = useState([]);
  const [eventData, setEventData] = useState(null);
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

      fetchInscriptions();

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
      className="max-w-2xl mx-auto mt-20 bg-mana-white p-6 rounded-lg shadow-magic border border-mana-gold border-opacity-60 outline-none"
      overlayClassName="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-start"
    >
      <h2 className="text-3xl font-magic font-bold mb-6 text-mana-gold drop-shadow-magic">👥 Gérer les Inscriptions</h2>

      {loading ? (
        <p className="text-mana-black italic">Chargement des âmes inscrites...</p>
      ) : error ? (
        <p className="text-mana-red font-semibold">Erreur : {error}</p>
      ) : (
        <>
          <div className="mb-4">
            <label htmlFor="filterStatus" className="mr-3 font-semibold text-mana-black">Filtrer par statut :</label>
            <select
              id="filterStatus"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-mana-gold rounded px-3 py-1 bg-mana-white text-mana-black shadow-inner focus:outline-none focus:ring-2 focus:ring-mana-gold"
            >
              <option value="all">Tous</option>
              <option value="en_attente">En attente</option>
              <option value="valide">Validé</option>
              <option value="refuse">Refusé</option>
            </select>
          </div>

          {filteredInscriptions.length === 0 ? (
            <p className="text-mana-black italic">Aucune inscription pour ce filtre 💡</p>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto pr-3 scrollbar-thin scrollbar-thumb-mana-gold scrollbar-track-mana-white">
              {filteredInscriptions.map((inscription) => (
                <div key={inscription.id} className="bg-mana-white border border-mana-gold rounded p-4 shadow-magic">
                  <p className="text-mana-black font-semibold">Utilisateur : <span className="font-normal">{inscription.player.username}</span></p>
                  <p className="text-mana-black font-semibold"> Deck :{' '}<a href={inscription.deck} target="_blank" rel="noopener noreferrer" className="text-mana-gold hover:underline"> {inscription.deck}</a> </p>
                  <p className="text-mana-black font-semibold">Statut : <span className="font-normal capitalize">{inscription.etat}</span></p>
                  <div className="flex gap-3 mt-3">
                    <button
                      onClick={() => handleUpdateInscriptionStatus(inscription.id, 'valide')}
                      className="bg-mana-green hover:bg-mana-green/80 text-mana-white px-4 py-1 rounded shadow-magic transition"
                    >
                      ✅ Valider
                    </button>
                    <button
                      onClick={() => handleUpdateInscriptionStatus(inscription.id, 'refuse')}
                      className="bg-mana-red hover:bg-mana-red/80 text-mana-white px-4 py-1 rounded shadow-magic transition"
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

      <div className="mt-8 text-right">
        <button
          onClick={onRequestClose}
          className="bg-mana-gold text-mana-black px-5 py-2 rounded hover:bg-mana-gold/80 font-magic font-semibold transition shadow-magic"
        >
          Fermer
        </button>
      </div>
    </Modal>
  );
};

export default ManageInscriptionsModal;
