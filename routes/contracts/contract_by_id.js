const express = require('express')
const config = require('../../configs/config.json')
const router = express.Router();
const generateJWT = require("../../token")
router.use(express.json())
const jwtToken = generateJWT();

const tableAPIEndpoint = config.url_endpoint;
const axios = require("axios").default;
const tableName = config.table_name_contracts;


let body = {};

router.post("/", async (req,res)=>{
    try{
        const reqBody = req.body
        const header = req.headers['content-type']
        if (header === 'application/json') {
            let query = {}
            if (reqBody.CON_ID) {
                query.Contract_Code = {
                    $eq: reqBody.CON_ID
                }
            }
            body.query = query;
            let response = await axios(
                {
                    method: "POST",
                    url: `${tableAPIEndpoint}/${tableName}/rows/query`,
                    data: JSON.stringify(body),
                    headers: {
                        "auth": jwtToken,
                        "Content-Type": "application/json"
                    }
                }
            )
            await res.send(response.data)
        }
        else{
            res.status(403).send("Request format incorrect")
        }
        
    }
    catch (err){
        console.log(err)
    }

})


module.exports = router;