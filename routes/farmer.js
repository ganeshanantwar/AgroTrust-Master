const express = require('express');
const router = express.Router();
const controller = require('../controllers/farmerController.js');

/**
 * FARMER Codes Range: 0xFA000001 to 0xFAFFFFFF
 */

/**
 * Farmer create sample request:
 * URL: POST http://localhost:8000/farmer/create/GFPCL
 * JSON:
 {
	"regDate":"20-10-2020",
	"fName":"Ganesh",
	"mName":"Krishna",
	"lName":"Anantwar",
	"crops":["c001","c003"],
	"assoc":"FPC Member",
	"gender":"Male",
	"dob":"12-12-1981",
	"edu":"POSTGRAD",
    "email":"ganesh@emertech.io",
	"phone":"9890604028",
	"addr":{
        "postalcode":"445302",
        "town":"Pandharkawada",
        "block":"Kelapur",
        "district":"Yavatmal",
        "state":"Maharashtra"
    }
}
 */

router.post('/create/:le', controller.create);

/**
 * Farmer list all sample request:
 * URL: GET http://localhost:8000/farmer/list/GFPCL
 */

router.get('/list/:le', controller.listAll);

/**
 * Farmer list one sample request:
 * URL: GET http://localhost:8000/farmer/list/GFPCL/fa000001
 */

router.get('/list/:le/:id', controller.listOne);

/**
 * Farmer update sample request:
 * URL: POST http://localhost:8000/farmer/update/GFPCL/fa000001
 * JSON:
{
	"phone":"9999999999",
	"email":"ganesh@emertech.it",
}
 */

router.post('/update/:le/:id', controller.update);

module.exports = router;
