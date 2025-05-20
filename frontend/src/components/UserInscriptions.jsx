// UserInscriptions.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const isEventPast = (eventDate) => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const eventDay = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());
  return eventDay < today;
};

const UserInscriptions = ({ user }) => {
  const [inscriptions, setInscriptions] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [showArchived, setShowArchived] = useState(false);

  useEffect(() => {
    const fetchInscriptions = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const res = await axios.get("http://127.0.0.1:8000/api/get_user_inscriptions/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setInscriptions(res.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des inscriptions :", error);
      }
    };

    fetchInscriptions();
  }, [user]);

  const filteredInscriptions = inscriptions.filter(inscription => {
    const isPast = isEventPast(new Date(inscription.event.date));
    if (showArchived && !isPast) return false;
    if (!showArchived && isPast) return false;
    if (filterStatus === 'all') return true;
    return inscription.etat === filterStatus;
  });

  return (
    <div className="mt-4">
      <h2 className="text-xl font-bold mb-2">Mes Inscriptions</h2>

      {/* Filtre Statut */}
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Filtrer par statut :</label>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="all">Tous</option>
          <option value="en_attente">En attente</option>
          <option value="valide">Validé</option>
          <option value="refuse">Refusé</option>
        </select>
      </div>

      {/* Bouton archivage */}
      <button
        onClick={() => setShowArchived(!showArchived)}
        className="mb-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
      >
        {showArchived ? 'Voir les inscriptions à venir' : 'Voir les inscriptions passées'}
      </button>

      {/* Liste des inscriptions */}
      {filteredInscriptions.length > 0 ? (
        filteredInscriptions.map(inscription => (
          <div key={inscription.id} className="bg-white p-4 mb-2 rounded shadow">
            <Link
              to={`/event/${inscription.event.id}`}
              className="text-blue-600 hover:underline hover:text-blue-800"
            >
              {inscription.event.nom} 🔍
            </Link>
            <p className="text-gray-700">
              <span className="font-semibold">Date :</span>{' '}
              {new Date(inscription.event.date).toLocaleDateString()}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Lieux :</span>{' '}
              {inscription.event.IRL ? inscription.event.lieux : 'En ligne'}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Statut :</span>{' '}
              {inscription.etat}
            </p>
          </div>
        ))
      ) : (
        <p className="text-gray-500">Aucune inscription trouvée.</p>
      )}
    </div>
  );
};

export default UserInscriptions;
