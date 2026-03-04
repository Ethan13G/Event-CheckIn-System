class EventService {
  constructor(storage) {
    this.storage = storage;
  }

  createEvent(id, name, date) {
    // normalize and validate inputs
    id = id && String(id).trim();
    name = name && String(name).trim();
    date = date && String(date).trim();
    if (!id || !name || !date) {
      throw new Error('Invalid event data');
    }

    // validate the date string can be parsed and store as ISO
    const parsed = new Date(date);
    if (isNaN(parsed.getTime())) {
      throw new Error('Invalid event date');
    }
    if (this.storage.getEvent(id)) {
      throw new Error('Event already exists');
    }
    const event = { id, name, date: parsed.toISOString(), attendees: [] };
    this.storage.saveEvent(event);
    return event;
  }
}

module.exports = { EventService };