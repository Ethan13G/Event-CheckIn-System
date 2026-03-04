class InMemoryStorage {
  constructor() {
    this.events = new Map();
    this.attendees = new Map();
  }

  saveEvent(event) {
    this.events.set(event.id, event);
  }

  getEvent(id) {
    return this.events.get(id);
  }

  saveAttendee(eventId, attendee) {
    if (!this.attendees.has(eventId)) {
      this.attendees.set(eventId, []);
    }
      if (attendee.email) {
    attendee.email = String(attendee.email).toLowerCase();
   }
    const list = this.attendees.get(eventId);
    const idx = list.findIndex(a => a.email === attendee.email);
    if (idx !== -1) {
      list[idx] = attendee;
    } else {
      list.push(attendee);
    }
  }

  findAttendee(eventId, email) {
    if (!email) return undefined;
    const needle = String(email).toLowerCase();
    const list = this.getAttendees(eventId);
    return list.find(a => a.email === needle);
  }

  getAttendees(eventId) {
    return this.attendees.get(eventId) || [];
  }
}

module.exports = { InMemoryStorage };