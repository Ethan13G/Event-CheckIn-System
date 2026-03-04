const { EventManager } = require('../../src/EventManager');

// using a fake storage to isolate logic
class FakeStorage {
  constructor() {
    this.events = new Map();
    this.attendees = new Map();
  }
  saveEvent(event) { this.events.set(event.id, event); }
  getEvent(id) { return this.events.get(id); }
  saveAttendee(eventId, attendee) {
    if (!this.attendees.has(eventId)) this.attendees.set(eventId, []);
    const list = this.attendees.get(eventId);
    const idx = list.findIndex(a => (a.email && String(a.email).toLowerCase()) === (attendee.email && String(attendee.email).toLowerCase()));
    if (idx !== -1) list[idx] = attendee;
    else list.push(attendee);
  }
  getAttendees(eventId) { return this.attendees.get(eventId) || []; }
  findAttendee(eventId, email) {
    if (!email) return undefined;
    const needle = String(email).toLowerCase();
    const list = this.getAttendees(eventId);
    return list.find(a => (a.email && String(a.email).toLowerCase()) === needle);
  }
}

let manager;
beforeEach(() => {
  manager = new EventManager(new FakeStorage());
});

test('createEvent should throw when data invalid', () => {
  expect(() => manager.createEvent()).toThrow('Invalid event data');
});

test('registerAttendee validates email format', () => {
  manager.createEvent('1', 'Event', '2025-01-01');
  expect(() => manager.registerAttendee('1', 'bademail', 'Name')).toThrow('Invalid email');
});

test('register trims inputs and normalizes email casing', () => {
  manager.createEvent('1', 'Event', '2025-01-01');
  manager.registerAttendee('1', '  A@B.COM  ', '  John Doe  ');
  const attendees = manager.storage.getAttendees('1');
  expect(attendees.length).toBe(1);
  const a = attendees[0];
  expect(a.email).toBe('a@b.com');
  expect(a.name).toBe('John Doe');
});

test('register rejects empty name or email', () => {
  manager.createEvent('1', 'Event', '2025-01-01');
  expect(() => manager.registerAttendee('1', '   ', 'Name')).toThrow('Invalid attendee data');
  expect(() => manager.registerAttendee('1', 'a@b.com', '   ')).toThrow('Invalid attendee data');
});

test('registerAttendee prevents duplicates', () => {
  manager.createEvent('1', 'Event', '2025-01-01');
  manager.registerAttendee('1', 'a@b.com', 'A');
  expect(() => manager.registerAttendee('1', 'a@b.com', 'A')).toThrow('Attendee already registered');
});

test('checkIn requires registration', () => {
  manager.createEvent('1', 'Event', '2025-01-01');
  expect(() => manager.checkIn('1', 'a@b.com')).toThrow('Attendee not registered');
});

test('generateReport returns correct counts', () => {
  manager.createEvent('1', 'Event', '2025-01-01');
  manager.registerAttendee('1', 'a@b.com', 'A');
  manager.registerAttendee('1', 'b@c.com', 'B');
  manager.checkIn('1', 'a@b.com');
  const report = manager.generateReport('1');
  expect(report.totalRegistered).toBe(2);
  expect(report.totalCheckedIn).toBe(1);
});

test('checkIn prevents double check-in', () => {
  manager.createEvent('1', 'Event', '2025-01-01');
  manager.registerAttendee('1', 'a@b.com', 'A');
  manager.checkIn('1', 'a@b.com');
  expect(() => manager.checkIn('1', 'a@b.com')).toThrow('Already checked in');
});

test('register fails when event missing', () => {
  expect(() => manager.registerAttendee('missing', 'a@b.com', 'A')).toThrow('Event not found');
});

test('report fails when event missing', () => {
  expect(() => manager.generateReport('missing')).toThrow('Event not found');
});

test('createEvent should throw on invalid date', () => {
  expect(() => manager.createEvent('1', 'Event', 'not-a-date')).toThrow('Invalid event date');
});
