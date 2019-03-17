const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');
const User = require('../models/User');
const errorHandler = require('../utils/errorHandler');

module.exports.login = async (req, res) => {
  const candidate = await User.findOne({ email: req.body.email });

  if (candidate) {
    //Проверка пароля, пользователь существует
    const passwordResult = bcryptjs.compareSync(req.body.password, candidate.password);
    if (passwordResult) {
      //Генерация токена, пароли совпали
      const token = jwt.sign(
        {
          email: candidate.email,
          userId: candidate._id
        },
        keys.jwt,
        { expiresIn: 60 * 60 }
      );

      res.status(200).json({
        token: `Bearer ${token}`
      });
    } else {
      //Пароли не совпали
      res.status(401).json({
        message: 'Пароли не совпадают. Попробуйте снова.'
      });
    }
  } else {
    //Пользователя нет
    res.status(404).json({
      message: 'Пользователь с таким email не найден.'
    });
  }
};

module.exports.register = async (req, res) => {
  const candidate = await User.findOne({ email: req.body.email });

  if (candidate) {
    // Пользователь существует, отправляем ошибку
    res.status(409).json({
      message: 'Такой email уже занят. Попробуйте другой.'
    });
  } else {
    // Создаем пользователя
    const salt = bcryptjs.genSaltSync(10);
    const password = req.body.password;
    const user = new User({
      email: req.body.email,
      password: bcryptjs.hashSync(password, salt)
    });

    try {
      await user.save();
      res.status(201).json(user);
    } catch (error) {
      errorHandler(res, error);
    }
  }
};
