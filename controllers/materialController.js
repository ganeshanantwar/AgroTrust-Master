const multichain = require('../utils/multichain.js');
const { all } = require('../routes/material.js');

exports.create = async (req, res) => {

    //parse request JSON for mandatory and optional fields

    let regLE = req.body.regLE;
    let cropID = req.body.cropID;
    let varietyID = req.body.varietyID;
    let cropComName = req.body.cropComName;
    let varComName = req.body.varComName;
    let botName = req.body.botName;
    let cultivar = req.body.cultivar;
    let cropState = req.body.cropState;
    let batchPrefix = req.body.batchPrefix;
    let defCat = req.body.defCat;
    let custCat = req.body.custCat;
    let uom = req.body.uom;
    let uomWeight = req.body.uomWeight;
    let recovery = req.body.recovery;

    //generate material code from cropID/varietyID combination
    let materialCode = (cropID + parseInt('0x' + varietyID).toString(16).padStart(4, '0')).toString();

    //check if material code already exists
    let allMatCodes = await multichain(regLE, [cropID], 'liststreamitems', ['material']);
    allMatCodes = allMatCodes[0].map(c => c.data.json.materialCode);
    if (allMatCodes.includes(materialCode)) {
        res.status(400).json({ failure: 'Material with this cropID/VarietyID already exists', materialCode: materialCode });
    } else {
        //Generate loose sku code
        let lastIDs = await multichain(regLE, [cropID], 'liststreamkeyitems', ['idmap', 'sku', false, 1, -1]);
        let skuCode = (parseInt('0x' + lastIDs[0][0].data) + 1).toString(16);

        //Build material object
        let materialObject = {
            materialCode: materialCode,
            cropID: cropID,
            varietyID: varietyID,
            cropComName: cropComName,
            varComName: varComName,
            botName: botName,
            cultivar: cultivar,
            cropState: cropState,
            batchPrefix: batchPrefix,
            defCat: defCat,
            custCat: custCat,
            uom: uom,
            uomWeight: uomWeight,
            recovery: recovery,
            status: true
        };

        //Build loose sku object
        let skuObject = {
            skuCode: skuCode,
            materialCode: materialCode,
            skuName: cropComName + ' ' + varComName + ' Loose',
            displayName: cropComName + ' ' + varComName + ' Loose',
            isMade: true,
            packType: 'Loose',
            barcode: null,
            uom: 'KG',
            quantity: 1.000,
            gWeight: 1.000,
            tWeight: 0,
            nWeight: 1.000,
            expDays: 5,
            isWastage: false,
            status: true
        };

        //Publish material and sku objects to crop blockchain
        let materialPublish = await multichain(regLE, [cropID], 'publish', ['material', materialCode, { json: materialObject }, 'offchain']);
        let skuPublish = await multichain(regLE, [cropID], 'publish', ['sku', skuCode, { json: skuObject }, 'offchain']);
        if (materialPublish.error == true || skuPublish.error == true) {
            res.status(400).json({ failure: 'Unable to publish material object to stream' });
        } else {
            let idPublish1 = await multichain(regLE, [cropID], 'publish', ['idmap', 'material', materialCode, 'offchain']);
            let idPublish2 = await multichain(regLE, [cropID], 'publish', ['idmap', 'sku', skuCode, 'offchain']);
            res.status(200).json({ success: 'New material created', materialCode: materialCode });
        }
    }

};

exports.listAll = async (req, res) => {

    let regLE = req.params.le;

    let streamItems = await multichain(regLE, [], 'liststreamitems', ['material']);
    let allConfirmedData = [];
    streamItems.forEach(s => {
        if (s.error == true) {
            res.status(400).json({ failure: 'Unable to read material objects' });
        } else {
            //Filter items confirmed on blockchain
            let confirmedItems = (s.filter(i => i.confirmations > 0)).reverse();
            let confirmedData = confirmedItems.map(h => h.data.json);

            //Filter only the latest values for each material code
            confirmedData = confirmedData.filter((data, index, self) => {
                return index === self.findIndex(obj => {
                    return JSON.stringify(obj.materialCode) === JSON.stringify(data.materialCode);
                });
            });

            allConfirmedData=[...allConfirmedData,...confirmedData];
        }
    });

    res.status(200).send(allConfirmedData);
};

exports.listOne = async (req, res) => {
    //read material code from request, validations to be added later
    let regLE = req.params.le;
    let materialCode = req.params.id;
    let cropID=materialCode.substring(0,4);

    //check if the material code exists
    let streamItem = await multichain(regLE, [cropID], 'liststreamkeyitems', ['material', materialCode, true, 1, -1]);
    if (streamItem[0].error == true) {
        res.status(400).json({ failure: 'Unable to read material object with code ' + materialCode });
    } else {
        if (streamItem[0].confirmations == 0) {
            res.status(400).json({ failure: 'material code ' + materialCode + ' awaiting confirmation on blockchain' });
        } else {
            materialObject = streamItem[0][0].data.json;
            res.status(200).json(materialObject);
        }
    }

};

exports.update = async (req, res) => {
    //read material code from request, validations to be added later
    let regLE = req.params.le;
    let materialCode = req.params.id;
    let cropID=materialCode.substring(0,4);

    //check if the material code exists
    let streamItem = await multichain(regLE, [cropID], 'liststreamkeyitems', ['material', materialCode, true, 1, -1]);
    if (streamItem[0].error == true) {
        res.status(400).json({ failure: 'Unable to read material object with code ' + materialCode });
    } else {
        if (streamItem[0][0].confirmations == 0) {
            res.status(400).json({ failure: 'material code ' + materialCode + ' awaiting confirmation on blockchain' });
        } else {
            materialObject = streamItem[0][0].data.json;
            let updatedmaterialObject = { ...materialObject, ...req.body };

            //Publish updated material object to org blockchain
            let mainPublish = await multichain(regLE, [cropID], 'publish', ['material', materialCode, { json: updatedmaterialObject }, 'offchain']);
            if (mainPublish.error == true) {
                res.status(400).json({ failure: 'Unable to publish material object to stream' });
            } else {
                res.status(200).json({ success: 'Existing material updated', materialCode: materialCode, legalEntity: regLE });
            }
        }
    }

};


