import React, { useState } from 'react';
import DiaryFormInputs from './DiaryFormInputs';
  
const DiaryForm = ({ onSubmit, onCancel, initialData,weekTitles }) => {
  const [formData, setFormData] = useState(initialData|| {
    overview: '',
    rating: 3,
    actorNotes: '',
    costumeNotes: '',
    timestamp: Date.now(), //add timestamp
  });

  const handleSubmit = (event) => {
        event.preventDefault();
        onSubmit(formData);
        resetForm();
        
      };
      const handleCancel = () => {
        resetForm();
        onCancel();
      };
      const resetForm = () => {
      setFormData({
      overview: '',
      rating: 3,
      
      
      actorNotes: '',
      costumeNotes: '',
      
      timestamp: Date.now(),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="diary-form">
      <DiaryFormInputs formData={formData} setFormData={setFormData} weekTitles={weekTitles}/>

      <div className='form-buttons'>
        <button type="submit">Save Entry</button>
        <button type="button" onClick={handleCancel}>Cancel</button>
      </div>

    </form>
  );
};

export default DiaryForm;