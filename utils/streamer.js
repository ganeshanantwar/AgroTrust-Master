const multichain = require('./multichain');

exports.hashVerify = async (stream, hash, LECode, crops) => {
	let hashItems = await multichain(LECode, crops, 'liststreamitems', [
		stream + '-hashmap',
	]);
	hashItems = hashItems[0].reverse();
	hashItems = hashItems.filter((data, index, self) => {
		return (
			index ===
			self.findIndex((obj) => {
				return JSON.stringify(obj.keys[0]) === JSON.stringify(data.keys[0]);
			})
		);
	});
	hashItems = hashItems.map((j) => j.data);
	if (hashItems.includes(hash)) {
		return true;
	} else {
		return false;
	}
};

exports.nextCode = async (stream, LECode, crops) => {
	let last = await multichain(LECode, crops, 'liststreamkeyitems', [
		'idmap',
		stream,
		false,
		1,
		-1,
	]);

	next = (parseInt('0x' + last[0][0].data) + 1).toString(16);
	return next;
};

exports.publishNew = async (stream, hash, code, newObject, LECode, crops) => {
	let dataPublish = await multichain(LECode, crops, 'publish', [
		stream,
		code,
		{ json: newObject },
		'offchain',
	]);

	if (dataPublish.error == true) {
		return {
			failure: 'Unable to publish ' + stream + ' object to stream',
		};
	} else {
		let idPublish = await multichain(LECode, crops, 'publish', [
			'idmap',
			stream,
			code,
			'offchain',
		]);
		let hashPublish = await multichain(LECode, crops, 'publish', [
			stream + '-hashmap',
			code,
			hash,
			'offchain',
		]);
		return {
			success: 'New ' + stream + ' created',
			code: code,
			LECode: LECode,
		};
	}
};

exports.fetchAll = async (stream, LECode, crops) => {
	let streamItems = await multichain(LECode, crops, 'liststreamitems', [
		stream,
	]);

	if (streamItems[0].error == true) {
		return { failure: 'Unable to read ' + stream + ' objects' };
	} else {
		//Filter items confirmed on blockchain
		dataItems = streamItems[0].filter((i) => i.confirmations > 0).reverse();
		dataItems = dataItems.map((h) => h.data.json);
		//Filter only the latest items for each key
		dataItems = dataItems.filter((data, index, self) => {
			return (
				index ===
				self.findIndex((obj) => {
					return (
						JSON.stringify(obj[stream + 'Code']) ===
						JSON.stringify(data[stream + 'Code'])
					);
				})
			);
		});
		return dataItems;
	}
};

exports.fetchOne = async (stream, code, LECode, crops) => {
	let streamItem = await multichain(LECode, crops, 'liststreamkeyitems', [
		stream,
		code,
		true,
		1,
		-1,
	]);

	if (streamItem[0].error == true || streamItem[0].length == 0) {
		return {
			failure: 'Not found ' + stream + ' object with code ' + code,
		};
	} else {
		if (streamItem[0].confirmations == 0) {
			return {
				failure:
					stream + 'code ' + code + ' awaiting confirmation on blockchain',
			};
		} else {
			streamObject = streamItem[0][0].data.json;
			return streamObject;
		}
	}
};

//Fixing bug in publishUpdate
exports.publishUpdate = async (stream, code, update, LECode, crops) => {
	let streamItem = await multichain(LECode, crops, 'liststreamkeyitems', [
		stream,
		code,
		true,
		1,
		-1,
	]);

	if (streamItem[0].error == true || streamItem[0].length == 0) {
		return {
			failure: 'Not found ' + stream + ' object with code ' + code,
		};
	} else {
		if (streamItem[0].confirmations == 0) {
			return {
				failure:
					stream + 'code ' + code + ' awaiting confirmation on blockchain',
			};
		} else {
			streamObject = streamItem[0][0].data.json;
			let crops = streamObject.crops;
			let updatedStreamObject = { ...streamObject, ...update };
			//Publish updated farmer object to org blockchain
			let dataPublish = await multichain(LECode, crops, 'publish', [
				stream,
				code,
				{ json: updatedStreamObject },
				'offchain',
			]);
		}
	}
};
