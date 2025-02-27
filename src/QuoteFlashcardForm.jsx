import React, { useState, useEffect } from 'react';

function QuoteFlashcardForm({ onSubmit, onCancel, initialData }) {
  const [formData, setFormData] = useState({
    quote: '',
    notes: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        quote: initialData.quote || '',
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
    <form onSubmit={handleSubmit} className="quote-flashcard-form">
      <div className="form-group">
        <label htmlFor="quote">Quote</label>
        <input
          type="text"
          id="quote"
          name="quote"
          value={formData.quote}
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

export default QuoteFlashcardForm;