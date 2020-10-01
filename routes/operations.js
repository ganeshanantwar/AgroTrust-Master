const express = require('express');
const router = express.Router();
const controller = require('../controllers/operationsController.js');

/**
 * Record incoming material into a location
 * Inward sample request:
 * URL: POST http://localhost:8000/operations/inward
 * JSON:
 * {
    "fromLoc":"",
    "toLoc":"",
    "toLE":""
    "date":"",
    "orderID":"",
    "delNote":"",
    "cropID":"",
    "varietyID":"",
    "skuCode":"",
    "skuQuantity":"",
    "uomPrice":"",
    "transferCost":""
   }
 * 
 * 
 */


router.post('/inward', controller.processInward);

//router.post('/manufacture', controller.processInward);
//router.post('/dispatch', controller.processInward);


module.exports = router;