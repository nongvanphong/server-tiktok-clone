const authModel = require("../models/auth.model");

exports.verify = async (req, res, next) => {
  try {
    console.log("id=>", req.body.id);
    const result = await authModel.findPK(req.body.id);
    if (!result) {
      return res.status(400).json({
        status: 400,
        msg: "Requires login again",
      });
    }

    req.user = result.dataValues;

    next();
  } catch (error) {
    return res.status(400).json({
      status: 400,
      msg: "Requires login again",
    });
  }
};
