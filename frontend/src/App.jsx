import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Register from './pages/register'
import Login from './pages/login'
import Home from './pages/Home'
import CreateArticle from './pages/CreateArticle' 
import { useState } from 'react'
import CreateEvent from './pages/CreateEvent'
import ArticlesList from './pages/ArticlesList'
import ArticleDetail from './pages/ArticleDetail'
import EventsList from './pages/EventsList'
import EventDetail from './pages/EventDetail'
import ProfilePage from './pages/Profil'

function App() {
    const [message, setMessage] = useState('')
    const [user, setUser] = useState(null)

    return (
        <Router>
            <Routes>
                <Route path="/register" element={<Register message={message} setMessage={setMessage} />} />
                <Route path="/login" element={<Login message={message} setMessage={setMessage} />} />
                <Route path="/profil" element={<ProfilePage />} />
                <Route path="/" element={<Home user={user} setUser={setUser} setMessage={setMessage} message={message} />} />

                <Route path="/articles/" element={<ArticlesList />} />
                <Route path="/articles/:id" element={<ArticleDetail />} />
                <Route path="/article/create" element={<CreateArticle />} />

                <Route path="/event/" element={<EventsList />} />
                <Route path="/event/:id" element={<EventDetail />} />
                <Route path="/event/create" element={<CreateEvent />} />
            </Routes>
        </Router>
    )
}

export default App
