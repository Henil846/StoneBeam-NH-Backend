const customerCareModel = require('../models/customerCare.model');

async function customerCare(req, res) {
    try {
        const { name, email, subject, message } = req.body;

        const ticket = await customerCareModel.create({
            name,
            email,
            subject,
            message,
        });

        res.status(201).json({
            message: "Customer care ticket created successfully",
            data: ticket,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: error.message,
        });
    }
}

module.exports = { customerCare };