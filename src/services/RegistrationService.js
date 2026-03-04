class RegistrationService {
  constructor(storage) {
    this.storage = storage;
  }

  registerAttendee(eventId, email, name) {
    eventId = eventId && String(eventId).trim();
    email = email && String(email).trim().toLowerCase();
    name = name && String(name).trim();

    const event = this.storage.getEvent(eventId);
    if (!event) {
      throw new Error('Event not found');
    }
    if (!email || !name) {
      throw new Error('Invalid attendee data');
    }
    if (!/^[^@]+@[^@]+\.[^@]+$/.test(email)) {
      throw new Error('Invalid email');
    }
    const existing = this.storage.findAttendee(eventId, email);
    if (existing) {
      throw new Error('Attendee already registered');
    }
    const attendee = { email, name, checkedIn: false };
    this.storage.saveAttendee(eventId, attendee);
    return attendee;
  }
}

module.exports = { RegistrationService };