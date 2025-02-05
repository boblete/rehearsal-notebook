import React, { useState, useEffect } from 'react';
import './App.css'; 
import DiaryForm from './DiaryForm';
import NotebookEntry from './NotebookEntry';


function App() {  
  //localStorage.clear();
  const [entries, setEntries] = useState(() => {
    const savedEntries = localStorage.getItem('entries');
    return savedEntries ? JSON.parse(savedEntries) : [];
  }); 
  const [selectedDate, setSelectedDate] = useState(null);
  const [newEntry, setNewEntry] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    
    if(entries == [] || entries === null){
      return;
    }

    localStorage.setItem('entries', JSON.stringify(entries));
  }, [entries]);

  const handleDateClick = (date) => {
    setSelectedDate(date);
  };
    const [editFormData, setEditFormData] = useState(null);
  const handleEditClick = (entry) => {
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
            date: editFormData.date,
            overview: formData.overview,
            rating: formData.rating,
            attendanceNotes: formData.attendanceNotes,            
            costumeStageNotes: formData.costumeStageNotes,
            whatWentWell: formData.whatWentWell,
            whatNeedsImprovement: formData.whatNeedsImprovement,
            imageUrls: formData.imageUrls,
            timeStamp: editFormData.timeStamp
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
        whatWentWell: formData.whatWentWell,
        whatNeedsImprovement: formData.whatNeedsImprovement
      };
      console.log("New Entry Object:", newEntryObject);
      setEntries([...entries, newEntryObject]);    
    }
      setNewEntry("");
    
    
   
      setShowForm(false);
  };
  const [entryToDelete, setEntryToDelete] = useState(null);

  const getUniqueDates = () => {
    const uniqueDates = [...new Set(entries.map(entry => entry.date))];
    return uniqueDates.sort().reverse();
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
      setSelectedDate(null);
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
    <> <div className='top-bar'>
    <h2>Rehearsal Note Diary</h2>
    </div>
      <div className="app-container">
       
          <div className="entry-area">           
          {showForm && <DiaryForm onSubmit={handleSubmit} onCancel={handleCancel} initialData={editFormData} />}
          {!showForm && selectedDate && ( 
            <div>
                {entries.filter(e => e.date === selectedDate).map((entry) => (
                <NotebookEntry
                key={entry.timeStamp}
                 entry={entry}
                onDelete={()=>handleDeleteClick(entry)}
                onEdit={handleEditClick} /> 
            ))}</div>
          )}          
        </div>
        
         <div className="sidebar">
          <div className="date-list-header">
          
             <div className="entry-content">              
              <p>Click '+ Add Entry' to start writing today's diary</p>
            
            </div>
            <button className="add-button" onClick={() => setShowForm(!showForm)}>            
              + Add Entry
            </button>
            
          </div>
          <ul className="date-list">
          {getUniqueDates().map(date => (
              <li
                key={date}
                className={selectedDate === date ? 'selected' : ''}
                onClick={() => handleDateClick(date)}
              >{date}</li>
            ))}
          </ul>
        </div>
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





