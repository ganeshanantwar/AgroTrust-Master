const multichain = require('../utils/multichain.js');

exports.create = async (req, res) => {

    //parse request JSON for mandatory and optional fields

    let ownerLE = req.body.ownerLE;
    let createDate = req.body.createDate;
    let refName = req.body.refName;
    let fullName = req.body.fullName;
    let tracepoint = req.body.tracepoint;
    let isDefault = req.body.isDefault;
    let group = req.body.group;
    let geoLoc = req.body.geoLoc;
    let addr = req.body.addr;

    //Generate next location code
    let lastIDs = await multichain(ownerLE, [], 'liststreamkeyitems', ['idmap', 'location', false, 1, -1]);
    let locationCode = (parseInt('0x' + lastIDs[0][0].data) + 1).toString(16);

    //Build location object
    let locationObject = {
        locationCode: locationCode,
        ownerLE: ownerLE,
        createDate: createDate,
        refName: refName,
        fullName: fullName,
        tracepoint: tracepoint,
        isDefault: isDefault,
        group: group,
        geoLoc: geoLoc,
        addr: addr,
        status: true
    };

    //Publish location object to all crop blockchains
    let mainPublish = await multichain(ownerLE, [], 'publish', ['location', locationCode, { json: locationObject }, 'offchain']);
    if (mainPublish.error == true) {
        res.status(400).json({ failure: 'Unable to publish location object to stream' });
    } else {
        let idPublish = await multichain(ownerLE, [], 'publish', ['idmap', 'location', locationCode, 'offchain']);
        res.status(200).json({ success: 'New location registered', locationCode: locationCode, legalEntity: req.body.regLE });
    }


};

exports.listAll = async (req, res) => {

    let regLE = req.params.le;

    let streamItems = await multichain(regLE, [], 'liststreamitems', ['location']);
    if (streamItems[0].error == true) {
        res.status(400).json({ failure: 'Unable to read location objects' });
    } else {
        //Filter items confirmed on blockchain
        let confirmedItems = (streamItems[0].filter(i => i.confirmations > 0)).reverse();
        let confirmedData = confirmedItems.map(h => h.data.json);

        //Filter only the latest values for each location code
        confirmedData = confirmedData.filter((data, index, self) => {
            return index === self.findIndex(obj => {
                return JSON.stringify(obj.locationCode) === JSON.stringify(data.locationCode);
            });
        });
        res.status(200).send(confirmedData);
    }
};


exports.listOne = async (req, res) => {
    //read location code from request, validations to be added later
    let regLE = req.params.le;
    let locationCode = req.params.id;

    //check if the location code exists
    let streamItem = await multichain(regLE, [], 'liststreamkeyitems', ['location', locationCode, true, 1, -1]);
    if (streamItem[0].error == true) {
        res.status(400).json({ failure: 'Unable to read location object with code ' + locationCode });
    } else {
        if (streamItem[0].confirmations == 0) {
            res.status(400).json({ failure: 'location code ' + locationCode + ' awaiting confirmation on blockchain' });
        } else {
            locationObject = streamItem[0][0].data.json;
            res.status(200).json(locationObject);
        }
    }

};

exports.update = async (req, res) => {
    //read location code from request, validations to be added later
    let regLE = req.params.le;
    let locationCode = req.params.id;

    //check if the location code exists
    let streamItem = await multichain(regLE, [], 'liststreamkeyitems', ['location', locationCode, true, 1, -1]);
    if (streamItem[0].error == true) {
        res.status(400).json({ failure: 'Unable to read location object with code ' + locationCode });
    } else {
        if (streamItem[0][0].confirmations == 0) {
            res.status(400).json({ failure: 'location code ' + locationCode + ' awaiting confirmation on blockchain' });
        } else {
            locationObject = streamItem[0][0].data.json;
            let updatedlocationObject = { ...locationObject, ...req.body };

            //Publish updated location object to org blockchain
            let mainPublish = await multichain(regLE, [], 'publish', ['location', locationCode, { json: updatedlocationObject }, 'offchain']);
            if (mainPublish.error == true) {
                res.status(400).json({ failure: 'Unable to publish location object to stream' });
            } else {
                res.status(200).json({ success: 'Existing location updated', locationCode: locationCode, legalEntity: regLE });
            }
        }
    }

};


