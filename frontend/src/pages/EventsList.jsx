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
        console.log('Events from API:', response.data); // Log des données reçues
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
    console.log('Filtered events:', filtered); // Log des événements filtrés
    setFilteredEvents(filtered);
  }, [events, locationFilter]);


  const handleEventClick = (eventId) => {
    navigate(`/events/${eventId}`);
  };

  if (loading) return <div className="text-center py-4">Loading...</div>;
  if (error) return <div className="text-center py-4 text-red-500">Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Events</h1>

      {/* Filter for location */}
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Filtrer par localisation:</label>
        <select
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="all">Tous</option>
          <option value="IRL">En Présentiel (IRL)</option>
          <option value="online">En Ligne</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map(event => (
          <div
            key={event.id}
            data-aos="fade-up"
            className="bg-white p-4 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow flex flex-col"
          >
            <h2 className="text-xl font-semibold mb-2">{event.nom}</h2>
            <img
              src={event.banner_img}
              alt={event.nom}
              className="w-full h-48 object-cover rounded mb-4"
              onClick={() => handleEventClick(event.id)}
            />
            <p className="text-gray-700 mb-1"><span className="font-semibold">Date :</span> {new Date(event.date).toLocaleDateString()}</p>
            <p className="text-gray-700 mb-4"><span className="font-semibold">Localisation :</span> {event.IRL ? 'En Présentiel' : 'En Ligne'}</p>

            <div className="mt-auto flex gap-2">
              <button
                onClick={() => handleEventClick(event.id)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
              >
                Plus d'infos
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
