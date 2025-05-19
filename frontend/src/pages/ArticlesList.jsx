import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function ArticlesList() {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('all'); // 'all', 'news', 'guide', 'avis'
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 800 });
  }, []);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/articles/');
        setArticles(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  useEffect(() => {
    const filtered = articles.filter(article => {
      if (categoryFilter === 'all') return true;
      return article.categorie === categoryFilter;
    });
    setFilteredArticles(filtered);
    setCurrentPage(1); // Reset to first page when filter changes
  }, [articles, categoryFilter]);

  const handleArticleClick = (articleId) => {
    navigate(`/articles/${articleId}`);
  };

  // Logic for displaying current articles
  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = filteredArticles.slice(indexOfFirstArticle, indexOfLastArticle);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) return <div className="text-center py-4">Loading...</div>;
  if (error) return <div className="text-center py-4 text-red-500">Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Articles</h1>

      {/* Filter for category */}
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Filtrer par catégorie:</label>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="all">Tous</option>
          <option value="news">News</option>
          <option value="guide">Guide</option>
          <option value="avis">Avis</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {currentArticles.map(article => (
          <div
            key={article.id}
            data-aos="fade-up"
            className="bg-white p-4 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow"
          >
            <img
              src={article.image_banner}
              alt={article.titre}
              className="w-full h-48 object-cover rounded mb-2"
            />
            <h2 className="text-xl font-semibold mb-2">{article.titre}</h2>
            <p className="text-gray-700"><span className="font-semibold">Catégorie:</span> {article.categorie}</p>
            <button
              onClick={() => handleArticleClick(article.id)}
              className="mt-2 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
            >
              Voir l'article
            </button>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-4">
        {Array.from({ length: Math.ceil(filteredArticles.length / articlesPerPage) }, (_, i) => (
          <button
            key={i}
            onClick={() => paginate(i + 1)}
            className={`mx-1 px-3 py-1 rounded ${currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
