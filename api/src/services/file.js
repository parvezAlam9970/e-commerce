const Response = require("../utilities/Response");
const Message = require("../utilities/Message");
const fileModel = require("../models/file");
const { genFileUrl, removeFile } = require("../utilities/Helper");
const { deleteFromCloudinary } = require("../api/middlewares/uploadToCloudnary");

module.exports = class file {
  static async save(req) {
    try {
      const response = { data: {}, status: false, message: "" };

      const docData = new fileModel();
      let url = "";
      console.log(req.file, "ooooooooooooooooooooooooooo");

      if (!req.file) {
        response.message = "Id is Required";
        throw new Error("File must be Filet Type");
      }

      if (req.file && req.file.cloudinaryUrl) {
        url = req.file.cloudinaryUrl;
        docData.url = url;
      }

      docData.uid = req.file.filename.split(".")[0];
      docData.name = req.file.filename;

      // Save the document data
      await docData.save();
      response.data = docData;
      response.message = Message.dataSaved.message;
      return response;
    } catch (error) {
      // res.status(500).json({ message: "Error saving file data", error });
    }
  }

  static async remove(req) {
    const response = {
      resCode: Message.dataDeletionError.code,
      message: Message.dataDeletionError.message,
    };
  
    try {
      // Extract the file name from the URL
      const name = req.body?.url?.split("/").pop()?.split(".")[0];
  
      // If no name is extracted, return an error response
      if (!name) {
        throw new Error('Invalid URL format');
      }
  
      // Use Promise.all to execute both operations concurrently
      const [deleteFromCloudinaryResult, updateDbResult] = await Promise.all([
        deleteFromCloudinary(name), 
        fileModel.updateOne({ url: req.body.url }, { isDeleted: true })
      ]);
  
      console.log(deleteFromCloudinaryResult, updateDbResult)
  
      // Check the results and form the response accordingly
      if (updateDbResult.modifiedCount === 1 && deleteFromCloudinaryResult) {
        response.message = Message.dataDeleted.message;
        response.resCode = Message.dataDeleted.code;
      } else {
        response.message = 'Deletion process failed';
      }
  
      return response;
    } catch (e) {
      console.error('Error in remove method:', e);
      throw Response.createError(Message.dataDeletionError, e);
    }
  }
  
};
