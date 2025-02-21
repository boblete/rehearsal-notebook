import React, { useState, useEffect } from 'react';
import './App.css'; 
import DiaryForm from './DiaryForm';
import NotebookEntry from './NotebookEntry';

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
  
  const [selectedWeek, setSelectedWeek] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  useEffect(() => {
    if(entries == [] || entries === null){
      return;
    }

    localStorage.setItem('entries', JSON.stringify(entries));
  }, [entries]);
  const handleWeekClick = (week) => {
    setSelectedDate(null)
    setSelectedWeek(week);
  };
  const [editFormData, setEditFormData] = useState(null);
  const handleEditClick = (entry) => {

    console.log(entry)
    setEditFormData({...entry});
    setShowForm(true);
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
        whatNeedsImprovement: formData.whatNeedsImprovement
      };
      console.log("New Entry Object:", newEntryObject);
      setEntries([...entries, newEntryObject]);    
    }    
          
   
      setShowForm(false);
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
      setSelectedWeek(null);
      setEntryToDelete(null);
      setShowDeleteModal(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setEntryToDelete(null);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEntryToDelete(null);
  };

  return (    
    <> 
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

        
        {!showForm && (<div className="sidebar">
          <div className="date-list-header">
            <div className="entry-content">              
              <p>Click '+ Add Entry' to start writing today's entry</p>

            </div>
            <button className="add-button" onClick={() => {setShowForm(!showForm);  setSelectedWeek(null);}}>
              + Add Entry
            </button>
            
          </div>
          <ul>
              {getUniqueWeeks().map((date) => (
                <li
                  key={date}
                  onClick={() => handleWeekClick(date)}
                  className={date === selectedDate ? 'selected' : ''}
                >

                  {date && weekTitles[date]}
      
                </li>
              ))}
            </ul>
        </div>)}
        <div className="entry-area">           
          {showForm && <DiaryForm onSubmit={handleSubmit} onCancel={handleCancel} initialData={editFormData} weekTitles={weekTitles}/>}
   
          {!showForm && selectedWeek && (
            <div>
              {entries.filter(e => e.week === selectedWeek).map((entry,i) => (
                <NotebookEntry
                  key={`${entry.week}_${i}`}
                  entry={entry}
                  weekTitles={weekTitles}
                  onDelete={() => handleDeleteClick(entry)}
                  onEdit={handleEditClick}
                />
              ))}
            </div>
          )}        </div>
        {showDeleteModal && (
          <div className="modal">
            <div className="modal-content">
              <p>Are you sure you want to delete this entry?</p>
              <button onClick={handleDeleteConfirm}>Delete</button>
              <button onClick={handleDeleteCancel}>Cancel</button>
            </div>
          </div>)}
      </div>
    </>
  )
}

export default App;





