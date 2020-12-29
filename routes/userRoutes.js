const router = require('express').Router();
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
let User = require('../models/user');


const handleErrors = (err) => {

    console.log(err.message, err.code);

    let errors = {};

    // incorrect email
    if (err.message === 'incorrect email'){
        errors.email = "The email is not registered";
    }

    // incorrect password
    if (err.message === 'incorrect password'){
        errors.password = "The password is incorrect";
    }

    // duplicate error
    if (err.code === 11000){
        const fieldname = Object.keys(err.keyValue)[0];
        const fieldvalue = Object.values(err.keyValue)[0];
        errors[fieldname] = `The ${fieldname} ${fieldvalue} already exist`;
    }

    // validation errors
    if (err.message.includes('User validation failed')){
        Object.values(err.errors).forEach(({properties}) => {
            errors[properties.path] = properties.message;
        });
     }
    return errors;
}

const maxAge = 3 * 24 * 60 * 60;

const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: maxAge
    })
}

// non-test routes
router.post('/register', async (req, res) => {
    const { email, password, firstname, lastname, username } = req.body;
    try{
        const user = await User.create({ email, password, firstname, lastname, username });
        res.status(200).json(user);
    }catch(err){
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }

});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.login(email, password);
        const token = createToken(user._id);
        res.status(200).json({
            token,
            user: {
                id: user._id,
                firstname: user.firstname,
                lastname: user.lastname
            }
        });
    }catch(err){
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
})

router.delete('/delete', auth, async (req, res) => {
    try {
       const deletedUser = await User.findByIdAndDelete(req.user);
       res.json(deletedUser); 
    }catch(err) {
        res.status(500).json({ errors: err.message });
    }
})

router.post('/tokenIsValid', async (req, res) => {
    try{
        const token = req.header('x-auth-token');
        if (!token) return res.json(false);

        const verified = jwt.verify(token, process.env.JWT_SECRET);
        if (!verified) return res.json(false);

        const user = await User.findById(verified.id);
        if (!user) return res.json(false);

        return res.json(true);
    }catch(err) {
        res.status(500).json({ errors: err.message });
    }
})

router.get('/', auth, async (req, res) => {
    const user = await User.findById(req.user);
    res.json({
        id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        username: user.username,
        email: user.email
    });
})

module.exports = router;


