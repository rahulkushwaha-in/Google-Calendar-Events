const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const { getCalendarService } = require('../utils/googleAuth');

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  next();
};

// Get all events
router.get('/', isAuthenticated, async (req, res) => {
  try {
    // / Get calendar service
    const calendar = await getCalendarService(req.user.accessToken, req.user.refreshToken);
    
    //fetch events from google calendar
    const googleEvents = await calendar.events.list({
      calendarId: 'primary',
      timeMin: new Date().toISOString(),
      maxResults: 100,
      singleEvents: true,
      orderBy: 'startTime' 
    })

    //Get events from DB
    // Update or create events
    const syncedEvents = await Promise.all(
      googleEvents.data.items.map(async (googleEvent) => {
        return await Event.findOneAndUpdate(
          { googleEventId: googleEvent.id },
          {
            userId: req.user._id,
            title: googleEvent.summary,
            description: googleEvent.description || '',
            startTime: googleEvent.start.dateTime || googleEvent.start.date,
            endTime: googleEvent.end.dateTime || googleEvent.end.date
          },
          { 
            upsert: true, 
            new: true 
          }
        );
      })
    );

    res.json(syncedEvents);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// Create event
router.post('/', isAuthenticated, async (req, res) => {
  try {
    const { title, description, start, end } = req.body;

    // Get calendar service
    const calendar = await getCalendarService(req.user.accessToken, req.user.refreshToken);
    
    // Create in Google Calendar
    const googleEvent = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: {
        summary: title,
        description,
        start: { dateTime: start },
        end: { dateTime: end }
      }
    });

    // Create in database
    const event = await Event.create({
      googleEventId: googleEvent.data.id,
      userId: req.user._id,
      title,
      description,
      startTime: start,
      endTime: end
    });

    res.status(201).json(event);
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ error: 'Failed to create event' });
  }
});

// Update event
router.put('/:id', isAuthenticated, async (req, res) => {
  try {
    const { title, description, start, end } = req.body;
    const event = await Event.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Get calendar service
    const calendar = await getCalendarService(req.user.accessToken, req.user.refreshToken);
    
    // Update in Google Calendar
    await calendar.events.update({
      calendarId: 'primary',
      eventId: event.googleEventId,
      requestBody: {
        summary: title,
        description,
        start: { dateTime: start },
        end: { dateTime: end }
      }
    });

    // Update in database
    event.title = title;
    event.description = description;
    event.startTime = start;
    event.endTime = end;
    await event.save();

    res.json(event);
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ error: 'Failed to update event' });
  }
});

// Delete event
router.delete('/:id', isAuthenticated, async (req, res) => {
  try {
    const event = await Event.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Get calendar service
    const calendar = await getCalendarService(req.user.accessToken, req.user.refreshToken);
    
    // Delete from Google Calendar
    await calendar.events.delete({
      calendarId: 'primary',
      eventId: event.googleEventId
    });

    // Delete from database
    await event.deleteOne();
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ error: 'Failed to delete event' });
  }
});

module.exports = router;