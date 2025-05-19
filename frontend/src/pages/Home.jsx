import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AOS from 'aos';
import 'aos/dist/aos.css';

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(dateString).toLocaleDateString(undefined, options);
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
        setEarlyEvents(res.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des early events :", error);
      }
    };

    const fetchLastChanceEvents = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/api/events/last-chance/");
        setLastChanceEvents(res.data);
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
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Homepage</h1>

      {/* Hero Section */}
      <section
        className="relative h-[400px] md:h-[500px] lg:h-[600px] flex items-center justify-center text-white text-center overflow-hidden rounded-lg mb-6"
        data-aos="fade-down"
      >
        <img
          src="https://source.unsplash.com/1600x900/?community,event"
          alt="Hero"
          className="absolute w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        <div className="relative z-10 p-4">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Rejoins notre Communauté !</h2>
          <p className="text-lg md:text-xl">Découvre des événements, partage ta passion et connecte-toi aux autres.</p>
        </div>
      </section>

      {/* Early Events Section */}
      <section className="mb-6" data-aos="fade-up">
        <h2 className="text-2xl font-bold mb-4">Early Events</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {earlyEvents.map(event => (
            <div key={event.id} className="bg-white p-4 rounded-lg shadow-md" data-aos="zoom-in">
              <img src={event.banner_img} alt={event.nom} className="w-full h-48 object-cover rounded mb-2" />
              <h3 className="text-xl font-semibold">{event.nom}</h3>
              <p>Date de l'event: {formatDate(event.date)}</p>
              <p>Participants : <span className={event.nombre_participant_max - event.nombre_participant <= 5 ? "text-red-600 font-bold" : ""}>{event.nombre_participant}/{event.nombre_participant_max}</span></p>              
              <p>Format: {event.format}</p>
              {event.format === "commander" && <p>Bracket: {event.bracket_level}</p>}
              <button
                onClick={() => navigate(`/events/${event.id}`)}
                className="mt-2 bg-blue-500 text-white px-4 py-2 rounded transition-transform duration-300 ease-in-out hover:scale-105"
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Last Chance Events Section */}
      <section className="mb-6" data-aos="fade-up">
        <h2 className="text-2xl font-bold mb-4">Last Chance Events</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {lastChanceEvents.map(event => (
            <div key={event.id} className="bg-white p-4 rounded-lg shadow-md" data-aos="zoom-in">
              <img src={event.banner_img} alt={event.nom} className="w-full h-48 object-cover rounded mb-2" />
              <h3 className="text-xl font-semibold">{event.nom}</h3>
              <p>Date de l'event: {formatDate(event.date)}</p>
              <p>Participants: <span className="text-red-600 font-bold">{event.nombre_participant}/{event.nombre_participant_max}</span></p>
              <p>Format: {event.format}</p>
              {event.format === "commander" && <p>Bracket Level : {event.bracket_level}</p>}
              <button
                onClick={() => navigate(`/events/${event.id}`)}
                className="mt-2 bg-blue-500 text-white px-4 py-2 rounded transition-transform duration-300 ease-in-out hover:scale-105"
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Latest Articles Section */}
      <section data-aos="fade-up">
        <h2 className="text-2xl font-bold mb-4">Latest Articles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {latestArticles.map(article => (
            <div key={article.id} className="bg-white p-4 rounded-lg shadow-md" data-aos="zoom-in">
              <img src={article.image_banner} alt={article.titre} className="w-full h-48 object-cover object-top rounded mb-2" />
              <h3 className="text-xl font-semibold">{article.titre}</h3>
              <p>{article.categorie}</p>
              <button
                onClick={() => navigate(`/articles/${article.id}`)}
                className="mt-2 bg-blue-500 text-white px-4 py-2 rounded transition-transform duration-300 ease-in-out hover:scale-105"
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;
