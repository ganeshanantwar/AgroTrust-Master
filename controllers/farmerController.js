const multichain = require('../utils/multichain');
const streamer = require('../utils/streamer');
const crypto = require('crypto');

exports.create = async (req, res) => {
	//parse request JSON for mandatory and optional fields

	let regLE = req.params.le;
	let regDate = req.body.regDate;
	let fName = req.body.fName;
	let lName = req.body.lName;
	let mName = req.body.mName;
	let crops = req.body.crops;
	let assoc = req.body.assoc;
	let img = req.body.img;
	let gender = req.body.gender;
	let dob = req.body.dob;
	let edu = req.body.edu;
	let email = req.body.email;
	let phone = req.body.phone;
	let addr = req.body.addr;

	//Build farmer object without farmerCode
	let farmerObject = {
		regLE: regLE,
		regDate: regDate,
		fName: fName,
		lName: lName,
		mName: mName,
		crops: crops,
		assoc: assoc,
		img: img,
		gender: gender,
		dob: dob,
		edu: edu,
		email: email,
		phone: phone,
		addr: addr,
		status: true,
	};
	let farmerHash = crypto
		.createHash('sha256')
		.update(JSON.stringify(farmerObject))
		.digest('hex');

	//Chek if the hash of farmer object already exists
	let hashItems = await multichain(regLE, crops, 'liststreamitems', [
		'farmer-hashmap',
	]);
	hashItems = streamer.filterHashItems(hashItems[0]);

	if (hashItems.includes(farmerHash)) {
		res.status(400).json({
			failure: 'Farmer with these exact details has already been registered',
		});
	} else {
		//Generate next farmer code
		let lastIDs = await multichain(regLE, crops, 'liststreamkeyitems', [
			'idmap',
			'farmer',
			false,
			1,
			-1,
		]);
		let farmerCode = (parseInt('0x' + lastIDs[0][0].data) + 1).toString(16);
		//Add farmer code to farmer object
		farmerObject = { farmerCode: farmerCode, ...farmerObject };
		console.log(farmerObject);
		//Publish farmer object to crop blockchains
		let dataPublish = await multichain(regLE, crops, 'publish', [
			'farmer',
			farmerCode,
			{ json: farmerObject },
			'offchain',
		]);
		if (dataPublish.error == true) {
			res.status(400).json({
				failure: 'Unable to publish farmer object to stream',
			});
		} else {
			let idPublish = await multichain(regLE, crops, 'publish', [
				'idmap',
				'farmer',
				farmerCode,
				'offchain',
			]);
			let hashPublish = await multichain(regLE, crops, 'publish', [
				'farmer-hashmap',
				farmerCode,
				farmerHash,
				'offchain',
			]);
			res.status(200).json({
				success: 'New farmer registered',
				farmerCode: farmerCode,
				LECode: req.body.regLE,
			});
		}
	}
};

exports.listAll = async (req, res) => {
	let regLE = req.params.le;

	let streamItems = await multichain(regLE, [], 'liststreamitems', ['farmer']);
	if (streamItems[0].error == true) {
		res.status(400).json({ failure: 'Unable to read farmer objects' });
	} else {
		dataItems = streamer.filterDataItems(streamItems[0], 'farmerCode');
		res.status(200).send(dataItems);
	}
};

exports.listOne = async (req, res) => {
	//read farmer code from request, validations to be added later
	let regLE = req.params.le;
	let farmerCode = req.params.id;

	//check if the farmer code exists
	let streamItem = await multichain(regLE, [], 'liststreamkeyitems', [
		'farmer',
		farmerCode,
		true,
		1,
		-1,
	]);
	if (streamItem[0].error == true) {
		res.status(400).json({
			failure: 'Unable to read farmer object with code ' + farmerCode,
		});
	} else {
		if (streamItem[0].confirmations == 0) {
			res.status(400).json({
				failure:
					'Farmer code ' +
					farmerCode +
					' awaiting confirmation on blockchain',
			});
		} else {
			farmerObject = streamItem[0][0].data.json;
			res.status(200).json(farmerObject);
		}
	}
};

exports.update = async (req, res) => {
	//read farmer code from request, validations to be added later
	let regLE = req.params.le;
	let farmerCode = req.params.id;

	//check if the farmer code exists
	let streamItem = await multichain(regLE, [], 'liststreamkeyitems', [
		'farmer',
		farmerCode,
		true,
		1,
		-1,
	]);

	if (streamItem[0].error == true) {
		res.status(400).json({
			failure: 'Unable to read farmer object with code ' + farmerCode,
		});
	} else {
		if (streamItem[0][0].confirmations == 0) {
			res.status(400).json({
				failure:
					'Farmer code ' +
					farmerCode +
					' awaiting confirmation on blockchain',
			});
		} else {
			farmerObject = streamItem[0][0].data.json;
			let crops = farmerObject.crops;
			let updatedFarmerObject = { ...farmerObject, ...req.body };

			//Publish updated farmer object to org blockchain
			let dataPublish = await multichain(regLE, crops, 'publish', [
				'farmer',
				farmerCode,
				{ json: updatedFarmerObject },
				'offchain',
			]);

			if (dataPublish.error == true) {
				res.status(400).json({
					failure: 'Unable to publish farmer object to stream',
				});
			} else {
				delete updatedFarmerObject.farmerCode;
				let farmerHash = crypto
					.createHash('sha256')
					.update(JSON.stringify(updatedFarmerObject))
					.digest('hex');

				let hashPublish = await multichain(regLE, crops, 'publish', [
					'farmer-hashmap',
					farmerCode,
					farmerHash,
					'offchain',
				]);

				res.status(200).json({
					success: 'Existing farmer updated',
					farmerCode: farmerCode,
					LECode: regLE,
				});
			}
		}
	}
};
