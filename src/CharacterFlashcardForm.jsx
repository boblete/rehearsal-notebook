
import React, { useState, useEffect } from 'react';

function CharacterFlashcardForm({ onSubmit, onCancel, initialData }) {
  const [formData, setFormData] = useState({
    character: '',
    notes: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        character: initialData.character || '',
        notes: initialData.notes || '',
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="character-flashcard-form">
      <div className="form-group">
        <label htmlFor="character">Character</label>
        <input
          type="text"
          id="character"
          name="character"
          value={formData.character}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label htmlFor="notes">Notes</label>
        <textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
        />
      </div>
      <div className="form-actions">
        <button type="submit">Submit</button>
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}

export default CharacterFlashcardForm;