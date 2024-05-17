const express = require('express');
const router = express.Router();
const path = require('path');

// Route for registration page
router.get('/registration.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../front/pages', 'registration.html'));
});

// Route for login page
router.get('/login.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../front/pages', 'login.html'));
});

// Route for authorized site page
router.get('/authorizedSite.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../front/pages', 'authorizedSite.html'));
});

// Route for active sessions page
router.get('/activeSessions.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../front/pages', 'activeSessions.html'));
});

module.exports = router;
