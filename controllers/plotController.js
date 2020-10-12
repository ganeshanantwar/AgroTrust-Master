const multichain = require('../utils/multichain.js');

exports.create = async (req, res) => {
    //parse request JSON for mandatory and optional fields
    let regLE = req.params.le;
    let farmerCode = req.body.farmerCode;
    let fieldCode=req.body.fieldCode;
    let mainCrop=req.body.mainCrop;
    let interCrops=req.body.interCrops;
    let linkDate=req.body.linkDate;
    let unlinkDate=req.body.unlinkDate;
    let area=req.body.area;
    let season=req.body.season;
    let geoLoc=req.body.geoLoc;
    let flags=req.body.flags;

    //get the field Object from which plot Object is being created
    let streamItem = await multichain(regLE, [], 'liststreamkeyitems', ['field', fieldCode, true, 1, -1]);
    if (streamItem[0].error == true) {
        res.status(400).json({ failure: 'Unable to read field object with code ' + fieldCode });
    } else {
        if (streamItem[0].confirmations == 0) {
            res.status(400).json({ failure: 'field code ' + fieldCode + ' awaiting confirmation on blockchain' });
        } else {
            let fieldObject = streamItem[0][0].data.json;
        }
    }

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
    /*NOT IMPLEMENTED*/
}

exports.listOne = async (req, res) => {
    //read field code from request, validations to be added later
    let regLE = req.params.le;
    /*NOT IMPLEMENTED*/
}

exports.update = async (req, res) => {
    let regLE = req.params.le;
    /*NOT IMPLEMENTED*/
}