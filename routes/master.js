const express = require('express');
const router = express.Router();
const master = require('../controllers/masterController');

router.post('/create/:type/:le', master.create);
router.post('/update/:type/:le/:id', master.update);
router.get('/list/:type/:le', master.listAll);
router.get('/list/:type/:le/:id', master.listOne);

module.exports = router;

/*
type=farmer

{
	"regDate":"20-10-2020",
    "fName":"Ganesh",
    "mName":"Krishna",
	"lName":"Anantwar",
	"crops":["c001","c003"],
    "assoc":"FPC Member",
    "img":"https://media.agrotrust.io/GFPCL/ganesh.jpg",
	"gender":"Male",
	"dob":"12-12-1981",
	"edu":"POSTGRAD",
    "email":"ganesh@emertech.it",
	"phone":"9999999999",
	"addr":"qoishaoshahspihs;KBSPOIHYSpHSPHSpiYS",
	"postalCode":"445302"
    
}

*/

/*
type=origin

{
    "farmerCode":"fa000001",
	"isOwner":true,
	"fieldName":"GAT 123/12",
	"soilType":"Black Moist",
	"waterSrc":["Well","Canal"],
	"cropID":"",
	"varID":"",
	"plotArea":9.18,
	"plantationDate":"20-10-2020",
	"harvestDate":"31-12-2020",
	"geoLoc":[[12,12],[13,13],[14,14],[15,15]]
}

*/

/*
type=location

{
    "locName":"F&V Packhouse 1",
    "checkpoint":"Processing & Packaging",
	"inLocs":[],
	"outLocs":[],
	"facility":"Green Farms Mohadi Facility",
	"isVirtual":false,
	"isDefault":true,
    "geoLoc":[[12,12],[13,13],[14,14],[15,15]],
   	"addr":"qoishaoshahspihs;KBSPOIHYSpHSPHSpiYS",
	"postalCode":"426008"
}

*/

/*
type=material

{
    "cropID":"c001",
    "varID":"00ed",
	"cropName":"Orange",
	"varName":"Nagpur Large",
	"prefix":"NGOR",
	"retailName":"Nagpur Orange",
	"category":"Citrus Fruits",
	"recovery":0.86
}

*/

/*
type=sku

{
    "materialCode":"c00100ed",
    "isFinished":true,
	"skuName":"Orange Nagpur Tray 6 PC",
	"displayName":"Orange Nagpur Tray 6 PC",
	"packType":"Tray-0.1",
	"uom":"PC",
	"uWeight":0.3,
    "units":6,
    "gWeight":1.9,
    "nWeight":1.8,
    "expDays":7,
    "business":"B2C E-commerce"
}

*/
