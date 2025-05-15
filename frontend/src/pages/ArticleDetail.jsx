import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

export default function ArticleDetail() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/articles/${id}/`);
        console.log('Fetched article:', response.data); // Log the article
        setArticle(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!article) return <div>No article found</div>;

  return (
    <div>
      <h1>{article.titre}</h1>
      <img src={article.image_banner} alt={article.titre} />
      <p>{article.contenu}</p>
      <p>Category: {article.categorie}</p>
      <p>Author: {article.auteur}</p>
      <p>Created at: {formatDate(article.date_creation)}</p>
    </div>
  );
}
