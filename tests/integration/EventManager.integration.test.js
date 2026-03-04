const fs = require('fs');
const os = require('os');
const path = require('path');
const { EventManager, FileStorage } = require('../../src/EventManager');

let tmpDir;

beforeEach(() => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'event-test-'));
});

afterEach(() => {
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

// ensure basic persistence works across manager instances

test('register attendee stored and retrievable', () => {
  const manager = new EventManager(new FileStorage(tmpDir));
  manager.createEvent('1', 'Persistent Event', '2025-01-01');
  manager.registerAttendee('1', 'a@b.com', 'A');

  const manager2 = new EventManager(new FileStorage(tmpDir));
  const report = manager2.generateReport('1');
  expect(report.totalRegistered).toBe(1);
});