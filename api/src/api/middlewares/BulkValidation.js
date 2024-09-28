const http = require("http");
const Response = require("../../utilities/Response");
const HttpStatus = require("http-status-codes");
const _ = require("lodash");
const csv = require("csvtojson");
// const request = require("request")
// function extractDataFromCSVFileUrl(req, res, next) {
//   async function ConvertCSVtoJSON() {
//     const jsonArray = await csv().fromStream(request.get(req.body.url));
//     req.body.data = jsonArray;
//     next();
//   }
//   ConvertCSVtoJSON();
// }

module.exports = {
  extractDataFromCSVFileUrl
};
