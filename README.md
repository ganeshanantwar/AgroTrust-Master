# AGROTRUST MASTER

AgroTrust Master exposes the core platform APIs to manage the logcal data model of AgroTrust.
It implements below data which is written to crop blockchains, ensuring immutability and authenticity.

1. Farmer: Information about the farmer captured during registration process by the organization.
2. Origin: One or more static parcels of land cultivated by a farmer. The farmer may or may not own the field he is cultivating. When a farmer assigns some part of the field for cultivation of one crop, it becomes a plot. Plots are not static, farmers may decide to continue the same plot for next season or mix/split plots for a different crops. Hence plots need to be registered every season as origins.
3. Location: Locations are different operational units owned by constitutent LEs of the organization capable of storing SKUs until their shelf-life runs out. Locations can execute three operations:
   4.1 Inward SKUs with incoming stock transfer or purchase order if source LE is different
   4.2 Dispatch SKUs with outgoing stock transfer or sales order if target LE is different
   4.3 Manufacture SKUs with manufacturing orders

   A typical value chain can be described as:
   Production-Collection-Processing-Distribution-Retail-Consumption

4. Material: Materials are raw agricultural crop produce of a specific variety used in manufacturing SKUs.
5. SKU: SKUs are units that provide containers for materials to be procured, manufactured or sold. SKUs are either Finished Goods or Raw Materials.
6. BTU: BTUs are Blockchain Traced Units, a unique concept pioneered by AgroTrust.
   7.1 A BTU is a collection of SKUs of the same type, produced at the same time at the same location.
   7.2 Each BTU references the previous BTUs and next BTUs in the value chain, creating a chain of IDs which are used to calculate forward and backward traceability outputs from any given point.
   7.3 Each BTU is serilaised with a unique identifier authenticated with blockchain.
   7.4 BTUs are created and updated through operations routes.
7. Quality: Defines various grades of materials used in the organization during procurement and sorting & grading. Multiple quality IDs are created for each material classifying them into Grades with physical, biological and chemical parameters at the discretion of the organization. These quality IDs are referred by BTUs to record quality assessments during inwards/converts/dispatches. [To be implemented in version 1.1]
8. Safety: Defines pesticides, fungicides, weedicides, fertilizers and all other methods used during crop cultivation that might impact safety of the food products. These safety IDs are referred by origins to record farming activities. [To be implemented in version 1.1]

### What is this repository for?

-  Quick summary

AgroTrust Master manages the core logical data model. For POST APIs, the master validates it and calls AgroTrust Interface to write the data to the relevant crop blockchain. For GET APIs, the master calls AgroTrust Interface to read the data from relevant crop blockchain.

AgroTrust Master also provides three operations APIs viz. /inward, /convert, /dispatch for recording operations in a simple but powerful way.

-  Version

   0.1.0

### How do I get set up?

Below instructions assume Linux nodes and have been thoroughly tested on Ubuntu 18.04 LTS.

-  Configuration

None.

-  Setup instructions

1. Clone this repo at desired location
2. Open terminal and run 'npm install'
3. Run node app.js launching AgroTrust Master on TCP port 8000.

-  Dependencies

Please refer to package.json

### API Docuementation

### Contribution guidelines

-  Writing tests
-  Code review
-  Other guidelines

### Who do I talk to?

-  Repo owner: Ganesh Anantwar, email: ganesh@emertech.io, github: @ganeshanantwar
-  Admin: Danish Siraj, email: danish@emertech.io, github: @dan-19
