const multichain = require('../utils/multichain.js');
const streamer = require('../utils/streamer');

exports.processInward = async (req, res) => {
	//validate mandatory fields
	let LECode = req.params.le;
	let materialCode = req.body.materialCode;
	let fromLoc = req.body.fromLoc;
	let toLoc = req.body.toLoc;
	let skuCode = req.body.skuCode;
	let skuQuantity = req.body.skuQuantity;
	let totalWeight = req.body.totalWeight;
	let price = req.body.price;
	let rejection = req.body.rejection;
	let date = req.body.date;
	let transferCost = req.body.transferCost;
	let locationCost = req.body.locationCost;

	//get SKU object
	let crops = [];
	crops.push(materialCode.toString().substr(0, 4));
	let inSKU = await streamer.fetchOne('sku', skuCode, req.params.le, crops);

	//validate if difference between received total weight and skuQuantity*inSKU.nWeight is within 10KG
	if (Math.abs(totalWeight - skuQuantity * inSKU.nWeight) >= 10) {
		return res.status(400).json({
			success: false,
			message:
				'Total Weight for ' +
				skuQuantity +
				' SKUs should be ' +
				skuQuantity * inSKU.nWeight +
				' but actual weight is ' +
				totalWeight +
				'. Please check weighment!',
		});
	} else {
		//adjust total weight with rejections
		totalWeight -= rejection;

		//check if from location is a plot, if yes set the origin flag
		let isOrigin = req.body.fromLoc.toString().substr(0, 2) == 'aa';
		if (isOrigin) {
			//get next BTU code
			btuCode = await streamer.nextCode('btu', LECode, crops);
			//create a transfer object
			/*let inward_transfer={
                fromLoc:
                toLoc:
                date:
                locationCost:
                transferCost:
                buyerLE:
                sellerLE:
                price:
            }*/

			//create a BTU object at plot
			let btu = {
				btuCode: btuCode,
				btuName: 'inward-batch',
				materialCode: materialCode,
				skuCode: skuCode,
				skuQuantity: skuQuantity,
				isFinished: inSKU.isFinished,
				origin: fromLoc,
				oneDown: null,
				downMixed: false,
				oneUp: null,
				upMixed: false,
				transformDate: date,
				transformName: 'HARVEST',
				totalWeight: totalWeight,
				materialCost: totalWeight * price,
				transformCost: 0,
				totalValue: totalWeight * price + locationCost + transferCost,
				transfers: [],
			};
		} else {
		}
	}
};

exports.processConvert = async (req, res) => {
	return res.status(200).json({
		success: false,
		message: 'TO BE IMPLEMENTED',
	});
};

exports.processDispatch = async (req, res) => {
	return res.status(200).json({
		success: false,
		message: 'TO BE IMPLEMENTED',
	});
};
