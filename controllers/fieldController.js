const multichain = require('../utils/multichain.js');

exports.create = async (req, res) => {
    //parse request JSON for mandatory and optional fields
    let regLE = req.params.le;
    let farmerCode = req.body.farmerCode;
    let crops=req.body.crops;
    let isOwner = req.body.isOwner;
    let fieldName = req.body.fieldName;
    let totalArea = req.body.totalArea;
    let usableArea = req.body.usableArea;
    let linkedArea = req.body.linkedArea;
    let soilType = req.body.soilType;
    let waterSources = req.body.waterSources;
    let geoLoc = req.body.geoLoc;
    let addr = req.body.addr;

    //Verify area numbers
    if (totalArea <= 0 || usableArea <= 0) {
        res.status(400).json({ failure: 'Total Area or Usable Area cannot be zero' });
    } else {
        if (linkedArea > usableArea || usableArea > totalArea) {
            res.status(400).json({ failure: 'Linked Area or Usable Area exceeds limits' });
        } else {

            //Generate next field code
            let lastIDs = await multichain(regLE, [], 'liststreamkeyitems', ['idmap', 'field', false, 1, -1]);
            let fieldCode = (parseInt('0x' + lastIDs[0][0].data) + 1).toString(16);

            //Build field object
            let fieldObject = {
                fieldCode: fieldCode,
                farmerCode: farmerCode,
                crops:crops,
                regLE: regLE,
                isOwner: isOwner,
                fieldName: fieldName,
                totalArea: totalArea,
                usableArea: usableArea,
                linkedArea: linkedArea,
                soilType: soilType,
                waterSources: waterSources,
                geoLoc: geoLoc,
                addr: addr,
                status: true
            };

            //Publish field object to org blockchain
            let mainPublish = await multichain(regLE, crops, 'publish', ['field', fieldCode, { json: fieldObject }, 'offchain']);
            if (mainPublish.error == true) {
                res.status(400).json({ failure: 'Unable to publish field object to stream' });
            } else {
                let idPublish = await multichain(regLE, crops, 'publish', ['idmap', 'field', fieldCode, 'offchain']);
                res.status(200).json({ success: 'New field created', farmerCode: farmerCode, fieldCode: fieldCode, legalEntity: req.body.regLE });
            }


        }
    }
}

exports.listAll = async (req, res) => {
    let regLE = req.params.le;

    let streamItems = await multichain(regLE, [], 'liststreamitems', ['field']);
    if (streamItems[0].error == true) {
        res.status(400).json({ failure: 'Unable to read field objects' });
    } else {
        //Filter items confirmed on blockchain
        let confirmedItems = (streamItems[0].filter(i => i.confirmations > 0)).reverse();
        let confirmedData = confirmedItems.map(h => h.data.json);

        //Filter only the latest values for each field code
        confirmedData = confirmedData.filter((data, index, self) => {
            return index === self.findIndex(obj => {
                return JSON.stringify(obj.fieldCode) === JSON.stringify(data.fieldCode);
            });
        });
        res.status(200).send(confirmedData);
    }
}

exports.listOne = async (req, res) => {
    //read field code from request, validations to be added later
    let regLE = req.params.le;
    let fieldCode = req.params.id;

    //check if the field code exists
    let streamItem = await multichain(regLE, [], 'liststreamkeyitems', ['field', fieldCode, true, 1, -1]);
    if (streamItem[0].error == true) {
        res.status(400).json({ failure: 'Unable to read field object with code ' + fieldCode });
    } else {
        if (streamItem[0].confirmations == 0) {
            res.status(400).json({ failure: 'field code ' + fieldCode + ' awaiting confirmation on blockchain' });
        } else {
            fieldObject = streamItem[0][0].data.json;
            res.status(200).json(fieldObject);
        }
    }
}

exports.update = async (req, res) => {
    //read field code from request, validations to be added later
    let regLE = req.params.le;
    let fieldCode = req.params.id;

    //check if the field code exists
    let streamItem = await multichain(regLE, [], 'liststreamkeyitems', ['field', fieldCode, true, 1, -1]);
    if (streamItem[0].error == true) {
        res.status(400).json({ failure: 'Unable to read field object with code ' + fieldCode });
    } else {
        if (streamItem[0][0].confirmations == 0) {
            res.status(400).json({ failure: 'field code ' + fieldCode + ' awaiting confirmation on blockchain' });
        } else {
            fieldObject = streamItem[0][0].data.json;
            let crops=fieldObject.crops;
            let updatedfieldObject = { ...fieldObject, ...req.body };
            if (updatedfieldObject.totalArea <= 0 || updatedfieldObject.usableArea <= 0) {
                res.status(400).json({ failure: 'Total Area or Usable Area cannot be zero' });
            } else {
                if (updatedfieldObject.linkedArea > updatedfieldObject.usableArea || updatedfieldObject.usableArea > updatedfieldObject.totalArea) {
                    res.status(400).json({ failure: 'Linked Area or Usable Area exceeds limits' });
                } else {
                    //Publish updated field object to org blockchain
                    let mainPublish = await multichain(regLE, crops, 'publish', ['field', fieldCode, { json: updatedfieldObject }, 'offchain']);
                    if (mainPublish.error == true) {
                        res.status(400).json({ failure: 'Unable to publish field object to stream' });
                    } else {
                        res.status(200).json({ success: 'Existing field updated', fieldCode: fieldCode, legalEntity: regLE });
                    }
                }
            }
        }
    }
}