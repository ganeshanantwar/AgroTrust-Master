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

		//get next BTU code
		btuCode = await streamer.nextCode('btu', LECode, crops);

		//create a BTU object at fromLoc and transfer it to receiving location
		let btuObject = {
			btuCode: btuCode,
			btuName: 'INWARD-BATCH',
			materialCode: materialCode,
			isFinished: false,
			origin: fromLoc,
			currentLoc: toLoc,
			oneDown: null,
			oneUp: [],
			createdDate: date,
			creationCost: locationCost,
			totalWeight: totalWeight,
			estWeight: totalWeight,
			totalValue: totalWeight * price,
			unitValue: price,
			transfers: [
				{
					fromLoc: fromLoc,
					toLoc: toLoc,
					date: date,
					locationCost: locationCost,
					transferCost: transferCost,
					margin: totalWeight * price - locationCost - transferCost,
				},
			],
		};

		//write the btu to blockchain
		let btuPublish = await multichain(LECode, crops, 'publish', [
			'btu',
			btuCode,
			{ json: btuObject },
			'offchain',
		]);

		let idPublish = await multichain(LECode, crops, 'publish', [
			'idmap',
			'btu',
			btuCode,
			'offchain',
		]);

		if (btuPublish.error == true || idPublish.error == true) {
			return res.status(200).json({
				success: false,
				message: 'Could not record inward to blockchain',
			});
		} else {
			return res.status(200).json({
				success: true,
				message: 'Inward recorded to blockchain',
				batchCode: btuCode,
			});
		}
	}
};

exports.processConvert = async (req, res) => {
	let LECode = req.params.le;
	let atLoc = req.body.atLoc;
	let materialCode = req.body.materialCode;
	let fromBtuCode = req.body.fromBtuCode;
	let toSkuCode = req.body.toSkuCode;
	let toSkuQuantity = req.body.toSkuQuantity;
	let date = req.body.date;
	let cost = req.body.cost;

	//get the source BTU and target SKU objects
	let crops = [];
	crops.push(materialCode.toString().substr(0, 4));
	let targetSKU = await streamer.fetchOne('sku', toSkuCode, LECode, crops);
	let sourceBTU = await streamer.fetchOne('btu', fromBtuCode, LECode, crops);

	//check if the source BTU exists at the location

	//check if the BTU object has enough weight for conversion
	if (sourceBTU.estWeight < targetSKU.nWeight * toSkuQuantity) {
		return res.status(400).json({
			success: false,
			message: 'Source BTU does not have enough material for conversion',
			sourceWeight: sourceBTU.estWeight,
			targetWeight: targetSKU.nWeight * toSkuQuantity,
		});
	} else {
		if (targetSKU.isFinished) {
			//if the target SKU object is finished good, create one BTU for each SKU
			for (let i = 0; i < toSkuQuantity; i++) {
				//get next BTU code
				btuCode = await streamer.nextCode('btu', LECode, crops);
				let btuObject = {
					btuCode: btuCode,
					btuName: 'FINISHED-GOOD',
					materialCode: materialCode,
					isFinished: true,
					origin: sourceBTU.origin,
					currentLoc: atLoc,
					oneDown: [fromBtuCode],
					oneUp: null,
					createdDate: date,
					creationCost: cost / toSkuQuantity,
					totalWeight: targetSKU.nWeight,
					totalValue:
						targetSKU.nWeight * sourceBTU.unitValue +
						cost / toSkuQuantity,
					transfers: [],
				};
				sourceBTU.oneUp.push(btuCode);

				//write the btu to blockchain
				let btuPublish = await multichain(LECode, crops, 'publish', [
					'btu',
					btuCode,
					{ json: btuObject },
					'offchain',
				]);

				let idPublish = await multichain(LECode, crops, 'publish', [
					'idmap',
					'btu',
					btuCode,
					'offchain',
				]);
			}

			//update source BTU object
			sourceBTU.estWeight -= targetSKU.nWeight * toSkuQuantity;
			sourceBTU.totalValue = sourceBTU.estWeight * sourceBTU.unitValue;

			let sourceBtuPublish = await multichain(LECode, crops, 'publish', [
				'btu',
				sourceBTU.btuCode,
				{ json: sourceBTU },
				'offchain',
			]);

			if (sourceBtuPublish.error == true) {
				return res.status(200).json({
					success: false,
					message: 'Could not record conversion to blockchain',
				});
			} else {
				return res.status(200).json({
					success: true,
					message: 'Conversion recorded to blockchain',
					batchCode: btuCode,
				});
			}
		} else {
			return res.status(200).json({
				success: false,
				message:
					'Work in Progress: This case models raw material to raw material conversion',
			});
			//if the target SKU object is raw material, create a single BTU for all SKUs
			//Specific conversion case not yet implemented
		}
	}
};

exports.processDispatch = async (req, res) => {
	//validate mandatory fields
	let LECode = req.params.le;
	let materialCode = req.body.materialCode;
	let fromLoc = req.body.fromLoc;
	let toLoc = req.body.toLoc;
	let btuCodeList = req.body.btuCodeList;
	let price = req.body.price;
	let date = req.body.date;
	let transferCost = req.body.transferCost;
	let locationCost = req.body.locationCost;

	let crops = [];
	crops.push(materialCode.toString().substr(0, 4));

	//filter the BTUs available at from location for dispatch
	let availableBtus = btuCodeList.filter(async (i) => {
		let btuObject = await streamer.fetchOne('btu', i, LECode, crops);
		return btuObject.currentLoc === fromLoc;
	});

	if (btuCodeList.length > availableBtus.length) {
		return res.status(200).json({
			success: false,
			message: 'Not all items being dispatched available at source location',
			dispatchItems: btuCodeList.length,
			availableItems: availableBtus.length,
		});
	} else {
		//Update values of all BTUs and transfer them to target location
		for (let j = 0; j < btuCodeList.length; j++) {
			let updatedBtu = await streamer.fetchOne('btu', j, LECode, crops);
			updatedBtu.currentLoc = toLoc;
			updatedBtu.totalValue += transferCost / btuCodeList.length;
			updatedBtu.totalValue += locationCost / btuCodeList.length;
			updatedBtu.unitValue = updatedBtu.totalValue / updatedBtu.totalWeight;
			updatedBtu.sellPrice = price;
			updatedBtu.transfers.push({
				fromLoc: fromLoc,
				toLoc: toLoc,
				date: date,
				locationCost: locationCost,
				transferCost: transferCost,
				margin: price - (locationCost + transferCost) / btuCodeList.length,
			});

			let updatedBtuPublish = await multichain(LECode, crops, 'publish', [
				'btu',
				btuCodeList[j],
				{ json: updatedBtu },
				'offchain',
			]);
		}
	}
};
