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

        // Check if passwords match
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            const response = await axios.post("http://127.0.0.1:8000/api/register/", formData);
            console.log(response.data);
            if (response.data.status === 'success') {
                props.setMessage(response.data.message);
                navigate('/');
            } else {
                props.setMessage(response.data.message);
            }
        } catch (error) {
            console.error("There was an error registering the user:", error);
            props.setMessage("An error occurred during registration.");
        }
    };

    const change = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                {props.message.length > 0 ? <p className="mb-4 text-center text-green-500">{props.message}</p> : null}
                {error.length > 0 ? <p className="mb-4 text-center text-red-500">{error}</p> : null}
                <form onSubmit={inscription} className="space-y-4">
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
                        <label htmlFor="lastname" className="block text-sm font-medium text-gray-700">Last Name</label>
                        <input
                            type="text"
                            name="lastname"
                            value={formData.lastname}
                            onChange={change}
                            className="w-full px-3 py-2 mt-1 border rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="firstname" className="block text-sm font-medium text-gray-700">First Name</label>
                        <input
                            type="text"
                            name="firstname"
                            value={formData.firstname}
                            onChange={change}
                            className="w-full px-3 py-2 mt-1 border rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
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
                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={change}
                            className="w-full px-3 py-2 mt-1 border rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
                    >
                        Inscription
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Register;
