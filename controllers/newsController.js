const db = require('../models');
const Comment = db.comments;
const Word = db.words;

class newsController {
    static getAddNews (req, res, next) {
        res.render('addnews', { title: 'Add News' });
    }

    static postAddNews (req, res, next) {
        if(req.body.title) var title=req.body.title;
        if(req.body.author) var author=req.body.author;
        if(req.file.filename) var image=req.file.filename;
        if(req.body.content) var content=req.body.content; 
        var news = {
            title: title,
            author: author,
            image: image,
            content: content
        }
        Word.create(news)
        .then(data => {
            res.redirect('/')
        })
        .catch(err => {
            res.redirect('/');
        });
    }

    static getDetailNews (req, res, next) {
        var id = parseInt(req.params.id);
        Word.findOne({
            include: [Comment],
            where: {id: id}
        })
        .then(data => {
            if(data){
                res.render('detailnews', { 
                title: 'Detail News',
                words: data,
                array: data.comments
                });
            }else{
                res.redirect('/')
            }	
        })
        .catch(err => {
            res.redirect('/')
        });
    }

    static getUpdateNews (req, res, next) {
        var id = parseInt(req.params.id);
        Word.findByPk(id)
        .then(words => {
            if(words){
                res.render('updatenews', { 
                title: 'Update News',
                words: words
                });
            }else{
                res.redirect('/')
            }
        })
        .catch(err => {
            res.redirect('/')
        });
    }

    static postUpdateNews (req, res, next) {
        var id = req.params.id;
        if(req.body.title) var title=req.body.title;
        if(req.body.author) var author=req.body.author;
        if(req.file.filename) var image=req.file.filename;
        if(req.body.content) var content=req.body.content; 
        var news = {
            title: title,
            author: author,
            image: image,
            content: content
        }

        Word.update(news, {
            where: {id: id}
        })
        .then(num => {
            res.redirect('/')
        })
        .catch(err => {
            res.redirect('/')
        });
    }

    static getDeleteNews (req, res, next) {
        const id = req.params.id;
        Word.destroy({
            where: {id: id}
        })
        .then(num => {
            res.redirect('/')		
        })
        .catch(err => {
            res.redirect('/')	
        });
    }
}

module.exports = newsController