const express = require('express')
const config = require('../../configs/config.json')
const generateJWT = require("../../token")
const router = express.Router()
router.use(express.json())
const jwtToken = generateJWT();
const tableAPIEndpoint = config.url_endpoint;
const axios = require("axios").default;
const tableName = config.table_name_rfq;

function closedRFQsPeriodCalculator(str) {
    const date = new Date();
    let prevMonth = 1;
    if (str.includes("3")) {
        prevMonth = 3;
    }
    else if (str.includes("6")) {
        prevMonth = 6;
    }

    return new Date(date.getFullYear(), date.getMonth() - prevMonth, date.getDate()).toISOString().split("T")[0];
}

let body = {};

router.post("/", async (req,res)=>{
    try{
        const reqBody = req.body
        let query = {}
        if(reqBody.Owner){
            query.Owner = {
                $eq : reqBody.Owner
            }
        }
        if(reqBody.Status){
            query.Status = {
                $eq : reqBody.Status
            }
            if(reqBody.Status === 'closed'){
                query.CloseDate = {
                    $gte : +new Date(closedRFQsPeriodCalculator(reqBody.Period))
                }
            }
        }
        body.query = query;
        let response = await axios(
            {
                method : "POST",
                url : `${tableAPIEndpoint}/${tableName}/rows/query`,
                data : JSON.stringify(body),
                headers :{
                    "auth" : jwtToken,
                    "Content-Type" : "application/json"
                }
            }
        )
        await res.send(response.data)
    }
    catch (err){
        console.log(err)
    }

})


module.exports = router;