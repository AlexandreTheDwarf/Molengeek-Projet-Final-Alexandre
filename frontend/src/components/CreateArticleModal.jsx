import React, { useState } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import DOMPurify from 'dompurify';

Modal.setAppElement('#root');

const bbcodeToHtml = (bbcode) => {
  const tags = {
    '[b]': '<strong>',
    '[/b]': '</strong>',
    '[i]': '<em>',
    '[/i]': '</em>',
    '[u]': '<u>',
    '[/u]': '</u>',
    '[img]': '<img src="',
    '[/img]': '">',
    '[url]': '<a href="',
    '[/url]': '">',
    '[list]': '<ul>',
    '[/list]': '</ul>',
    '[*]': '<li>',
    '[/*]': '</li>',
  };

  let html = bbcode;
  Object.keys(tags).forEach(tag => {
    html = html.split(tag).join(tags[tag]);
  });
  return html;
};

const cleanHtml = (dirtyHtml) => {
  return DOMPurify.sanitize(dirtyHtml);
};

const CreateArticleModal = ({ isOpen, onRequestClose, user, onArticleCreated }) => {
  const [titre, setTitre] = useState('');
  const [categorie, setCategorie] = useState('news');
  const [contenu, setContenu] = useState('');
  const [imageBanner, setImageBanner] = useState(null);
  const [message, setMessage] = useState('');
  const [preview, setPreview] = useState('');

  const insertBBCode = (tag) => {
    setContenu(contenu + tag);
  };

  const updatePreview = (bbcode) => {
    const htmlContent = bbcodeToHtml(bbcode);
    const cleanContent = cleanHtml(htmlContent);
    setPreview(cleanContent);
  };

  const handleContenuChange = (e) => {
    const newContenu = e.target.value;
    setContenu(newContenu);
    updatePreview(newContenu);
  };

  const renameImage = (file) => {
    // Générez un nouveau nom de fichier basé sur un timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileExtension = file.name.split('.').pop();
    const newFileName = `image_${timestamp}.${fileExtension}`;

    // Créez un nouvel objet File avec le nouveau nom
    return new File([file], newFileName, { type: file.type });
  };

  const convertImageToJPEG = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);
          canvas.toBlob((blob) => {
            resolve(new File([blob], file.name.replace(/\.[^/.]+$/, ".jpeg"), { type: 'image/jpeg' }));
          }, 'image/jpeg');
        };
        img.src = event.target.result;
      };
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('titre', titre);
    formData.append('categorie', categorie);
    const htmlContent = bbcodeToHtml(contenu);
    const cleanContent = cleanHtml(htmlContent);
    formData.append('contenu', cleanContent);

    if (imageBanner) {
      console.log('Image Banner:', imageBanner);
      const convertedImage = await convertImageToJPEG(imageBanner);
      formData.append('image_banner', convertedImage);
    }

    // Vérifiez que l'ID de l'auteur est valide et non vide
    if (user && user.id) {
      formData.append('auteur', user.id);
    } else {
      console.error('ID de l\'auteur invalide ou non défini');
      setMessage('❌ ID de l\'auteur invalide ou non défini.');
      return;
    }

    // Vérifiez que toutes les données sont correctement ajoutées à formData
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.post('http://localhost:8000/api/articles/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        }
      });
      console.log('Article créé :', response.data);
      setMessage('✨ Article créé avec succès !');
      onRequestClose();
      onArticleCreated();
    } catch (error) {
      if (error.response) {
        console.error('Erreur:', error.response.data);
        setMessage('❌ Erreur lors de la création de l\'article.');
      } else {
        console.error('Erreur inconnue:', error.message);
        setMessage('❌ Erreur inconnue lors de la création de l\'article.');
      }
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Créer un Article"
      className="bg-mana-white border-4 border-mana-gold rounded-lg shadow-magic p-6 max-w-2xl mx-auto mt-20 font-magic max-h-screen overflow-y-auto"
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
          <div className="flex space-x-2 mb-2">
            <button type="button" onClick={() => insertBBCode('[b][/b]')} className="bg-mana-gold text-mana-black px-2 py-1 rounded">Gras</button>
            <button type="button" onClick={() => insertBBCode('[i][/i]')} className="bg-mana-gold text-mana-black px-2 py-1 rounded">Italique</button>
            <button type="button" onClick={() => insertBBCode('[u][/u]')} className="bg-mana-gold text-mana-black px-2 py-1 rounded">Souligné</button>
            <button type="button" onClick={() => insertBBCode('[img][/img]')} className="bg-mana-gold text-mana-black px-2 py-1 rounded">Image</button>
            <button type="button" onClick={() => insertBBCode('[url][/url]')} className="bg-mana-gold text-mana-black px-2 py-1 rounded">Lien</button>
            <button type="button" onClick={() => insertBBCode('[list][*]Item 1[/*][*]Item 2[/*][/list]')} className="bg-mana-gold text-mana-black px-2 py-1 rounded">Liste</button>
          </div>
          <textarea
            value={contenu}
            onChange={handleContenuChange}
            className="w-full p-2 border border-mana-gold rounded bg-mana-white text-mana-black"
            placeholder="Écris ton article ici"
            rows="6"
          />
          <div className="mt-4 border border-mana-gold rounded p-4 bg-mana-white text-mana-black">
            <h3 className="text-mana-black mb-2">Aperçu en direct</h3>
            <div dangerouslySetInnerHTML={{ __html: preview }} />
          </div>
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
