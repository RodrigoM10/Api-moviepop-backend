// Rutas necesarias
const express = require('express');
const { check } = require('express-validator');
const router = express.Router();
const authController = require('../controllers/authController');

router.post(
    '/register',
    [
        check('name', 'El nombre es obligatorio').not().isEmpty().isLength({ max: 30 }),
        check('email', 'Agrega un email valido').isEmail().isLength({ max: 30 }),
        check('password', 'El password debe tener mínimo de 6 caracteres').isLength({ min: 6 }),
        check('password', 'El password debe tener maximo de 20 caracteres').isLength({ max: 20 }),
    ],
    authController.register
);

router.post(
    '/login',
    [
        check('email', 'Agrega un email valido').isEmail().isLength({ max: 30 }),
        check('password', 'El password debe tener mínimo de 6 caracteres').isLength({ min: 6 }),
        check('password', 'El password debe tener maximo de 20 caracteres').isLength({ max: 20 }),
    ],
    authController.login
);

router.get('/', authController.getUserAuthentic);

module.exports = router;
