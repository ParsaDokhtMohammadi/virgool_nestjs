import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
    private transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host:"smtp.gmail.com",
            service: 'gmail',
            port: 587,
            secure: false,
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_PASS,
            },
            connectionTimeout:10000
        });
    }

    async sendMail(to: string, subject: string, text: string, html?: string) {
        try {
            const info = await this.transporter.sendMail({
                from: process.env.GMAIL_USER,
                to,
                subject,
                text,
                html, 
            });

            console.log('Email sent: ', info.messageId);
            return info;
        } catch (err) {
            console.error('Error sending email', err);
            throw new InternalServerErrorException('Failed to send email');
        }
    }
} 