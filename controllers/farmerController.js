const multichain = require('../utils/multichain.js');

exports.create = async (req, res) => {

    //parse request JSON for mandatory and optional fields

    let regLE = req.params.le;
    let regDate = req.body.regDate;
    let fName = req.body.fName;
    let lName = req.body.lName;
    let mName = req.body.mName;
    let crops=req.body.crops;
    let assoc = req.body.assoc;
    let img = req.body.img;
    let gender = req.body.gender;
    let dob = req.body.dob;
    let edu = req.body.edu;
    let email = req.body.email;
    let phones = req.body.phones;
    let addr = req.body.addr;

    //Generate next farmer code
    let lastIDs = await multichain(regLE, [], 'liststreamkeyitems', ['idmap', 'farmer', false, 1, -1]);
    let farmerCode = (parseInt('0x' + lastIDs[0][0].data) + 1).toString(16);

    //Build farmer object
    let farmerObject = {
        farmerCode: farmerCode,
        regLE: regLE,
        regDate: regDate,
        fName: fName,
        lName: lName,
        mName: mName,
        crops:crops,
        assoc: assoc,
        img: img,
        gender: gender,
        dob: dob,
        edu: edu,
        email: email,
        phones: phones,
        addr: addr,
        status: true
    };

    //Publish farmer object to crop blockchains
    let mainPublish = await multichain(regLE, crops, 'publish', ['farmer', farmerCode, { json: farmerObject }, 'offchain']);
    if (mainPublish.error == true) {
        res.status(400).json({ failure: 'Unable to publish farmer object to stream' });
    } else {
        let idPublish = await multichain(regLE, crops, 'publish', ['idmap', 'farmer', farmerCode, 'offchain']);
        res.status(200).json({ success: 'New farmer registered', farmerCode: farmerCode, legalEntity: req.body.regLE });
    }

};

exports.listAll = async (req, res) => {

    let regLE = req.params.le;

    let streamItems = await multichain(regLE, [], 'liststreamitems', ['farmer']);
    if (streamItems[0].error == true) {
        res.status(400).json({ failure: 'Unable to read farmer objects' });
    } else {
        //Filter items confirmed on blockchain
        let confirmedItems = (streamItems[0].filter(i => i.confirmations > 0)).reverse();
        let confirmedData = confirmedItems.map(h => h.data.json);

        //Filter only the latest values for each farmer code
        confirmedData = confirmedData.filter((data, index, self) => {
            return index === self.findIndex(obj => {
                return JSON.stringify(obj.farmerCode) === JSON.stringify(data.farmerCode);
            });
        });
        res.status(200).send(confirmedData);
    }
};

exports.listOne = async (req, res) => {
    //read farmer code from request, validations to be added later
    let regLE = req.params.le;
    let farmerCode = req.params.id;

    //check if the farmer code exists
    let streamItem = await multichain(regLE, [], 'liststreamkeyitems', ['farmer', farmerCode, true, 1, -1]);
    if (streamItem[0].error == true) {
        res.status(400).json({ failure: 'Unable to read farmer object with code ' + farmerCode });
    } else {
        if (streamItem[0].confirmations == 0) {
            res.status(400).json({ failure: 'Farmer code ' + farmerCode + ' awaiting confirmation on blockchain' });
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
    let streamItem = await multichain(regLE, [], 'liststreamkeyitems', ['farmer', farmerCode, true, 1, -1]);
    if (streamItem[0].error == true) {
        res.status(400).json({ failure: 'Unable to read farmer object with code ' + farmerCode });
    } else {
        if (streamItem[0][0].confirmations == 0) {
            res.status(400).json({ failure: 'Farmer code ' + farmerCode + ' awaiting confirmation on blockchain' });
        } else {
            farmerObject = streamItem[0][0].data.json;
            let crops=farmerObject.crops;
            let updatedFarmerObject = { ...farmerObject, ...req.body };

            //Publish updated farmer object to org blockchain
            let mainPublish = await multichain(regLE, crops, 'publish', ['farmer', farmerCode, { json: updatedFarmerObject }, 'offchain']);
            if (mainPublish.error == true) {
                res.status(400).json({ failure: 'Unable to publish farmer object to stream' });
            } else {
                res.status(200).json({ success: 'Existing farmer updated', farmerCode: farmerCode, legalEntity: regLE });
            }
        }
    }

};


