import * as readline from 'readline';
class Logger {
  static info(msg: string) { console.log(`[INFO] ${msg}`); }
  static error(msg: string) { console.error(`[ERROR] ${msg}`); }
}
interface PaymentStrategy { pay(amount: number): void; }
class CardPayment implements PaymentStrategy { pay(amount: number) { Logger.info(`Paid ${amount} using Card.`); } }
class UpiPayment implements PaymentStrategy { pay(amount: number) { Logger.info(`Paid ${amount} using UPI.`); } }
class PaymentContext { constructor(private strategy: PaymentStrategy) {} execute(amount: number) { this.strategy.pay(amount); }}
interface Observer { update(msg: string): void; }
class User implements Observer { constructor(private name: string) {} update(msg: string) { Logger.info(`${this.name} received: ${msg}`); }}
class ChatRoom { private observers: Observer[] = []; addUser(u: Observer) { this.observers.push(u); } notify(msg: string) { this.observers.forEach(o => o.update(msg)); }}
class Config {
  private static instance: Config;
  private constructor(public appName: string) {}
  static getInstance() { return this.instance ??= new Config("PatternApp"); }
}
interface Shape { draw(): void; }
class Circle implements Shape { draw() { Logger.info("Drawing Circle"); } }
class Square implements Shape { draw() { Logger.info("Drawing Square"); } }
class ShapeFactory { static create(type: string): Shape | null { if (type === 'circle') return new Circle(); if (type === 'square') return new Square(); return null; }}
class OldPrinter { oldPrint(text: string) { Logger.info(`OldPrinter: ${text}`); }}
interface Printer { print(text: string): void; }
class PrinterAdapter implements Printer { constructor(private oldPrinter: OldPrinter) {} print(text: string) { this.oldPrinter.oldPrint(text); }}
interface Notifier { send(msg: string): void; }
class BasicNotifier implements Notifier { send(msg: string) { Logger.info(`Message: ${msg}`); }}
class EmailNotifier implements Notifier { constructor(private wrap: Notifier) {} send(msg: string) { this.wrap.send(msg); Logger.info(`Email sent: ${msg}`); }}
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
function menu() {
  Logger.info("Choose option: 1-Strategy, 2-Observer, 3-Singleton, 4-Factory, 5-Adapter, 6-Decorator, 0-Exit");
  rl.question('> ', (ans) => {
    try {
      switch(ans.trim()) {
        case '1': new PaymentContext(new CardPayment()).execute(100); break;
        case '2': const room = new ChatRoom(); room.addUser(new User("Alice")); room.addUser(new User("Bob")); room.notify("Hello!"); break;
        case '3': Logger.info(Config.getInstance().appName); break;
        case '4': ShapeFactory.create('circle')?.draw(); break;
        case '5': new PrinterAdapter(new OldPrinter()).print("Adapted Print"); break;
        case '6': new EmailNotifier(new BasicNotifier()).send("Hi there"); break;
        case '0': rl.close(); return;
        default: Logger.error("Invalid input");
      }
    } catch(e) { Logger.error((e as Error).message); }
    menu();
  });
}
menu();
