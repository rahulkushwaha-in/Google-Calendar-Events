import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export const EventForm = ({ event, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    start: '',
    end: '',
    description: ''
  });

  useEffect(() => {
    if (event) {
      const startDate = new Date(event.startTime || event.start);
      const endDate = new Date(event.endTime || event.end);
      
      setFormData({
        title: event.title || '',
        start: startDate.toISOString().slice(0, 16),
        end: endDate.toISOString().slice(0, 16),
        description: event.description || ''
      });
    }
  }, [event]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onSubmit({
        ...formData,
        start: new Date(formData.start).toISOString(),
        end: new Date(formData.end).toISOString()
      });
      onClose();
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>{event ? 'Edit Event' : 'Create Event'}</h2>
          <button onClick={onClose} className="btn-icon">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Event Title</label>
            <input
              type="text"
              required
              className="form-input"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Start Time</label>
            <input
              type="datetime-local"
              required
              className="form-input"
              value={formData.start}
              onChange={e => setFormData({ ...formData, start: e.target.value })}
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">End Time</label>
            <input
              type="datetime-local"
              required
              className="form-input"
              value={formData.end}
              onChange={e => setFormData({ ...formData, end: e.target.value })}
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-input"
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
          
          <button type="submit" className="btn btn-primary">
            {event ? 'Update Event' : 'Create Event'}
          </button>
        </form>
      </div>
    </div>
  );
};