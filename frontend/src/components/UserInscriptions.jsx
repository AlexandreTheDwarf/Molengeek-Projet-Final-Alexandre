import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

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
    AOS.init({ duration: 800, easing: 'ease-in-out', once: true });
  }, []);

  useEffect(() => {
    const fetchInscriptions = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const res = await axios.get("http://127.0.0.1:8000/api/get_user_inscriptions/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setInscriptions(res.data);
        AOS.refresh();  // On refresh AOS à chaque nouvelle data récupérée
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
    <div className="mt-8 px-6 py-6 bg-mana-black text-mana-white rounded-2xl shadow-magic border border-mana-gold font-magic">
      <h2 className="text-3xl font-bold text-mana-gold mb-6 text-center">
        🧙‍♂️ Mes Inscriptions
      </h2>

      {/* Filtres */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="block text-mana-gold mb-2 text-lg">🎯 Filtrer par statut :</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full p-3 bg-mana-white text-mana-black border border-mana-gold rounded-lg shadow-inner"
          >
            <option value="all">🔮 Tous</option>
            <option value="en_attente">🕐 En attente</option>
            <option value="valide">✅ Validé</option>
            <option value="refuse">❌ Refusé</option>
          </select>
        </div>

        <div className="flex flex-col justify-end">
          <button
            onClick={() => setShowArchived(!showArchived)}
            className="bg-mana-gold text-mana-black px-5 py-3 rounded-full font-semibold hover:bg-mana-white transition duration-200"
          >
            {showArchived ? '📅 Voir les inscriptions à venir' : '📜 Voir les inscriptions passées'}
          </button>
        </div>
      </div>

      {/* Liste des inscriptions */}
      {filteredInscriptions.length > 0 ? (
        <div className="space-y-6">
          {filteredInscriptions.map(inscription => {
            const isPast = isEventPast(new Date(inscription.event.date));
            return (
              <div
                key={inscription.id}
                data-aos="fade-up"
                className={`p-6 rounded-xl shadow-lg border ${
                  isPast ? 'border-mana-red bg-mana-white/10' : 'border-mana-gold bg-mana-white/5'
                }`}
              >
                <Link
                  to={`/events/${inscription.event.id}`}
                  className="text-mana-blue font-bold text-xl hover:underline hover:text-mana-purple"
                >
                  {inscription.event.nom} 🔍
                </Link>
                <p className="mt-2">
                  <span className="font-semibold">📅 Date :</span>{' '}
                  {new Date(inscription.event.date).toLocaleDateString()}
                </p>
                <p>
                  <span className="font-semibold">📍 Lieu :</span>{' '}
                  {inscription.event.IRL ? inscription.event.lieux : 'En ligne'}
                </p>
                <p>
                  <span className="font-semibold">📊 Statut :</span>{' '}
                  {inscription.etat === 'en_attente' && '🕐 En attente'}
                  {inscription.etat === 'valide' && '✅ Validé'}
                  {inscription.etat === 'refuse' && '❌ Refusé'}
                </p>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-center text-mana-gold mt-6">
          🧞‍♂️ Aucune inscription trouvée pour ce filtre.
        </p>
      )}
    </div>
  );
};

export default UserInscriptions;
