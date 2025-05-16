import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login(props) {
    const [formData, setFormData] = useState({
        'username': '',
        'password': '',
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
            props.setMessage("Login failed. Please check your credentials.");
        }
    };

    const change = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                {props.message.length > 0 ? <p className="mb-4 text-center text-red-500">{props.message}</p> : null}
                <form onSubmit={login} className="space-y-6">
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={change}
                            className="w-full px-3 py-2 mt-1 border rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={change}
                            className="w-full px-3 py-2 mt-1 border rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
                    >
                        Connexion
                    </button>
                    <div className="text-center mt-4">
                    <span className="text-sm text-gray-600">Pas encore inscrit·e ? </span>
                    <button
                        onClick={() => navigate("/register")}
                        className="text-indigo-600 hover:underline font-medium"
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
