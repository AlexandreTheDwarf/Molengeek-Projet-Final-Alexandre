import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Register from './pages/register'
import Login from './pages/login'
import Home from './pages/Home'
import { useState } from 'react'
import ArticlesList from './pages/ArticlesList'
import ArticleDetail from './pages/ArticleDetail'
import EventsList from './pages/EventsList'
import EventDetail from './pages/EventDetail'
import ProfilePage from './pages/Profil'
import Layout from './components/Layout' // 👈 Ajout du Layout

function App() {
    const [message, setMessage] = useState('')
    const [user, setUser] = useState(null)

    return (
        <Router>
            <Routes>
                {/* Routes sans Layout */}
                <Route path="/register" element={<Register message={message} setMessage={setMessage} />} />
                <Route path="/login" element={<Login message={message} setMessage={setMessage} />} />

                {/* Routes avec Layout */}
                <Route element={<Layout />}>
                    <Route path="/" element={<Home user={user} setUser={setUser} setMessage={setMessage} message={message} />} />
                    <Route path="/profil" element={<ProfilePage />} />
                    <Route path="/articles/" element={<ArticlesList />} />
                    <Route path="/articles/:id" element={<ArticleDetail />} />
                    <Route path="/events/" element={<EventsList />} />
                    <Route path="/events/:id" element={<EventDetail />} />
                </Route>
            </Routes>
        </Router>
    )
}

export default App

