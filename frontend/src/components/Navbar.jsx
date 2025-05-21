import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) return;
        const res = await axios.get("http://127.0.0.1:8000/api/get_user/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data.user);
      } catch (err) {
        console.error("Erreur récupération user dans Navbar :", err);
      }
    };
    fetchUser();
  }, []);

  const logout = () => {
    localStorage.removeItem("access_token");
    axios
      .post("http://127.0.0.1:8000/api/logout/")
      .then(() => {
        setUser(null);
        navigate("/");
      })
      .catch((err) => console.error("Erreur déconnexion :", err));
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleNavigate = (path) => {
    navigate(path);
    setMenuOpen(false); // fermer le menu après navigation
  };

  return (
    <nav className="bg-mana-black text-mana-white font-magic shadow-magic px-6 py-4 relative">
      <div className="container mx-auto flex items-center justify-between">
        <div
          onClick={() => handleNavigate("/")}
          className="cursor-pointer text-2xl font-bold text-mana-gold hover:text-mana-white transition duration-300 select-none"
        >
          🧙‍♂️ EventMaster
        </div>

        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-mana-gold hover:text-mana-white transition duration-300">
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Menu desktop */}
        <div className="hidden md:flex gap-3">
          <button onClick={() => handleNavigate("/")} className="btn-nav bg-mana-blue">Accueil</button>
          <button onClick={() => handleNavigate("/articles/")} className="btn-nav bg-mana-green">Articles</button>
          <button onClick={() => handleNavigate("/events/")} className="btn-nav bg-mana-red">Événements</button>
          {!user ? (
            <button onClick={() => handleNavigate("/login")} className="btn-nav bg-mana-gold text-mana-black">Connexion</button>
          ) : (
            <>
              <button onClick={() => handleNavigate("/profil")} className="btn-nav bg-mana-purple">Profil</button>
              <button onClick={logout} className="btn-nav bg-mana-gold">Déconnexion</button>
            </>
          )}
        </div>
      </div>

      {/* Menu mobile */}
      {menuOpen && (
        <div className="md:hidden mt-4 flex flex-col gap-3">
          <button onClick={() => handleNavigate("/")} className="btn-nav-mobile bg-mana-blue">Accueil</button>
          <button onClick={() => handleNavigate("/articles/")} className="btn-nav-mobile bg-mana-green">Articles</button>
          <button onClick={() => handleNavigate("/events/")} className="btn-nav-mobile bg-mana-red">Événements</button>
          {!user ? (
            <button onClick={() => handleNavigate("/login")} className="btn-nav-mobile bg-mana-gold text-mana-black">Connexion</button>
          ) : (
            <>
              <button onClick={() => handleNavigate("/profil")} className="btn-nav-mobile bg-mana-purple">Profil</button>
              <button onClick={logout} className="btn-nav-mobile bg-mana-gold">Déconnexion</button>
            </>
          )}
        </div>
      )}

      {user && (
        <div className="container mx-auto mt-3 text-mana-gold text-sm font-semibold select-none text-center">
          Bienvenue <span>{user.username}</span> !
        </div>
      )}
    </nav>
  );
};

export default Navbar;
