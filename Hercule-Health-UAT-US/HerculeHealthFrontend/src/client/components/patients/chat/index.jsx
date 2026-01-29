import React, { useEffect, useState, useRef } from "react";
import { io } from 'socket.io-client';
import '../../pages/aboutus/ChatComponent.css';
import Header from "../../header";
import axios from "../../../../axiosConfig"
import { Link, useHistory } from "react-router-dom"; import {
  ChevronLeft,
  MoreVertical,
  Phone,
  PhoneOff,
  PlusCircle,
  Video,
} from "feather-icons-react/build/IconComponents";
import Slider from "react-slick";
import {
  doctordashboardprofile01,
  doctordashboardprofile02,
  doctordashboardprofile04,
  doctordashboardprofile05,
  doctordashboardprofile06,
  doctordashboardprofile07,
  doctordashboardprofile08,
  doctordashboardprofile3,
  doctorprofileimg,
  emoj1,
  emoj2,
  emoj3,
  emoj4,
  emoj5,
  heart,
  like,
  media1,
  media2,
  media3,
  play1,
  send,
  voice1,
} from "../../imagepath";
import DoctorFooter from "../../common/doctorFooter";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import { useLocation } from "react-router-dom";
import baseUrl from "../../../../config/config";
import { IoMdArrowRoundBack } from "react-icons/io";
 
const PatientChat = (props) => {
 
  const location = useLocation()
  const { item } = location.state || {};
  // const [doctor, setDoctor] = useState(stateDoctor || null);
  const [senderId, setSenderId] = useState(null);
  const [receiverId, setReceiverId] = useState(null);
  const [receiverDetails, setReceiverDetails] = useState([])
  const [previousMessages, setPreviousMessages] = useState([])
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [mediaFile, setMediaFile] = useState(null);
  const mediaRecorderRef = useRef(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [dailyMessageCount, setDailyMessageCount] = useState(0);
  const [dailyMessageLimit, setDailyMessageLimit] = useState(30);
  const [limitReached, setLimitReached] = useState(false);
  const [limitWarning, setLimitWarning] = useState('');
  const [visible, setVisible] = useState(false);
  const [searchChat, setSearchChat] = useState(false);
  const { id } = useParams()
  const messagesEndRef = useRef(null);
  const history = useHistory()
 
 
  useEffect(() => {
    document.body.classList.add("main-chat-blk");
    return () => document.body.classList.remove("main-chat-blk");
  }, []);
  const settings = {
    dots: false,
    autoplay: false,
    slidesToShow: 5,
    margin: 12,
    speed: 500,
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 800,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 776,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 567,
        settings: {
          slidesToShow: 2,
        },
      },
    ],
  };
 
  const fetchHistory = async (senderId, receiverId) => {
    try {
      const response = await axios.get(`/api/patient-chat-history/${senderId}`);
      const chats = response.data.chats || [];
      const filterPreviousMessages = chats.map((chat) => {
        const { consultantDetails, messages, consultantId } = chat.chatDetails;
        const lastMessage = messages.reduce((latest, current) => {
          return new Date(current.timestamp) > new Date(latest.timestamp) ? current : latest;
        }, messages[0]);
        return {
          consultantId,
          displayName: consultantDetails?.information?.firstName || 'Unknown',
          profileImage: consultantDetails?.profileImage || '',
          lastMessage,
        };
      });
      setPreviousMessages(filterPreviousMessages);
 
      const matchingChats = chats.filter(
        chat => Number(chat.chatDetails.consultantId) === Number(receiverId)
      );
 
      const filteredMessages = matchingChats.flatMap(chat => chat.chatDetails.messages);
 
      // Sort messages in ascending order (oldest first)
      const sortedMessages = filteredMessages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
 
      const last10Messages = sortedMessages.slice(-10); // Get the last 10 messages
 
      const fetchFileDataFromBackend = async (fileUrl, messageType, msg) => {
        try {
          const response = await axios.post(`${baseUrl}/api/fetchFileData`, { fileUrl, messageType });
          return { ...msg, base64Data: response.data.data };
        } catch (error) {
          console.error('Error fetching file data:', error);
          return msg;
        }
      };
 
      const updatedMessagesPromises = last10Messages.map(async (msg) => {
        if (msg.messageType === 'media' || msg.messageType === 'voice') {
          return await fetchFileDataFromBackend(msg.file, msg.messageType, msg);
        }
        return msg;
      });
 
      const updatedMessages = await Promise.all(updatedMessagesPromises);
      setMessages(updatedMessages);
 
      return updatedMessages;
    } catch (err) {
      console.error("Error when fetching chat history:", err);
      return [];
    }
  };
 
  useEffect(() => {
    const sender = localStorage.getItem("userData");
    setSenderId(sender);
    setReceiverId(id);
 
    const fetchReceiverDetails = async () => {
      try {
        const response = await axios.get(`/api/consultant-profile-information/${id}`);
        setReceiverDetails(response.data.consultant);
      } catch (err) {
        console.log("Error when fetching receiverDetails", err);
      }
    };
 
    if (id) {
      fetchReceiverDetails(); // Fetch only if sender !== id
    }
 
    if (sender) {
      fetchHistory(sender, id);
    }
  }, [id]);
 
  useEffect(() => {
    const newSocket = io(baseUrl, {
      secure: true,
      transports: ['websocket', 'polling'], // Fallback to polling if WebSocket fails
      withCredentials: true,
    });
    setSocket(newSocket);
  
    if (senderId && receiverId) {
      const roomId = `${Math.min(senderId, receiverId)}_${Math.max(senderId, receiverId)}`;
      newSocket.emit('joinRoom', { userId: senderId, roomId });
    }
  
    newSocket.on('newMessage', async (msg) => {
      // Avoid adding duplicate messages for the sender
      if (msg.senderId !== senderId) {
        if (msg.messageType === 'media' || msg.messageType === 'voice') {
          try {
            // Fetch the base64 data for the media or voice file
            const response = await axios.post(`${baseUrl}/api/fetchFileData`, {
              fileUrl: msg.file,
              messageType: msg.messageType,
            });
  
            // Update the message with the fetched base64 data
            msg.base64Data = response.data.data;
          } catch (error) {
            console.error('Error fetching media data for new message:', error);
          }
        }
  
        // Add the message to the state
        setMessages((prevMessages) => [...prevMessages, msg]);
      }
    });
    newSocket.on('roomJoined', (data) => {
  setDailyMessageCount(data.dailyMessageCount || 0);
  setDailyMessageLimit(data.dailyMessageLimit || 30);
  setLimitReached(data.limitReached || false);
  
  if (data.limitReached) {
    setLimitWarning(`You have reached daily limit of ${data.dailyMessageLimit} messages. Please try again tomorrow.`);
  }
});

newSocket.on('dailyLimitUpdate', (data) => {
  setDailyMessageCount(data.dailyMessageCount);
  setDailyMessageLimit(data.dailyMessageLimit);
  setLimitReached(data.limitReached);
  
  if (data.limitReached) {
    setLimitWarning(`You have reached daily limit of  ${data.dailyMessageLimit} messages. Please try again tomorrow.`);
  } else {
    setLimitWarning('');
  }
});

newSocket.on('messageLimitReached', (data) => {
  setErrorMessage(data.message);
  setLimitReached(true);
  setTimeout(() => {
    setErrorMessage('');
    setLimitWarning('')
  }, 5000);
});
  
    return () => {
      newSocket.disconnect();
    };
  }, [senderId, receiverId]);
 
  //   const fetchUndeliveredMessages = async () => {
  //     const sender = localStorage.getItem("userData");
  //     try {
  //       const response = await axios.get(`${baseUrl}/api/chats/undelivered/${sender}`);
  //       const { undeliveredMessages } = response.data;
 
  //       setMessages((prevMessages) => [...prevMessages, ...undeliveredMessages]);
 
  //       // Mark messages as delivered
  //       // if (undeliveredMessages.length > 0) {
  //       //   await axios.post(`${baseUrl}/api/chats/mark-delivered`, {
  //       //     messageIds: undeliveredMessages.map((msg) => msg._id),
  //       //   });
  //       // }
  //     } catch (error) {
  //       console.error('Error fetching undelivered messages:', error);
  //     }
  //   };
 
  //   fetchUndeliveredMessages();
  // }, [senderId]);
 
  const fetchFileDataFromBackend = async (fileUrl, messageType, msg) => {
    try {
      //console.log("fileUrl in frontend",fileUrl);
      const response = await axios.post(`${baseUrl}/api/fetchFileData`, { fileUrl, messageType });
      console.log('Response from backend:', response.data);
 
      const updatedMessage = { ...msg, base64Data: response.data.data };
      setMessages((prevMessages) =>
        prevMessages.map((message) =>
          message.fileUrl === msg.fileUrl ? updatedMessage : message
        )
      );
      console.log(messages)
    } catch (error) {
      console.error('Error fetching file data:', error);
    }
  };
 
  const startRecording = async (e) => {
    e.preventDefault()
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert('Your browser does not support audio recording.');
      return;
    }
 
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      const audioChunks = [];
 
      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };
 
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        setAudioBlob(audioBlob);
        stream.getTracks().forEach((track) => track.stop());
      };
 
      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Failed to start recording.');
    }
  };
 
  const stopRecording = (e) => {
    e.preventDefault()
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };
 
  const convertBlobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(',')[1]);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };
 
  const convertBase64ToBlob = (base64, type) => {
    try {
      if (typeof base64 !== 'string') {
        console.error("Invalid base64 data. Expected a string but got:", typeof base64);
        return null;
      }
 
      const cleanBase64 = base64.includes(',') ? base64.split(',')[1] : base64;
      const binary = atob(cleanBase64);
      const array = [];
      for (let i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i));
      }
 
      return new Blob([new Uint8Array(array)], { type });
    } catch (error) {
      console.error('Error converting base64 to Blob:', error);
      return null;
    }
  };
 
  const handleSendMessage = async (e) => {
    e.preventDefault();
       // Character limit for messages
  const CHARACTER_LIMIT = 500;

  // Check if the message exceeds the character limit
  if (message.trim().length > CHARACTER_LIMIT) {
    setErrorMessage("Message too long, please shorten."); // Set the error message

    setTimeout(() => {
      setErrorMessage('');
    }, 5000);

    return;
  }
  if (limitReached) {
    setErrorMessage(`Daily message limit of ${dailyMessageLimit} reached. Try again tomorrow.`);
    setTimeout(() => {
      setErrorMessage('');
    }, 5000);
    return;
  }

  setErrorMessage('');
    if (message.trim() || audioBlob || mediaFile) {
      let fileUrl = '';
      let base64Data = '';
  
      if (audioBlob) {
        base64Data = await convertBlobToBase64(audioBlob);
        fileUrl = `data:audio/wav;base64,${base64Data}`;
      } else if (mediaFile) {
        base64Data = await convertBlobToBase64(mediaFile);
        fileUrl = `data:${mediaFile.type};base64,${base64Data}`;
      }
  
      const msg = {
        senderId,
        receiverId,
        message: message.trim(),
        messageType: audioBlob ? 'voice' : mediaFile ? 'media' : 'text',
        file: audioBlob || mediaFile || '',
        fileUrl: fileUrl || '',
        base64Data: base64Data || '',
      };
  
      // Emit the message to the server
      socket.emit('sendMessage', msg);
  
      // Add the message to the local state without waiting for the server
      setMessages((prevMessages) => [...prevMessages, { ...msg, timestamp: new Date() }]);
  
      setMessage('');
      setAudioBlob(null);
      setMediaFile(null);
    }
  };
 
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check if the file is an image
      if (file.type.startsWith('image/')) {
        setMediaFile(file);
      } else {
        alert('Only image files are allowed!');
        e.target.value = ''; // Reset the file input
      }
    }
  };
 
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };
 
  useEffect(() => {
    scrollToBottom(); // Scroll to the bottom when messages change
  }, [messages]);
 
  const handleBackButton = () => {
    history.push("/patient/dashboard"); // Corrected push method
  }; 
  return (
    <div className="main-wrapper">
      <Header {...props} />
      <div className="breadcrumb-bar-two">
        <div className="container">
          <div className="row align-items-center inner-banner">
            <div className="col-md-12 col-12 text-center">
              <h2 className="breadcrumb-title">Message</h2>
              <nav aria-label="breadcrumb" className="page-breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/patient/dashboard">Home</Link>
                  </li>
                  <li className="breadcrumb-item" aria-current="page">
                    Message
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </div>
      <div className="chat-page-wrapper">
        <div className="container">
          <div className="content">
          <div className="dashboard-header ">
              <div>
                <h3 className="mb-3">Message</h3>
              </div>
              <br />
              <div>
                {" "}
                <button
                onClick={handleBackButton}
                  style={{
                    border: "none",
                    backgroundColor: "transparent",
                    color: "black",
                  }}
                >
                  <IoMdArrowRoundBack />
                  Back
                </button>
              </div>
            </div>
            <div className="chat-sec">
              {/* sidebar group */}
              <div className="sidebar-group left-sidebar chat_sidebar">
                {/* Chats sidebar */}
                <div
                  id="chats"
                  className="left-sidebar-wrap sidebar active slimscroll"
                >
                  <div className="slimscroll-active-sidebar">
                    {/* Left Chat Title */}
                    <div className="left-chat-title all-chats">
                      <div className="setting-title-head">
                        <h4> All Chats</h4>
                      </div>
                      <div className="add-section">
                        {/* Chat Search */}
                        {/* <form>
                          <div className="user-chat-search">
                            <span className="form-control-feedback">
                              <i className="fa-solid fa-magnifying-glass" />
                            </span>
                            <input
                              type="text"
                              name="chat-search"
                              placeholder="Search"
                              className="form-control"
                            />
                          </div>
                        </form> */}
                      </div>
                    </div>
                    {/* /Top Online Contacts */}
                    <div className="sidebar-body chat-body" id="chatsidebar">
                      {/* Left Chat Title */}
                      <div className="d-flex justify-content-between align-items-center ps-0 pe-0">
                        <div className="fav-title pin-chat">
                          <h6>Recent Chat</h6>
                        </div>
                      </div>
                      {/* /Left Chat Title */}
                      <ul className="user-list">
                        {previousMessages &&
                          previousMessages.map((item, index) => (
                            <li className="user-list-item" key={index}>
                              {/* Use Link to navigate to the new URL */}
                              <Link to={`/patient/patient-chat/${item.consultantId}`}>
                                <div className="avatar avatar-online">
                                  <img src={item.profileImage ? item.profileImage :  "/assets/images/doctor-thumb-01.png"  } alt="profile" />
                                </div>
                                <div className="users-list-body">
                                  <div>
                                    <h5>{item.displayName}</h5>
                                    <p>
                                      {item?.lastMessage?.messageType === "text" &&
                                        item?.lastMessage?.message}
                                    </p>
                                  </div>
                                  <div className="last-chat-time">
                                    {/* Add any additional time information if needed */}
                                  </div>
                                </div>
                              </Link>
                            </li>
                          ))}
                      </ul>
                    </div>
                  </div>
                </div>
                {/* / Chats sidebar */}
              </div>
              {/* /Sidebar group */}
              {id === "messages"
                ?
                <div className="container d-flex justify-content-center default-chat-message-window">
                  <div className="card d-flex align-items-center" style={{ textAlign: 'center' }}>
                    <img style={{width: "250px"}} src="https://img.freepik.com/free-vector/doctor-character-with-patient_23-2147792564.jpg?t=st=1736848531~exp=1736852131~hmac=5d607f6027a5bdc345f90fed70c7ebdde3a29a97912392bf7d7aea4a1db05e30&w=826" className="card-img-top" alt="Select a doctor" />
                    <div className="card-body">
                      <h5 className="card-title">Welcome to your Medical Chat!</h5>
                      <p className="card-text">Select a doctor to begin your consultation and get the assistance you need.</p>
                    </div>
                  </div>
                </div>
                :
                <div className="chat chat-messages" id="middle">
                  <div className="slimscroll">
                    <div className="chat-inner-header" style={{ position: 'sticky', top: 0, zIndex: 1000 }}>
                      <div className="chat-header">
                        <div className="user-details">
                          <div className="d-lg-none">
                            <ul className="list-inline mt-2 me-2">
                              <li className="list-inline-item">
                                <Link
                                  className="text-muted px-0 left_sides"
                                  to="#"
                                  data-chat="open"
                                >
                                  <i className="fas fa-arrow-left" />
                                </Link>
                              </li>
                            </ul>
                          </div>
                          <figure className="avatar ms-1 avatar-online">
                            <img
                              src={receiverDetails && receiverDetails.profileImage ? receiverDetails.profileImage : "/assets/images/doctor-thumb-01.png"}
                              alt="image"
                            />
                          </figure>
                          <div className="mt-1">
                            <h5>{receiverDetails?.information?.displayName}</h5>
                            <div className="message-counter" style={{ fontSize: '12px', color: limitReached ? '#dc3545' : '#6c757d' }}>
                              Daily messages: {dailyMessageCount}/{dailyMessageLimit}
                              {limitReached && (
                                <span style={{ color: '#dc3545', fontWeight: 'bold' }}> - Limit Reached</span>
                              )}
                            </div>
                          </div>
                        </div>
                       
                        {/* Chat Search */}
                        <div className="chat-search">
                          <form>
                            <span className="form-control-feedback">
                              <i className="fa-solid fa-magnifying-glass" />
                            </span>
                            <input
                              type="text"
                              name="chat-search"
                              placeholder="Search Chats"
                              className="form-control"
                            />
                            <div className="close-btn-chat">
                              <i className="fa fa-close" />
                            </div>
                          </form>
                        </div>
                        {/* /Chat Search */}
                      </div>
                    </div>
                    <div className="chat-body" style={{paddingTop: '20px'}}>
                      <div className="messages">
                        {
                          messages.map((msg, index) => (
                            <div className={`chats ${msg?.senderId == senderId ? "chats-right" : ""}`} ref={messagesEndRef}>
                              <div className="chat-content">
                                <div className="message-content">
                                  {msg.messageType === "text" ? (
                                    <p>{msg.message}</p>
                                  ) : msg.messageType === "voice" ? (
                                    msg.base64Data ? (
                                      <div className="voice-message">
                                        {(() => {
                                          const blob = convertBase64ToBlob(msg.base64Data, "audio/wav");
                                          if (blob) {
                                            const objectURL = URL.createObjectURL(blob);
                                            return (
                                              <>
                                                <audio controls>
                                                  <source src={objectURL} type="audio/wav" />
                                                  Your browser does not support the audio element.
                                                </audio>
                                                <a
                                                  href={`data:audio/wav;base64,${msg.base64Data}`}
                                                  download="audio.wav"
                                                >
                                                  Download Audio
                                                </a>
                                              </>
                                            );
                                          } else {
                                            return <p>Error rendering audio. Invalid data.</p>;
                                          }
                                        })()}
                                      </div>
                                    ) : (
                                      <p>Audio not available</p>
                                    )
                                  ) : msg.messageType === "media" ? (
                                    msg.base64Data ? (
                                      msg.base64Data.startsWith("/9j/") ||
                                        msg.base64Data.startsWith("iVBORw0KGgo") ? (
                                        <img
                                          src={`data:image/jpeg;base64,${msg.base64Data}`}
                                          alt="Media"
                                          className="media-image"
                                        />
                                      ) : msg.base64Data.startsWith("AA") ? (
                                        <video controls>
                                          <source
                                            src={`data:video/mp4;base64,${msg.base64Data}`}
                                            type="video/mp4"
                                          />
                                          Your browser does not support the video element.
                                        </video>
                                      ) : (
                                        <p>Unsupported media type</p>
                                      )
                                    ) : (
                                      <p>Unsupported media type</p>
                                    )
                                  ) : (
                                    <p>Unsupported message type</p>
                                  )}
 
                                </div>
                              </div>
                            </div>
                          ))
                        }
 
                      </div>
 
                    </div>
                  </div>
                  <div className="chat-footer">
                    <form>
                      <div className="smile-foot">
                        <div className="chat-action-btns">
                          <div className="chat-action-col">
                            <Link
                              className="action-circle"
                              to="#"
                              data-bs-toggle="dropdown"
                            >
                              <i className="fa-solid fa-ellipsis-vertical" />
                            </Link>
                            <div className="dropdown-menu dropdown-menu-end">
                              {/* <Link to="#" className="dropdown-item ">
                              <span>
                                <i className="fa-solid fa-file-lines" />
                              </span>
                              Document
                            </Link> */}
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                style={{ display: 'none' }}
                                id="media-file-input"
                                className="dropdown-item"
                              />
 
                              <label htmlFor="media-file-input"><span className="p-2">
                                <i className="fa-solid fa-file-lines" />
                              </span> Upload File</label>
 
 
                            </div>
                          </div>
                        </div>
                      </div>
 
                      <div className="smile-foot">
                        {/* <Link to="#" className="action-circle">
                        <i className="fa-solid fa-microphone" />
                      </Link> */}
                        {isRecording ? (
                          <button style={{ backgroundColor: "#008080", borderRadius: "5px" }} onClick={stopRecording}><i className="fa-solid fa-circle-notch fa-spin" style={{ color: 'red' }} /></button>
                        ) : (
                          <button style={{ backgroundColor: "#008080", borderRadius: "5px" }} onClick={startRecording}><i className="fa-solid fa-microphone" /></button>
                        )}
                      </div>
                      {mediaFile && (
                        <div className="d-flex align-items-center mb-2">
                          <div style={{ position: "relative", display: "inline-block" }}>
                            <img
                              src={URL.createObjectURL(mediaFile)}
                              alt="Selected"
                              style={{
                                width: 64,
                                height: 64,
                                objectFit: "cover",
                                borderRadius: 8,
                                border: "2px solid #007bff",
                              }}
                            />
                            <button
                              type="button"
                              className="btn p-0"
                              onClick={() => setMediaFile(null)}
                              style={{
                                position: "absolute",
                                top: 2,
                                right: 2,
                                background: "#fff",
                                border: "none",
                                borderRadius: "50%",
                                width: 22,
                                height: 22,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                boxShadow: "0 1px 4px rgba(0,0,0,0.12)",
                                padding: 0,
                              }}
                              aria-label="Remove"
                            >
                              <i className="fa-solid fa-xmark" style={{ fontSize: 12, color: "#dc3545" }} />
                            </button>
                          </div>
                        </div>
                      )}
                      {audioBlob ? (
                        <div className="d-flex align-items-center justify-content-center w-100">
                          <audio className="w-100" controls src={URL.createObjectURL(audioBlob)} />
                          <button onClick={() => setAudioBlob(null)} className="btn remove-audio">
                            <i className="fa-solid fa-trash" />
                          </button>
                        </div>) : (
                          <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="form-control chat_form"
                            placeholder={limitReached ? "Daily message limit reached" : "Type your message here..."}
                            disabled={limitReached} // ADD THIS
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && !limitReached) { // ADD !limitReached check
                                e.preventDefault();
                                handleSendMessage(e);
                              }
                            }}
                          />
                        )
                      }
                      <div className="form-buttons">
                        <button
                          onClick={(e) => handleSendMessage(e)}
                          className="btn send-btn"
                          type="submit"
                          disabled={limitReached} // ADD THIS
                          style={{ opacity: limitReached ? 0.5 : 1 }} // ADD THIS for visual feedback
                        >
                          <i className="fa-solid fa-paper-plane" />
                        </button>
                      </div>
                    </form>
                  </div>
                  {errorMessage && (
                <div
                style={{
                backgroundColor: '#f8d7da', // Light red background
                color: '#721c24', // Dark red text
                border: '1px solid #f5c6cb', // Border matching the background
                borderRadius: '5px', // Rounded corners
                padding: '10px', // Padding inside the box
                marginTop: '10px', // Space above the error message
                fontSize: '14px', // Font size
                textAlign: 'center', // Center the text
                animation: 'fadeIn 0.5s ease-in-out', // Optional fade-in animation
                }}
                >
                {errorMessage}
                </div>
                )}
                  {limitWarning && (
                    <div
                      style={{
                        backgroundColor: '#fff3cd',
                        color: '#856404',
                        border: '1px solid #ffeaa7',
                        borderRadius: '5px',
                        padding: '10px',
                        marginTop: '10px',
                        fontSize: '14px',
                        textAlign: 'center',
                      }}
                    >
                      {limitWarning}
                    </div>
                  )}
                </div>
              }
            </div>
          </div>
        </div>
      </div>
       <DoctorFooter {...props} /> 
    </div>
  );
};
 
export default PatientChat;