const Sequelize = require('sequelize');
const dbConfig = require('../config/database');
const sequelize = new Sequelize(dbConfig);

const crypto = require('crypto');
const path = require('path');

const File = require('../models/File');

const findNextFileName = require('../utils/find-next-file-name');

module.exports = {
  async index(req, res) {
    const files = await File.findAll();
    return res.json(files);
  },
  async store(req, res) {
    const _files = req.files.files;
    const files = [];
    var data = [];

    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json('Nenhum arquivo encontrado.');
    }

    const transaction = await sequelize.transaction();
    
    (!_files.length) ? files.push(_files) : _files.map( file => files.push(file) );

    const promises = await files.map( async (file) => {
      let ext = file.name.split('.').pop();
      filename = `${Date.now()}-${crypto.randomBytes(24).toString('hex')}.${ext}`;
    
      let upload_dir = path.resolve(__dirname, "..","..", "uploads");
    
      try {
        
        const result = await File.create({ 
          filename
        },{ transaction });

        data.push(result);

        // throw new Error("Erro");

        filename = await findNextFileName(upload_dir, filename, false);

        await file.mv(`${upload_dir}/${filename}`, (err) => {
          if (err) throw new Error("Erro");;
        });

      } catch (e) {
        transaction.rollback();
        return res.status(500).json('Ocorreu um erro');
      }

    });
    
    await Promise.all(promises);

    await transaction.commit();
    
    return res.json(data);
  }
};