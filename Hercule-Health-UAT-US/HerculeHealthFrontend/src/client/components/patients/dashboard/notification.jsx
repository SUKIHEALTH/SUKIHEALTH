import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { io } from 'socket.io-client';
import baseUrl from '../../../../config/config';

function Notification() {
  const [notifications, setNotifications] = useState([]);
  const userId = localStorage.getItem("userData");
  const socketRef = useRef(null); // Store socket instance

  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io(baseUrl); // Initialize socket once
    }
    const socket = socketRef.current;

    if (userId) {
      socket.emit('joinUserRoom', userId);
      socket.emit('subscribeToNotifications', userId);
    }

    const handleInitialNotifications = (data) => {
      setNotifications(data);
    };

    const handleNewNotification = (notification) => {
      setNotifications((prev) => [...prev, notification]);
    };

    socket.on('initialNotifications', handleInitialNotifications);
    socket.on('newNotification', handleNewNotification);

    return () => {
      socket.off('initialNotifications', handleInitialNotifications);
      socket.off('newNotification', handleNewNotification);
    };
  }, [userId]); // Only re-run if userId changes

  const getNotificationIcon = (type) => {
    switch (type) {
      case "Appointment":
        return "fa-solid fa-calendar-check";
      case "LabResultRequest":
        return "fa-solid fa-flask";
      case "Payment":
        return "fa-solid fa-money-bill-1-wave";
      default:
        return "fa-solid fa-bell";
    }
  };

  return (
    <>
      <li className="nav-item dropdown noti-nav me-3 pe-0">
        <Link
          to="#"
          className="dropdown-toggle nav-link p-0"
          data-bs-toggle="dropdown"
        >
          <i className="fa-solid fa-bell" /> 
        </Link>
        <div className="dropdown-menu notifications dropdown-menu-end ">
          <div className="topnav-dropdown-header">
            <span className="notification-title">Notifications</span>
          </div>
          <div className="noti-content">
            <ul className="notification-list">
              {notifications.length === 0 ? (
                <li className="notification-message text-center">
                  <div className="media d-flex">
                    <div className="media-body">
                      <div className="table-noti-info">
                        <div className="table-noti-icon color-gray">
                          <i className="fa-solid fa-bell-slash" />
                        </div>
                        <h6>No Notifications Found</h6>
                      </div>
                    </div>
                  </div>
                </li>
              ) : (
                notifications.map((notification, index) => (
                  <li className="notification-message" key={notification._id || index}>
                    <Link to="#">
                      <div className="media d-flex">
                        <div className="media-body">
                          <h6>{notification.userName}</h6>
                          <div className="table-noti-info">
                            <div className={`table-noti-icon color-${notification.type.toLowerCase()}`}>
                              <i className={getNotificationIcon(notification.type)} />
                            </div>
                            <p className="noti-details">
                              {notification.message}{" "}
                              <span className="noti-title">{notification.details}</span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      </li>
    </>
  );
}

export default Notification;
