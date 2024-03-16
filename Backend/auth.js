const jwt = require("jsonwebtoken");
const userModel = require("./models/user.model");

async function auth(req, res, next) {
  try {
    const { authorization } = req.headers;
    if (!authorization) {
      return res.status(401).json({
        error: "You must login first...",
      });
    }

    // const token = authorization.replace("Bearer ", "");
    const token = req.headers.authorization.split(" ")[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    if (!payload) {
      return res.status(401).json({
        error: "You must login first...",
      });
    }

    const { _id } = payload;
    const user = await userModel.findById(_id);

    if (!user) {
      console.log("Error: require login middleware");
      return res.json({
        error: "Not a user...",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(500).json({
      message: `Internal server error ${error}`,
    });
  }
}

module.exports  = auth