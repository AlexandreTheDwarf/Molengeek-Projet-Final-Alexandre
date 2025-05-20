import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AOS from 'aos';
import 'aos/dist/aos.css';

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const filterEventsByDate = (events) => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return events.filter(event => {
    const eventDate = new Date(event.date);
    const eventDay = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());
    return eventDay >= today;
  });
};

function Home({ setMessage }) {
  const [user, setUser] = useState(null);
  const [earlyEvents, setEarlyEvents] = useState([]);
  const [lastChanceEvents, setLastChanceEvents] = useState([]);
  const [latestArticles, setLatestArticles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 800, once: true });

    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const res = await axios.get("http://127.0.0.1:8000/api/get_user/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data.user);
      } catch (error) {
        console.error("Erreur lors de la récupération de l'utilisateur :", error);
      }
    };

    const fetchEarlyEvents = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/api/events/early/");
        const filteredEvents = filterEventsByDate(res.data);
        setEarlyEvents(filteredEvents);
      } catch (error) {
        console.error("Erreur lors de la récupération des early events :", error);
      }
    };

    const fetchLastChanceEvents = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/api/events/last-chance/");
        const filteredEvents = filterEventsByDate(res.data);
        setLastChanceEvents(filteredEvents);
      } catch (error) {
        console.error("Erreur lors de la récupération des last chance events :", error);
      }
    };

    const fetchLatestArticles = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/api/articles/latest/");
        setLatestArticles(res.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des derniers articles :", error);
      }
    };

    fetchUser();
    fetchEarlyEvents();
    fetchLastChanceEvents();
    fetchLatestArticles();
  }, []);

  const logout = () => {
    localStorage.removeItem("access_token");
    axios
      .post("http://127.0.0.1:8000/api/logout/")
      .then((res) => setMessage(res.data.message))
      .catch((err) => console.log(err));
    setUser(null);
  };

  return (
    <div className="min-h-screen bg-mana-black font-magic text-mana-white container mx-auto p-4">

      {/* Hero Section */}
      <section
        className="relative h-[400px] md:h-[500px] lg:h-[600px] flex items-center justify-center text-center overflow-hidden rounded-lg mb-10"
        data-aos="fade-down"
      >
        <img
          src="src/assets/banner.png"
          alt="Hero"
          className="absolute w-full h-full object-cover object-center brightness-50"
        />
        <div className="relative z-10 p-4">
          <h2 className="text-5xl font-bold mb-4 text-mana-gold">Rejoins notre Communauté !</h2>
          <p className="text-xl max-w-xl mx-auto">Découvre des événements, partage ta passion et connecte-toi aux autres.</p>
        </div>
      </section>

      {/* Early Events Section */}
      <section className="mb-10" data-aos="fade-up">
        <h2 className="text-3xl font-bold mb-6 text-mana-gold">Early Events</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {earlyEvents.map(event => (
            <div key={event.id} className="bg-mana-gold p-6 rounded-lg shadow-magic cursor-pointer hover:shadow-xl transition-shadow flex flex-col justify-between" data-aos="zoom-in">
              <img src={event.banner_img} alt={event.nom} className="w-full h-48 object-cover rounded mb-4" />
              <h3 className="text-2xl font-semibold mb-2 text-mana-black">{event.nom}</h3>
              <p className="mb-1 text-mana-black">Date : {formatDate(event.date)}</p>
              <p className="mb-1 text-mana-black">
                Participants :{" "}
                <span className={event.nombre_participant_max - event.nombre_participant <= 5 ? "text-mana-red font-bold" : "text-mana-black"}>
                  {event.nombre_participant}/{event.nombre_participant_max}
                </span>
              </p>
              <p className="mb-1 text-mana-black">Format : {event.format}</p>
              {event.format === "commander" && <p className="mb-2 text-mana-black">Bracket : {event.bracket_level}</p>}
              <button
                onClick={() => navigate(`/events/${event.id}`)}
                className="mt-3 w-full bg-mana-black text-mana-gold font-bold py-2 rounded hover:bg-mana-white hover:text-mana-black transition-colors duration-300"
              >
                Voir détails
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Last Chance Events Section */}
      <section className="mb-10" data-aos="fade-up">
        <h2 className="text-3xl font-bold mb-6 text-mana-gold">Last Chance Events</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lastChanceEvents.map(event => (
            <div key={event.id} className="bg-mana-gold p-6 rounded-lg shadow-magic cursor-pointer hover:shadow-xl transition-shadow flex flex-col justify-between" data-aos="zoom-in">
              <img src={event.banner_img} alt={event.nom} className="w-full h-48 object-cover rounded mb-4" />
                <h3 className="text-2xl font-semibold mb-2 text-mana-black">{event.nom}</h3>
                <p className="mb-1 text-mana-black">Date : {formatDate(event.date)}</p>
                <p className="mb-1 text-mana-red font-bold">Participants : {event.nombre_participant}/{event.nombre_participant_max}</p>
                <p className="mb-1 text-mana-black">Format : {event.format}</p>
                {event.format === "commander" && <p className="mb-2 text-mana-black">Bracket Level : {event.bracket_level}</p>}
              <button
                onClick={() => navigate(`/events/${event.id}`)}
                className="mt-3 w-full bg-mana-black text-mana-gold font-bold py-2 rounded hover:bg-mana-white hover:text-mana-black transition-colors duration-300"
              >
                Voir détails
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Latest Articles Section */}
      <section data-aos="fade-up">
        <h2 className="text-3xl font-bold mb-6 text-mana-gold">Derniers Articles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {latestArticles.map(article => (
            <div key={article.id} className="bg-mana-gold p-6 rounded-lg shadow-magic cursor-pointer hover:shadow-xl transition-shadow flex flex-col justify-between" data-aos="zoom-in">
              <img src={article.image_banner} alt={article.titre} className="w-full h-48 object-cover object-center rounded mb-4" />
              <h3 className="text-2xl font-semibold mb-2 text-mana-black">{article.titre}</h3>
              <div className="flex justify-between">
                <p className="mb-4 text-mana-black">{article.categorie}</p>
                <p className="mb-1 text-mana-black">Date : {formatDate(article.date_creation)}</p>
              </div>
              <button
                onClick={() => navigate(`/articles/${article.id}`)}
                className="w-full bg-mana-black text-mana-gold font-bold py-2 rounded hover:bg-mana-white hover:text-mana-black transition-colors duration-300"
              >
                Voir détails
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;
