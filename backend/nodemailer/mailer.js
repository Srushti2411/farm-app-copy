import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create the transporter using Gmail and environment variables
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    port: 465,
    secure: true,
});

// Verify the transporter once when the app starts
transporter.verify((error, success) => {
    if (error) {
        console.error('Transporter verification failed:', error);
    } else {
        console.log('Transporter is ready to send emails.');
    }
});

// Generic sendMail function
export const sendMail = async (to, subject, text, html) => {
    try {
        if (!to || !subject || (!text && !html)) {
            throw new Error('Missing required email fields.');
        }

        const mailOptions = {
            from: `"AgroConnect" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            text,
            html,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully to:', to);
        return info;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};
