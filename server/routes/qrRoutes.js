const express = require('express');
const { validateQR } = require('../controllers/qrController');
const router = express.Router();

// router.post('/validate', validateQR);
// router.post('/book-ticket', validateAndBookTicket);

// router.post('/validate', validateQrAndBookTicket);

router.post('/validate', validateQR);


module.exports = router;