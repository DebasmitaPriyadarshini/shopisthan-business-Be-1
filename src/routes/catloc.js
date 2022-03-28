const express = require('express');
const { addStorePlan, addCatalog, addLeadGeneration } = require('../controller/catloc');
const router = express.Router();

router.post('/addStorePlan', addStorePlan)
router.post('/createCatalog', addCatalog)
router.post('/addLeadGeneration', addLeadGeneration)




module.exports = router;