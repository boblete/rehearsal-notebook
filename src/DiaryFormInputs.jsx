import React, { useState } from 'react';

const DiaryFormInputs = ({ formData, setFormData }) => {
  const [imageUrls, setImageUrls] = useState([]);
    const [newImageUrl, setNewImageUrl] = useState('');
    const [newImageFile, setNewImageFile] = useState(null);
  const handleInputChange = (event) => {

    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

   const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setNewImageFile(selectedFile);
  };
   const handleAddImage = () => {
        if (newImageUrl) {
            setImageUrls(prevImageUrls => [...prevImageUrls, newImageUrl]);
            setFormData(prevFormData => ({
                ...prevFormData,
                imageUrls: [...prevFormData.imageUrls || [], newImageUrl]
            }));
            setNewImageUrl(''); // Clear the URL input field
        }

        if (newImageFile) {
            setImageUrls(prevImageUrls => [...prevImageUrls, newImageFile]);
            setFormData(prevFormData => ({
                ...prevFormData,
                imageUrls: [...prevFormData.imageUrls || [], newImageFile]
            }));
            setNewImageFile(null); // Clear the file input
        }
        
    };

    const handleDeleteImage = (index) => {
        setImageUrls(currentImageUrls => currentImageUrls.filter((_, i) => i !== index));
        setFormData(prevFormData => ({
            ...prevFormData,
            imageUrls: prevFormData.imageUrls.filter((_, i) => i !== index)
        }));
    };

  return (
    <>
    
      <div className="form-group">
        <label htmlFor="rating">How did it go? (1-5 stars):</label>
          <select id="rating" name="rating" value={formData.rating} onChange={handleInputChange}>
          <option value="1">1 Star</option>
          <option value="2">2 Stars</option>
          <option value="3">3 Stars</option>
          <option value="4">4 Stars</option>
          <option value="5">5 Stars</option>
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="overview">Overview:</label>
        <textarea
          id="overview"
          name="overview"
          value={formData.overview}
          onChange={handleInputChange}
        />
      
      </div>
      <div className="form-group">
        <label htmlFor="attendanceNotes">Attendance Notes:</label>
        <textarea
          id="attendanceNotes"
          name="attendanceNotes"
          value={formData.attendanceNotes}
          onChange={handleInputChange}
        />
        </div>
       <div className="form-group">
       <label htmlFor="attendanceNotes">Costume/Staging Notes:</label>
        <textarea
          id="costumeStageNotes"
          name="costumeStageNotes"
          value={formData.costumeStageNotes}
          onChange={handleInputChange}
        />
      </div>
      {/* Display the list of images */}
      <div className="image-list">
          {imageUrls.map((img, index) => (
            <div key={index} className="image-item">
                         {typeof img === 'string' ? (
                            <img src={img} alt={`Uploaded ${index + 1}`} style={{ maxWidth: '100px', maxHeight: '100px' }} />
                        ) : (
                            <div>{img.name}</div>
                        )}
                        <button type="button" onClick={() => handleDeleteImage(index)}>
                            Delete
                        </button>
            </div>
          ))}
      </div>
          
           
      
       <div className="form-group">
        <input type="text" placeholder="Image URL" value={newImageUrl} onChange={(e) => setNewImageUrl(e.target.value)} />
        <input type="file" onChange={handleFileChange} />
         <button type="button" onClick={handleAddImage}>
            Add Image
          </button>
      </div>
    </>
  );
};

export default DiaryFormInputs;