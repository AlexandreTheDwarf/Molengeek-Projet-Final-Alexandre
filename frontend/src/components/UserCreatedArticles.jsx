import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import EditArticleModal from './EditArticleModal';

const UserCreatedArticles = ({ refreshToggle, onArticleCreated }) => {
  const [articles, setArticles] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const fetchArticles = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const res = await axios.get("http://127.0.0.1:8000/api/get_user_articles/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setArticles(res.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des articles créés :", error);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, [refreshToggle]);

  const openEditModal = (article) => {
    setSelectedArticle(article);
    setEditModalOpen(true);
  };

  const handleUpdated = () => {
    fetchArticles();
    setEditModalOpen(false);
  };

  const handleDelete = async (articleId) => {
    const confirmDelete = window.confirm("Es-tu sûr·e de vouloir supprimer cet article ?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("access_token");
      await axios.delete(`http://127.0.0.1:8000/api/articles/${articleId}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setArticles(articles.filter(a => a.id !== articleId));
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
    }
  };

  if (articles.length === 0) return null;

  return (
    <div className="mt-6">
      <h2 className="text-2xl font-magic font-bold mb-4 text-mana-gold drop-shadow-[0_0_8px_rgb(191,167,111)]">Mes articles rédigés</h2>
      {articles.map(article => (
        <div key={article.id} className="bg-mana-gold bg-opacity-20 p-5 mb-4 rounded-lg shadow-magic border border-mana-gold">
          <p className="text-mana-black font-semibold">
            Titre :{' '}
            <Link to={`/articles/${article.id}`} className="text-mana-blue hover:underline">
              {article.titre}
            </Link>
          </p>
          <p className="text-mana-black mt-1">
            <span className="font-semibold">Catégorie :</span> {article.categorie}
          </p>
          <p className="text-mana-black mt-1">
            <span className="font-semibold">Date :</span> {new Date(article.date_creation).toLocaleDateString()}
          </p>
          <div className="flex gap-3 mt-4">
            <button
              onClick={() => openEditModal(article)}
              className="bg-mana-gold hover:bg-mana-gold/80 text-mana-black font-bold py-2 px-4 rounded shadow-magic transition duration-300"
            >
              ✏️ Modifier
            </button>
            <button
              onClick={() => handleDelete(article.id)}
              className="bg-mana-red hover:bg-mana-red/90 text-mana-white font-bold py-2 px-4 rounded shadow-magic transition duration-300"
            >
              🗑 Supprimer
            </button>
          </div>
        </div>
      ))}

      <EditArticleModal
        isOpen={editModalOpen}
        onRequestClose={() => setEditModalOpen(false)}
        article={selectedArticle}
        onUpdated={handleUpdated}
        onArticleCreated={onArticleCreated}
      />
    </div>
  );
};

export default UserCreatedArticles;
