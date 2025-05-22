const { default: axios } = require("axios");
const { Payment } = require("../payment/payment.model");

async function payByZarinpal(paymentId, amount, description) {
  const zarinpal = await axios
    .post(`${process.env.ZARINPAL_BASE_URL}/pg/v4/payment/request.json`, {
      merchant_id: process.env.ZARINPAL_MERCHANT_ID,
      amount,
      description,
      callback_url: process.env.ZARINPAL_CALLBACK_URL,
    })
    .then((res) => res.data)
    .catch((err) => {
      res.json(503, "zarinpal failed.");
    });
  if (zarinpal["data"]["code"] === 100) {
    const payment = await Payment.findByPk(paymentId);
    if (!payment) return res.status(404).json({ msg: "page not found" });
    payment.authority = zarinpal["data"]["authority"];
    payment.fee_type = zarinpal["data"]["fee_type"];
    payment.fee = zarinpal["data"]["fee"];
    await payment.save();
    return `${process.env.ZARINPAL_BASE_URL}/pg/StartPay/${payment.authority}`;
  }
}

async function zarinpalVerify(amount, authority) {
  const zarinpal = axios.post(
    `${process.env.ZARINPAL_VERIFY_URL}/pg/v4/payment/verify.json`,
    {
      merchant_id: process.env.ZARINPAL_MERCHANT_ID,
      amount,
      authority,
    }
  );
  return zarinpal["data"];
}
module.exports = { payByZarinpal, zarinpalVerify };
