import {
  NotificationData,
  NotificationOptions,
  NotificationResult,
  EmailOptions,
  SmsOptions,
} from './types';
import { handleNotificationError } from './error';
import { v4 as uuidv4 } from 'uuid';
import { NotificationConfig } from './config';
import { createTransport } from 'nodemailer';
import { Twilio } from 'twilio';

// Mock implementation for email sending
async function sendEmail(options: EmailOptions, config: NotificationConfig): Promise<any> {
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
    } else {
      // Mock implementation for other email providers
      console.log('Sending email:', options);
      return {
        messageId: uuidv4(),
        status: 'sent',
      };
    }
  } catch (error) {
    throw handleNotificationError(error, 'EMAIL_SEND_FAILED');
  }
}

// Mock implementation for SMS sending
async function sendSms(options: SmsOptions, config: NotificationConfig): Promise<any> {
  try {
    if (config.smsProvider === 'twilio') {
      const client = new Twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
      const message = await client.messages.create({
        body: options.text,
        from: options.from || process.env.TWILIO_FROM_NUMBER,
        to: options.to,
      });
      return message;
    } else {
      // Mock implementation for other SMS providers
      console.log('Sending SMS:', options);
      return {
        messageId: uuidv4(),
        status: 'sent',
      };
    }
  } catch (error) {
    throw handleNotificationError(error, 'SMS_SEND_FAILED');
  }
}

export async function sendNotification(
  data: NotificationData,
  options: NotificationOptions
): Promise<NotificationResult> {
  try {
    const notificationId = uuidv4();
    const config = options.config || {
      emailProvider: 'smtp',
      smsProvider: 'twilio',
    };

    let providerResponse: any;
    if (data.type === 'email') {
      providerResponse = await sendEmail(data.options as EmailOptions, config);
    } else if (data.type === 'sms') {
      providerResponse = await sendSms(data.options as SmsOptions, config);
    } else {
      throw handleNotificationError(
        new Error(`Unsupported notification type: ${data.type}`),
        'UNSUPPORTED_NOTIFICATION_TYPE'
      );
    }

    return {
      success: true,
      notificationId,
      providerResponse,
    };
  } catch (error) {
    return {
      success: false,
      error: handleNotificationError(error, 'NOTIFICATION_SEND_FAILED'),
    };
  }
}