const express = require('express');
const router = express.Router();
const controller = require('../controllers/fieldController.js');

/**
 * FIELD Codes Range: 0xAA000001 to 0xAAFFFFFF
 */

/**
 * Field create sample request:
 * URL: POST http://localhost:8000/plot/create/GFPCL
 * JSON:
 * {
    "farmerCode":"fa000001",
    "fieldCode":"fe000001",
    "mainCrop":"",
    "interCrops":[],
    "linkDate":"",
    "unlinkDate":"",
    "area":""
    "geoLoc":[[12,12],[13,13],[14,14],[15,15]],
    "season":"",
    "flags":[
        {"transplanted":false},
        {"readyToSow":false},
        {"readyToHarvest":false}
    ]
	}
 */

router.post('/create/:le', controller.create);

/**
 * field list all sample request:
 * URL: GET http://localhost:8000/plot/list/GFPCL
 */

router.get('/list/:le', controller.listAll);

/**
 * field list one sample request:
 * URL: GET http://localhost:8000/plot/list/GFPCL/fe000001
 */

router.get('/list/:le/:id', controller.listOne);

/**
 * field update sample request:
 * URL: POST http://localhost:8000/plot/update/GFPCL/fe000001
 * JSON:
 * {
	"linkedArea":11.11
    }
 */

router.post('/update/:le/:id', controller.update);

module.exports = router;
