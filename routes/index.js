var express = require('express');
var router = express.Router();

const db = require('../models');
const Comment = db.comments;
const User = db.users;
const Word = db.words;
const Op = db.Sequelize.Op;

var bcrypt = require('bcryptjs');
const auth = require('../auth');
const path = require('path');
const multer = require('multer');

const fileStorage = multer.diskStorage({
	destination: (req, file, callback) => {
		callback(null, '././public/images');
	}, 
	filename: (req, file, callback) => {
		callback(null, Date.now() + path.extname(file.originalname))
	}
});

const upload = multer({
	storage: fileStorage
  });

/* GET home page. */
router.get('/', function(req, res, next) {
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
  });

  router.get('/login', function(req, res, next) {
	res.render('login', { title: 'Form Login' });
  });

  router.post('/login', function(req, res, next) {
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
  });

  router.get('/register', function(req, res, next) {
	res.render('register', { title: 'Form Registrasi' });
  });

  router.post('/register', function(req, res, next) {
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
  });

router.get('/logout',function(req, res, next) {
	req.session.destroy();
	res.redirect('/')
});

router.get('/restore', auth, function(req, res, next) {
	Word.restore()
	.then(num => {
		res.redirect('/')		
	})
	.catch(err => {
		res.redirect('/')	
	});
});

  router.get('/addnews', auth, function(req, res, next) {
	res.render('addnews', { title: 'Add News' });
  });

  router.post('/addnews', auth, upload.single('image'),function(req, res, next) {
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
  });

  router.get('/detailnews/:id', function(req, res, next) {
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
  });

  router.get('/updatenews/:id',auth, function(req, res, next) {
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
  });

  router.post('/updatenews/:id', auth, upload.single('image'), function(req, res, next) {
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
});

router.get('/deletenews/:id',auth, function(req, res, next) {
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
});

  router.post('/addcomment/:id/:idreply',function(req, res, next) {
	const id = req.params.id;
	if(!(req.body.name && req.body.comment)) {
		res.redirect('/detailnews/' + data.idword);
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
		res.redirect('/detailnews/' + data.idword)
	})
	.catch(err => {
		res.redirect('/');
	});
  });

  router.get('/replycomment/:id/:idreply',function(req, res, next) {
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
});

router.get('/cancelcomment/:id/:idreply',function(req, res, next) {
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
});

router.get('/showcomment/:id/:idreply',function(req, res, next) {
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
});

router.get('/hidecomment/:id/:idreply',function(req, res, next) {
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
});

module.exports = router;
