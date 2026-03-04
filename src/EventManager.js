const { EventService } = require('./services/EventService');
const { RegistrationService } = require('./services/RegistrationService');
const { CheckInService } = require('./services/CheckInService');
const { ReportService } = require('./services/ReportService');
const { InMemoryStorage } = require('./storage/InMemoryStorage');
const { FileStorage } = require('./storage/FileStorage');

class EventManager {
  constructor(storage) {
    this.storage = storage || new InMemoryStorage();
    this.eventService = new EventService(this.storage);
    this.registrationService = new RegistrationService(this.storage);
    this.checkInService = new CheckInService(this.storage);
    this.reportService = new ReportService(this.storage);
  }

  createEvent(id, name, date) {
    return this.eventService.createEvent(id, name, date);
  }

  registerAttendee(eventId, email, name) {
    return this.registrationService.registerAttendee(eventId, email, name);
  }

  checkIn(eventId, email) {
    return this.checkInService.checkIn(eventId, email);
  }

  generateReport(eventId) {
    return this.reportService.generateReport(eventId);
  }
}

// re-export storage classes for backwards compatibility
module.exports = { EventManager, InMemoryStorage, FileStorage };