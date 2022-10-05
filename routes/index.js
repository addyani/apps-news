var express = require('express');
var router = express.Router();

const upload = require('../middlewares/imageMulter')
const auth = require('../auth');
const dasboardController = require('../controllers/dasboardController')
const newsController = require('../controllers/newsController')
const commentController = require('../controllers/commentController')

router.get('/', dasboardController.getAllDasboard)
router.get('/login', dasboardController.getLogin)
router.post('/login', dasboardController.postLogin)
router.get('/register', dasboardController.getRegister)
router.post('/register', dasboardController.postRegister)
router.get('/logout', dasboardController.getLogout)
router.get('/restore', auth, dasboardController.getRestore)

router.get('/addnews', auth, newsController.getAddNews)
router.post('/addnews', auth, upload.single('image'), newsController.postAddNews)
router.get('/detailnews/:id', newsController.getDetailNews)
router.get('/updatenews/:id',auth, newsController.getUpdateNews)
router.post('/updatenews/:id', auth, upload.single('image'), newsController.postUpdateNews)
router.get('/deletenews/:id',auth, newsController.getDeleteNews)

router.post('/addcomment/:id/:idreply', commentController.postAddComment)
router.get('/replycomment/:id/:idreply', commentController.getReplyComment)
router.get('/cancelcomment/:id/:idreply',commentController.getCancelComment)
router.get('/showcomment/:id/:idreply', commentController.getShowComment)
router.get('/hidecomment/:id/:idreply',commentController.getHideComment)

module.exports = router;
