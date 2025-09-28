import * as readline from 'readline';
// ---------- Logger ----------
class Logger {
  static info(msg: string) { console.log(`[INFO] ${msg}`); }
  static error(msg: string) { console.error(`[ERROR] ${msg}`); }
}
// ---------- Observer Pattern ----------
interface Observer { update(): void; }
// ---------- Device Classes ----------
abstract class SmartDevice implements Observer {
  constructor(public id: number, public type: string) {}
  abstract status(): string;
  abstract update(): void;
}
class Light extends SmartDevice {
  private isOn = false;
  turnOn() { this.isOn = true; Logger.info(`Light ${this.id} ON`); }
  turnOff() { this.isOn = false; Logger.info(`Light ${this.id} OFF`); }
  status() { return `Light ${this.id} is ${this.isOn ? 'ON' : 'OFF'}`; }
  update() { Logger.info(`Light ${this.id} received system update`); }
}
class Thermostat extends SmartDevice {
  private temp = 70;
  setTemp(value: number) { this.temp = value; Logger.info(`Thermostat ${this.id} set to ${value}`); }
  status() { return `Thermostat ${this.id} is at ${this.temp}°F`; }
  update() { Logger.info(`Thermostat ${this.id} received system update`); }
}
class DoorLock extends SmartDevice {
  private locked = true;
  lock() { this.locked = true; Logger.info(`Door ${this.id} LOCKED`); }
  unlock() { this.locked = false; Logger.info(`Door ${this.id} UNLOCKED`); }
  status() { return `Door ${this.id} is ${this.locked ? 'LOCKED' : 'UNLOCKED'}`; }
  update() { Logger.info(`Door ${this.id} received system update`); }
}
// ---------- Factory ----------
class DeviceFactory {
  static create(type: string, id: number): SmartDevice | null {
    switch(type.toLowerCase()) {
      case 'light': return new Light(id,type);
      case 'thermostat': return new Thermostat(id,type);
      case 'door': return new DoorLock(id,type);
      default: Logger.error(`Unknown device type: ${type}`); return null;
    }
  }
}
// ---------- Smart Home System ----------
class SmartHome {
  private devices: Map<number, SmartDevice> = new Map();

  addDevice(device: SmartDevice) {
    this.devices.set(device.id, device);
    Logger.info(`Device ${device.id} (${device.type}) added.`);
  }
  execute(id: number, command: string, value?: number) {
    const device = this.devices.get(id);
    if(!device){ Logger.error(`Device ${id} not found.`); return; }

    if(device instanceof Light) {
      if(command === 'turnOn') device.turnOn();
      else if(command === 'turnOff') device.turnOff();
      else Logger.error('Invalid command for Light.');
    }
    else if(device instanceof Thermostat && command === 'setTemp' && value !== undefined) device.setTemp(value);
    else if(device instanceof DoorLock) {
      if(command === 'lock') device.lock();
      else if(command === 'unlock') device.unlock();
      else Logger.error('Invalid command for Door.');
    } else Logger.error('Invalid command or value.');
  }
  showStatus() {
    Logger.info('--- Smart Home Status ---');
    this.devices.forEach(d => Logger.info(d.status()));
    Logger.info('------------------------');
  }
  updateAll() { this.devices.forEach(d => d.update()); }
}
// ---------- CLI ----------
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const home = new SmartHome();
// Initialize devices
[{id:1,type:'light'}, {id:2,type:'thermostat'}, {id:3,type:'door'}].forEach(d => {
  const device = DeviceFactory.create(d.type,d.id);
  if(device) home.addDevice(device);
});
function menu() {
  Logger.info('Commands: turnOn id | turnOff id | lock id | unlock id | setTemp id value | status | update | exit');
  rl.question('> ', (input) => {
    try {
      const parts = input.trim().split(' ');
      const cmd = parts[0];
      if(cmd === 'exit') rl.close();
      else if(cmd === 'status') home.showStatus();
      else if(cmd === 'update') home.updateAll();
      else {
        const id = Number(parts[1]);
        const value = parts[2] ? Number(parts[2]) : undefined;
        home.execute(id, cmd, value);
      }
    } catch(e){ Logger.error((e as Error).message); }
    menu();
  });
}
menu();
