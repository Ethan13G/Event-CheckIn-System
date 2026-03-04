const fs = require('fs');
const path = require('path');

class FileStorage {
  constructor(dir) {
    this.fs = fs;
    this.path = path;
    this.dir = dir;
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    this.eventsFile = path.join(dir, 'events.json');
    this.attendeesFile = path.join(dir, 'attendees.json');
    this._load();
  }

  _load() {
    try {
      const raw = this.fs.readFileSync(this.eventsFile, 'utf8');
      this.events = new Map(JSON.parse(raw));
    } catch (e) {
      this.events = new Map();
    }
    try {
      const raw2 = this.fs.readFileSync(this.attendeesFile, 'utf8');
      const arr = JSON.parse(raw2);
      this.attendees = new Map(arr);
    } catch (e) {
      this.attendees = new Map();
    }
  }

  _saveEvents() {
    this.fs.writeFileSync(this.eventsFile, JSON.stringify([...this.events]));
  }

  _saveAttendees() {
    this.fs.writeFileSync(this.attendeesFile, JSON.stringify([...this.attendees]));
  }

  saveEvent(event) {
    this.events.set(event.id, event);
    this._saveEvents();
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
    const idx = list.findIndex(a => (a.email && String(a.email).toLowerCase()) === (attendee.email && String(attendee.email).toLowerCase()));
    if (idx !== -1) {
      list[idx] = attendee;
    } else {
      list.push(attendee);
    }
    this._saveAttendees();
  }

  getAttendees(eventId) {
    return this.attendees.get(eventId) || [];
  }

  findAttendee(eventId, email) {
    if (!email) return undefined;
    const needle = String(email).toLowerCase();
    const list = this.getAttendees(eventId);
    return list.find(a => (a.email && String(a.email).toLowerCase()) === needle);
  }
}

module.exports = { FileStorage };