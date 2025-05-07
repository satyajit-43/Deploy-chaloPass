const express = require('express');
const { protect } = require('../middlewares/auth');
const { topUpWallet, getUserData } = require('../controllers/walletController');

const router = express.Router();

router.use(protect);
router.get('/me', getUserData);
router.post('/topup', topUpWallet);

module.exports = router;