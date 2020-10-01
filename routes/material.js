const express = require('express');
const router = express.Router();
const controller = require('../controllers/materialController.js');

/**
 * MATERIAL Codes Range: 0xC0010001 to 0xCFFFFFFF
 * Where Crop IDs from C001 to CFFF
 * And Variety IDs from 0001 to FFFF
 */

/**
 * material create sample request:
 * URL: POST http://localhost:8000/material/create
 * JSON:
 * {
 "regLE":"GFPCL",
 "cropID":"c001",
 "varietyID":78,
 "cropComName":"Orange",
 "varComName":"Nagpur",
 "botName":"Citrus Oranga",
 "cultivar":"N-555",
 "cropState":"Fresh",
 "batchPrefix":"ORN",
 "defCat":"Citrus",
 "custCat":"Fruit",
 "uom":"PC",
 "uomWeight":0.200,
 "recovery":0.95
}
 */

router.post('/create', controller.create);

/**
 * material list all sample request:
 * URL: GET http://localhost:8000/material/list/GFPCL
 */

router.get('/list/:le', controller.listAll);

/**
 * material list one sample request:
 * URL: GET http://localhost:8000/material/list/GFPCL/f0000002
 */

router.get('/list/:le/:id', controller.listOne);

/**
 * material update sample request:
 * URL: POST http://localhost:8000/material/update/GFPCL/f0000002
 * JSON:
 * {
	"uomWeight":0.250
    }
 */

router.post('/update/:le/:id', controller.update);

module.exports = router;
