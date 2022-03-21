const express = require('express');
const { check } = require('express-validator');
const router = express.Router();
const userController = require('../controllers/userController');

router.post(
    '/',
    [
        check('name', 'El nombre es obligatorio').not().isEmpty().isLength({ max: 30 }),
        check('email', 'Agrega un email valido').isEmail().isLength({ max: 30 }),
        check('password', 'El password debe tener mínimo de 6 caracteres').isLength({ min: 6 }),
        check('password', 'El password debe tener maximo de 20 caracteres').isLength({ max: 20 }),
    ],
    userController.createUser
);

router.get('/', userController.getUsers);
router.get('/:id', userController.getUser);
router.put('/:id', userController.modifyUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;
