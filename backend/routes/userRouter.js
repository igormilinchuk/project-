const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { User } = require('../models/models');
const authMiddleware = require('../middleware/authorizationMiddleware');
const ApiError = require('../error/apiError');

const generateJwt = (id, email) => {
    return jwt.sign(
        { id, email },
        process.env.SECRET_KEY,
        { expiresIn: '1h' }
    );
}

class UserActions {
    async registration(req, res, next) {
        try {
            const { email, password } = req.body;
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return next(ApiError.badRequest('Invalid email format'));
            }
            const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
            if (!passwordRegex.test(password)) {
                return next(ApiError.badRequest('Password must be 6-20 characters long and contain at least one digit, one lowercase letter, and one uppercase letter'));
            }
            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) {
                return next(ApiError.badRequest('A user with this email already exists'));
            }
            const hashPassword = await bcrypt.hash(password, 10);
            const user = await User.create({ email, password: hashPassword });
            const token = generateJwt(user.id, user.email);
            res.json({ token, userId: user.id });
        } catch (error) {
            console.error(error);
            return next(ApiError.internal('Registration failed'));
        }
    }

    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return next(ApiError.badRequest('Invalid email format'));
            }
            const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
            if (!passwordRegex.test(password)) {
                return next(ApiError.badRequest('Password must be 6-20 characters long and contain at least one digit, one lowercase letter, and one uppercase letter'));
            }
            const user = await User.findOne({ where: { email } });
            if (!user) {
                return next(ApiError.internal('User not found'));
            }
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return next(ApiError.internal('The password is incorrect'));
            }
            const token = generateJwt(user.id, user.email);
            res.json({ token, userId: user.id });
        } catch (error) {
            console.error(error);
            return next(ApiError.internal('Login failed'));
        }
    }

    async newToken(req, res, next) {
        try {
            const token = generateJwt(req.user.id, req.user.email);
            res.json({ token, userId: req.user.id });
        } catch (error) {
            console.error(error);
            return next(ApiError.internal('Failed to generate new token'));
        }
    }
}

const userActions = new UserActions();

router.post('/registration', userActions.registration);
router.post('/login', userActions.login);
router.get('/auth', authMiddleware, userActions.newToken);

module.exports = router;
