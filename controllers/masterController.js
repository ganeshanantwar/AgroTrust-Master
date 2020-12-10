const streamer = require('../utils/streamer');
const crypto = require('crypto');

//Business logic for creation of new master data
exports.create = async (req, res) => {
	if (req.params.type == 'farmer') {
		//validate mandatory fields
		if (
			!req.body.regDate ||
			!req.body.crops ||
			!req.body.assoc ||
			!req.body.fName ||
			!req.body.lName ||
			!req.body.gender ||
			!req.body.dob ||
			!req.body.phone ||
			!req.body.addr ||
			!req.body.postalCode
		) {
			return res.status(400).json({
				failure: 'Mandatory fields missing for farmer',
			});
		}
	} else if (req.params.type == 'origin') {
		//validate mandatory fields
		if (
			!req.body.farmerCode ||
			!req.body.fieldName ||
			!req.body.isOwner ||
			!req.body.cropID ||
			!req.body.varID ||
			!req.body.plotArea ||
			!req.body.plantationDate
		) {
			return res.status(400).json({
				failure: 'Mandatory fields missing for origin',
			});
		}
	} else if (req.params.type == 'location') {
		//validate mandatory fields
		if (
			!req.body.locName ||
			!req.body.checkpoint ||
			!req.body.facility ||
			!req.body.postalCode
		) {
			return res.status(400).json({
				failure: 'Mandatory fields missing for location',
			});
		}
	} else if (req.params.type == 'material') {
		//validate mandatory fields
		if (
			!req.body.cropID ||
			!req.body.varID ||
			!req.body.cropName ||
			!req.body.varName ||
			!req.body.prefix ||
			!req.body.retailName ||
			!req.body.category ||
			!req.body.recovery
		) {
			return res.status(400).json({
				failure: 'Mandatory fields missing for material',
			});
		}
	} else if (req.params.type == 'sku') {
		//validate mandatory fields
		if (
			!req.body.materialCode ||
			!req.body.skuName ||
			!req.body.displayName ||
			!req.body.packType ||
			!req.body.uom ||
			!req.body.units ||
			!req.body.uWeight ||
			!req.body.gWeight ||
			!req.body.nWeight ||
			!req.body.expDays ||
			!req.body.business
		) {
			return res.status(400).json({
				failure: 'Mandatory fields missing for SKU',
			});
		}
	} else {
		return res.status(400).json({ failure: 'Invalid master data type' });
	}

	//select the correct crop blockchains
	let type = req.params.type;
	let le = req.params.le;
	let crops = [];

	if (type == 'farmer') {
		crops = req.body.crops;
	} else if (type == 'location') {
		crops = [];
	} else if (type == 'material' || type == 'origin') {
		crops.push(req.body.cropID);
	} else if (type == 'sku') {
		crops.push(req.body.materialCode.toString().substr(0, 4));
	} else {
		crops = req.body.crops;
	}

	//build master object without code and get the hash
	masterObject = { regLE: le, ...req.body, status: true };
	let masterHash = crypto
		.createHash('sha256')
		.update(JSON.stringify(masterObject))
		.digest('hex');

	//check if the hash already exists
	let check = await streamer.hashVerify(type, masterHash, le, crops);

	if (check) {
		return res.status(400).json({
			failure: type + ' with exact same details already exists',
		});
	} else {
		//Generate next object code
		if (type == 'material') {
			masterCode = (
				req.body.cropID +
				parseInt('0x' + req.body.varID)
					.toString(16)
					.padStart(4, '0')
			).toString();
		} else {
			masterCode = await streamer.nextCode(type, le, crops);
		}
		//Add master code to master object
		masterObject[type + 'Code'] = masterCode;

		//Publish master object to crop blockchains
		result = await streamer.publishNew(
			type,
			masterHash,
			masterCode,
			masterObject,
			le,
			crops
		);

		if (result.success) {
			return res.status(200).json(result);
		} else {
			return res.status(400).json(result);
		}
	}
};

//Business logic for fetching of all objects
exports.listAll = async (req, res) => {
	if (
		req.params.type == 'farmer' ||
		req.params.type == 'origin' ||
		req.params.type == 'location' ||
		req.params.type == 'material' ||
		req.params.type == 'sku'
	) {
		let result = await streamer.fetchAll(req.params.type, req.params.le, []);
		if (result.success) {
			return res.status(200).json(result);
		} else {
			return res.status(400).json(result);
		}
	} else {
		return res.status(400).json({ failure: 'Invalid master data type' });
	}
};

//Business logic for fetching of one object
exports.listOne = async (req, res) => {
	if (
		req.params.type == 'farmer' ||
		req.params.type == 'origin' ||
		req.params.type == 'location' ||
		req.params.type == 'material' ||
		req.params.type == 'sku'
	) {
		let result = await streamer.fetchOne(
			req.params.type,
			req.params.id,
			req.params.le,
			[]
		);
		if (result.success) {
			return res.status(200).json(result);
		} else {
			return res.status(400).json(result);
		}
	} else {
		return res.status(400).json({ failure: 'Invalid master data type' });
	}
};

//Business logic for updation of existing master data
exports.update = async (req, res) => {
	if (
		req.params.type == 'farmer' ||
		req.params.type == 'origin' ||
		req.params.type == 'location' ||
		req.params.type == 'material' ||
		req.params.type == 'sku'
	) {
		let result = await streamer.publishUpdate(
			req.params.type,
			req.params.id,
			req.body,
			req.params.le,
			[]
		);
		if (result.success) {
			return res.status(200).json(result);
		} else {
			return res.status(400).json(result);
		}
	} else {
		return res.status(400).json({ failure: 'Invalid master data type' });
	}
};
