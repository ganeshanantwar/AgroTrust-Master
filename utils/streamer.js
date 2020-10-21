exports.filterHashItems = (hashItems) => {
	hashItems = hashItems.reverse();
	hashItems = hashItems.filter((data, index, self) => {
		return (
			index ===
			self.findIndex((obj) => {
				return JSON.stringify(obj.keys[0]) === JSON.stringify(data.keys[0]);
			})
		);
	});
	hashItems = hashItems.map((j) => j.data);
	return hashItems;
};

exports.filterDataItems = (dataItems, keyName) => {
	//Filter items confirmed on blockchain
	dataItems = dataItems.filter((i) => i.confirmations > 0).reverse();
	dataItems = dataItems.map((h) => h.data.json);

	//Filter only the latest values for each farmer code
	dataItems = dataItems.filter((data, index, self) => {
		return (
			index ===
			self.findIndex((obj) => {
				return (
					JSON.stringify(obj[keyName]) === JSON.stringify(data[keyName])
				);
			})
		);
	});
	return dataItems;
};
