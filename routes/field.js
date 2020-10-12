const express = require('express');
const router = express.Router();
const controller = require('../controllers/fieldController.js');

/**
 * FIELD Codes Range: 0xFE000001 to 0xFEFFFFFF
 */

/**
 * Field create sample request:
 * URL: POST http://localhost:8000/field/create/GFPCL
 * JSON:
 * {
    "farmerCode":"fa000001",
    "crops":["c001"],
	"isOwner":true,
	"fieldName":"GAT 123/12",
	"totalArea":19.27,
	"usableArea":13.23,
	"linkedArea":9.18,
	"soilType":"Black Moist",
	"waterSources":["Well","Canal"],
	"geoLoc":[[12,12],[13,13],[14,14],[15,15]],
	"addr":{"a":"a","b":"b","c":"c","d":"d"}
	}
 */

router.post('/create/:le', controller.create);

/**
 * field list all sample request:
 * URL: GET http://localhost:8000/field/list/GFPCL
 */

router.get('/list/:le', controller.listAll);

/**
 * field list one sample request:
 * URL: GET http://localhost:8000/field/list/GFPCL/fe000001
 */

router.get('/list/:le/:id', controller.listOne);

/**
 * field update sample request:
 * URL: POST http://localhost:8000/field/update/GFPCL/fe000001
 * JSON:
 * {
	"linkedArea":11.11
    }
 */

router.post('/update/:le/:id', controller.update);

module.exports = router;
