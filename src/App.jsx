import React, { useState, useEffect } from 'react';
import { Calendar, Plus, LogOut } from 'lucide-react';
import { GoogleSignIn } from './components/Auth/GoogleSignIn';
import { EventForm } from './components/Calendar/EventForm';
import { EventTable } from './components/Calendar/EventTable';
import { authService } from './services/authService';
import { eventService } from './services/eventService';
import './styles/main.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [showEventForm, setShowEventForm] = useState(false);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchEvents();
    }
  }, [isAuthenticated]);

  const checkAuth = async () => {
    try {
      const userData = await authService.getCurrentUser();
      if (userData) {
        setIsAuthenticated(true);
        setUser(userData);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEvents = async () => {
    try {
      const eventData = await eventService.getEvents();
      setEvents(eventData);
    } catch (error) {
      console.error('Failed to fetch events:', error);
    }
  };

  const handleCreateEvent = async (eventData) => {
    try {
      const newEvent = await eventService.createEvent(eventData);
      setEvents([...events, newEvent]);
      setShowEventForm(false);
    } catch (error) {
      console.error('Failed to create event:', error);
      alert('Failed to create event. Please try again.');
    }
  };

  const handleEditEvent = async (eventData) => {
    try {
      const updatedEvent = await eventService.updateEvent(selectedEvent._id, eventData);
      setEvents(events.map(event => 
        event._id === selectedEvent._id ? updatedEvent : event
      ));
      setSelectedEvent(null);
      setShowEventForm(false);
    } catch (error) {
      console.error('Failed to update event:', error);
      alert('Failed to update event. Please try again.');
    }
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      await eventService.deleteEvent(eventId);
      setEvents(events.filter(event => event._id !== eventId));
    } catch (error) {
      console.error('Failed to delete event:', error);
      alert('Failed to delete event. Please try again.');
    }
  };

  const openEditForm = (event) => {
    setSelectedEvent(event);
    setShowEventForm(true);
  };

  const closeForm = () => {
    setSelectedEvent(null);
    setShowEventForm(false);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="app">
      <header className="header">
        <div className="container">
          <div className="header-content">
            <div className="header-title">
              <Calendar className="header-icon" size={32} />
              <h3>Google Calendar Events</h3>
            </div>
            {!isAuthenticated ? (
              <GoogleSignIn />
            ) : (
              <div className="user-controls">
                <span className="user-name">{user?.name}</span>
                <button onClick={authService.logout} className="btn btn-white">
                  <LogOut size={20} />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="container">
        {isAuthenticated ? (
          <div className="content">
            <div className="actions-bar">
              <h2>Your Events</h2>
              <button
                onClick={() => setShowEventForm(true)}
                className="btn btn-primary"
              >
                <Plus size={20} />
                Create Event
              </button>
            </div>

            <EventTable
              events={events}
              onEdit={openEditForm}
              onDelete={handleDeleteEvent}
            />

            {showEventForm && (
              <EventForm
                event={selectedEvent}
                onClose={closeForm}
                onSubmit={selectedEvent ? handleEditEvent : handleCreateEvent}
              />
            )}
          </div>
        ) : (
          <div className="welcome">
            <h2>Welcome to Calendar Integration</h2>
            <p>Please sign in with Google to manage your calendar events.</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;