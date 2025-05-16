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
      <h2 className="text-xl font-bold mb-2">Mes articles rédigés</h2>
      {articles.map(article => (
        <div key={article.id} className="bg-white p-4 mb-2 rounded shadow">
          <p className="text-gray-700">
            <span className="font-semibold">Titre :</span>{' '}
            <Link to={`/articles/${article.id}`} className="text-blue-600 hover:underline">{article.titre}</Link>
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">Catégorie :</span> {article.categorie}
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">Date :</span> {new Date(article.date_creation).toLocaleDateString()}
          </p>
          <div className="flex gap-2 mt-2">
            <button onClick={() => openEditModal(article)} className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500">
              ✏️ Modifier
            </button>
            <button
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              onClick={() => handleDelete(article.id)}
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
