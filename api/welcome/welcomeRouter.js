const express = require("express");

const router = express.Router();

router.get("/", async(req, res, next) => {
    try{res.json({
        message: "Adela's Database project 1"
    })
}catch(err){
    next(err)
}
})

module.exports = router;