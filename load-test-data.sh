#!/bin/bash

curl -X POST -H "Content-Type: application/json" -d '{"regDate":"20-10-2019","fName":"Ganesh","mName":"Krishna","lName":"Anantwar","crops":["c001"],"assoc":"FPC Member","img":"https://media.agrotrust.io/GFPCL/ganesh_anantwar.jpg","gender":"Male","dob":"12-12-1981","edu":"POSTGRAD","email":"ganesh@emertech.io","phone":"9890604028","addr":"Res. Pandharkawada, Dist. Yavatmal, MH, India","postalCode":"445302"}' http://localhost:8000/master/create/farmer/GFPCL
sleep 2

curl -X POST -H "Content-Type: application/json" -d '{"regDate":"20-11-2019","fName":"Gunvant","mName":"Ramesh","lName":"Sarpate","crops":["c001"],"assoc":"FPC Member","img":"https://media.agrotrust.io/GFPCL/gunvant_sarpate.jpg","gender":"Male","dob":"11-11-1989","edu":"GRAD","email":null,"phone":"9982651785","addr":"Res. Nanded, Dist. Nanded, MH, India","postalCode":"445302"}' http://localhost:8000/master/create/farmer/GFPCL
sleep 2

curl -X POST -H "Content-Type: application/json" -d '{"regDate":"20-12-2019","fName":"Tejal","lName":"Mishram","crops":["c002"],"assoc":"FPC Member","img":"https://media.agrotrust.io/GFPCL/tejal_mishram.jpg","gender":"Female","dob":"02-05-1986","edu":"HSC","phone":"9999999999","addr":"qoishaoshahspihs;KBSPOIHYSpHSPHSpiYS","postalCode":"445302"}' http://localhost:8000/master/create/farmer/GFPCL

curl -X POST -H "Content-Type: application/json" -d '{"regDate":"06-08-2020","fName":"Dattu","mName":"Prabhakar","lName":"Purkar","crops":["c002"],"assoc":"FPC Member","img":"https://media.agrotrust.io/GFPCL/dattu_purkar.jpg","gender":"Male","dob":"10-11-1976","edu":"SSC","phone":"9817155112","addr":"Res. Adgaon, Dist. Nashik, MH, India","postalCode":"445302"}' http://localhost:8000/master/create/farmer/GFPCL

curl -X POST -H "Content-Type: application/json" -d '{"regDate":"20-01-2020","fName":"Uttam","mName":"Balu","lName":"Shinde","crops":["c003"],"assoc":"FPC Member","img":"https://media.agrotrust.io/GFPCL/uttam_shinde.jpg","gender":"Male","dob":"28-02-1983","edu":"GRAD","phone":"9162416411","addr":"Res. Dindori, Dist. Nashik, MH, India","postalCode":"445302"}' http://localhost:8000/master/create/farmer/GFPCL

curl -X POST -H "Content-Type: application/json" -d '{"regDate":"20-03-2020","fName":"Santosh","mName":"Shivaji","lName":"Gaikwad","crops":["c003"],"assoc":"FPC Member","img":"https://media.agrotrust.io/GFPCL/santosh_gaikwad.jpg","gender":"Male","dob":"12-04-1974","edu":"HSC","phone":"9621725618","addr":"Res. Mohadi, Dist. Nashik, MH, India","postalCode":"445302"}' http://localhost:8000/master/create/farmer/GFPCL

curl -X POST -H "Content-Type: application/json" -d '{"farmerCode":"fa000001","isOwner":true,"fieldName":"GAT 123/456/11","soilType":"Black Moist","waterSrc":["Well","Canal"],"cropID":"c001","varID":"e001","plotArea":0.1619,"plantationDate":"20-10-2020","harvestDate":"31-12-2020","geoLoc":[[73.79501913,20.01421334],[73.79525517,20.01408901],[73.79531954,20.01389748],[73.79501556,20.01392112],[73.79501913,20.01421334]]}' http://localhost:8000/master/create/origin/GFPCL

curl -X POST -H "Content-Type: application/json" -d '{"farmerCode":"fa000002","isOwner":true,"fieldName":"GAT 123/456/12","soilType":"Black Moist","waterSrc":["Well","Canal"],"cropID":"c001","varID":"e001","plotArea":0.4047,"plantationDate":"20-10-2020","harvestDate":"31-12-2020","geoLoc":[[73.8851266,20.17782628],[73.88491169,20.17784059],[73.88478136,20.17784059],[73.88477165,20.17798114],[73.88510719,20.17797334],[73.8851266,20.17782628]]}' http://localhost:8000/master/create/origin/GFPCL

curl -X POST -H "Content-Type: application/json" -d '{"farmerCode":"fa000003","isOwner":true,"fieldName":"GAT 123/456/13","soilType":"Black Moist","waterSrc":["Well","Canal"],"cropID":"c003","varID":"e003","plotArea":0.1328,"plantationDate":"20-10-2020","harvestDate":"31-12-2020","geoLoc":[[73.97596098,20.13821597],[73.97652324,20.13804568],[73.97645686,20.13786908],[73.97588924,20.13803057],[73.97596098,20.13821597]]}' http://localhost:8000/master/create/origin/GFPCL

curl -X POST -H "Content-Type: application/json" -d '{"farmerCode":"fa000004","isOwner":true,"fieldName":"GAT 123/456/14","soilType":"Black Moist","waterSrc":["Well","Canal"],"cropID":"c003","varID":"e003","plotArea":0.4,"plantationDate":"20-10-2020","harvestDate":"31-12-2020","geoLoc":[[74.7490504,19.08653731],[74.74916808,19.08700466],[74.75038949,19.08676132],[74.75025002,19.08614981],[74.7490504,19.08653731]]}' http://localhost:8000/master/create/origin/GFPCL

curl -X POST -H "Content-Type: application/json" -d '{"farmerCode":"fa000005","isOwner":true,"fieldName":"GAT 123/456/15","soilType":"Black Moist","waterSrc":["Well","Canal"],"cropID":"c005","varID":"e005","plotArea":0.0025,"plantationDate":"20-10-2020","harvestDate":"31-12-2020","geoLoc":[[73.99155132,20.22938708],[73.99154127,20.22935594],[73.99149198,20.2293616],[73.99150405,20.22941319],[73.99155132,20.22938708]]}' http://localhost:8000/master/create/origin/GFPCL

curl -X POST -H "Content-Type: application/json" -d '{"farmerCode":"fa000006","isOwner":true,"fieldName":"GAT 123/456/16","soilType":"Black Moist","waterSrc":["Well","Canal"],"cropID":"c005","varID":"e005","plotArea":0.0025,"plantationDate":"20-10-2020","harvestDate":"31-12-2020","geoLoc":[[73.99155132,20.22938708],[73.99154127,20.22935594],[73.99149198,20.2293616],[73.99150405,20.22941319],[73.99155132,20.22938708]]}' http://localhost:8000/master/create/origin/GFPCL

curl -X POST -H "Content-Type: application/json" -d '{"cropID":"c001","varID":"e001","cropName":"Orange","varName":"Nagpur Large","prefix":"NGOR","retailName":"Nagpur Orange","category":"Citrus Fruits","recovery":0.86}' http://localhost:8000/master/create/material/GFPCL

curl -X POST -H "Content-Type: application/json" -d '{"cropID":"c002","varID":"e002","cropName":"Mandarin","varName":"Mandarin Chinese","prefix":"MAND","retailName":"Mandarin","category":"Citrus Fruits","recovery":0.86}' http://localhost:8000/master/create/material/GFPCL

curl -X POST -H "Content-Type: application/json" -d '{"cropID":"c003","varID":"e003","cropName":"Spinach","varName":"Standard","prefix":"SPNC","retailName":"Spinach","category":"Leafy Vegetables","recovery":0.6}' http://localhost:8000/master/create/material/GFPCL

curl -X POST -H "Content-Type: application/json" -d '{"cropID":"c004","varID":"e004","cropName":"Fenugreek","varName":"Pusa-333","prefix":"FNGK","retailName":"Fenugreek","category":"Leafy Vegetables","recovery":0.6}' http://localhost:8000/master/create/material/GFPCL

curl -X POST -H "Content-Type: application/json" -d '{"cropID":"c005","varID":"e005","cropName":"Cucumber","varName":"Arka-56","prefix":"CUCU","retailName":"Cucumber White","category":"Cucurbits & Gourds","recovery":0.75}' http://localhost:8000/master/create/material/GFPCL

curl -X POST -H "Content-Type: application/json" -d '{"cropID":"c006","varID":"e006","cropName":"Bottle Gourd","varName":"Pus-777","prefix":"BTGD","retailName":"Bottle Gourd","category":"Cucurbits & Gourds","recovery":0.75}' http://localhost:8000/master/create/material/GFPCL

curl -X POST -H "Content-Type: application/json" -d '{"materialCode":"c001e001","isFinished":false,"skuName":"Orange Nagpur CRATE 5 KG","displayName":"Orange Nagpur CRATE 5 KG","packType":"CRATE-0.5","uom":"KG","uWeight":1,"units":5,"gWeight":5.5,"nWeight":5,"expDays":7,"business":"B2C STORE"}' http://localhost:8000/master/create/sku/GFPCL

curl -X POST -H "Content-Type: application/json" -d '{"materialCode":"c001e001","isFinished":true,"skuName":"Orange Nagpur Tray 6 PC","displayName":"Orange Nagpur Tray 6 PC","packType":"Tray-0.1","uom":"PC","uWeight":0.3,"units":6,"gWeight":1.9,"nWeight":1.8,"expDays":7,"business":"B2C STORE"}' http://localhost:8000/master/create/sku/GFPCL

curl -X POST -H "Content-Type: application/json" -d '{"materialCode":"c003e003","isFinished":false,"skuName":"Spinach CRATE 7 KG","displayName":"Spinach CRATE 7 KG","packType":"CRATE-0.5","uom":"KG","uWeight":1,"units":7,"gWeight":7.5,"nWeight":7,"expDays":3,"business":"B2C E-commerce"}' http://localhost:8000/master/create/sku/GFPCL

curl -X POST -H "Content-Type: application/json" -d '{"materialCode":"c003e003","isFinished":true,"skuName":"Spinach Polybag 250G","displayName":"Spinach Polybag 250G","packType":"Polybag-0.02","uom":"KG","uWeight":0.25,"units":1,"gWeight":0.252,"nWeight":0.25,"expDays":3,"business":"B2C STORE"}' http://localhost:8000/master/create/sku/GFPCL

curl -X POST -H "Content-Type: application/json" -d '{"materialCode":"c005e005","isFinished":false,"skuName":"Cucumber White CRATE 8 KG","displayName":"Cucumber White CRATE 8 KG","packType":"CRATE-0.5","uom":"KG","uWeight":1,"units":8,"gWeight":8.5,"nWeight":8,"expDays":5,"business":"B2C E-commerce"}' http://localhost:8000/master/create/sku/GFPCL

curl -X POST -H "Content-Type: application/json" -d '{"materialCode":"c005e005","isFinished":true,"skuName":"Cucumber White Tray 3 PC","displayName":"Cucumber White Tray 3 PC","packType":"Tray-0.1","uom":"PC","uWeight":0.7,"units":3,"gWeight":2.2,"nWeight":2.1,"expDays":5,"business":"B2C STORE"}' http://localhost:8000/master/create/sku/GFPCL

curl -X POST -H "Content-Type: application/json" -d '{"locName":"F&V Packhouse","checkpoint":"Processing & Packaging","inLocs":[],"outLocs":[],"facility":"Green Farms Main Facility","isVirtual":false,"isDefault":true,"geoLoc":[[12,12],[13,13],[14,14],[15,15]],"addr":"GAT 198/76, Green Farms, Mohadi, Dist. Nashik, MH, India","postalCode":"400206"}' http://localhost:8000/master/create/location/GFPCL

curl -X POST -H "Content-Type: application/json" -d '{"locName":"F&V DC Mumbai","checkpoint":"Distribution Center","inLocs":[],"outLocs":[],"facility":"Green Farms Warehouse Mumbai","isVirtual":false,"isDefault":false,"geoLoc":[[12,12],[13,13],[14,14],[15,15]],"addr":"Green Farms Warehouse 1, Dist. Mumbai Suburbs, MH, India","postalCode":"400206"}' http://localhost:8000/master/create/location/GFPCL

curl -X POST -H "Content-Type: application/json" -d '{"locName":"F&V DC Pune","checkpoint":"Distribution Center","inLocs":[],"outLocs":[],"facility":"Green Farms Warehouse Pune","isVirtual":false,"isDefault":false,"geoLoc":[[12,12],[13,13],[14,14],[15,15]],"addr":"Green Farms Warehouse 1, Dist. Pune, MH, India","postalCode":"400206"}' http://localhost:8000/master/create/location/GFPCL

curl -X POST -H "Content-Type: application/json" -d '{"locName":"F&V Retail Store Pune","checkpoint":"Retail Center","inLocs":[],"outLocs":[],"facility":"Green Farms Store Pune","isVirtual":false,"isDefault":false,"geoLoc":[[12,12],[13,13],[14,14],[15,15]],"addr":"Green Farms Store, Dist. Pune, MH, India","postalCode":"400206"}' http://localhost:8000/master/create/location/GFPCL

curl -X POST -H "Content-Type: application/json" -d '{"locName":"F&V Retail Store Mumbai","checkpoint":"Retail Center","inLocs":[],"outLocs":[],"facility":"Green Farms Store Mumbai","isVirtual":false,"isDefault":false,"geoLoc":[[12,12],[13,13],[14,14],[15,15]],"addr":"Green Farms Store, Dist. Mumbai Suburbs, MH, India","postalCode":"400206"}' http://localhost:8000/master/create/location/GFPCL
