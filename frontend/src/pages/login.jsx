import axios from 'axios'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login(props) {

    const [formData, setFormData] = useState({
        'username': '',
        'password': '',
    })

    const navigate = useNavigate()

    const login = async (e) => {
        e.preventDefault()
        const response = await axios.post('http://127.0.0.1:8000/api/login/', formData)
        const accessToken = response.data.access_token
        // On récupère l'access token qu'on envoie dans la réponse
        localStorage.setItem('access_token', accessToken)
        // Et on le stock de le localStorage
        if (response.data.status === 'success') {
            props.setMessage(response.data.message)
            navigate('/')
        } else {
            props.setMessage(response.data.message)
        }
    }

    const change = (e) => {
        const {name, value} = e.target
        setFormData({...formData, [name]: value})
    }

    return(
        <div>
            {props.message.length > 0 ? <p>{props.message}</p> : null}
            <form onSubmit={login}>
                <label htmlFor="">Username</label>
                <input type="text" name='username' value={formData.username} onChange={(e) => change(e)} />
                <label htmlFor="">Password</label>
                <input type="password" name='password' value={formData.password} onChange={(e) => change(e)} />
                <button type="submit">Connexion</button>
            </form>
        </div>
    )
}

export default Login;