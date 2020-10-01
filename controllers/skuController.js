const multichain = require('../utils/multichain.js');

exports.create = async (req, res) => {

    //parse request JSON for mandatory and optional fields

    let regLE = req.body.regLE;
    let materialCode = req.body.materialCode;
    //let skuName = req.body.skuName;
    let displayName = req.body.displayName;
    let isMade = req.body.isMade;
    let packType = req.body.packType;
    let barcode = req.body.barcode;
    let uom = req.body.uom;
    let quantity = req.body.quantity;
    let tWeight = req.body.tWeight;
    let expDays = req.body.expDays;
    let isWastage = req.body.isWastage;


    //check if material code exists
    let cropID=materialCode.substring(0,4);
    let allMatCodes = await multichain(regLE, [cropID], 'liststreamitems', ['material']);
    allMatCodes = allMatCodes[0].map(c => c.data.json.materialCode);
    if (allMatCodes.includes(materialCode)) {

        //Get corresponding material object
        let materialObject = await multichain(regLE, [cropID], 'liststreamkeyitems', ['material', materialCode, false, 1, -1]);
        materialObject=materialObject[0][0].data.json;

        //Generate sku code
        let lastIDs = await multichain(regLE, [cropID], 'liststreamkeyitems', ['idmap', 'sku', false, 1, -1]);
        let skuCode = (parseInt('0x' + lastIDs[0][0].data) + 1).toString(16);

        //Build loose sku object
        let skuObject = {
            skuCode: skuCode,
            materialCode: materialCode,
            skuName: materialObject.cropComName+' '+materialObject.varComName+' '+packType+' ('+quantity+''+uom+')',
            displayName: displayName,
            isMade: isMade,
            packType: packType,
            barcode: barcode,
            uom: uom,
            quantity: quantity,
            gWeight: materialObject.uomWeight*quantity+tWeight,
            tWeight: tWeight,
            nWeight: materialObject.uomWeight*quantity,
            expDays: expDays,
            isWastage: isWastage,
            status: true
        };

        //Publish material and sku objects to crop blockchain
        let skuPublish = await multichain(regLE, [cropID], 'publish', ['sku', skuCode, { json: skuObject }, 'offchain']);
        if (skuPublish.error == true) {
            res.status(400).json({ failure: 'Unable to publish sku object to stream' });
        } else {
            let idPublish = await multichain(regLE, [cropID], 'publish', ['idmap', 'sku', skuCode, 'offchain']);
            res.status(200).json({ success: 'New SKU created', materialCode: materialCode, skuCode:skuCode });
        }

    } else {
        res.status(400).json({ failure: 'Material does not exist', materialCode: materialCode });
    }


};

exports.listAll = async (req, res) => {

    let regLE = req.params.le;

    let streamItems = await multichain(regLE, [], 'liststreamitems', ['sku']);
    let allConfirmedData = [];
    streamItems.forEach(s => {
        if (s.error == true) {
            res.status(400).json({ failure: 'Unable to read SKU objects' });
        } else {
            //Filter items confirmed on blockchain
            let confirmedItems = (s.filter(i => i.confirmations > 0)).reverse();
            let confirmedData = confirmedItems.map(h => h.data.json);

            //Filter only the latest values for each material code
            confirmedData = confirmedData.filter((data, index, self) => {
                return index === self.findIndex(obj => {
                    return JSON.stringify(obj.skuCode) === JSON.stringify(data.skuCode);
                });
            });

            allConfirmedData=[...allConfirmedData,...confirmedData];
        }
    });

    res.status(200).json(allConfirmedData);
};

exports.listOne = async (req, res) => {
    //read material code from request, validations to be added later
    let regLE = req.params.le;
    let skuCode = req.params.id;

    let streamItems = await multichain(regLE, [], 'liststreamitems', ['sku']);
    res.status(200).json('NOT IMPLEMENTED');

};

exports.update = async (req, res) => {
    //read sku code from request, validations to be added later
    let regLE = req.params.le;
    let skuCode = req.params.id;

    res.status(200).json('NOT IMPLEMENTED');

};


