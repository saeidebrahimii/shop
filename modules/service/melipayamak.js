const { default: axios } = require("axios");

async function sendOtpPayamak(to, code) {
  const sendOtpCode = await axios.post(
    "https://rest.payamak-panel.com/api/SendSMS/SendSMS",
    {
      username: process.env.MELIPAYAMAK_USERNAME,
      password: process.env.MELIPAYAMAK_PASSWORD,
      to,
      from: process.env.MELIPAYAMAK_NUMBER,
      text: `کدتایید شما: ${code}`,
    }
  );
  return sendOtpCode;
}
async function sendPayamak(to, text) {
  const sendPayamak = await axios.post(
    "https://rest.payamak-panel.com/api/SendSMS/SendSMS",
    {
      username: process.env.MELIPAYAMAK_USERNAME,
      password: process.env.MELIPAYAMAK_PASSWORD,
      to,
      from: process.env.MELIPAYAMAK_NUMBER,
      text
    }
  );
  return sendPayamak;
}
module.exports={sendOtpPayamak,sendPayamak}