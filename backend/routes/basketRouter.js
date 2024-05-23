var express = require('express');
var router = express.Router();

const { Url } = require('../models/models');

router.get("/", async (req, res, next) => {
  try {
    const userId = req.query.userId; 
    const data = await Url.findAll({ where: { userId } }); 
    res.json(data);
  } catch (error) {
    console.error("Error getting URL:", error);
    next(error);
  }
});

module.exports = router;
