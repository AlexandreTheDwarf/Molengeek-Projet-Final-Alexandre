import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Register(props) {
    const [formData, setFormData] = useState({
        username: '',
        lastname: '',
        firstname: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const [error, setError] = useState('');

    const navigate = useNavigate();

    const inscription = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            setError("Les mots de passe ne correspondent pas.");
            return;
        }

        try {
            const response = await axios.post("http://127.0.0.1:8000/api/register/", formData);
            if (response.data.status === 'success') {
                props.setMessage(response.data.message);
                navigate('/');
            } else {
                props.setMessage(response.data.message);
            }
        } catch (error) {
            console.error("Erreur lors de l'inscription :", error);
            props.setMessage("Une erreur est survenue pendant l'inscription.");
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
                {error.length > 0 && (
                    <p className="mb-4 text-center text-mana-red font-semibold">{error}</p>
                )}
                <form onSubmit={inscription} className="space-y-5">
                    <div>
                        <label htmlFor="username" className="block mb-1 font-semibold">Username</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={change}
                            className="w-full px-4 py-2 rounded bg-mana-black border border-mana-gold focus:outline-none focus:ring-2 focus:ring-mana-gold text-mana-white"
                        />
                    </div>
                    <div>
                        <label htmlFor="lastname" className="block mb-1 font-semibold">Last Name</label>
                        <input
                            type="text"
                            name="lastname"
                            value={formData.lastname}
                            onChange={change}
                            className="w-full px-4 py-2 rounded bg-mana-black border border-mana-gold focus:outline-none focus:ring-2 focus:ring-mana-gold text-mana-white"
                        />
                    </div>
                    <div>
                        <label htmlFor="firstname" className="block mb-1 font-semibold">First Name</label>
                        <input
                            type="text"
                            name="firstname"
                            value={formData.firstname}
                            onChange={change}
                            className="w-full px-4 py-2 rounded bg-mana-black border border-mana-gold focus:outline-none focus:ring-2 focus:ring-mana-gold text-mana-white"
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block mb-1 font-semibold">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={change}
                            className="w-full px-4 py-2 rounded bg-mana-black border border-mana-gold focus:outline-none focus:ring-2 focus:ring-mana-gold text-mana-white"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block mb-1 font-semibold">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={change}
                            className="w-full px-4 py-2 rounded bg-mana-black border border-mana-gold focus:outline-none focus:ring-2 focus:ring-mana-gold text-mana-white"
                        />
                    </div>
                    <div>
                        <label htmlFor="confirmPassword" className="block mb-1 font-semibold">Confirm Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={change}
                            className="w-full px-4 py-2 rounded bg-mana-black border border-mana-gold focus:outline-none focus:ring-2 focus:ring-mana-gold text-mana-white"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-3 bg-mana-green text-mana-black font-bold rounded hover:bg-mana-white transition-colors duration-300"
                    >
                        Inscription
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Register;
