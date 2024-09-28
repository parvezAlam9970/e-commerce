const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const Response = require("../../utilities/Response");
const Message = require("../../utilities/Message");

// Configure Cloudinary
cloudinary.config({
  cloud_name: "dotsqrb8d",
  api_key: "459373363746316",
  api_secret: "0NJS7YB4-xICDVffe3-14aWohGA",
});

const uploadOnCloudinary = async (localFile) => {
  try {
    if (!localFile) {
      console.error("Local file path is missing or invalid");
      return null;
    }

    const options = {
      resource_type: "auto",
      timeout: 60000, // 60 seconds timeout
    };

    let res;
    let retryCount = 0;
    const maxRetries = 3;

    do {
      try {
        res = await cloudinary.uploader.upload(localFile, options);
        break; // Break the loop if upload succeeds
      } catch (error) {
        console.error(`Error uploading file '${localFile}':`, error);
        retryCount++;
        if (retryCount < maxRetries) {
          console.log(`Retrying upload (attempt ${retryCount + 1})...`);
          await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait for 2 seconds before retrying
        } else {
          throw error; // If max retries reached, propagate the error
        }
      }
    } while (retryCount < maxRetries);

    // Clean up local file after successful upload
    fs.unlinkSync(localFile);

    return res;
  } catch (error) {
    console.error(`Error uploading file '${localFile}':`, error);

    // Clean up local file in case of error
    if (fs.existsSync(localFile)) {
      fs.unlinkSync(localFile);
    }

    return null;
  }
};

const handleUploadToCloudinary = async (req, res, next) => {
  console.log("filehbs", req.file);
  try {
    if (req.file) {
      const result = await uploadOnCloudinary(req.file.path);
      if (result) {
        req.file.cloudinary = result;
        req.file.cloudinaryUrl = result.url;
        next(); // Proceed to the next middleware or route handler
      } else {
        // Send a failure response if upload fails
        return Response.fail(res, "Failed to upload file to Cloudinary", 500);
      }
    } else {
      // Send a failure response if no file is found
      return Response.fail(res, "No file uploaded", 400);
    }
  } catch (error) {
    console.error('Error while uploading file to Cloudinary:', error);
    // Send a failure response in case of an exception
    return Response.fail(res, "Error while uploading file to Cloudinary", 500);
  }
};


const deleteFromCloudinary = async (publicId) => {
  const maxRetries = 3;
  let retryCount = 0;

  while (retryCount < maxRetries) {
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      return result;
    } catch (error) {
      console.error(`Error deleting file '${publicId}' (Attempt ${retryCount + 1}):`, error);
      retryCount++;
      if (retryCount < maxRetries) {
        const waitTime = Math.pow(2, retryCount) * 1000; // Exponential backoff in milliseconds
        console.log(`Retrying after ${waitTime} ms...`);
        await new Promise((resolve) => setTimeout(resolve, waitTime));
      } else {
        throw error; // If max retries reached, propagate the error
      }
    }
  }

  throw new Error(`Failed to delete file '${publicId}' after ${maxRetries} attempts`);
};


module.exports = {
  cloudinary,
  uploadOnCloudinary,
  handleUploadToCloudinary,
  deleteFromCloudinary
};
