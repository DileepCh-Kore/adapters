const express = require('express')
const config = require('../../configs/config.json')
const generateJWT = require("../../token")
const router = express.Router()
router.use(express.json())
const jwtToken = generateJWT();
const tableAPIEndpoint = config.url_endpoint;
const axios = require("axios").default;
const tableName = config.table_name_contracts;

let body = {};

router.post("/", async (req,res)=>{
    try{
        const reqBody = req.body
        let query = {}
        if(reqBody.Owner){
            query.Contract_Owner = {
                $eq : reqBody.Owner
            }
        }
        if(reqBody.Status){
            query.Contract_Status = {
                $eq : reqBody.Status
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