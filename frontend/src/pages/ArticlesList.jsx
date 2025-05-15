import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function ArticlesList() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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

  const handleArticleClick = (articleId) => {
    navigate(`/articles/${articleId}`);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Articles</h1>
      <div className="articles-list">
        {articles.map(article => (
          <div key={article.id} className="article-card" onClick={() => handleArticleClick(article.id)}>
            <h2>{article.titre}</h2>
            <img src={article.image_banner} alt={article.titre} />
          </div>
        ))}
      </div>
    </div>
  );
}
