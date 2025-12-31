import express from "express";
    const router = express.Router();


    router.get("/sendmessage", (req, res) => {
        res.json({
            message: "send message endpoint"
        });
    });


    export default router;