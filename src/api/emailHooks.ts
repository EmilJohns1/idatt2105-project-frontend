import api from '@/api/axiosConfig';

export const sendEmail = async (to: string) => {
    try {
        await api.post('/sendEmail?to=' + to);
        console.log('Email sent successfully!');
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send email');
    }
};
