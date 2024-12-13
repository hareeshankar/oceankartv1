const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID; // Twilio Account SID
const authToken = process.env.TWILIO_AUTH_TOKEN; // Twilio Auth Token
const serviceSid = process.env.TWILIO_SERVICE_SID; // Twilio Verify Service SID

const client = twilio(accountSid, authToken);

/**
 * Sends an OTP to the given phone number.
 * @param {string} phoneNumber - The phone number to send the OTP to.
 */
const sendOtp = async (phoneNumber) => {
    try {
        const response = await client.verify.v2.services(serviceSid).verifications.create({
            to: phoneNumber,
            channel: 'sms', // You can also use 'call' for voice OTP
        });
        return response;
    } catch (error) {
        throw new Error(`Failed to send OTP: ${error.message}`);
    }
};

/**
 * Verifies the OTP sent to the given phone number.
 * @param {string} phoneNumber - The phone number the OTP was sent to.
 * @param {string} otp - The OTP to verify.
 */
const verifyOtp = async (phoneNumber, otp) => {
    try {
        const response = await client.verify.v2.services(serviceSid).verificationChecks.create({
            to: phoneNumber,
            code: otp,
        });
        return response.status === 'approved';
    } catch (error) {
        throw new Error(`Failed to verify OTP: ${error.message}`);
    }
};

module.exports = { sendOtp, verifyOtp };
