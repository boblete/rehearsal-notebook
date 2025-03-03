
import React from 'react';
import { isValid } from 'date-fns'; // Import isValid
function NotebookEntry({ entry, onDelete, onEdit,weekTitles }) {
  let formattedDate, formattedTime;
  const date = new Date(entry.timeStamp);
 // console.log(entry,date)
  if (!isValid(date)) { // Use isValid for date validation
    return (
      <div className="notebook-entry-container">
        Invalid Date
      </div>
    );
  } else {
    formattedDate = date.toLocaleDateString('en-GB');
    formattedTime = date.toLocaleTimeString('en-GB');
  }

  const handleEditClick = () => {
    onEdit(entry); // Pass the entry data to the onEdit callback
  };

    const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= entry.rating) {
        stars.push(<span key={i} className="filled-star">⭐</span>);
      } else {
        stars.push(<span key={i} className="empty-star">☆</span>);
      }
    } 
    return stars;
  };
  const entryClass = entry.userType === 'Teacher' ? 'teacher-entry' : 'student-entry';
  return (
    <div className={`notebook-entry-container ${entryClass}`}>
       <div className="entry-date">
        <p>{formattedDate} {formattedTime}</p>
        <div className="user-id">
        <p>User: {entry.userId}</p>
        </div>        
      </div>
      <div className="notebook-entry">
          <div className="entry-content">
          <div className="entry-details">
            <div className="rating-stars">
            {renderStars()}
            </div>
            {entry.week && (<p>{weekTitles[entry.week]}</p>)}
            <p>Overview: {entry.overview}</p>
            <p>Attendance Notes: {entry.attendanceNotes}</p>
            <p>Costume/Stage Notes: {entry.costumeStageNotes}</p>
            {entry.whatNeedsImprovement && (
              <p>What Needs Improvement: {entry.whatNeedsImprovement}</p>
            )}
            {entry.whatWentWell && (
              <p>What Went Well: {entry.whatWentWell}</p>
            )}

            <div className="image-list">
          {(entry.imageUrls || []).map((img, index) => (
            <div key={index} className="image-item">
                         {typeof img === 'string' ? (
                            <img src={img} alt={`Uploaded ${index + 1}`} style={{ maxWidth: '100px', maxHeight: '100px' }} />
                        ) : (
                            <div>{img.name}</div>
                        )}
                      
            </div>
          ))}
      </div>
          </div>
          <button className="edit-button" onClick={handleEditClick}>
            Edit
          </button>
          <button className="delete-button" onClick={() => onDelete(entry.timestamp)}>Delete</button>
        </div>
      </div>
     
    </div>
  );
}

export default NotebookEntry;