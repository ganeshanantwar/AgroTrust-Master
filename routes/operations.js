const express = require('express');
const router = express.Router();
const controller = require('../controllers/operationsController.js');

/**
 * Record incoming SKUs into a location
 * Inward sample request:
 * URL: POST http://localhost:8000/operations/inward/GFPCL
 * JSON:
 {
    "fromLoc":"",
    "toLoc":"",
    "materialCode":"",
    "skuCode":"",
    "skuQuantity":"",
    "totalWeight":"",
    "price":"",
    "rejection":"",
    "date":"",
    "locationCost":"",
    "transferCost":""
}
*/

router.post('/inward/:le', controller.processInward);
/**
 * Convert one type of SKUs into another of the same material at a location
 * Convert sample request:
 * URL: POST http://localhost:8000/operations/convert/GFPCL
 * JSON:
 {
    "atLoc":"",
    "materialCode":"",
    "fromSkuCode":"",
    "fromSkuQuantity":"",
    "toSkuCode":"",
    "toSkuQuantity":"",
    "date":"",
    "transformCost":""
}
*/

router.post('/convert/:le', controller.processConvert);

/**
 * Record outgoing SKUs from a location
 * Dispatch sample request:
 * URL: POST http://localhost:8000/operations/dispatch/GFPCL
 * JSON:
 {
    "fromLoc":"",
    "toLoc":"",
    "materialCode":"",
    "skuCode":"",
    "skuQuantity":"",
    "totalWeight":"",
    "price":"",
    "date":"",
    "locationCost":"",
    "transferCost":""
}
*/

router.post('/dispatch/:le', controller.processDispatch);

module.exports = router;
