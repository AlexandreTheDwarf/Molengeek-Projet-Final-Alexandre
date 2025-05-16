import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'axios';

Modal.setAppElement('#root');

const EditArticleModal = ({ isOpen, onRequestClose, article, onUpdated }) => {
  const [formData, setFormData] = useState({
    titre: '',
    categorie: 'news',
    contenu: '',
    image_banner: null,
  });

  useEffect(() => {
    if (article) {
      setFormData({
        titre: article.titre || '',
        categorie: article.categorie || 'news',
        contenu: article.contenu || '',
        image_banner: null,  // on ne pré-remplit pas le fichier
      });
    }
  }, [article]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image_banner') {
      setFormData(prev => ({ ...prev, image_banner: files[0] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const token = localStorage.getItem('access_token');
        const data = new FormData();
        data.append('titre', formData.titre);
        data.append('categorie', formData.categorie);
        data.append('contenu', formData.contenu);
        data.append('auteur', article.auteur);  // Important !
        if (formData.image_banner) {
        data.append('image_banner', formData.image_banner);
        }

        await axios.put(`http://localhost:8000/api/articles/${article.id}/`, data, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
        }
        });
        onUpdated();
        onRequestClose();
    } catch (err) {
        if (err.response) {
        console.error('Erreur lors de la modification de l’article:', err.response.data);
        } else {
        console.error('Erreur inconnue:', err.message);
        }
    }
    };

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} contentLabel="Modifier l'article">
      <h2 className="text-xl font-bold mb-4">Modifier l’article</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          name="titre"
          value={formData.titre}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          placeholder="Titre"
          required
        />
        <select
          name="categorie"
          value={formData.categorie}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        >
          <option value="news">News</option>
          <option value="guide">Guide</option>
          <option value="avis">Avis</option>
        </select>
        <textarea
          name="contenu"
          value={formData.contenu}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          placeholder="Contenu"
          required
          rows={6}
        />
        <label className="block text-gray-700 mb-2">
          Image de la bannière (optionnel)
        </label>
        <input
          type="file"
          name="image_banner"
          onChange={handleChange}
          className="w-full p-2 border rounded"
          accept="image/*"
        />
        <button type="submit" className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600">
          💾 Sauvegarder
        </button>
      </form>
    </Modal>
  );
};

export default EditArticleModal;
