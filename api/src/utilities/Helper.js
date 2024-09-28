const crypto = require('crypto');
const sendGridMail = require('@sendgrid/mail');
const Logger = require('./Logger');
const mime = require('mime');
const fs = require('fs');
const config = require('../config');
const path = require('path');
const fileModel = require('../models/file');
const moment = require('moment');
const referralCodeGenerator = require('referral-code-generator')


// sendGridMail.setApiKey(config.sendGrid.apiKey);
function getDateWithoutTime(d = new Date) {
    return new Date(moment(new Date(d)).format('LL'));
}
function clearSearch(obj) {
    for (const [key, value] of Object.entries(obj)) {
        if (typeof value === "object") {
            clearSearch(value);
        } else {
            if ((typeof value === 'string' && value.length < 1)) {
                delete (obj[key]);
            }
        }
    }
}

function isValidObjectId(inputString) {
    // Define the regular expression pattern for a valid ObjectId
    const objectIdPattern = /^[0-9a-fA-F]{24}$/;
    // Use the pattern to test the input string
    return objectIdPattern.test(inputString);
}

function decodeBase64(dataString) {
    var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/), response = {};

    if (matches.length !== 3) {
        return new Error('Invalid input string');
    }

    response.type = matches[1];
    response.data = new Buffer.from(matches[2], 'base64');

    return response;
}

async function uploadFileBase64(req, res, next) {

    const decodedImg = decodeBase64(req.body.file);
    const buffer = decodedImg.data;
    const type = decodedImg.type;
    const extension = mime.getExtension(type);
    const fileName = Date.now() + '' + Math.random() + '.' + extension;
    const filePath = path.join(__dirname, '..', '..', 'public', fileName);
    try {
        try {
            await fs.writeFileSync(filePath, buffer, 'utf8');
            req.file = { filename: fileName };
        } catch (e) {
            throw new Error(e);
        }
        next();
        // return fileName;
    } catch (err) {
        throw new Error(err);
    }
}

async function uploadMultipleFile(dataBase64Array, path, model, key, _id, deletingFiles) {
    const fileNames = await deleteMultipleFiles(path, model, key, _id, deletingFiles);
    if (Array.isArray(dataBase64Array) && dataBase64Array.length > 0) {
        const prms = dataBase64Array.map(async (v) => {
            return uploadFileBase64(v, path, model);
        });

        if (prms.length > 0) {
            return Promise.all(prms).then(res => {
                res.forEach(v => {
                    fileNames.push(v);
                })
                return fileNames;
            });
        }
    } else {
        return fileNames;
    }
}

async function deleteMultipleFiles(path, model, key, _id, deletingFiles) {
    let tpl, fileNames = [];

    if (_id) {
        tpl = await model.findById(_id);
        fileNames = tpl[key]?.filter(v => !deletingFiles?.includes(v));
    }

    if (_id && Array.isArray(deletingFiles) && deletingFiles.length > 0) {
        try {
            deletingFiles.map(v => {
                fs.unlink(path + v, () => { });
            });

        } catch (err) {

        }
    }
    return fileNames;
}

function encryptData(text) {
    let iv = crypto.randomBytes(config.crypto.ivLength);
    let cipher = crypto.createCipheriv(config.crypto.algorithm, Buffer.from(config.crypto.encryptionKey, 'hex'), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
}

function decryptData(text) {
    let textParts = text.split(':');
    let iv = Buffer.from(textParts.shift(), 'hex');
    let encryptedText = Buffer.from(textParts.join(':'), 'hex');
    let decipher = crypto.createDecipheriv(config.crypto.algorithm, Buffer.from(config.crypto.encryptionKey, 'hex'), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}

async function mailer(to, subject, html) {

    const mailOptions = {
        to,
        from: config.sendGrid.senderEmail,
        subject,
        html,
    };


    return new Promise(async (resolve, reject) => {
        try {
            const info = await sendGridMail.send(mailOptions);
            resolve(info);
        } catch (error) {
            Logger.error(
                `
                    Error while sending mail
                    To   			- ${to}
                    Subject   		- ${subject}
                    Reason   	    - ${error.message}
                `
            );
            reject(error);
        }
    })
}

function genFileUrl(fileName) {
    return config.localUploadBaseUrl() + "/" + fileName;
}
async function removeFile(fileName) {
    try {
        // const fileName = (await fileModel.findOne({ uid })).name;
        fs.unlink(path.join(__dirname, '..', '..', 'public', fileName), () => { });
        return true;
    } catch (err) {
        return false;
    }
}
async function genFileUrlFromId(fileId) {
    try {
        return config.uploadBaseUrl() + "/" + (await fileModel.findById(fileId)).name;
    } catch (error) {
        return false;
    }
}

function hoursAndMinuteDiff(startingDate, endingDate = new Date()) {
    const milliSeconds = new Date(endingDate) - new Date(startingDate);
    let hours = parseInt(milliSeconds / 3600 / 1000);
    let seconds = parseInt((milliSeconds % (3600 * 1000)) / 1000 / 60);
    hours = hours === 0 ? "00" : (hours <= 9 ? "0" + hours : hours);
    seconds = seconds === 0 ? "00" : (seconds <= 9 ? "0" + seconds : seconds);
    return hours + ":" + seconds;
}

function convertMinutesToHoursAndMinutes(minutes) {
    let hours = parseInt(minutes / 60);
    let seconds = parseInt((minutes % (60)));
    hours = hours === 0 ? "00" : (hours <= 9 ? "0" + hours : hours);
    seconds = seconds === 0 ? "00" : (seconds <= 9 ? "0" + seconds : seconds);
    return hours + ":" + seconds;
}

function startEndDate(prms = 'today') {
    let startDate = moment().format('YYYY-MM-DD');
    let endDate = moment(startDate).add(1, 'days');
    return { startDate, endDate };
}

function genRandomNumber(otp_length) {
    let OTP = "";
    for (let i = 0; i < otp_length; i++) {
        OTP += config.IsProd ? "0123456789"[Math.floor(Math.random() * 10)] : "0123456789"[i];
    }
    return OTP;
};

function generatorReferralCode(text) {
    return referralCodeGenerator.alphaNumeric('uppercase', 3, 3, text);
}


function flattenArray(array) {
    const arr = [];
    function makeFlatten(array) {
        array.forEach(v => {
            if (Array.isArray(v)) {
                makeFlatten(v)
            } else {
                if (v) {
                    arr.push(v);
                }
            }
        })
    }

    makeFlatten(array);

    return arr;
}

function commaSepratedToList(commaSepratedData) {
    return {
        data: commaSepratedData.split(",")
    }
}

function removeSpecialChars(key) {
    return key?.trim().toLowerCase()?.replace(/[^a-z0-9 _-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');
}

module.exports = {
    clearSearch, decodeBase64, uploadFileBase64, uploadMultipleFile, deleteMultipleFiles, encryptData,
    decryptData, mailer, getDateWithoutTime,
    genFileUrl, genFileUrlFromId, hoursAndMinuteDiff, startEndDate, convertMinutesToHoursAndMinutes,
    genRandomNumber, removeFile, generatorReferralCode, isValidObjectId, flattenArray,commaSepratedToList, removeSpecialChars
};
