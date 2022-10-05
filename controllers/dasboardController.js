const db = require('../models');
const User = db.users;
const Word = db.words;
var bcrypt = require('bcryptjs');

class dasboardController {
    static getAllDasboard (req, res, next) {
        Word.findAll()
        .then(words => {
            res.render('homepage', { 
            title: 'Home Page',
            words: words
            });
        })
        .catch(err => {
            res.render('homepage', { 
                title: 'Home Page',
                words: {}
            });
        });
    }

    static getLogin (req, res, next) {
        res.render('login', { title: 'Form Login' });
    }

    static postLogin (req, res, next) {
        User.findOne({ where: { username: req.body.username } })
        .then(data => {
            // /res.send(data);
            var validPassword = bcrypt.compareSync(req.body.password, data.password);
            if(validPassword) {
                //save session
                req.session.username = req.body.username;
                req.session.islogin = true;

                res.redirect('/');
            } else {
                res.redirect('/login');
            }	
        })
        .catch(err => {
            res.redirect('/login');
        });
    }

    static getRegister (req, res, next) {
        res.render('register', { title: 'Form Registrasi' });
    }

    static postRegister (req, res, next) {
        if(!(req.body.name && req.body.email && req.body.username && req.body.password)) {
            res.redirect('/register');
          }
          else {
            var hashpass = bcrypt.hashSync(req.body.password, 8);
            var user = {
                name: req.body.name,
                email: req.body.email,
                username: req.body.username,
                password: hashpass
            }
            User.create(user)
            .then(data => {
                // /res.send(data);
                res.redirect('/login')
            })
            .catch(err => {
                res.redirect('/register');
            });
        }
    }

    static getLogout (req, res, next) {
        req.session.destroy();
        res.redirect('/');
    }

    static getRestore (req, res, next) {
        Word.restore()
        .then(num => {
            res.redirect('/')		
        })
        .catch(err => {
            res.redirect('/')	
        });
    }
}

module.exports = dasboardController