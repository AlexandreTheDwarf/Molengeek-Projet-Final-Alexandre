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
    <nav className="bg-white shadow-md p-4 mb-4">
      <div className="container mx-auto flex flex-wrap gap-2 items-center justify-between">
        <div onClick={() => navigate("/")} className="cursor-pointer font-bold text-xl text-purple-700 hover:text-purple-900 transition">
          🧙‍♂️ EventMaster
        </div>

        <div className="flex flex-wrap gap-2">
          <button onClick={() => navigate("/")} className="bg-blue-500 text-white px-4 py-2 rounded transition-transform duration-300 ease-in-out hover:scale-105">
            Acceuil
          </button>
          <button onClick={() => navigate("/articles/")} className="bg-purple-500 text-white px-4 py-2 rounded transition-transform duration-300 ease-in-out hover:scale-105">
            Articles
          </button>
          <button onClick={() => navigate("/events/")} className="bg-yellow-500 text-white px-4 py-2 rounded transition-transform duration-300 ease-in-out hover:scale-105">
            Événements
          </button>

          {!user ? (
            <button onClick={() => navigate("/login")} className="bg-green-500 text-white px-4 py-2 rounded transition-transform duration-300 ease-in-out hover:scale-105">
              Connexion
            </button>
          ) : (
            <>
              <button onClick={() => navigate("/profil")} className="bg-indigo-500 text-white px-4 py-2 rounded transition-transform duration-300 ease-in-out hover:scale-105">
                Profil
              </button>
              <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded transition-transform duration-300 ease-in-out hover:scale-105">
                Déconnexion
              </button>
            </>
          )}
        </div>
      </div>

      {user && (
        <div className="container mx-auto mt-2 text-sm text-gray-700">
          <p>
            Bienvenue <span className="font-semibold">{user.username}</span> !
          </p>
        </div>
      )}
    </nav>
  )
}

export default Navbar
