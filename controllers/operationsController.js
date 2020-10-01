const multichain = require('../utils/multichain.js');


exports.processInward = async (req, res) => {

    //parse request JSON for mandatory and optional fields
    let fromLoc = req.body.fromLoc;
    let toLoc = req.body.toLoc;
    let toLE = req.body.toLE;
    let date = req.body.date;
    let orderID = req.body.orderID;
    let delNote = req.body.delNote;
    let cropID = req.body.cropID;
    let varietyID = req.body.varietyID;
    let skuCode = req.body.skuCode;
    let skuQuantity = req.body.skuQuantity;
    let uomPrice = req.body.uomPrice;
    let transferCost = req.body.transferCost;


    if (fromLoc.substring(0, 1) == 'e') {

        //Check if harvest batch for this field already exists
        let allBTUs=await multichain(toLE, [cropID], 'liststreamitems', ['btu']);
        allBTUNames=allBTUs


        //Generate harvest-batch BTU
        let btuIDs = await multichain(toLE, [cropID], 'liststreamkeyitems', ['idmap', 'btu', false, 1, -1]);
        let btuID1 = (parseInt('0x' + tf1IDs[0][0].data) + 1).toString(16);
        let btuID2 = (parseInt('0x' + tf1IDs[0][0].data) + 2).toString(16);


        

        //Record a transfer from fromLoc to toLoc
        let tr1IDs = await multichain(toLE, [cropID], 'liststreamkeyitems', ['idmap', 'transfer', false, 1, -1]);
        let tr1ID = (parseInt('0x' + tr1IDs[0][0].data) + 1).toString(16);
        let tr1={
            transferID:tr1ID,
            type:'Purchase',

        }

        //Generate a BTU 


    } else {

    }


}