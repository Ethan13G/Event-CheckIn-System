#!/usr/bin/env node

const { EventManager } = require('./EventManager');
const readline = require('readline');

const manager = new EventManager();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('Event Check-In System');
console.log('Commands: create, register, checkin, report, exit');

function prompt() {
  rl.question('> ', answer => {
    const raw = answer && String(answer).trim();
    if (!raw) return prompt();
    const [cmd, ...args] = raw.split(/\s+/);
    try {
      switch (cmd) {
        case 'create': {
          const [id, ...rest] = args;
          const date = rest.length ? rest[rest.length - 1] : undefined;
          const name = rest.length ? rest.slice(0, -1).join(' ') : undefined;
          const ev = manager.createEvent(id && id.trim(), name && name.trim(), date && date.trim());
          console.log('Created', ev);
          break;
        }
        case 'register': {
          const [eventId, email, ...nameParts] = args;
          const name = nameParts.join(' ');
          const att = manager.registerAttendee(eventId && eventId.trim(), email && email.trim(), name && name.trim());
          console.log('Registered', att);
          break;
        }
        case 'checkin': {
          const [eventId, email] = args;
          const att = manager.checkIn(eventId && eventId.trim(), email && email.trim());
          console.log('Checked in', att);
          break;
        }
        case 'report': {
          const [eventId] = args;
          const report = manager.generateReport(eventId && eventId.trim());
          console.log(JSON.stringify(report, null, 2));
          break;
        }
        case 'exit':
          rl.close();
          return;
        default:
          console.log('Unknown command');
      }
    } catch (e) {
      console.error('Error:', e.message);
    }
    prompt();
  });
}

prompt();