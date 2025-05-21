import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login(props) {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });

    const navigate = useNavigate();

    const login = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/login/', formData);
            const accessToken = response.data.access_token;
            localStorage.setItem('access_token', accessToken);
            if (response.data.status === 'success') {
                props.setMessage(response.data.message);
                navigate('/');
            } else {
                props.setMessage(response.data.message);
            }
        } catch (error) {
            console.error("Login error:", error);
            props.setMessage("Échec de la connexion. Vérifie tes identifiants, niaa.");
        }
    };

    const change = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-mana-black font-magic">
            <div className="bg-mana-gold p-8 rounded-lg shadow-magic w-full max-w-md text-mana-white">
                {props.message.length > 0 && (
                    <p className="mb-4 text-center text-mana-gold font-semibold">{props.message}</p>
                )}
                <form onSubmit={login} className="space-y-6">
                    <div>
                        <label htmlFor="username" className="block mb-1 font-semibold">Username</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={change}
                            required
                            className="w-full px-4 py-2 rounded bg-mana-black border border-mana-white focus:outline-none focus:ring-2 focus:ring-mana-white text-mana-white"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block mb-1 font-semibold">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={change}
                            required
                            className="w-full px-4 py-2 rounded bg-mana-black border border-mana-white focus:outline-none focus:ring-2 focus:ring-mana-white text-mana-white"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-3 bg-mana-green text-mana-black font-bold rounded hover:bg-mana-blue hover:text-mana-white transition-colors duration-300"
                    >
                        Connexion
                    </button>
                    <div className="text-center mt-4">
                        <span className="text-sm text-mana-white">Pas encore inscrit·e ? </span>
                        <button
                            onClick={() => navigate("/register")}
                            className="text-mana-white bg-mana-red hover:text-mana-black hover:bg-mana-white px-2 py-1 rounded transition-colors duration-200 font-medium"
                        >
                            Crée ton compte
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;
