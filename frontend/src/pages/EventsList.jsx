import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function EventsList() {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [locationFilter, setLocationFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 800 });
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/events/');
        setEvents(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    const now = new Date();
    const filtered = events.filter(event => {
      const eventDate = new Date(event.date);
      const isDateValid = eventDate > now;
      const isLocationValid =
        locationFilter === 'all' ||
        (locationFilter === 'IRL' && event.IRL) ||
        (locationFilter === 'online' && !event.IRL);

      return isDateValid && isLocationValid;
    });
    setFilteredEvents(filtered);
  }, [events, locationFilter]);

  const handleEventClick = (eventId) => {
    navigate(`/events/${eventId}`);
  };

  if (loading) return <div className="text-center py-6 font-magic text-mana-purple">Chargement des événements...</div>;
  if (error) return <div className="text-center py-6 font-magic text-red-600">Erreur : {error}</div>;

  return (
    <div className="container mx-auto p-6 bg-mana-white rounded-lg border border-mana-gold shadow-magic">
      <h1 className="text-3xl font-magic font-bold mb-6 text-mana-gold text-center">
        Événements à venir
      </h1>

      {/* Filtre */}
      <div className="mb-6 max-w-md mx-auto">
        <label className="block mb-2 font-magic text-mana-purple text-lg">Filtrer par localisation :</label>
        <select
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
          className="w-full p-2 rounded border border-mana-gold bg-mana-white text-mana-purple font-magic focus:outline-none focus:ring-2 focus:ring-mana-gold"
        >
          <option value="all">Tous</option>
          <option value="IRL">En Présentiel (IRL)</option>
          <option value="online">En Ligne</option>
        </select>
      </div>

      {/* Liste des événements */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.length === 0 && (
          <p className="text-mana-purple text-center col-span-full font-magic italic">
            Aucun événement à venir dans cette catégorie... Soyez le premier, mon héros, nia~
          </p>
        )}

        {filteredEvents.map(event => (
          <div
            key={event.id}
            data-aos="fade-up"
            className="bg-mana-white p-4 rounded-lg shadow-magic cursor-pointer border border-mana-gold hover:shadow-lg transition-shadow flex flex-col"
            onClick={() => handleEventClick(event.id)}
          >
            <h2 className="text-xl font-magic font-bold mb-2 text-mana-purple">{event.nom}</h2>
            <img
              src={event.banner_img}
              alt={event.nom}
              className="w-full h-48 object-cover rounded mb-4"
            />
            <p className="text-mana-purple mb-1"><span className="font-semibold">Date :</span> {new Date(event.date).toLocaleDateString()}</p>
            <p className="text-mana-purple mb-4"><span className="font-semibold">Localisation :</span> {event.IRL ? event.lieux : 'En Ligne'}</p>
            <button
              onClick={(e) => { e.stopPropagation(); handleEventClick(event.id); }}
              className="bg-mana-gold text-mana-black px-4 py-2 rounded shadow-magic hover:bg-yellow-400 transition font-magic font-semibold mt-auto"
            >
              Plus d'infos
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
