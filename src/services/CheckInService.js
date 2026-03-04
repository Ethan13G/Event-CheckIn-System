class CheckInService {
  constructor(storage) {
    this.storage = storage;
  }

  checkIn(eventId, email) {
    // normalize inputs
    eventId = eventId && String(eventId).trim();
    email = email && String(email).trim().toLowerCase();

    const event = this.storage.getEvent(eventId);
    if (!event) {
      throw new Error('Event not found');
    }
    const attendee = this.storage.findAttendee(eventId, email);
    if (!attendee) {
      throw new Error('Attendee not registered');
    }
    if (attendee.checkedIn) {
      throw new Error('Already checked in');
    }
    attendee.checkedIn = true;
    this.storage.saveAttendee(eventId, attendee);
    return attendee;
  }
}

module.exports = { CheckInService };