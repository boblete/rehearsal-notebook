import React, { useState, useEffect } from 'react';
import './App.css'; 
import DiaryForm from './DiaryForm';
import NotebookEntry from './NotebookEntry';
import HomeworkQuestionForm from './HomeworkQuestionForm'; // Import the new forms
import CharacterFlashcardForm from './CharacterFlashcardForm';
import QuoteFlashcardForm from './QuoteFlashcardForm';
import EntryTypeGrid from './EntryTypeGrid'; // Import the new component

function App() {  
  // Theme State and Logic
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme === 'dark';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches; // Default to system preference
  });
  // User ID State and Logic
  const [userId, setUserId] = useState(null);
  // User Type State and Logic
  const [userType, setUserType] = useState('Student'); // Default to 'Student'
    const initializeUserType = () => {
      const storedUserType = localStorage.getItem('userType');
      if (storedUserType === null || storedUserType === undefined)
      {localStorage.setItem('userType', 'Student')}
      if (storedUserType) {
        setUserType(storedUserType);
      } else if(!storedUserType){
      } else {
        localStorage.setItem('userType', 'Student');
      }
    };
    const initializeUserId = () => {
      const storedUserId = localStorage.getItem('userId');
      if (storedUserId) {
        setUserId(storedUserId);
      } else {
        const newUserId = 'A New User';
        localStorage.setItem('userId', newUserId);
        setUserId(newUserId);
      }
    };
    const weekTitles = ["Week 1:Meeting the play ", 
                        "Week 2:Building the world of the play", 
                        "Week 3:Interpreting key scenes and speeches", 
                        "Week 4:Interpreting key scenes and speeches", 
                        "Week 5:Key characters and relationships", 
                        "Week 6:Key characters and relationships",
                        "Week 7:Over to you", 
                        "Week 8:Outcomes"]
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark-mode');
      root.classList.remove('light-mode');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.add('light-mode');
      root.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (event) => {
      const savedTheme = localStorage.getItem('theme');
      // Only change if the user hasn't set a preference
      if (!savedTheme) {
        setIsDarkMode(event.matches);
      }
    };
    mediaQuery.addEventListener('change', handleChange);
    // Ensure the correct class is added initially
    handleChange(mediaQuery);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

    useEffect(() => {
      initializeUserId();
    }, []);

    useEffect(() => {
      initializeUserType();
    }, []);
  //localStorage.clear();
  const [entries, setEntries] = useState(() => {
    const savedEntries = localStorage.getItem('entries');
    return savedEntries ? JSON.parse(savedEntries) : [];
  }); 
  
  const [selectedWeeks, setSelectedWeeks] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  // Sort State and Logic
  const [sortDirection, setSortDirection] = useState('asc');
  const [activeSort, setActiveSort] = useState(null);


  const [showDiaryForm, setShowDiaryForm] = useState(false); //rename to show diary form
  const [showHomeworkQuestionForm, setShowHomeworkQuestionForm] = useState(false);
  const [showCharacterFlashcardForm, setShowCharacterFlashcardForm] = useState(false);
  const [showQuoteFlashcardForm, setShowQuoteFlashcardForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  useEffect(() => {
    if(entries == [] || entries === null){
      return;
    }

    localStorage.setItem('entries', JSON.stringify(entries));
  }, [entries]);

  const handleWeekClick = (week) => {
    setSelectedDate(null);
    if (selectedWeeks.includes(week)) {
        setSelectedWeeks(selectedWeeks.filter(w => w !== week));
    } else {
        setSelectedWeeks([...selectedWeeks, week]);
    }
    
  };
  const [editFormData, setEditFormData] = useState(null);
  const handleEditClick = (entry) => {

    console.log(entry)
    setEditFormData({...entry, entryType: "Diary Entry"});
    setShowDiaryForm(true);
  };

  const handleSubmit = (formData) => {
    console.log("Form Data:", formData);
    console.log("Edit Form Data:", editFormData)
    if (editFormData !== null) {
      const updatedEntries = entries.map((e) => {
        if (e.timeStamp === editFormData.timeStamp) {
          return {
            userId: userId,
            userType: userType,
            date: editFormData.date,
            overview: formData.overview,
            rating: formData.rating,
            attendanceNotes: formData.attendanceNotes,            
            costumeStageNotes: formData.costumeStageNotes,
            whatWentWell: formData.whatWentWell,
            whatNeedsImprovement: formData.whatNeedsImprovement,
            imageUrls: formData.imageUrls,
            week:formData.week,
            timeStamp: editFormData.timeStamp,
          };
        }
        return e;
      });
      console.log("Updated Entries:", updatedEntries);
      setEntries(updatedEntries);
      setEditFormData(null);
    } else {
      console.log("Creating new entry");
      

      const newEntryObject = {
        date: new Date().toISOString().split('T')[0],
        timeStamp: Date.now(),
        overview: formData.overview,
        rating: formData.rating,
        attendanceNotes: formData.attendanceNotes,
        imageUrls: formData.imageUrls,
        costumeStageNotes: formData.costumeStageNotes,
        week:formData.week,
        whatWentWell: formData.whatWentWell,
        userId: userId,
        userType: userType,
        entryType:"Diary Entry",
        whatNeedsImprovement: formData.whatNeedsImprovement
      };
      console.log("New Entry Object:", newEntryObject);
      setEntries([...entries, newEntryObject]);    
    }    
          
    setShowDiaryForm(false);
  };
  const [entryToDelete, setEntryToDelete] = useState(null);
  const getUniqueWeeks = () => {
    const uniqueWeeks = [...new Set(entries.map(entry => entry.week))];
    return uniqueWeeks.sort((a, b) => {

   
        return a - b;
      });
  };

  const handleDeleteClick = (entry) => {
    setEntryToDelete(entry);

    setShowDeleteModal(true);    
  };

  const handleDeleteConfirm = () => {
    console.log('handleDeleteConfirm',entryToDelete)
    if (entryToDelete) {    
      setEntries(entries.filter(entry => entry.timeStamp !== entryToDelete.timeStamp));
      

      console.log('entryToDelete',entryToDelete);
      setSelectedWeeks([]);
      setEntryToDelete(null);
      setShowDeleteModal(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setEntryToDelete(null);
  };

  const handleCancel = () => {
    setShowDiaryForm(false);
    setShowHomeworkQuestionForm(false);
    setShowCharacterFlashcardForm(false);
    setShowQuoteFlashcardForm(false);
    setEntryToDelete(null);
  };
  const handleSortByWeekToggle = () => {
    setActiveSort('week');
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
  };
    // Sort by Created Date State and Logic
  const [sortByDateDirection, setSortByDateDirection] = useState('asc'); // Default to ascending
  const handleSortByDateToggle = () => {
      setActiveSort('date');

    
    setSortByDateDirection(sortByDateDirection === 'asc' ? 'desc' : 'asc')

  }
 // const handleSortByDateToggle = () => setSortByDateDirection(sortByDateDirection === 'asc' ? 'desc' : 'asc');


  const sortedEntries = [...entries].sort((a, b) => {
    const weekA = a.week;
    const weekB = b.week;

    if (sortDirection === 'asc') {
      return weekA - weekB;
    } else {
      return weekB - weekA;
    }
  }).sort((a, b) => {
    // Sort by timestamp (date created)
    const dateA = a.timeStamp;
    const dateB = b.timeStamp;

    if (sortByDateDirection === 'asc') {
      return dateA - dateB; // Ascending order (oldest first)
    } else {
      return dateB - dateA; // Descending order (newest first)
    }
  
  });

  const [showEntryTypeGrid, setShowEntryTypeGrid] = useState(false);
  const handleAddEntryClick = () => {
    setShowEntryTypeGrid(true);
    setSelectedWeeks([]);
  };

  const handleEntryTypeSelect = (entryType) => {
    setShowEntryTypeGrid(false);
    if (entryType === "Diary Entry") {
      setShowDiaryForm(true);
    } else if (entryType === "Homework Question") {
      setShowHomeworkQuestionForm(true);
    } else if (entryType === "Character Flashcard") {
      setShowCharacterFlashcardForm(true);
    } else if (entryType === "Quote Flashcard") {
      setShowQuoteFlashcardForm(true);
    }
  };

  const handleHomeworkSubmit = (formData) => {
    const newEntry = {
      entryType: "Homework Question",
      timeStamp: Date.now(),
      question: formData.question,
      answer: formData.answer,
      userId: userId,
      userType: userType,
    };
    setEntries([...entries, newEntry]);
    setShowHomeworkQuestionForm(false);
  };

  const handleCharacterFlashcardSubmit = (formData) => {
    const newEntry = {
      entryType: "Character Flashcard",
      timeStamp: Date.now(),
      characterName: formData.characterName,
      notes: formData.notes,
      userId: userId,
      userType: userType,
    };
    setEntries([...entries, newEntry]);
    setShowCharacterFlashcardForm(false);
  };

  const handleQuoteFlashcardSubmit = (formData) => {
    const newEntry = {
      entryType: "Quote Flashcard",
      timeStamp: Date.now(),
      quote: formData.quote,
      source: formData.source,
      notes: formData.notes,
      userId: userId,
      userType: userType,
    };
    setEntries([...entries, newEntry]);
    setShowQuoteFlashcardForm(false);
  };

  return (<>

    <div className='top-bar'>
      <h2>Rehearsal Note Diary</h2>
      <div className="theme-toggle-container">
        <label className="theme-toggle" htmlFor="theme-toggle-input">            
        <input
          type="checkbox"
          id="theme-toggle-input"
          checked={isDarkMode}
          onChange={() => setIsDarkMode(!isDarkMode)} />            
          <span id="theme-toggle-slider" />
          <div className='dark-light-label'>{isDarkMode?'Dark':'Light'}</div>
        </label>          
      </div>
    </div>
    <div className="app-container">

      
      {!showDiaryForm && !showHomeworkQuestionForm 
        && !showCharacterFlashcardForm 
        && !showQuoteFlashcardForm 
        && (<div className="sidebar">
        {!showEntryTypeGrid && (<>
          <div className="date-list-header">
            <div className="entry-content">              
              <p>Click '+ Add Entry' to start writing today's entry</p>

            </div>
            <button className="add-button" onClick={handleAddEntryClick}>
              + Add Entry
            </button>

          </div>
            <div className="sort-button-container">
            <h5>Sort</h5>
                <button onClick={handleSortByWeekToggle}
                  className={activeSort === 'week' ? 'selected' : ''}>Sort by Week ({sortDirection === 'asc' ? 'Ascending' : 'Descending'})
                </button>
                    <button onClick={handleSortByDateToggle}                  
                      className={activeSort === 'date' ? 'selected' : ''}>Sort by Date Created ({sortByDateDirection === 'asc' ? 'Ascending' : 'Descending'})
                    </button>
            </div>
            <h5>Filters</h5>
              {getUniqueWeeks().map((date) => (
                <div
                  key={"unique_week_"+date}
                  onClick={() => handleWeekClick(date)}
                  className={`week-chip ${selectedWeeks.includes(date) ? 'selected-week' : 'normal-week'} ${date === selectedDate ? 'selected' : ''}`}
                >

                  

                  {date && weekTitles[date]}

                </div>
              ))}
         
          </>)}
        </div>)}
        <div className="entry-area">
          {showDiaryForm && <DiaryForm onSubmit={handleSubmit} onCancel={handleCancel} initialData={editFormData} weekTitles={weekTitles}/>}
          {showHomeworkQuestionForm && <HomeworkQuestionForm onSubmit={handleHomeworkSubmit} onCancel={handleCancel} />}
          {showCharacterFlashcardForm && <CharacterFlashcardForm onSubmit={handleCharacterFlashcardSubmit} onCancel={handleCancel} />}
          {showQuoteFlashcardForm && <QuoteFlashcardForm onSubmit={handleQuoteFlashcardSubmit} onCancel={handleCancel} />}
          {showEntryTypeGrid && <EntryTypeGrid onEntryTypeSelect={handleEntryTypeSelect} />}

          {!showDiaryForm && !showHomeworkQuestionForm && !showCharacterFlashcardForm && !showQuoteFlashcardForm && (
            <div>
                {
                  (selectedWeeks.length > 0 ? (
                    sortedEntries.filter(e => selectedWeeks.includes(e.week))
                  ) : (
                    sortedEntries
                  )).map((entry,i) => (
                    <NotebookEntry
                      key={`${entry.week}_${i}_${entry.timeStamp}`}
                      entry={entry}
                      weekTitles={weekTitles}
                      onDelete={() => handleDeleteClick(entry)}
                      onEdit={handleEditClick}
                    />
                  ))}
            
              

            </div>

          )}       
          
        </div>
        {showDeleteModal && (
          <div className="modal">
            <div className="modal-content">
              <p>Are you sure you want to delete this entry?</p>
              <button onClick={handleDeleteConfirm}>Delete</button>
              <button onClick={handleDeleteCancel}>Cancel</button>
            </div>
          </div>)
          
          }
      </div>

    </>)
}

export default App;






