const express = require('express');
const router = express.Router();

const stuffCtrl = require('../controllers/stuff');
const auth = require('../controllers/auth');
const multer = require('../controllers/multer');

router.get('/', auth, stuffCtrl.getAllThings);
router.get('/:id', auth, stuffCtrl.getOneThing);
router.post('/', auth, multer, stuffCtrl.createThing);
router.put('/:id', multer, stuffCtrl.modifyThing);
router.delete('/:id', auth, stuffCtrl.deleteOneThing);

module.exports = router;