const express=require('express');
const router=express.Router();
const controller=require('../controllers/locationController.js');

/**
 * LOCATION Codes Range: 0xAB000001 to 0xABFFFFFF
 */


/**
 * location create sample request:
 * URL: POST http://localhost:8000/location/create
 * JSON:
 * {
    "ownerLE":"GFPCL",
    "createDate":"12-08-2020",
	"refName":"Packhouse1",
	"fullName":"Main Packhouse City XYZ Area ABC",
	"tracepoint":"Processing & Packaging",
	"isDefault":1,
	"group":"XYZ Plant",
	"geoLoc":[[12,12],[13,13],[14,14],[15,15]],
	"addr":{"a":"a","b":"b","c":"c","d":"d"}
    }
 */

router.post('/create', controller.create);

/**
 * location list all sample request:
 * URL: GET http://localhost:8000/location/list/GFPCL
 */

router.get('/list/:le', controller.listAll);

/**
 * location list one sample request:
 * URL: GET http://localhost:8000/location/list/GFPCL/f0000002
 */

router.get('/list/:le/:id', controller.listOne);

/**
 * location update sample request:
 * URL: POST http://localhost:8000/location/update/GFPCL/f0000002
 * JSON:
 * {
	"refName":"My Packhouse 3"
    }
 */

router.post('/update/:le/:id', controller.update);


module.exports = router;
