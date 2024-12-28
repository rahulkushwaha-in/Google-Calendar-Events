import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';

export const EventTable = ({ events, onEdit, onDelete }) => {

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleString();
    } catch (error) {
      return 'Invalid date';
    }
  };

  return (
    <div className="table-container">
      <table className="event-table">
        <thead>
          <tr>
            <th>Event</th>
            <th>Start Time</th>
            <th>End Time</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {events &&
          events.map((event) => (
            <tr key={event._id}>
              <td>
                <div className="event-title">{event.title}</div>
                {event.description && (
                  <div className="event-description">{event.description}</div>
                )}
              </td>
              <td>{formatDate(event.startTime || event.start)}</td>
              <td>{formatDate(event.endTime || event.end)}</td>
              <td>
                <div className="event-actions">
                  <button
                    onClick={() => onEdit && onEdit(event)}
                    className="btn-icon btn-edit"
                    title="Edit event"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => onDelete && onDelete(event._id)}
                    className="btn-icon btn-delete"
                    title="Delete event"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};