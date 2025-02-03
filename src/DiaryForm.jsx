import React, { useState } from 'react';
import DiaryFormInputs from './DiaryFormInputs';

const DiaryForm = ({ onSubmit,initialData }) => {
  const [formData, setFormData] = useState(initialData || {
    overview: '',
    rating: 0,
    actorNotes: '',
    costumeNotes: '',
    timestamp: Date.now(), //add timestamp
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(formData);
    setFormData({
      overview: '',
      rating: 0,
      actorNotes: '',
      costumeNotes: '',
      
      timestamp: Date.now(),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="diary-form">
      <DiaryFormInputs formData={formData} setFormData={setFormData} />
   
    
      <button type="submit">Save Entry</button>
      
    </form>
  );
};

export default DiaryForm;