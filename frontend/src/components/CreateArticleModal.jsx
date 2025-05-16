// CreateArticleModal.js
import React, { useState } from 'react';
import Modal from 'react-modal';
import axios from 'axios';

Modal.setAppElement('#root');

const CreateArticleModal = ({ isOpen, onRequestClose, user, onArticleCreated }) => {
  const [titre, setTitre] = useState('');
  const [categorie, setCategorie] = useState('news');
  const [contenu, setContenu] = useState('');
  const [imageBanner, setImageBanner] = useState(null);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('titre', titre);
    formData.append('categorie', categorie);
    formData.append('contenu', contenu);
    formData.append('image_banner', imageBanner);
    formData.append('auteur', user.id);

    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.post('http://localhost:8000/api/articles/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        }
      });
      console.log('Article créé :', response.data);
      setMessage('Article créé avec succès!');
      onRequestClose();
      onArticleCreated();
    } catch (error) {
      if (error.response) {
        console.error('Erreur:', error.response.data);
        setMessage('Erreur lors de la création de l\'article.');
      } else {
        console.error('Erreur inconnue:', error.message);
        setMessage('Erreur inconnue lors de la création de l\'article.');
      }
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Créer un Article"
    >
      <h2 className="text-2xl font-bold mb-4">Créer un Article</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-2">Titre</label>
          <input
            type="text"
            value={titre}
            onChange={(e) => setTitre(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Titre"
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-2">Catégorie</label>
          <select
            value={categorie}
            onChange={(e) => setCategorie(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="news">News</option>
            <option value="guide">Guide</option>
            <option value="avis">Avis</option>
          </select>
        </div>
        <div>
          <label className="block text-gray-700 mb-2">Contenu</label>
          <textarea
            value={contenu}
            onChange={(e) => setContenu(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Contenu"
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-2">Image de la bannière</label>
          <input
            type="file"
            onChange={(e) => setImageBanner(e.target.files[0])}
            className="w-full p-2 border rounded"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-600"
        >
          Créer l'article
        </button>
      </form>
      {message && <div className="text-center py-4 text-green-500">{message}</div>}
    </Modal>
  );
};

export default CreateArticleModal;
