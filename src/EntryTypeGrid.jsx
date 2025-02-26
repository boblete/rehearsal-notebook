import React from 'react';

function EntryTypeGrid({ onEntryTypeSelect }) {
  return (
    <div className="entry-type-grid">
      <button onClick={() => onEntryTypeSelect('Diary Entry')}>Diary Entry</button>
      <button onClick={() => onEntryTypeSelect('Homework Question')}>Homework Question</button>
      <button onClick={() => onEntryTypeSelect('Character Flashcard')}>Character Flashcard</button>
      <button onClick={() => onEntryTypeSelect('Quote Flashcard')}>Quote Flashcard</button>
    </div>
  );
}

export default EntryTypeGrid;