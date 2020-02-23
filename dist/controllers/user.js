"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Users_1 = require("../models/Users");
const msg = require("../services/response-msg-service");
const JSONRes = require("../services/response-service");
const multer = require("multer");
const fs = require("fs");
const request = require("express-validator");
let userId = 0;
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/voice_demo_attachments');
    },
    filename: function (req, file, cb) {
        let ext = (file.originalname.split('.')).pop();
        cb(null, userId + '-' + Date.now() + '.' + ext);
    }
});
const logoStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/agency_logo');
    },
    filename: function (req, file, cb) {
        let ext = (file.originalname.split('.')).pop();
        cb(null, Date.now() + '.' + ext);
    }
});
var uploadAttachments = multer({ storage: storage }).array('voiceDemo', 5);
var uploadLogo = multer({ storage: logoStorage }).single('logo');
exports.getUserDetails = (req, res) => {
    let selectProperties = '';
    if (req.body.decoded.userRole == 'PRODUCER') {
        selectProperties = 'firstName lastName email phoneNumber agentOrAgencyName updatedAt createdAt';
    }
    else if (req.body.decoded.userRole == 'ARTIST') {
        selectProperties = 'firstName lastName email phoneNumber agentOrAgencyName voiceDemo recordingMethods jobCategory characteristics language updatedAt createdAt';
    }
    else {
        selectProperties = 'firstName lastName email phoneNumber agentOrAgencyName agencyLogoURL updatedAt createdAt';
    }
    Users_1.default.findOne({ _id: req.body.decoded.userId }, selectProperties, (err, user) => {
        if (err) {
            res.status(500).json(JSONRes.constructResponseJson(500, "ERROR", msg.RES_MSG.ERROR_IN_DATABASE_OPERATION));
            return;
        }
        if (!user) {
            res.status(400).json(JSONRes.constructResponseJson(400, "FAIL", msg.RES_MSG.USER_NOT_FOUND));
            return;
        }
        res.status(200).json(JSONRes.constructResponseJson(200, "SUCCESS", user));
    });
};
exports.updateUserDetails = (req, res) => {
    userId = req.body.decoded.userId;
    if (req.body.decoded.userRole == 'PRODUCER') {
        uploadAttachments(req, res, function (uploadErr) {
            req.assert("firstName", msg.RES_MSG.FIRST_NAME_EMPTY).notEmpty();
            req.assert("lastName", msg.RES_MSG.LAST_NAME_EMPTY).notEmpty();
            req.assert("email", msg.RES_MSG.EMAIL_EMPTY).notEmpty();
            req.assert("phoneNumber", msg.RES_MSG.PHONE_NUMBER_EMPTY).notEmpty();
            req.assert("agentOrAgencyName", msg.RES_MSG.PHONE_NUMBER_EMPTY).notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                res.status(400).json(JSONRes.constructResponseJson(400, "FAIL", errors[0].msg));
                return;
            }
            Users_1.default.findOne({ _id: { $not: { $eq: userId } }, email: req.body.email }, function (mongoErr, existingUser) {
                if (mongoErr) {
                    res.status(500).json(JSONRes.constructResponseJson(500, "ERROR", msg.RES_MSG.ERROR_IN_DATABASE_OPERATION));
                    return;
                }
                if (existingUser) {
                    res.status(400).json(JSONRes.constructResponseJson(400, "FAIL", msg.RES_MSG.EMAIL_EXISTS));
                    return;
                }
                Users_1.default.findById(userId, function (err, user) {
                    if (err) {
                        res.status(500).json(JSONRes.constructResponseJson(500, "ERROR", msg.RES_MSG.ERROR_IN_DATABASE_OPERATION));
                        return;
                    }
                    user.firstName = req.body.firstName;
                    user.lastName = req.body.lastName;
                    user.email = req.body.email;
                    user.phoneNumber = req.body.phoneNumber;
                    user.save(function (err, updatedUser) {
                        if (err) {
                            res.status(500).json(JSONRes.constructResponseJson(500, "ERROR", msg.RES_MSG.ERROR_IN_DATABASE_OPERATION));
                            return;
                        }
                        res.status(200).json(JSONRes.constructResponseJson(200, "SUCCESS", msg.RES_MSG.UPDATE_PROFILE_SUCCESS));
                    });
                });
            });
        });
    }
    else if (req.body.decoded.userRole == 'ARTIST') {
        let attachmentArr = [];
        uploadAttachments(req, res, function (uploadErr) {
            if (uploadErr) {
                res.status(400).json(JSONRes.constructResponseJson(400, "FAIL", msg.RES_MSG.UPLOAD_FAIL));
                return;
            }
            req.assert("firstName", msg.RES_MSG.FIRST_NAME_EMPTY).notEmpty();
            req.assert("lastName", msg.RES_MSG.LAST_NAME_EMPTY).notEmpty();
            req.assert("gender", msg.RES_MSG.GENDER_EMPTY).notEmpty();
            req.assert("age", msg.RES_MSG.AGE_EMPTY).notEmpty();
            req.assert("language", msg.RES_MSG.LANGUAGE_EMPTY).notEmpty();
            req.assert("email", msg.RES_MSG.EMAIL_EMPTY).notEmpty();
            req.assert("password", msg.RES_MSG.PASSWORD_EMPTY).notEmpty();
            req.assert("phoneNumber", msg.RES_MSG.PHONE_NUMBER_EMPTY).notEmpty();
            req.assert("description", msg.RES_MSG.DESCRIPTION_EMPTY).notEmpty();
            req.assert("characteristics", msg.RES_MSG.CHARACTERISTICS_EMPTY).notEmpty();
            req.assert("jobCategory", msg.RES_MSG.JOB_CATEGORY_EMPTY).notEmpty();
            req.assert("recordingMethods", msg.RES_MSG.RECORDING_METHODS_EMPTY).notEmpty();
            let language = (req.body.language).trim() != '[]' ? (req.body.language).trim().slice(1, -1).split(',') : [];
            let characteristics = (req.body.characteristics).trim() != '[]' ? (req.body.characteristics).trim().slice(1, -1).split(',') : [];
            let jobCategory = (req.body.jobCategory).trim() != '[]' ? (req.body.jobCategory).trim().slice(1, -1).split(',') : [];
            let recordingMethods = (req.body.recordingMethods).trim() != '[]' ? (req.body.recordingMethods).trim().slice(1, -1).split(',') : [];
            if (language.length < 1) {
                res.status(400).json(JSONRes.constructResponseJson(400, "FAIL", msg.RES_MSG.LANGUAGE_EMPTY));
                return;
            }
            if (characteristics.length < 1) {
                res.status(400).json(JSONRes.constructResponseJson(400, "FAIL", msg.RES_MSG.CHARACTERISTICS_EMPTY));
                return;
            }
            if (jobCategory.length < 1) {
                res.status(400).json(JSONRes.constructResponseJson(400, "FAIL", msg.RES_MSG.JOB_CATEGORY_EMPTY));
                return;
            }
            if (recordingMethods.length < 1) {
                res.status(400).json(JSONRes.constructResponseJson(400, "FAIL", msg.RES_MSG.RECORDING_METHODS_EMPTY));
                return;
            }
            const errors = req.validationErrors();
            if (errors) {
                res.status(400).json(JSONRes.constructResponseJson(400, "FAIL", errors[0].msg));
                return;
            }
            let uploadedFilesPathArr = [];
            let dirName = 'uploads/voice_demo_attachments/' + userId;
            if (!fs.existsSync(dirName)) {
                fs.mkdirSync(dirName);
            }
            let uploadedFileArr = req.files;
            for (let i = 0; i < uploadedFileArr.length; i++) {
                let oldPath = uploadedFileArr[i].path;
                let newPath = 'uploads/voice_demo_attachments/' + userId + '/' + uploadedFileArr[i].filename;
                uploadedFilesPathArr.push(newPath.toString());
                fs.rename(oldPath, newPath, function (err) {
                    if (err) {
                        res.status(400).json(JSONRes.constructResponseJson(400, "FAIL", "Upload Fail."));
                        return;
                    }
                });
            }
            Users_1.default.findOne({ _id: { $not: { $eq: userId } }, email: req.body.email }, function (mongoErr, existingUser) {
                if (mongoErr) {
                    res.status(500).json(JSONRes.constructResponseJson(500, "ERROR", msg.RES_MSG.ERROR_IN_DATABASE_OPERATION));
                    return;
                }
                if (existingUser) {
                    res.status(400).json(JSONRes.constructResponseJson(400, "FAIL", msg.RES_MSG.EMAIL_EXISTS));
                    return;
                }
                Users_1.default.findById(userId, function (err, user) {
                    if (err) {
                        res.status(500).json(JSONRes.constructResponseJson(500, "ERROR", msg.RES_MSG.ERROR_IN_DATABASE_OPERATION));
                        return;
                    }
                    user.firstName = req.body.firstName;
                    user.lastName = req.body.lastName;
                    user.gender = req.body.gender;
                    user.age = req.body.age;
                    user.language = language.forEach(function (element) { element = element.trim(); });
                    //user.email = req.body.email;
                    //user.password = req.body.password;
                    user.phoneNumber = req.body.phoneNumber;
                    user.description = req.body.description;
                    user.characteristics = characteristics.forEach(function (element) { element = element.trim(); });
                    ;
                    user.jobCategory = jobCategory.forEach(function (element) { element = element.trim(); });
                    ;
                    user.recordingMethods = recordingMethods.forEach(function (element) { element = element.trim(); });
                    ;
                    user.voiceDemo = uploadedFilesPathArr;
                    user.save(function (err, updatedUser) {
                        if (err) {
                            res.status(500).json(JSONRes.constructResponseJson(500, "ERROR", msg.RES_MSG.ERROR_IN_DATABASE_OPERATION));
                            return;
                        }
                        res.status(200).json(JSONRes.constructResponseJson(200, "SUCCESS", msg.RES_MSG.UPDATE_PROFILE_SUCCESS));
                    });
                });
            });
        });
    }
    else if (req.body.decoded.userRole == 'AGENT') {
        uploadLogo(req, res, function (uploadErr) {
            if (uploadErr) {
                res.status(400).json(JSONRes.constructResponseJson(400, "FAIL", msg.RES_MSG.UPLOAD_FAIL));
                return;
            }
            req.assert("firstName", msg.RES_MSG.FIRST_NAME_EMPTY).notEmpty();
            req.assert("lastName", msg.RES_MSG.LAST_NAME_EMPTY).notEmpty();
            req.assert("email", msg.RES_MSG.EMAIL_EMPTY).notEmpty();
            req.assert("phoneNumber", msg.RES_MSG.PHONE_NUMBER_EMPTY).notEmpty();
            const errors = req.validationErrors();
            if (errors) {
                res.status(400).json(JSONRes.constructResponseJson(400, "FAIL", errors[0].msg));
                return;
            }
            Users_1.default.findOne({ _id: { $not: { $eq: userId } }, email: req.body.email }, function (mongoErr, existingUser) {
                if (mongoErr) {
                    res.status(500).json(JSONRes.constructResponseJson(500, "ERROR", msg.RES_MSG.ERROR_IN_DATABASE_OPERATION));
                    return;
                }
                if (existingUser) {
                    res.status(400).json(JSONRes.constructResponseJson(400, "FAIL", msg.RES_MSG.EMAIL_EXISTS));
                    return;
                }
                Users_1.default.findById(userId, function (err, user) {
                    if (err) {
                        res.status(500).json(JSONRes.constructResponseJson(500, "ERROR", msg.RES_MSG.ERROR_IN_DATABASE_OPERATION));
                        return;
                    }
                    fs.unlink(user.agencyLogoURL, function (unlinkErr) {
                        if (unlinkErr) {
                            res.status(400).json(JSONRes.constructResponseJson(400, "FAIL", msg.RES_MSG.UPLOAD_FAIL));
                            return;
                        }
                        user.firstName = req.body.firstName;
                        user.lastName = req.body.lastName;
                        user.email = req.body.email;
                        user.phoneNumber = req.body.phoneNumber;
                        user.agencyLogoURL = req.file.path;
                        user.save(function (err, updatedUser) {
                            if (err) {
                                res.status(500).json(JSONRes.constructResponseJson(500, "ERROR", msg.RES_MSG.ERROR_IN_DATABASE_OPERATION));
                                return;
                            }
                            res.status(200).json(JSONRes.constructResponseJson(200, "SUCCESS", msg.RES_MSG.UPDATE_PROFILE_SUCCESS));
                        });
                    });
                });
            });
        });
    }
};
//# sourceMappingURL=user.js.map