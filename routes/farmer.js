const express = require('express');
const router = express.Router();
const controller = require('../controllers/farmerController.js');

/**
 * FARMER Codes Range: 0xF0000001 to 0xFFFFFFFF
 */

/**
 * Farmer create sample request:
 * URL: POST http://localhost:8000/farmer/create
 * JSON:
 * {
	"regLE":"GFPCL",
	"regDate":"12-09-2020",
	"assoc":"FPC Member",
	"fName":"Gargi",
	"mName":"Ganesh",
	"lName":"Anantwar",
	"gender":"Male",
	"dob":"10-11-1989",
	"phones":["18726826","12869111"],
	"addr":{"a":"a","b":"b","c":"c","d":"d"}
    }
 */

router.post('/create', controller.create);

/**
 * Farmer list all sample request:
 * URL: GET http://localhost:8000/farmer/list/GFPCL
 */

router.get('/list/:le', controller.listAll);

/**
 * Farmer list one sample request:
 * URL: GET http://localhost:8000/farmer/list/GFPCL/f0000002
 */

router.get('/list/:le/:id', controller.listOne);

/**
 * Farmer update sample request:
 * URL: POST http://localhost:8000/farmer/update/GFPCL/f0000002
 * JSON:
 * {
	"phones":["9999999999","8888888888"],
	"addr":{"a":"a","b":"b","c":"c","d":"d"}
    }
 */

router.post('/update/:le/:id', controller.update);

module.exports = router;
