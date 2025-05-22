const { Order } = require("../order/order.model");
const { payByZarinpal, zarinpalVerify } = require("../service/zarinpal");
const { Payment } = require("./payment.model");

async function paymentHandler(req, res, next) {
  const { user } = req;
  const { orderId } = req.body;
  try {
    const order =await Order.findByPk(1, { include: ["orderItems"] });
    if (!order) return res.json({msg:"order is empty"});
    const payment = await Payment.create({
      user_id: user.id,
      order_id: order.id,
      totalPrice: order.totalPrice,
      finalPrice: order.finalPrice,
      discount: order.discount ?? 0,
    });
    const zarinpal = await payByZarinpal(
      payment.id,
      process.env.ZARINPAL_MERCHANT_ID,
      1000000,
      "pay in local shop",
      process.env.ZARINPAL_CALLBACK_URL
    );
    return res.json(zarinpal);
  } catch (error) {
    next(error);
  }
}
async function verifyPayment(req, res, next) {
  const { Status } = req.query;
  if (Status === "NOK") return res.status(500).json({ msg: "payment faild" });
  if (Status === "OK") {
    const { Authority } = req.query;
    const payment = await Payment.findOne({ where: { authority: Authority } });
    if (!payment) return res.json("not valid payment");
    const verify = zarinpalVerify(
      process.env.ZARINPAL_MERCHANT_ID,
      payment.finalPrice,
      Authority
    );
    if (verify["data"]["code"] === 100) {
      payment.card_pan = verify["data"]["card_pan"];
      payment.ref_id = verify["data"]["ref_id"];
      payment.fee_type = verify["data"]["fee_type"];
      payment.fee = verify["data"]["fee"];
      await payment.save();
      res.status(200).json({ msg: "pay successfully" });
    } else {
      res.status(402).json({ msg: "falid payment." });
    }
  }
}
module.exports = { paymentHandler, verifyPayment };
