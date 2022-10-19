const express = require('express');
const config = require("./configs/config.json")
const app = express();

const port  = config.port;
const rfqEndpoint = config.rfq_endpoint;
const contractsEndpoint = config.contracts_endpoint;

const rfq_by_owner = require('./routes/rfq/rfq_by_owner');
const rfq_by_id = require("./routes/rfq/rfq_by_id");

const contract_by_owner = require('./routes/contracts/contract_by_owner');
const contract_by_id = require('./routes/contracts/contract_by_id');
const contract_by_ifa = require('./routes/contracts/contract_by_ifa');


app.use(`/${rfqEndpoint}/rfqByOwner`,rfq_by_owner);
app.use(`/${rfqEndpoint}/rfqById`,rfq_by_id);
app.use(`/${contractsEndpoint}/contractByOwner`,contract_by_owner);
app.use(`/${contractsEndpoint}/contractById`,contract_by_id);
//app.use(`/${contractsEndpoint}/contractByIFA`,contract_by_ifa);

app.listen(port,(err)=>{
    if(err){
        console.log(err)
    }
    console.log(`server listening on port ${port}`)
})
