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
  const articlesPerPage = 9;
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

  if (loading) return <div className="text-center py-4 text-mana-gold font-magic">Chargement...</div>;
  if (error) return <div className="text-center py-4 text-red-600 font-magic">Erreur : {error}</div>;

  return (
    <div className="container mx-auto p-6 bg-mana-white rounded-lg shadow-magic">
      <h1 className="text-4xl font-magic font-bold mb-8 text-mana-gold text-center drop-shadow-[0_0_6px_rgba(191,167,111,0.8)]">
        Articles Magiques
      </h1>

      {/* Filtre */}
      <div className="mb-6 max-w-sm mx-auto">
        <label className="block mb-2 font-magic text-mana-purple text-lg">Filtrer par catégorie :</label>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="w-full p-3 border border-mana-gold rounded font-magic text-mana-black focus:outline-none focus:ring-2 focus:ring-mana-gold"
        >
          <option value="all">Tous</option>
          <option value="news">News</option>
          <option value="guide">Guide</option>
          <option value="avis">Avis</option>
        </select>
      </div>

      {/* Liste des articles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {currentArticles.map(article => (
          <div
            key={article.id}
            data-aos="fade-up"
            className="bg-mana-white border border-mana-gold rounded-lg shadow-magic cursor-pointer hover:shadow-[0_0_20px_rgba(191,167,111,0.7)] transition duration-300 flex flex-col"
            onClick={() => handleArticleClick(article.id)}
          >
            <img
              src={article.image_banner}
              alt={article.titre}
              className="w-full h-48 object-cover rounded-t-lg"
            />
            <div className="p-4 flex flex-col flex-grow">
              <h2 className="text-2xl font-magic font-semibold mb-2 text-mana-purple drop-shadow-[0_0_4px_rgba(75,49,114,0.8)]">{article.titre}</h2>
              <p className="text-mana-black mb-4"><span className="font-semibold">Catégorie :</span> {article.categorie}</p>
              <button
                onClick={(e) => { e.stopPropagation(); handleArticleClick(article.id); }}
                className="mt-auto bg-mana-gold text-mana-black font-magic py-2 rounded shadow-magic hover:bg-mana-purple hover:text-mana-white transition"
              >
                Voir l'article
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-10 space-x-2">
        {Array.from({ length: Math.ceil(filteredArticles.length / articlesPerPage) }, (_, i) => (
          <button
            key={i}
            onClick={() => paginate(i + 1)}
            className={`px-4 py-2 rounded font-magic ${
              currentPage === i + 1
                ? 'bg-mana-purple text-mana-white shadow-magic'
                : 'bg-mana-gold text-mana-black hover:bg-mana-black hover:text-mana-gold transition'
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
