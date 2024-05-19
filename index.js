require('dotenv').config();
const express = require("express");
const cors = require("cors");
const sequelize = require('./db');
const { Op } = require('sequelize');
const path = require('path');

const models = require('./backend/models/models');
const router = require('./backend/routes/mainRouter');
const pageRoutes = require('./front/pageRoutes');
const errorHandler = require('./backend/middleware/errorMiddleware');
const authMiddleware = require('./backend/middleware/authorizationMiddleware')
const { Url, User } = require('./backend/models/models');

const CHECK_FOR_EXPIRED_INTERVAL = 60 * 60 * 1000;
const app = express();
const PORT = process.env.PORT 


app.use(cors());
app.use(express.json());

app.use('/api', router);
app.use(express.static(path.join(__dirname, 'pages')));
app.use(errorHandler);

app.get('/styles.css', (req, res) => {
  res.sendFile(path.join(__dirname, './front/pages', 'styles.css'));
})

router.get("/", async (req, res, next) => {
  try {
    const userId = req.session.userId;
    console.log(userId)
    res.render('index', { userId });
  } catch (error) {
    next(error);
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './front/pages', 'Site.html'));
});

app.use('/', pageRoutes);


const start = async () => {
  try {
      await sequelize.authenticate()
      await sequelize.sync()
      app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
      });
  } catch (e) {
      console.log(e)
  }
}

start();

const checkAndDeleteExpiredUrls = async () => {
  try {
    const expiredUrls =  await Url.destroy({
      where: {
        expiryDate: {
          [Op.lte]: new Date(),
        },
      },
    });

    console.log(`${expiredUrls} expired URLs have been deleted.`);
  } catch (error) {
    console.error("Error checking and deleting expired URLs:", error);
  }
};

checkAndDeleteExpiredUrls();

setInterval(checkAndDeleteExpiredUrls, CHECK_FOR_EXPIRED_INTERVAL);


