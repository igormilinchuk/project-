const express = require('express');
const router = express.Router();
const shortid = require("shortid");
const validUrl = require('valid-url');

const { Url } = require('../models/models');
const ApiError = require('../error/apiError');

const MAX_URL_LENGTH = 255;

router.post("/", async (req, res, next) => {
  const { origUrl, customShortUrl, expiryDate } = req.body;
  let { userId } = req.body;

  userId = userId || null;

  const defaultExpiryDate = new Date();
  defaultExpiryDate.setTime(defaultExpiryDate.getTime() + 24 * 60 * 60 * 1000);


  try {
    if (!validUrl.isUri(origUrl)) {
      return next(ApiError.badRequest("Invalid URL"));
    }

    if (origUrl.length > MAX_URL_LENGTH) {
      return next(ApiError.badRequest("Original URL is too long"));
    }

    const urlId = customShortUrl || shortid.generate();
    const shortUrl = `http://${process.env.HOST}:${process.env.PORT}/api/${urlId}`;

    if (shortUrl.length > MAX_URL_LENGTH) {
      return next(ApiError.badRequest("Generated short URL is too long"));
    }

    const url = await Url.create({
      origUrl,
      shortUrl,
      urlId,
      expiryDate: expiryDate || defaultExpiryDate,
      userId,
    });

    return res.json(url);
  } catch (error) {
    console.error(error);
    next(ApiError);
  }
});

module.exports = router;
