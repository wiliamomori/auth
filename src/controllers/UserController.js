const User = require('../models/User');

module.exports = {
  async index(req, res) {
    const users = await User.findAll();
    return res.json(users);
  },
  async store(req, res) {
    const { email } = req.body;
    
    try {
      if (await User.findOne({ where: { email } })) {
        return res.status(400).json({ error: "User already exists" });
      }
  
      const user = await User.create(req.body);
  
      return res.json({ user });
    } catch (err) {
      return res.status(400).json({ error: "User registration failed" });
    }
  },
  async auth(req, res){
    try {
      const { email, password } = req.body;
  
      const user = await User.findOne({ 
        where: { email }
      });
  
      if (!user) {
        return res.status(400).json({ error: "User not found" });
      }
  
      if (!(await user.compareHash(password))) {
        return res.status(400).json({ error: "Invalid password" });
      }
  
      return res.json({
        user,
        token: await user.generateToken()
      });
    } catch (err) {
      return res.status(400).json({ error: "User authentication failed" });
    }  
  }
};