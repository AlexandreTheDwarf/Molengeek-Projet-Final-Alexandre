import { useState, useEffect } from "react";
import axios from "axios";

function Home({ setMessage }) {
  const [user, setUser] = useState(null);

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

    fetchUser();
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
    </div>
  );
}

export default Home;
