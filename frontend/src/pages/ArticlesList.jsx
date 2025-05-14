import { useState, useEffect } from 'react';
import axios from 'axios';

export default function ArticlesList() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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


  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = new Date(dateString).toLocaleDateString(undefined, options);
    return formattedDate;
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Articles</h1>
      <div className="articles-list">
        {articles.map(article => (
          <div key={article.id} className="article-card">
            <h2>{article.titre}</h2>
            <img src={article.image_banner} alt={article.titre} />
            <p>{article.contenu}</p>
            <p>Category: {article.categorie}</p>
            <p>Author: {article.auteur}</p>
            <p>Created at: {formatDate(article.date_creation)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
