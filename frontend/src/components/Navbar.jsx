import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import axios from "axios"

const Navbar = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("access_token")
        if (!token) return
        const res = await axios.get("http://127.0.0.1:8000/api/get_user/", {
          headers: { Authorization: `Bearer ${token}` },
        })
        setUser(res.data.user)
      } catch (err) {
        console.error("Erreur récupération user dans Navbar :", err)
      }
    }
    fetchUser()
  }, [])

  const logout = () => {
    localStorage.removeItem("access_token")
    axios
      .post("http://127.0.0.1:8000/api/logout/")
      .then(() => {
        setUser(null)
        navigate("/")
      })
      .catch((err) => console.error("Erreur déconnexion :", err))
  }

  return (
    <nav className="bg-mana-black text-mana-white font-magic shadow-magic px-6 py-4 mb-6">
      <div className="container mx-auto flex flex-wrap items-center justify-between">
        <div
          onClick={() => navigate("/")}
          className="cursor-pointer text-2xl font-bold text-mana-gold hover:text-mana-white transition-colors duration-300 select-none"
          title="Retour à l'accueil"
        >
          🧙‍♂️ EventMaster
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => navigate("/")}
            className="bg-mana-blue hover:bg-mana-gold text-mana-white px-5 py-2 rounded shadow-inner transition-all duration-300 font-semibold"
          >
            Accueil
          </button>
          <button
            onClick={() => navigate("/articles/")}
            className="bg-mana-green hover:bg-mana-gold text-mana-white px-5 py-2 rounded shadow-inner transition-all duration-300 font-semibold"
          >
            Articles
          </button>
          <button
            onClick={() => navigate("/events/")}
            className="bg-mana-red hover:bg-mana-gold text-mana-white px-5 py-2 rounded shadow-inner transition-all duration-300 font-semibold"
          >
            Événements
          </button>

          {!user ? (
            <button
              onClick={() => navigate("/login")}
              className="bg-mana-gold hover:bg-mana-blue text-mana-black px-5 py-2 rounded shadow-inner transition-all duration-300 font-semibold"
            >
              Connexion
            </button>
          ) : (
            <>
              <button
                onClick={() => navigate("/profil")}
                className="bg-mana-purple hover:bg-mana-gold text-mana-white px-5 py-2 rounded shadow-inner transition-all duration-300 font-semibold"
              >
                Profil
              </button>
              <button
                onClick={logout}
                className="bg-mana-gold hover:bg-mana-black text-mana-white px-5 py-2 rounded shadow-inner transition-all duration-300 font-semibold"
              >
                Déconnexion
              </button>
            </>
          )}
        </div>
      </div>

      {user && (
        <div className="container mx-auto mt-3 text-mana-gold text-sm font-semibold select-none">
          Bienvenue <span>{user.username}</span> !
        </div>
      )}
    </nav>
  )
}

export default Navbar
