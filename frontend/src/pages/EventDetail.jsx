import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

export default function EventDetail() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [avis, setAvis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const eventResponse = await axios.get(`http://localhost:8000/api/events/${id}/`);
        setEvent(eventResponse.data);
        setLoading(false);

        // Fetch reviews related to the event
        const avisResponse = await axios.get(`http://localhost:8000/api/events/${id}/avis/`);
        setAvis(avisResponse.data);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!event) return <div>No event found</div>;

  return (
    <div>
      <h1>{event.nom}</h1>
      <img src={event.banner_img} alt={event.nom} />
      <p>{event.description}</p>
      <p>Author: {event.author}</p>
      <p>Bracket Level: {event.bracket_level}</p>
      <p>Format: {event.format}</p>
      <p>Number of Participants: {event.nombre_participant}</p>
      <p>Date: {formatDate(event.date)}</p>
      <p>IRL: {event.IRL ? 'Yes' : 'No'}</p>
      <p>Location: {event.lieux}</p>

      <h2>Reviews</h2>
      <div className="reviews-list">
        {avis.map(avi => (
          <div key={avi.id} className="review-card">
            <p>Author: {avi.author}</p>
            <p>Positive: {avi.positif ? 'Yes' : 'No'}</p>
            <p>Comment: {avi.commentaire}</p>
            <p>Date Posted: {formatDate(avi.date_poste)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
