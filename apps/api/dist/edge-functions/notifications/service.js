import { handleNotificationError } from './error';
import { v4 as uuidv4 } from 'uuid';
import { createTransport } from 'nodemailer';
import { Twilio } from 'twilio';
// Mock implementation for email sending
async function sendEmail(options, config) {
    try {
        if (config.emailProvider === 'smtp') {
            const transporter = createTransport({
                host: process.env.SMTP_HOST,
                port: parseInt(process.env.SMTP_PORT || '587'),
                secure: process.env.SMTP_SECURE === 'true',
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASSWORD,
                },
            });
            const info = await transporter.sendMail({
                from: options.from || process.env.SMTP_FROM_EMAIL,
                to: options.to,
                subject: options.subject,
                text: options.text,
                html: options.html,
            });
            return info;
        }
        else {
            // Mock implementation for other email providers
            console.log('Sending email:', options);
            return {
                messageId: uuidv4(),
                status: 'sent',
            };
        }
    }
    catch (error) {
        throw handleNotificationError(error, 'EMAIL_SEND_FAILED');
    }
}
// Mock implementation for SMS sending
async function sendSms(options, config) {
    try {
        if (config.smsProvider === 'twilio') {
            const client = new Twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
            const message = await client.messages.create({
                body: options.text,
                from: options.from || process.env.TWILIO_FROM_NUMBER,
                to: Array.isArray(options.to) ? options.to[0] : options.to, // Convert array to single string for Twilio
            });
            return message;
        }
        else {
            // Mock implementation for other SMS providers
            console.log('Sending SMS:', options);
            return {
                messageId: uuidv4(),
                status: 'sent',
            };
        }
    }
    catch (error) {
        throw handleNotificationError(error, 'SMS_SEND_FAILED');
    }
}
export async function sendNotification(data, options) {
    try {
        const notificationId = uuidv4();
        const config = options.config || {
            emailProvider: 'smtp',
            smsProvider: 'twilio',
        };
        let providerResponse;
        if (data.type === 'email') {
            providerResponse = await sendEmail(data.options, config);
        }
        else if (data.type === 'sms') {
            providerResponse = await sendSms(data.options, config);
        }
        else {
            throw handleNotificationError(new Error(`Unsupported notification type: ${data.type}`), 'UNSUPPORTED_NOTIFICATION_TYPE');
        }
        return {
            success: true,
            notificationId,
            providerResponse,
        };
    }
    catch (error) {
        return {
            success: false,
            error: handleNotificationError(error, 'NOTIFICATION_SEND_FAILED'),
        };
    }
}
