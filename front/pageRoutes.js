const express = require('express');
const router = express.Router();
const path = require('path');

router.get('/registration.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../front/pages', 'registration.html'));
});

router.get('/login.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../front/pages', 'login.html'));
});

router.get('/authorizedSite.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../front/pages', 'authorizedSite.html'));
});

router.get('/activeSessions.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../front/pages', 'activeSessions.html'));
});

module.exports = router;
