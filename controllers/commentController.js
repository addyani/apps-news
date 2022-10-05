const db = require('../models');
const Comment = db.comments;

class commentController {
    static postAddComment (req, res, next) {
        let id = req.params.id;
        if(!(req.body.name && req.body.comment)) {
            res.redirect('/detailnews/' + req.params.id);
        }
        let replyid = req.params.idreply;
        let replyStatus = false;
        let showStatus = false;

        var comment = {
            name: req.body.name,
            comment: req.body.comment,
            idword: id,
            replyid: replyid,
            replystatus: replyStatus,
            showstatus: showStatus
        }
        var back = {
            replystatus: false,
            showstatus: false
        }
        Comment.update(back, {
            where: {id: replyid}
        })
        Comment.create(comment)
        .then(data => {
            // /res.send(data);
            res.redirect('/detailnews/' + req.params.id)
        })
        .catch(err => {
            res.redirect('/');
        });
    }

    static getReplyComment (req, res, next) {
        const idword = req.params.id;
        const id = req.params.idreply;
        var comment = {
            replystatus: true
        }
        Comment.update(comment, {
            where: {id: id}
        })
        .then( data => {
            res.redirect('/detailnews/' + idword)
        })
        .catch(err => {
            res.redirect('/')
        });
    }

    static getCancelComment (req, res, next) {
        const idword = req.params.id;
        const id = req.params.idreply;
        var comment = {
            replystatus: false
        }
        Comment.update(comment, {
            where: {id: id}
        })
        .then( data => {
            res.redirect('/detailnews/' + idword)
        })
        .catch(err => {
            res.redirect('/')
        });
    }

    static getShowComment (req, res, next) {
        const idword = req.params.id;
        const id = req.params.idreply;
        var comment = {
            showstatus: true
        }
        Comment.update(comment, {
            where: {id: id}
        })
        .then( data => {
            res.redirect('/detailnews/' + idword)
        })
        .catch(err => {
            res.redirect('/')
        });
    }

    static getHideComment (req, res, next) {
        const idword = req.params.id;
        const id = req.params.idreply;
        var comment = {
            showstatus: false
        }
        Comment.update(comment, {
            where: {id: id}
        })
        .then( data => {
            res.redirect('/detailnews/' + idword)
        })
        .catch(err => {
            res.redirect('/')
        });
    }
}

module.exports = commentController