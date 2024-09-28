const otpModel = require("../models/otp");

class userLoginServices {
    static async save(data) {
        
        const response = { data: {}, status: false };
        try {
            const docData = await otpModel.findOne({ userId: data.userId }) || new otpModel();

            docData.userId = data.userId;
            docData.ip = data.ip;
            docData.otp = data.otp;

            await docData.save();

            response.data = docData;
            response.status = true;
            return response;
        } catch (err) {
            throw err;
        }
    }



}




module.exports = userLoginServices;