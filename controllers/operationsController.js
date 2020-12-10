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
			skuCode: skuCode,
			isFinished: false,
			origin: fromLoc,
			currentLoc: toLoc,
			oneDown: null,
			oneUp: [],
			createdDate: date,
			productionCost: 0,
			totalWeight: totalWeight,
			residualWeight: totalWeight,
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
				btuCode: btuCode,
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

	//check if the BTU object has enough weight for conversion
	if (sourceBTU.residualWeight < targetSKU.nWeight * toSkuQuantity) {
		return res.status(400).json({
			success: false,
			message: 'Source BTU does not have enough material for conversion',
			sourceWeight: sourceBTU.residualWeight,
			targetWeight: targetSKU.nWeight * toSkuQuantity,
		});
	} else {
		if (targetSKU.isFinished) {
			//if the target SKU object is finished good, create one BTU for each SKU
			let btuSet = [];
			for (let i = 0; i < toSkuQuantity; i++) {
				//get next BTU code
				btuCode = await streamer.nextCode('btu', LECode, crops);
				let btuObject = {
					btuCode: btuCode,
					btuName: 'FINISHED-GOOD',
					materialCode: materialCode,
					skuCode: toSkuCode,
					isFinished: true,
					origin: sourceBTU.origin,
					currentLoc: atLoc,
					oneDown: [fromBtuCode],
					oneUp: null,
					createdDate: date,
					productionCost: cost / toSkuQuantity,
					totalWeight: targetSKU.nWeight,
					totalValue:
						targetSKU.nWeight * sourceBTU.unitValue +
						cost / toSkuQuantity,
					transfers: [],
				};
				sourceBTU.oneUp.push(btuCode);
				btuSet.push(btuCode);

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
			sourceBTU.residualWeight -= targetSKU.nWeight * toSkuQuantity;
			sourceBTU.totalValue = sourceBTU.residualWeight * sourceBTU.unitValue;

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
					btuCode: btuSet,
				});
			}
		} else {
			return res.status(200).json({
				success: false,
				message:
					'Work in Progress: This case models raw material to raw material conversion',
			});
			//if the target SKU object is not finished goods, create a single BTU for all SKUs
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

	let price = 0;

	if (req.body.price) {
		price = req.body.price;
	}

	let date = req.body.date;
	let transferCost = req.body.transferCost;
	let locationCost = req.body.locationCost;

	let crops = [];
	crops.push(materialCode.toString().substr(0, 4));

	//filter the BTUs available at from location for dispatch
	let absentBtus = btuCodeList.filter(async (i) => {
		let btuObject = await streamer.fetchOne('btu', i, LECode, crops);
		return btuObject.currentLoc != fromLoc;
	});

	if (absentBtus.length > 0) {
		return res.status(200).json({
			success: false,
			message: 'Not all items being dispatched available at source location',
			dispatchItems: btuCodeList,
			absentItems: absentBtus,
		});
	} else {
		let fromLocObject = await streamer.fetchOne(
			'location',
			fromLoc,
			LECode,
			crops
		);
		let toLocObject = await streamer.fetchOne(
			'location',
			toLoc,
			LECode,
			crops
		);

		//Update values of all BTUs and transfer them to target location
		for (let j = 0; j < btuCodeList.length; j++) {
			let updatedBtu = await streamer.fetchOne(
				'btu',
				btuCodeList[j],
				LECode,
				crops
			);

			updatedBtu.currentLoc = toLoc;

			if (fromLocObject.regLE == toLocObject.regLE) {
				//This is an internal transfer, margin is zero
				//That means according to principles of value chain - price = sourceUnitValue+(locationCost + transferCost) / btuCodeList.length,
				//override price
				price =
					updatedBtu.unitValue +
					locationCost / btuCodeList.length +
					transferCost / btuCodeList.length;
				margin = 0;
			} else {
				//This is a sell transaction to another LE, margin is not zero
				margin =
					price -
					locationCost / btuCodeList.length +
					transferCost / btuCodeList.length;
			}

			updatedBtu.totalValue = updatedBtu.totalWeight * price;
			updatedBtu.unitValue = updatedBtu.totalValue / updatedBtu.totalWeight;
			updatedBtu.transfers.push({
				fromLoc: fromLoc,
				toLoc: toLoc,
				date: date,
				locationCost: locationCost / btuCodeList.length,
				transferCost: transferCost / btuCodeList.length,
				margin: margin,
			});

			let updatedBtuPublish = await multichain(LECode, crops, 'publish', [
				'btu',
				btuCodeList[j],
				{ json: updatedBtu },
				'offchain',
			]);
		}

		return res.status(200).json({
			success: true,
			message: 'Dispatch recorded to blockchain',
			btuCode: btuCodeList,
		});
	}
};
