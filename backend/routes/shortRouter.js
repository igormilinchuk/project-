const express = require('express');
const router = express.Router();
const shortid = require("shortid");
const validUrl = require('valid-url');
const { Url } = require('../models/models');
const ApiError = require('../error/apiError');

router.post("/", async (req, res, next) => {
  const { origUrl, customShortUrl, expiryDate, } = req.body;
  let { userId } = req.body; // Отримати userId з клієнтського запиту

  // Якщо користувач неавторизований, задати userId значення за замовчуванням
  userId = userId || null; // Або яке-небудь значення за замовчуванням, наприклад, null

  const defaultExpiryDate = new Date();
  defaultExpiryDate.setMinutes(defaultExpiryDate.getMinutes() + 1);

  try {
    if (!validUrl.isUri(origUrl)) {
      return next(ApiError.badRequest("Invalid URL"));
    }
    
    const urlId = customShortUrl || shortid.generate();
    const shortUrl = `http://${process.env.HOST}:${process.env.PORT}/api/${urlId}`;

    // Зберегти ідентифікатор користувача разом із іншими даними про URL
    const url = await Url.create({
      origUrl,
      shortUrl,
      urlId,
      expiryDate: expiryDate || defaultExpiryDate,
      userId, // Зберегти ідентифікатор користувача (може бути null, якщо користувач неавторизований)
    });

    return res.json(url);
  } catch (error) {
    console.error(error);
    next(ApiError);
  }
});

module.exports = router;
