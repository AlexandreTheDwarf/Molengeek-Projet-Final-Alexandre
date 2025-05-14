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
        <div>
            {props.message.length > 0 ? <p>{props.message}</p> : null}
            {error.length > 0 ? <p style={{ color: 'red' }}>{error}</p> : null}
            <form onSubmit={inscription}>
                <label htmlFor="username">Username</label>
                <input type="text" name="username" value={formData.username} onChange={change} />

                <label htmlFor="lastname">Last Name</label>
                <input type="text" name="lastname" value={formData.lastname} onChange={change} />

                <label htmlFor="firstname">First Name</label>
                <input type="text" name="firstname" value={formData.firstname} onChange={change} />

                <label htmlFor="email">Email</label>
                <input type="email" name="email" value={formData.email} onChange={change} />

                <label htmlFor="password">Password</label>
                <input type="password" name="password" value={formData.password} onChange={change} />

                <label htmlFor="confirmPassword">Confirm Password</label>
                <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={change} />

                <button type="submit">Inscription</button>
            </form>
        </div>
    );
}

export default Register;
