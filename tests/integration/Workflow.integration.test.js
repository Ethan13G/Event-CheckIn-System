const fs = require('fs');
const os = require('os');
const path = require('path');
const { EventManager, FileStorage } = require('../../src/EventManager');

let tmpDir;

beforeEach(() => {
  // create a fresh temporary directory for each test
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'event-test-'));
});

afterEach(() => {
  // clean up on disk so tests remain isolated
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

// Integration tests verifying persistence through FileStorage

test('register and check-in updates report accordingly', () => {  
  const manager = new EventManager(new FileStorage(tmpDir));
  manager.createEvent('2', 'Checkin Event', '2025-02-02');
  manager.registerAttendee('2', 'u@v.com', 'U');
  manager.checkIn('2', 'u@v.com');

  const manager2 = new EventManager(new FileStorage(tmpDir));
  const report = manager2.generateReport('2');
  expect(report.totalCheckedIn).toBe(1);
});

test('full workflow from creation to report', () => {
  const manager = new EventManager(new FileStorage(tmpDir));
  manager.createEvent('3', 'Full Workflow', '2025-03-03');
  manager.registerAttendee('3', 'x@y.com', 'X');
  manager.registerAttendee('3', 'y@z.com', 'Y');
  manager.checkIn('3', 'x@y.com');

  const manager2 = new EventManager(new FileStorage(tmpDir));
  const report = manager2.generateReport('3');
  expect(report.eventName).toBe('Full Workflow');
  expect(report.totalRegistered).toBe(2);
  expect(report.totalCheckedIn).toBe(1);
});
