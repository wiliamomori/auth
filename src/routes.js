const express = require('express');
const routes = express.Router();

const fileUpload = require('express-fileupload');
const path = require("path");

const FileController = require('./controllers/FileController');
const UserController = require('./controllers/UserController');



routes.post("/register1", async (req, res) => {
  const { email } = req.body;

  try {
    if (await User.findOne({ email })) {
      return res.status(400).json({ error: "User already exists" });
    }

    const user = await User.create(req.body);

    return res.json({ user });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: "User registration failed" });
  }
});

routes.post("/authenticate1", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    if (!(await user.compareHash(password))) {
      return res.status(400).json({ error: "Invalid password" });
    }

    return res.json({
      user,
      token: user.generateToken()
    });
  } catch (err) {
    return res.status(400).json({ error: "User authentication failed" });
  }
});

routes.post('/register', UserController.store);
routes.post('/authenticate', UserController.auth);

// routes.post('/user', UserController.user);

const authMiddleware = require("./middlewares/auth");
routes.use(authMiddleware);

routes.get('/files', FileController.index);
routes.post('/files', fileUpload({
  createParentPath: path.resolve(__dirname, "..", "uploads"),
  safeFileNames: true,
  preserveExtension: true
}), FileController.store);

module.exports = routes;