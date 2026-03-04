class ReportService {
  constructor(storage) {
    this.storage = storage;
  }

  generateReport(eventId) {
    eventId = eventId && String(eventId).trim();
    const event = this.storage.getEvent(eventId);
    if (!event) {
      throw new Error('Event not found');
    }
    const attendees = this.storage.getAttendees(eventId);
    const checkedIn = attendees.filter(a => a.checkedIn);
    return {
      eventName: event.name,
      totalRegistered: attendees.length,
      totalCheckedIn: checkedIn.length,
      checkedInAttendees: checkedIn
    };
  }
}

module.exports = { ReportService };