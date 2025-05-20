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
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Modifier l'article"
      className="bg-mana-white text-mana-black border border-mana-gold rounded-lg shadow-magic max-w-xl mx-auto p-6"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
    >
      <h2 className="text-2xl font-bold mb-6 font-magic text-mana-gold">Modifier l’article</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="titre"
          value={formData.titre}
          onChange={handleChange}
          className="w-full p-3 border border-mana-gold rounded font-magic text-mana-black"
          placeholder="Titre"
          required
        />
        <select
          name="categorie"
          value={formData.categorie}
          onChange={handleChange}
          className="w-full p-3 border border-mana-gold rounded font-magic text-mana-black"
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
          className="w-full p-3 border border-mana-gold rounded font-magic text-mana-black"
          placeholder="Contenu"
          required
          rows={6}
        />
        <label className="block text-mana-purple mb-2 font-magic">Image de la bannière (optionnel)</label>
        <input
          type="file"
          name="image_banner"
          onChange={handleChange}
          className="w-full p-2 border border-mana-gold rounded"
          accept="image/*"
        />
        <button
          type="submit"
          className="w-full bg-mana-gold text-mana-black font-magic py-3 rounded shadow-magic hover:bg-mana-green hover:text-mana-white transition"
        >
          💾 Sauvegarder
        </button>
      </form>
    </Modal>
  );
};

export default EditArticleModal;
