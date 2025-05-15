import { useState, useEffect } from "react";
import axios from "axios";

function Home({ setMessage }) {
  const [user, setUser] = useState(null);
  const [earlyEvents, setEarlyEvents] = useState([]);
  const [lastChanceEvents, setLastChanceEvents] = useState([]);
  const [latestArticles, setLatestArticles] = useState([]);

  useEffect(() => {
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
    <div>
      <h1>Homepage</h1>
      {user ? (
        <div>
          <a href="/register"><button>Inscription</button></a>
          <a href="/login"><button>Connexion</button></a>
          <a href="/articles/"><button>All Articles</button></a>
          <a href="/article/create"><button>Create Article</button></a>
          <a href="/event/"><button>All Events</button></a>
          <a href="/event/create"><button>Create Event</button></a>
          <a href="/event/avis/create"><button>Create Avis</button></a>
          <a href="/event/inscriptions/create"><button>Create Inscriptions</button></a>
          <button onClick={logout}>Logout</button>
          <h2>Bienvenue {user.username} !</h2>
          <p>ID utilisateur : {user.id}</p>
        </div>
      ) : (
        <div>
          <a href="/register"><button>Inscription</button></a>
          <a href="/login"><button>Connexion</button></a>
          <a href="/articles/"><button>All Articles</button></a>
          <a href="/article/create"><button>Create Article</button></a>
          <a href="/event/"><button>All Events</button></a>
          <a href="/event/create"><button>Create Event</button></a>
          <a href="/event/avis/create"><button>Create Avis</button></a>
          <a href="/event/inscriptions/create"><button>Create Inscriptions</button></a>
        </div>
      )}

      {/* Hero Section */}
      <section className="hero-section">
        <h2>Welcome to Our Community</h2>
        <p>Discover the latest events and articles from our community.</p>
      </section>

      {/* Early Events Section */}
      <section className="early-events-section">
        <h2>Early Events</h2>
        <div className="events-list">
          {earlyEvents.map(event => (
            <div key={event.id} className="event-card">
              <h3>{event.nom}</h3>
              <img src={event.banner_img} alt={event.nom} />
              <p>{event.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Last Chance Events Section */}
      <section className="last-chance-events-section">
        <h2>Last Chance Events</h2>
        <div className="events-list">
          {lastChanceEvents.map(event => (
            <div key={event.id} className="event-card">
              <h3>{event.nom}</h3>
              <img src={event.banner_img} alt={event.nom} />
              <p>{event.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Latest Articles Section */}
      <section className="latest-articles-section">
        <h2>Latest Articles</h2>
        <div className="articles-list">
          {latestArticles.map(article => (
            <div key={article.id} className="article-card">
              <h3>{article.titre}</h3>
              <img src={article.image_banner} alt={article.titre} />
              <p>{article.contenu}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;
