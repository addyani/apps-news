const auth = function(req, res, next) {
    if(req.session && req.session.islogin) {
        //Login valid
        return next();
    } else {
        //Login Invalid
        //return res.sendStatus(401);
        res.render('login', { title: 'Form Login' });
    }
}
module.exports = auth;