const express = require('express');
const { credentialData, setBussinessAppVersion, updateBussinessAppVersion } = require('../controller/credentials');
const router = express.Router();

router.get('/credentialData', credentialData)
router.post('/set-bussiness-app-version', setBussinessAppVersion);
router.post('/update-bussiness-app-version', updateBussinessAppVersion);


module.exports = router;