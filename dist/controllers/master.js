"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Characteristics_1 = require("../models/Characteristics");
const JobTypes_1 = require("../models/JobTypes");
const msg = require("../services/response-msg-service");
const JSONRes = require("../services/response-service");
exports.addCharacteristic = (req, res) => {
    //if(req.body.decoded.userRole != 'ADMIN'){
    //	res.status(401).json(JSONRes.constructResponseJson(401, "FAIL", msg.RES_MSG.PERMISSION_DENIED));
    //    return;
    //}
    req.assert("characteristic", msg.RES_MSG.CHARACTERISTIC_REQUIRED).notEmpty();
    const errors = req.validationErrors();
    if (errors) {
        res.status(400).json(JSONRes.constructResponseJson(400, "FAIL", errors[0].msg));
        return;
    }
    let char = req.body.characteristic.charAt(0).toUpperCase() + req.body.characteristic.substr(1).toLowerCase();
    const characteristic = new Characteristics_1.default({
        characteristic: char
    });
    Characteristics_1.default.findOne({ characteristic: char }, (err, existingCharacteristic) => {
        if (err) {
            res.status(500).json(JSONRes.constructResponseJson(500, "ERROR", msg.RES_MSG.ERROR_IN_DATABASE_OPERATION));
            return;
        }
        if (existingCharacteristic) {
            res.status(400).json(JSONRes.constructResponseJson(400, "FAIL", msg.RES_MSG.CHARACTERISTIC_EXISTS));
            return;
        }
        characteristic.save((err) => {
            if (err) {
                res.status(500).json(JSONRes.constructResponseJson(500, "ERROR", msg.RES_MSG.ERROR_IN_DATABASE_OPERATION));
                return;
            }
            res.status(200).json(JSONRes.constructResponseJson(200, "SUCCESS", msg.RES_MSG.CHARACTERISTIC_ADD_SUCCESS));
        });
    });
};
exports.editCharacteristic = (req, res) => {
    //if(req.body.decoded.userRole != 'ADMIN'){
    //	res.status(401).json(JSONRes.constructResponseJson(401, "FAIL", msg.RES_MSG.PERMISSION_DENIED));
    //    return;
    //}
    req.assert("characteristicId", msg.RES_MSG.CHARACTERISTIC_ID_REQUIRED).notEmpty();
    req.assert("characteristic", msg.RES_MSG.CHARACTERISTIC_REQUIRED).notEmpty();
    const errors = req.validationErrors();
    if (errors) {
        res.status(400).json(JSONRes.constructResponseJson(400, "FAIL", errors[0].msg));
        return;
    }
    let char = req.body.characteristic.charAt(0).toUpperCase() + req.body.characteristic.substr(1).toLowerCase();
    Characteristics_1.default.findOne({ _id: { $not: { $eq: req.body.characteristicId } }, characteristic: char, }, (err, existingCharacteristic) => {
        if (err) {
            res.status(500).json(JSONRes.constructResponseJson(500, "ERROR", msg.RES_MSG.ERROR_IN_DATABASE_OPERATION));
            return;
        }
        if (existingCharacteristic) {
            res.status(400).json(JSONRes.constructResponseJson(400, "FAIL", msg.RES_MSG.CHARACTERISTIC_EXISTS));
            return;
        }
        Characteristics_1.default.findById(req.body.characteristicId, function (MongoErr, characteristic) {
            if (MongoErr) {
                res.status(500).json(JSONRes.constructResponseJson(500, "ERROR", msg.RES_MSG.ERROR_IN_DATABASE_OPERATION));
                return;
            }
            characteristic.characteristic = char;
            characteristic.save((err) => {
                if (err) {
                    res.status(500).json(JSONRes.constructResponseJson(500, "ERROR", msg.RES_MSG.ERROR_IN_DATABASE_OPERATION));
                    return;
                }
                res.status(200).json(JSONRes.constructResponseJson(200, "SUCCESS", msg.RES_MSG.CHARACTERISTIC_EDIT_SUCCESS));
            });
        });
    });
};
exports.deleteCharacteristic = (req, res) => {
    //if(req.body.decoded.userRole != 'ADMIN'){
    //	res.status(401).json(JSONRes.constructResponseJson(401, "FAIL", msg.RES_MSG.PERMISSION_DENIED));
    //    return;
    //}
    req.assert("characteristicId", msg.RES_MSG.CHARACTERISTIC_ID_REQUIRED).notEmpty();
    const errors = req.validationErrors();
    if (errors) {
        res.status(400).json(JSONRes.constructResponseJson(400, "FAIL", errors[0].msg));
        return;
    }
    Characteristics_1.default.remove({ _id: req.body.characteristicId }, function (err) {
        if (err) {
            res.status(500).json(JSONRes.constructResponseJson(500, "ERROR", msg.RES_MSG.ERROR_IN_DATABASE_OPERATION));
            return;
        }
        res.status(200).json(JSONRes.constructResponseJson(200, "SUCCESS", msg.RES_MSG.CHARACTERISTIC_DELETE_SUCCESS));
    });
};
exports.getCharacteristicList = (req, res) => {
    //if(req.body.decoded.userRole != 'ADMIN'){
    //	res.status(401).json(JSONRes.constructResponseJson(401, "FAIL", msg.RES_MSG.PERMISSION_DENIED));
    //    return;
    //}
    Characteristics_1.default.find({}, 'characteristic', function (err, characteristicList) {
        if (err) {
            res.status(500).json(JSONRes.constructResponseJson(500, "ERROR", msg.RES_MSG.ERROR_IN_DATABASE_OPERATION));
            return;
        }
        res.status(200).json(JSONRes.constructResponseJson(200, "SUCCESS", characteristicList));
    });
};
exports.addJobType = (req, res) => {
    //if(req.body.decoded.userRole != 'ADMIN'){
    //	res.status(401).json(JSONRes.constructResponseJson(401, "FAIL", msg.RES_MSG.PERMISSION_DENIED));
    //    return;
    //}
    req.assert("jobType", msg.RES_MSG.JOB_TYPE_REQUIRED).notEmpty();
    const errors = req.validationErrors();
    if (errors) {
        res.status(400).json(JSONRes.constructResponseJson(400, "FAIL", errors[0].msg));
        return;
    }
    let char = req.body.jobType.charAt(0).toUpperCase() + req.body.jobType.substr(1).toLowerCase();
    const jobType = new JobTypes_1.default({
        jobType: char
    });
    JobTypes_1.default.findOne({ jobType: char }, (err, existingJobType) => {
        if (err) {
            res.status(500).json(JSONRes.constructResponseJson(500, "ERROR", msg.RES_MSG.ERROR_IN_DATABASE_OPERATION));
            return;
        }
        if (existingJobType) {
            res.status(400).json(JSONRes.constructResponseJson(400, "FAIL", msg.RES_MSG.JOB_TYPE_EXISTS));
            return;
        }
        jobType.save((err) => {
            if (err) {
                res.status(500).json(JSONRes.constructResponseJson(500, "ERROR", msg.RES_MSG.ERROR_IN_DATABASE_OPERATION));
                return;
            }
            res.status(200).json(JSONRes.constructResponseJson(200, "SUCCESS", msg.RES_MSG.JOB_TYPE_ADD_SUCCESS));
        });
    });
};
exports.editJobType = (req, res) => {
    //if(req.body.decoded.userRole != 'ADMIN'){
    //	res.status(401).json(JSONRes.constructResponseJson(401, "FAIL", msg.RES_MSG.PERMISSION_DENIED));
    //    return;
    //}
    req.assert("jobTypeId", msg.RES_MSG.JOB_TYPE_ID_REQUIRED).notEmpty();
    req.assert("jobType", msg.RES_MSG.JOB_TYPE_REQUIRED).notEmpty();
    const errors = req.validationErrors();
    if (errors) {
        res.status(400).json(JSONRes.constructResponseJson(400, "FAIL", errors[0].msg));
        return;
    }
    let char = req.body.jobType.charAt(0).toUpperCase() + req.body.jobType.substr(1).toLowerCase();
    JobTypes_1.default.findOne({ _id: { $not: { $eq: req.body.jobTypeId } }, jobType: char, }, (err, existingJobType) => {
        if (err) {
            res.status(500).json(JSONRes.constructResponseJson(500, "ERROR", msg.RES_MSG.ERROR_IN_DATABASE_OPERATION));
            return;
        }
        if (existingJobType) {
            res.status(400).json(JSONRes.constructResponseJson(400, "FAIL", msg.RES_MSG.JOB_TYPE_EXISTS));
            return;
        }
        JobTypes_1.default.findById(req.body.jobTypeId, function (MongoErr, jobType) {
            if (MongoErr) {
                res.status(500).json(JSONRes.constructResponseJson(500, "ERROR", msg.RES_MSG.ERROR_IN_DATABASE_OPERATION));
                return;
            }
            jobType.jobType = char;
            jobType.save((err) => {
                if (err) {
                    res.status(500).json(JSONRes.constructResponseJson(500, "ERROR", msg.RES_MSG.ERROR_IN_DATABASE_OPERATION));
                    return;
                }
                res.status(200).json(JSONRes.constructResponseJson(200, "SUCCESS", msg.RES_MSG.JOB_TYPE_EDIT_SUCCESS));
            });
        });
    });
};
exports.deleteJobType = (req, res) => {
    //if(req.body.decoded.userRole != 'ADMIN'){
    //	res.status(401).json(JSONRes.constructResponseJson(401, "FAIL", msg.RES_MSG.PERMISSION_DENIED));
    //    return;
    //}
    req.assert("jobTypeId", msg.RES_MSG.JOB_TYPE_ID_REQUIRED).notEmpty();
    const errors = req.validationErrors();
    if (errors) {
        res.status(400).json(JSONRes.constructResponseJson(400, "FAIL", errors[0].msg));
        return;
    }
    JobTypes_1.default.remove({ _id: req.body.jobTypeId }, function (err) {
        if (err) {
            res.status(500).json(JSONRes.constructResponseJson(500, "ERROR", msg.RES_MSG.ERROR_IN_DATABASE_OPERATION));
            return;
        }
        res.status(200).json(JSONRes.constructResponseJson(200, "SUCCESS", msg.RES_MSG.JOB_TYPE_DELETE_SUCCESS));
    });
};
exports.getJobTypeList = (req, res) => {
    //if(req.body.decoded.userRole != 'ADMIN'){
    //	res.status(401).json(JSONRes.constructResponseJson(401, "FAIL", msg.RES_MSG.PERMISSION_DENIED));
    //    return;
    //}
    JobTypes_1.default.find({}, 'jobType', function (err, jobTypeList) {
        if (err) {
            res.status(500).json(JSONRes.constructResponseJson(500, "ERROR", msg.RES_MSG.ERROR_IN_DATABASE_OPERATION));
            return;
        }
        res.status(200).json(JSONRes.constructResponseJson(200, "SUCCESS", jobTypeList));
    });
};
//# sourceMappingURL=master.js.map