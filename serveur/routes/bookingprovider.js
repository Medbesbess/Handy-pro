// booking routes
const express = require("express");
const { getrequests,getHistory,accept,reject} = require("../controllers/bookingprovider");
const {getProviderProfile,updateProviderProfile} = require("../controllers/getProviderProfile");
const router = express.Router();

router.get("/history/:providerId", getHistory);

router.post("/accept", accept);
router.post("/reject", reject);
router.get("/profile", getProviderProfile);
router.put("/update",  updateProviderProfile);
router.get("/requests", getrequests);
module.exports = router;
