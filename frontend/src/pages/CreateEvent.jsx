import { useState } from 'react';
import axios from 'axios';

export default function CreateEvent() {
  const [nom, setNom] = useState('');
  const [description, setDescription] = useState('');
  const [bracketLevel, setBracketLevel] = useState('1');
  const [format, setFormat] = useState('commander');
  const [bannerImg, setBannerImg] = useState(null);
  const [nombreParticipant, setNombreParticipant] = useState(0);
  const [date, setDate] = useState('');
  const [irl, setIrl] = useState(false);
  const [lieux, setLieux] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('nom', nom);
    formData.append('description', description);
    formData.append('bracket_level', bracketLevel);
    formData.append('format', format);
    formData.append('banner_img', bannerImg);
    formData.append('nombre_participant', nombreParticipant);
    formData.append('date', date);
    formData.append('IRL', irl);
    formData.append('lieux', lieux);
    formData.append('author', 1); // temporairement en dur

    try {
      const response = await axios.post('http://localhost:8000/api/events/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'X-CSRFToken': 'your_csrf_token_here' // Include CSRF token if needed
        }
      });
      console.log('Event créé :', response.data);
    } catch (error) {
      if (error.response) {
        console.error('Erreur:', error.response.data);
      } else {
        console.error('Erreur inconnue:', error.message);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={nom} onChange={(e) => setNom(e.target.value)} placeholder="Nom" />
      <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
      <select value={bracketLevel} onChange={(e) => setBracketLevel(e.target.value)}>
        <option value="1">Niveau 1</option>
        <option value="2">Niveau 2</option>
        <option value="3">Niveau 3</option>
        <option value="4">Niveau 4</option>
        <option value="5">Niveau 5</option>
      </select>
      <select value={format} onChange={(e) => setFormat(e.target.value)}>
        <option value="commander">Commander</option>
        <option value="modern">Modern</option>
        <option value="standard">Standard</option>
      </select>
      <input type="file" onChange={(e) => setBannerImg(e.target.files[0])} />
      <input type="number" value={nombreParticipant} onChange={(e) => setNombreParticipant(e.target.value)} placeholder="Nombre de participants" />
      <input type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} />
      <label>
        <input type="checkbox" checked={irl} onChange={(e) => setIrl(e.target.checked)} />
        IRL
      </label>
      <input value={lieux} onChange={(e) => setLieux(e.target.value)} placeholder="Lieux" />
      <button type="submit">Créer l'événement</button>
    </form>
  );
}
