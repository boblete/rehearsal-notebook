
import React, { useState, useEffect } from 'react';

function HomeworkQuestionForm({ onSubmit, onCancel, initialData }) {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  useEffect(() => {
    if (initialData) {
      setQuestion(initialData.question || '');
      setAnswer(initialData.answer || '');
    }
  }, [initialData]);

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({ question, answer });
  };

  const handleCancel = () => {
    onCancel();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="question">Homework Question</label>
        <input
          type="text"
          id="question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="answer">Your Answer</label>
        <textarea
          id="answer"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          required
        />
      </div>
      <button type="submit">Submit</button>
      <button type="button" onClick={handleCancel}>Cancel</button>
    </form>
  );
}

export default HomeworkQuestionForm;