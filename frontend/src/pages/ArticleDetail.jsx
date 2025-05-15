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

  if (loading) return <div className="text-center py-4">Loading...</div>;
  if (error) return <div className="text-center py-4 text-red-500">Error: {error}</div>;
  if (!article) return <div className="text-center py-4">No article found</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-4">{article.titre}</h1>
        <img src={article.image_banner} alt={article.titre} className="w-full h-128 object-cover rounded mb-4" />
        <div className='flex w-full justify-between'>
          <p className="text-gray-700 mb-2"><span className="font-semibold">Category:</span> {article.categorie}</p>
          <p className="text-gray-700 mb-2"><span className="font-semibold">Author:</span> {article.auteur}</p>
          <p className="text-gray-700"><span className="font-semibold">Created at:</span> {formatDate(article.date_creation)}</p>
        </div>
        <p className="text-lg mb-4">{article.contenu}</p>
      </div>
    </div>
  );
}
