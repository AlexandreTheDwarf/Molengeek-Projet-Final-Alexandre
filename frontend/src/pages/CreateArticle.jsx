// frontend/src/pages/CreateArticle.jsx
import { useState } from 'react'
import axios from 'axios'

export default function CreateArticle() {
  const [titre, setTitre] = useState('')
  const [categorie, setCategorie] = useState('news')
  const [contenu, setContenu] = useState('')
  const [imageBanner, setImageBanner] = useState(null)

  const handleSubmit = async (e) => {
  e.preventDefault();
  const formData = new FormData();
  formData.append('titre', titre);
  formData.append('categorie', categorie);
  formData.append('contenu', contenu);
  formData.append('image_banner', imageBanner);
  formData.append('auteur', 1); // temporairement en dur

  try {
    const response = await axios.post('http://localhost:8000/api/articles/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'X-CSRFToken': 'your_csrf_token_here' // Include CSRF token if needed
      }
    });
    console.log('Article créé :', response.data);
  } catch (error) {
    if (error.response) {
      console.error('Erreur:', error.response.data);
    } else {
      console.error('Erreur inconnue:', error.message);
    }
  }
};



  return (
    <form onSubmit={handleSubmit}>
      <input value={titre} onChange={(e) => setTitre(e.target.value)} placeholder="Titre" />
      <select value={categorie} onChange={(e) => setCategorie(e.target.value)}>
        <option value="news">News</option>
        <option value="guide">Guide</option>
        <option value="avis">Avis</option>
      </select>
      <textarea value={contenu} onChange={(e) => setContenu(e.target.value)} placeholder="Contenu" />
      <input type="file" onChange={(e) => setImageBanner(e.target.files[0])} />
      <button type="submit">Créer l'article</button>
    </form>
  )
}
