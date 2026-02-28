import { EventEmitter } from 'nodemailer/lib/xoauth2';
import { sendEmail } from './sendEmail';

export enum EMAIL_EVENTS_ENUM {
  VERIFY_EMAIL = 'VERIFY_EMAIL',
  RESET_PASSWORD = 'RESET_PASSWORD',
}

export class EmailEvents {
  constructor(private readonly emitter: EventEmitter) {}

  subscribe = (event: EMAIL_EVENTS_ENUM, callback: (payload: any) => void) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    this.emitter.on(event, callback);
  };

  publish = (event: EMAIL_EVENTS_ENUM, payload: any) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    this.emitter.emit(event, payload);
  };
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
const emitter = new EventEmitter();
export const emailEmitter = new EmailEvents(emitter);

emailEmitter.subscribe(
  EMAIL_EVENTS_ENUM.VERIFY_EMAIL,
  ({ to, subject, html }: { to: string; subject: string; html: string }) => {
    sendEmail({ to, subject, html });
  },
);

emailEmitter.subscribe(
  EMAIL_EVENTS_ENUM.RESET_PASSWORD,
  ({ to, subject, html }: { to: string; subject: string; html: string }) => {
    sendEmail({ to, subject, html });
  },
);
