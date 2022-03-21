const { validationResult } = require('express-validator');
const bcryptjs = require('bcryptjs');
const JWT = 'jsonwebtoken';
const jwt = require(JWT);
const User = require('../models/User');

exports.register = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ msg: errors.array() });
    }

    const { email, password } = req.body;

    try {
        let userfind = await User.findOne({ email });
        if (userfind) {
            return res.status(400).send('Ya existe cuenta con este email');
        }

        let user = new User(req.body);

        const salt = await bcryptjs.genSalt(10);
        user.password = await bcryptjs.hash(password, salt);

        await user.save();

        res.send('Usuario Creado Correctamente');
    } catch (error) {
        console.log(error);
        res.status(400).send('Hubo un error');
    }
};

exports.login = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array());
        }

        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json('usuario no existe');
        }

        const passCorrect = await bcryptjs.compare(password, user.password);
        if (!passCorrect) {
            return res.status(400).json('Password incorrecto');
        }

        const payload = {
            user: {
                id: user.id,
            },
        };
        jwt.sign(
            payload,
            process.env.SECRET,
            {
                expiresIn: 180000,
            },
            (error, token) => {
                if (error) throw error;
                res.json({ token, user: user });
            }
        );
    } catch (error) {
        res.status(400).send('error de conexion');
    }
};

exports.getUserAuthentic = async (req, res) => {
    const token = req.header('x-auth-token');

    if (!token) {
        return res.status(401).json('No hay Token, permiso no valido');
    }

    try {
        const cifrado = jwt.verify(token, process.env.SECRET);
        const user = await User.findById(cifrado.user.id).select('name email register');
        res.send(user);
    } catch (error) {
        res.status(401).json('Token no valido');
    }
};
