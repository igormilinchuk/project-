const express = require('express');
const router = express.Router();

const { Url } = require('../models/models');
const ApiError = require('../error/apiError');

router.get("/:shortUrl", async (req, res, next) => {
  const { shortUrl } = req.params;
  try {
    const cleanShortUrl = shortUrl.split('?')[0];
    const url = await Url.findOne({ where: { urlId: cleanShortUrl }});

    if (!url) {
      return next(ApiError.badRequest("URL not found"));
    } 
    return res.redirect(url.origUrl);
  } catch (error) {
    console.error(error);
    next(ApiError);
  }
});

module.exports = router;
