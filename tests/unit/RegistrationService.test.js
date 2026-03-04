const { RegistrationService } = require('../../src/services/RegistrationService');

// minimal fake storage implementing required methods
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

let service;
beforeEach(() => {
  service = new RegistrationService(new FakeStorage());
});

test('throws when event not in storage', () => {
  expect(() => service.registerAttendee('none', 'a@b.com', 'A')).toThrow('Event not found');
});

test('validates email format', () => {
  service.storage.saveEvent({ id: '1', name: 'E', date: '2025-01-01' });
  expect(() => service.registerAttendee('1', 'bad', 'A')).toThrow('Invalid email');
});

test('prevents duplicate registrations', () => {
  service.storage.saveEvent({ id: '1', name: 'E', date: '2025-01-01' });
  service.registerAttendee('1', 'a@b.com', 'A');
  expect(() => service.registerAttendee('1', 'a@b.com', 'A')).toThrow('Attendee already registered');
});

test('register trims inputs and normalizes email casing', () => {
  service.storage.saveEvent({ id: '1', name: 'E', date: '2025-01-01' });
  const att = service.registerAttendee('1', '  A@B.COM  ', '  John Doe  ');
  expect(att.email).toBe('a@b.com');
  expect(att.name).toBe('John Doe');
  const attendees = service.storage.getAttendees('1');
  expect(attendees.length).toBe(1);
  expect(attendees[0].email).toBe('a@b.com');
  expect(attendees[0].name).toBe('John Doe');
});

test('register rejects empty name or email', () => {
  service.storage.saveEvent({ id: '1', name: 'E', date: '2025-01-01' });
  expect(() => service.registerAttendee('1', '   ', 'Name')).toThrow('Invalid attendee data');
  expect(() => service.registerAttendee('1', 'a@b.com', '   ')).toThrow('Invalid attendee data');
});

test('register returns attendee on success', () => {
  service.storage.saveEvent({ id: '2', name: 'E2', date: '2025-01-02' });
  const att = service.registerAttendee('2', 'c@d.com', 'C');
  expect(att).toEqual({ email: 'c@d.com', name: 'C', checkedIn: false });
});