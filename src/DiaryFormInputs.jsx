import React, { useState, useRef, useEffect } from 'react'
import Modal from 'react-modal'

const DiaryFormInputs = ({ formData, setFormData,weekTitles }) => {
    const [imageUrls, setImageUrls] = useState([]);
    const [newImageUrl, setNewImageUrl] = useState('');
    const [newImageBlob, setNewImageBlob] = useState(null);
    const [cameraStream, setCameraStream] = useState(null);
    const [cameraError, setCameraError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);

    const videoRef = useRef(null);
    const handleInputChange = (event) => {

        const { name, value } = event.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }))
    };
    
    useEffect(() => {
        if (newImageBlob) handleAddImage();
    }, [newImageBlob]);

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        console.log(selectedFile,event,hiddenFileInput)
        if (selectedFile) {
            if (selectedFile.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setNewImageBlob(reader.result);
                };
                reader.readAsDataURL(selectedFile);
               
            } else { 
                alert('Please select an image file.');
                event.target.value = null; // Clear the file input
            }
        }
    };
    
    const handleAddImage = () => {
        if (newImageUrl) { // Handle adding from url
            setImageUrls(prevImageUrls => [...prevImageUrls, newImageUrl]);
            setFormData(prevFormData => ({
                ...prevFormData,
                imageUrls: [...(prevFormData.imageUrls || []), newImageUrl]
            }));
            setNewImageUrl('');
        } else if (newImageBlob) {
            setImageUrls(prevImageUrls => [...prevImageUrls, newImageBlob]); // handle add from file and camera
            setFormData(prevFormData => ({
                ...prevFormData,
                imageUrls: [...(prevFormData.imageUrls || []), newImageBlob]
            }));
            setNewImageBlob(null);
            hiddenFileInput.current.value = '';
        }
      };
    useEffect(() => {
      setFormData(prevFormData => ({ ...prevFormData, imageUrls: imageUrls }));
    }, [imageUrls]);

    const hiddenFileInput = useRef(null);
    const handleFileClick = event => {
        hiddenFileInput.current.click();
    };

    const handleCameraChange = (event) => {
        const fileUploaded = event.target.files[0];
        if (fileUploaded) {
            handleFileChange(event);
        }
    };
    const attatchStream = (stream) => {
        if (videoRef.current) {
            videoRef.current.srcObject = stream
            setCameraStream(stream)
        }else{
            setTimeout(()=> attatchStream(stream),100)
        }
    }
    const handleCameraStart = async () => {
        setCameraError(null);
      
        console.log('this wont start because no camera arounnd')
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true })
            setIsCameraModalOpen(true)
            console.log(stream,videoRef.current)
            attatchStream(stream)
        } catch (error) {
            setCameraStream(null);
            setCameraError("Could not access camera");
            console.error("Error accessing the camera:", error)
            setIsCameraModalOpen(false)
        }
    }


    const handleCapturePhoto = async() => {
        console.log('capture',isCameraModalOpen)
        if (!isCameraModalOpen){
            setIsCameraModalOpen(true)
        } else if (videoRef.current && cameraStream) {
            setIsCameraModalOpen(false)
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;
            context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
            canvas.toBlob((blob) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setNewImageBlob(reader.result);
                };
                reader.readAsDataURL(blob);
            });
            stopCamera();
        }
    };

    const stopCamera = () => {
        if (cameraStream) {
            cameraStream.getTracks().forEach((track) => track.stop());
            setCameraStream(null);
        }
    };

    useEffect(() => {
        return () => stopCamera();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);
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
                <label htmlFor="week">Week:</label>
                <select id="week" name="week" value={formData.week || ''} onChange={handleInputChange}>
                    <option value="">Select Week</option>
                    {[...Array(8)].map((_, i) => (
                        <option key={i + 1} value={i}>
                            {weekTitles[i]}
                        </option>
                    ))}
                </select>
            </div>
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
                <label htmlFor="overview">
                    Overview
                    <button className="help-button" type="button" onClick={() => setIsModalOpen(true)}>
                        ?
                    </button>
                </label>
                <textarea
                    id="overview"
                    name="overview"
                    value={formData.overview}
                    onChange={handleInputChange}
                />
                <Modal
                    isOpen={isCameraModalOpen}
                    onRequestClose={() => {
                        stopCamera()
                        setIsCameraModalOpen(false)
                    }}
                    contentLabel="Camera View"
                    className="modal camera-modal"
                    overlayClassName="modal-overlay"
                >
                    <h2>Camera View</h2>
                    <div className='camera-video'>
                    <video ref={videoRef} autoPlay style={{width:'100%'}}/>
                    </div>
                    <button type="button" onClick={() => {
                        handleCapturePhoto();
                        }}
                        >Capture</button>
                        <button type="button" onClick={() => {stopCamera();setIsCameraModalOpen(false)}}>
                        Close
                        </button>
                </Modal>
                <Modal
                    isOpen={isModalOpen}
                    onRequestClose={() => setIsModalOpen(false)}
                    contentLabel="Overview Help"
                    className="modal"
                    overlayClassName="modal-overlay"
                >
                    <h2>Overview Instructions</h2>
                    <p>Briefly summarise the events of the rehearsal.</p>
                    <p>Note how the director managed the rehearsal and whatever difficulties/successes occurred.</p>
                   
                    <p>Verbalize one main “take-away” lesson from the rehearsal.</p>
                    <p>other suggestions for things one might use in a post include:</p>
                    <ul>
                        <li>Light analysis of rehearsal’s scenes/songs/blocking</li>
                        <li>Relate rehearsal events to readings/recent lessons in acting/voice/dance/etc</li>
                        <li>Describe personal character choices/revelations</li>
                        <li>Analyze the rehearsal practices of other actors/director/etc whom you look up to</li>
                        <li>List areas in which you did well and areas in which you need to improve, Record questions you may have for the director in the next rehearsal</li>
                    </ul>
                    <button type="button" onClick={() => setIsModalOpen(false)}>Close</button>               
                    
                 </Modal>

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

            <div className="feedback-container">
                <div className="form-group feedback-box">
                    <label htmlFor="whatNeedsImprovement">What Needs Improvement:</label>
                    <textarea
                        id="whatNeedsImprovement"
                        name="whatNeedsImprovement"
                        value={formData.whatNeedsImprovement}
                        onChange={handleInputChange}
                    />
                </div>

            <div className="form-group feedback-box">
                <label htmlFor="whatWentWell">What Went Well:</label>
                <textarea
                    id="whatWentWell"
                    name="whatWentWell"
                    value={formData.whatWentWell}
                    onChange={handleInputChange}
                />
            </div>
        </div>
            {/* Display the list of images */}
            <div className="image-list">
                {imageUrls.map((img, index) => (
                    <div key={index} className="image-item">
                        <img src={img} alt={`Uploaded ${index + 1}`} style={{ maxWidth: '100px', maxHeight: '100px' }} />
                        <button type="button" onClick={() => handleDeleteImage(index)}>
                            Delete
                        </button>
                    </div>
                ))}
                <div className="form-group camera-container">
                    <input
                        type="text"
                        placeholder="Image URL"
                        value={newImageUrl}
                        onChange={(e) => setNewImageUrl(e.target.value)}
                    />
                    <input
                        type="file"
                        ref={hiddenFileInput}
                        onChange={handleCameraChange}
                        style={{ display: 'none' }}
                    />
                    <button type="button" onClick={handleAddImage}>
                       ➕Add Image
                    </button>
                    <button type="button" onClick={handleFileClick}>
                        🖼️ Choose File
                    </button>
                    <button type="button" onClick={handleCameraStart}>
                        📸 Use Camera
                    </button>
                    {cameraError && <span className="error-message">{cameraError}</span>}
                </div>
                <div className="form-group camera-container">                   
                {cameraStream && (
                    <div className='camera-video'>
                         {/* <video ref={videoRef} autoPlay style={{width:'100%'}}/> */}
                        <button type="button" onClick={handleCapturePhoto}>Capture Photo</button> 
                    </div>
                )}
                </div>
            </div>
        </>
    );
};

export default DiaryFormInputs;