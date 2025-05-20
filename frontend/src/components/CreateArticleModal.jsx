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

    if (!imageBanner) {
      setMessage("❌ Merci de sélectionner une image.");
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(imageBanner.type)) {
      setMessage("❌ Format d'image non supporté. Utilise JPEG ou PNG.");
      return;
    }

    // Renommer l'image (ex: titre-timestamp.jpg)
    const extension = imageBanner.name.split('.').pop();
    const newFileName = `${titre.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${Date.now()}.${extension}`;
    const renamedFile = new File([imageBanner], newFileName, { type: imageBanner.type });

    const formData = new FormData();
    formData.append('titre', titre);
    formData.append('categorie', categorie);
    formData.append('contenu', contenu);
    formData.append('image_banner', renamedFile);
    formData.append('auteur', user.id); // utile seulement si le back l'attend

    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.post('http://localhost:8000/api/articles/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        }
      });

      setMessage('✨ Article créé avec succès !');
      onRequestClose();
      onArticleCreated();
    } catch (error) {
      if (error.response) {
        console.error('Erreur:', error.response.data);
        setMessage("❌ Erreur lors de la création de l'article.");
      } else {
        console.error('Erreur inconnue:', error.message);
        setMessage("❌ Erreur inconnue lors de la création de l'article.");
      }
    }
  };


  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Créer un Article"
      className="bg-mana-white border-4 border-mana-gold rounded-lg shadow-magic p-6 max-w-2xl mx-auto mt-20 font-magic"
      overlayClassName="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
    >
      <h2 className="text-3xl text-mana-gold drop-shadow mb-6 text-center">Créer un Article</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-mana-black mb-1">Titre</label>
          <input
            type="text"
            value={titre}
            onChange={(e) => setTitre(e.target.value)}
            className="w-full p-2 border border-mana-gold rounded bg-mana-white text-mana-black"
            placeholder="Titre de l'article"
          />
        </div>
        <div>
          <label className="block text-mana-black mb-1">Catégorie</label>
          <select
            value={categorie}
            onChange={(e) => setCategorie(e.target.value)}
            className="w-full p-2 border border-mana-gold rounded bg-mana-white text-mana-black"
          >
            <option value="news">News</option>
            <option value="guide">Guide</option>
            <option value="avis">Avis</option>
          </select>
        </div>
        <div>
          <label className="block text-mana-black mb-1">Contenu</label>
          <textarea
            value={contenu}
            onChange={(e) => setContenu(e.target.value)}
            className="w-full p-2 border border-mana-gold rounded bg-mana-white text-mana-black"
            placeholder="Écris ton article ici"
            rows="6"
          />
        </div>
        <div>
          <label className="block text-mana-black mb-1">Image de la bannière</label>
          <input
            type="file"
            onChange={(e) => setImageBanner(e.target.files[0])}
            className="w-full p-2 border border-mana-gold rounded bg-mana-white text-mana-black"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-mana-purple text-white py-2 px-4 rounded shadow-magic hover:bg-mana-gold hover:text-mana-black transition-all duration-300"
        >
          ✨ Créer l'article
        </button>
      </form>
      {message && (
        <div className="text-center py-4 text-mana-green text-lg">{message}</div>
      )}
    </Modal>
  );
};

export default CreateArticleModal;
