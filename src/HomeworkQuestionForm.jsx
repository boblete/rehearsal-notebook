import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Slate, Editable, withReact } from 'slate-react';
import { createEditor } from 'slate';
import { withHistory } from 'slate-history';

function HomeworkQuestionForm({ onSubmit, onCancel, initialData }) {
  const [question, setQuestion] = useState('');
  const [editorValue, setEditorValue] = useState([
    {
      type: 'paragraph',
      children: [{ text: '' }],
    },
  ]);

  const editor = useMemo(() => withHistory(withReact(createEditor())), []);

  useEffect(() => {
    if (initialData) {
      setQuestion(initialData.question || '');
      setEditorValue(
        initialData.answer && initialData.answer.length > 0
          ? initialData.answer
          : [
              {
                type: 'paragraph',
                children: [{ text: '' }],
              },
            ]
      );
    }
  }, [initialData]);

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({ question, answer: editorValue });
  };

  const handleCancel = () => {
    onCancel();
  };

  const renderElement = useCallback((props) => {
    switch (props.element.type) {
      case 'paragraph':
        return <p {...props.attributes}>{props.children}</p>;
      default:
        return <p {...props.attributes}>{props.children}</p>;
    }
  }, []);

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
        <Slate
          editor={editor}
          initialValue={editorValue}
          onChange={(value) => setEditorValue(value)}
        >
          <Editable
            renderElement={renderElement}
            placeholder="Enter your answer..."
          />
        </Slate>
      </div>
      <button type="submit">Submit</button>
      <button type="button" onClick={handleCancel}>Cancel</button>
    </form>
  );
}

export default HomeworkQuestionForm;