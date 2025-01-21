declare module 'nodemailer' {
    import { Transport, TransportOptions, SendMailOptions, SentMessageInfo } from 'nodemailer';

    interface Transporter {
        sendMail(options: SendMailOptions): Promise<SentMessageInfo>;
    }

    interface createTransport {
        (options: TransportOptions): Transporter;
    }

    const createTransport: createTransport;
    export { createTransport, TransportOptions, SendMailOptions, SentMessageInfo, Transporter };
}