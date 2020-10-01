const express = require('express');
const router = express.Router();
const controller = require('../controllers/skuController.js');

/**
 * SKU Codes Range: 0xAA000001 to 0xAAFFFFFF
 */

/**
 * sku create sample request:
 * URL: POST http://localhost:8000/sku/create
 * JSON:
 * {
 "regLE":"GFPCL",
 "materialCode":"c0010079",
 "skuName":"Orange Vidarbha 4PC Tray",
 "displayName":"Orange Vidarbha 4PC Tray",
 "isMade":1,
 "packType":"Tray",
 "barcode":"1027187201872",
 "uom":"PC",
 "quantity":4,
 "tWeight":"",
 "expDays":14,
 "isWastage":0,
 //calculated "uomWeight:"0.200",
 //calculated "gWeight":uomWeight*Quantity+tWeight,
 //calculated "nWeight":uomWeight*Quantity
}
 */

router.post('/create', controller.create);

/**
 * sku list all sample request:
 * URL: GET http://localhost:8000/sku/list/GFPCL
 */

router.get('/list/:le', controller.listAll);

/**
 * sku list one sample request:
 * URL: GET http://localhost:8000/sku/list/GFPCL/f0000002
 */

router.get('/list/:le/:id', controller.listOne);

/**
 * sku update sample request:
 * URL: POST http://localhost:8000/sku/update/GFPCL/f0000002
 * JSON:
 * {
	"barcode":"8888888888888",
    }
 */

router.post('/update/:le/:id', controller.update);

module.exports = router;
