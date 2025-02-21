import React, { useState } from 'react';
import DiaryFormInputs from './DiaryFormInputs';

const DiaryForm = ({ onSubmit, onCancel, initialData, weekTitles }) => {
  const [formData, setFormData] = useState(initialData || {
    overview: '', // Add a default value for overview
    rating: 3, // Add a default value for rating
    actorNotes: '', // Add a default value for actorNotes
    costumeNotes: '', // Add a default value for costumeNotes
    timestamp: Date.now(), // Add timestamp
    week: null,
  });
  const [weekError, setWeekError] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!formData.week) {
      setWeekError(true);
      return;
    } else {
      setWeekError(false);
    }
    onSubmit(formData);
    resetForm();
  };
  const handleCancel = () => {
    resetForm();
    onCancel();
  };
  const resetForm = () => {
    setWeekError(false);



      setFormData({
      overview: '',
      rating: 3,
      
      
      actorNotes: '',
      costumeNotes: '',
        week: null,

      timestamp: Date.now(),
    });
  };


  return (

    <form onSubmit={handleSubmit} className="diary-form">
      <DiaryFormInputs formData={formData} setFormData={setFormData} weekTitles={weekTitles} weekError={weekError}/>

      <div className='form-buttons'>
        <button type="submit">Save Entry</button>
        <button type="button" onClick={handleCancel}>Cancel</button>
      </div>

    </form>
  );
};

export default DiaryForm;