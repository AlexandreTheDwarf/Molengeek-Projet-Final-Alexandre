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

  if (loading) return <div className="text-center py-4 text-mana-blue">Chargement du grimoire...</div>;
  if (error) return <div className="text-center py-4 text-red-500">Erreur : {error}</div>;
  if (!article) return <div className="text-center py-4">Aucun article trouvé</div>;

  return (
    <div className="container mx-auto p-6 font-magic text-mana-black">
      <div className="bg-mana-white border-4 border-mana-gold shadow-magic rounded-xl p-8 transition-transform duration-300 hover:scale-[1.01]">
        <h1 className="text-4xl font-bold text-mana-gold mb-6">{article.titre}</h1>
        <img
          src={article.image_banner}
          alt={article.titre}
          className="w-full h-96 object-cover rounded shadow-lg mb-6 border border-mana-gold"
        />
        <div className="flex flex-col md:flex-row md:justify-between text-sm mb-4 text-mana-black/80">
          <p><span className="font-semibold text-mana-gold">Catégorie :</span> {article.categorie}</p>
          <p><span className="font-semibold text-mana-gold">Auteur :</span> {article.auteur.username}</p>
          <p><span className="font-semibold text-mana-gold">Publié le :</span> {formatDate(article.date_creation)}</p>
        </div>
        <div className="prose prose-lg prose-mana max-w-none text-mana-black">
          <p>{article.contenu}</p>
        </div>
      </div>
    </div>
  );
}
