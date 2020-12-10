const axios = require('axios');
const fs = require('fs');
const path = require('path');
const objects = ['farmer', 'origin', 'location', 'material', 'sku'];

objects.forEach(async (i) => {
	let data = JSON.parse(
		fs.readFileSync(path.resolve(__dirname, './' + i + '.json'))
	);
	let x = data.map(async (d) => {
		let x = await axios({
			method: 'post',
			url: 'http://localhost:8000/master/create/' + i + '/GFPCL',
			data: d,
		});
	});

	let y = await Promise.all(x)
		.then((e) => e)
		.catch((e) => e);

	console.log(y);
});
