function emptyRequest(req, res, next) {
    // console.log(req.body)
  if (req.body?.length < 0 || req.body == undefined)
    return res.status(400).json({ msg: "body is empty." });
  next();
}
module.exports = { emptyRequest };
