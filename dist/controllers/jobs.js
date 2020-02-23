"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Users_1 = require("../models/Users");
const Jobs_1 = require("../models/Jobs");
const Auditions_1 = require("../models/Auditions");
const Notifications_1 = require("../models/Notifications");
const msg = require("../services/response-msg-service");
const JSONRes = require("../services/response-service");
const multer = require("multer");
const fs = require("fs");
let userId = 0;
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/job_attachments');
    },
    filename: function (req, file, cb) {
        let ext = (file.originalname.split('.')).pop();
        cb(null, userId + '-' + Date.now() + '.' + ext);
    }
});
var upload = multer({ storage: storage }).single('testFile'); //For testing only
var uploadAttachments = multer({ storage: storage }).array('attachments', 5);
const request = require("express-validator");
exports.createNewJob = (req, res) => {
    userId = req.body.decoded.userId;
    let attachmentArr = [];
    uploadAttachments(req, res, function (uploadErr) {
        if (uploadErr) {
            res.status(400).json(JSONRes.constructResponseJson(400, "FAIL", msg.RES_MSG.UPLOAD_FAIL));
            return;
        }
        req.assert("jobTitle", msg.RES_MSG.JOB_TITLE_EMPTY).notEmpty();
        req.assert("description", msg.RES_MSG.DESCRIPTION_EMPTY).notEmpty();
        req.assert("isDeadline", msg.RES_MSG.DEADLINE_STATUS_EMPTY).notEmpty();
        if ((req.body.isDeadline == '1')) {
            req.assert("deadlineDate", msg.RES_MSG.DEADLINE_DATE_EMPTY).notEmpty();
        }
        let artistArr = (req.body.artists).trim() != '[]' ? (req.body.artists).trim().slice(1, -1).split(',') : [];
        const errors = req.validationErrors();
        if (errors) {
            res.status(400).json(JSONRes.constructResponseJson(400, "FAIL", errors[0].msg));
            return;
        }
        let uploadedFilesPathArr = [];
        const job = new Jobs_1.default({
            jobTitle: req.body.jobTitle,
            description: req.body.description,
            isDeadline: req.body.isDeadline == '1' ? true : false,
            deadlineDate: parseInt(req.body.deadlineDate),
            attachments: [],
            jobCreatedBy: userId,
            artistDetails: artistArr
        });
        let dirName = 'uploads/job_attachments/' + job._id;
        if (!fs.existsSync(dirName)) {
            fs.mkdirSync(dirName);
        }
        let uploadedFileArr = req.files;
        for (let i = 0; i < uploadedFileArr.length; i++) {
            let oldPath = uploadedFileArr[i].path;
            let newPath = 'uploads/job_attachments/' + job._id + '/' + uploadedFileArr[i].filename;
            uploadedFilesPathArr.push(newPath.toString());
            fs.rename(oldPath, newPath, function (err) {
                if (err) {
                    res.status(400).json(JSONRes.constructResponseJson(400, "FAIL", msg.RES_MSG.UPLOAD_FAIL));
                    return;
                }
            });
        }
        job.attachments = uploadedFilesPathArr;
        job.save((mongoErr) => {
            if (mongoErr) {
                res.status(500).json(JSONRes.constructResponseJson(500, "ERROR", msg.RES_MSG.ERROR_IN_DATABASE_OPERATION));
                return;
            }
            sendAuditionRequest(job._id, artistArr);
            res.status(200).json(JSONRes.constructResponseJson(200, "SUCCESS", msg.RES_MSG.ADD_JOB_SUCCESS));
        });
    });
};
function sendAuditionRequest(jobId, artistArr) {
    for (let i = 0; i < artistArr.length; i++) {
        const audition = new Auditions_1.default({
            job: jobId,
            artist: artistArr[i]
        });
        const notification = new Notifications_1.default({
            audition: audition._id,
            notifyTo: artistArr[i]
        });
        audition.save((mongoErr) => {
            Jobs_1.default.findById(jobId, function (jobErr, job) {
                job.auditionsDetails.push(audition._id);
                job.save((mongoErrUp) => {
                });
            });
            notification.save((mongoErrNote) => {
            });
        });
    }
}
exports.getJobDetails = (req, res) => {
    let query = { _id: req.param('jobId') };
    Jobs_1.default.find(query).populate('jobCreatedBy', 'firstName lastName email agentOrAgencyName').populate({ path: 'auditionsDetails', select: 'status', populate: { path: 'artist', model: 'User', select: 'firstName lastName agentOrAgencyName email voiceDemo recordingMethods jobCategory characteristics language' } }).exec(function (err, job) {
        if (err) {
            res.status(500).json(JSONRes.constructResponseJson(500, "ERROR", msg.RES_MSG.ERROR_IN_DATABASE_OPERATION));
            return;
        }
        let jobData = job.length == 1 ? job[0] : job;
        res.status(200).json(JSONRes.constructResponseJson(200, "SUCCESS", jobData));
    });
};
exports.getJobList = (req, res) => {
    let jobStatus = req.param('jobType');
    let query = { jobCreatedBy: req.body.decoded.userId, isDelete: false };
    if (jobStatus == 'R') {
        query.status = 'REQUESTS';
    }
    else if (jobStatus == 'P') {
        query.status = 'PAST';
    }
    else if (jobStatus == 'O') {
        query.status = 'ONGOING';
    }
    Jobs_1.default.find(query).populate('jobCreatedBy', 'firstName lastName email agentOrAgencyName').populate({ path: 'auditionsDetails', select: 'status', populate: { path: 'artist', model: 'User', select: 'firstName lastName agentOrAgencyName email voiceDemo recordingMethods jobCategory characteristics language' } }).exec(function (err, jobs) {
        if (err) {
            res.status(500).json(JSONRes.constructResponseJson(500, "ERROR", msg.RES_MSG.ERROR_IN_DATABASE_OPERATION));
            return;
        }
        res.status(200).json(JSONRes.constructResponseJson(200, "SUCCESS", jobs));
    });
};
exports.getAuditionDetails = (req, res) => {
    let query = { _id: req.param('auditionId') };
    Auditions_1.default.find(query).populate({ path: 'job', select: 'jobTitle description status', populate: { path: 'jobCreatedBy', select: 'firstName lastName email agentOrAgencyName' } }).populate('artist', 'firstName lastName agentOrAgencyName email voiceDemo recordingMethods jobCategory characteristics language').exec(function (err, audition) {
        if (err) {
            res.status(500).json(JSONRes.constructResponseJson(500, "ERROR", msg.RES_MSG.ERROR_IN_DATABASE_OPERATION));
            return;
        }
        let auditionData = audition.length == 1 ? audition[0] : audition;
        res.status(200).json(JSONRes.constructResponseJson(200, "SUCCESS", auditionData));
    });
};
exports.getAuditionList = (req, res) => {
    let auditionStatus = req.param('auditionType');
    let query = { artist: req.body.decoded.userId };
    if (auditionStatus == 'S') {
        query.status = 'SAVED';
    }
    else if (auditionStatus == 'P') {
        query.status = 'ACCEPTED';
    }
    else if (auditionStatus == 'O') {
        query.status = 'ONGOING';
    }
    Users_1.default.findOne({ _id: req.body.decoded.userId }, (err, user) => {
        if (err) {
            res.status(500).json(JSONRes.constructResponseJson(500, "ERROR", msg.RES_MSG.ERROR_IN_DATABASE_OPERATION));
            return;
        }
        if (user.subscriptionStatus == 'NOT_SUBSCRIBE') {
            res.status(404).json(JSONRes.constructResponseJson(404, "ERROR", msg.RES_MSG.SUBSCRIPTION_REQUIRED));
        }
        else if (user.subscriptionStatus == 'EXPIRED') {
            res.status(404).json(JSONRes.constructResponseJson(404, "ERROR", msg.RES_MSG.SUBSCRIPTION_EXPIRED));
        }
        else {
            Auditions_1.default.find(query).populate({ path: 'job', select: 'jobTitle description status', populate: { path: 'jobCreatedBy', select: 'firstName lastName email agentOrAgencyName' } }).populate('artist', 'firstName lastName agentOrAgencyName email voiceDemo recordingMethods jobCategory characteristics language').exec(function (err, auditions) {
                if (err) {
                    res.status(500).json(JSONRes.constructResponseJson(500, "ERROR", msg.RES_MSG.ERROR_IN_DATABASE_OPERATION));
                    return;
                }
                res.status(200).json(JSONRes.constructResponseJson(200, "SUCCESS", auditions));
            });
        }
    });
};
exports.updateAuditionStatus = (req, res) => {
    const notification = new Notifications_1.default({
        audition: req.body.auditionId
    });
    Auditions_1.default.findById(req.body.auditionId, function (userErr, audition) {
        if (userErr) {
            res.status(500).json(JSONRes.constructResponseJson(500, "ERROR", msg.RES_MSG.ERROR_IN_DATABASE_OPERATION));
            return;
        }
        Jobs_1.default.findById(audition.job, function (userErr, job) {
            if (userErr) {
                res.status(500).json(JSONRes.constructResponseJson(500, "ERROR", msg.RES_MSG.ERROR_IN_DATABASE_OPERATION));
                return;
            }
            if (job.status == 'REQUESTS' && req.body.status == 'APPLIED') {
                job.status = 'ONGOING';
                job.save((mongoJobErr) => { });
            }
            if (job.status == 'ONGOING' && req.body.status == 'ACCEPTED') {
                job.status = 'PAST';
                job.save((mongoJobErr) => { });
            }
            notification.notifyTo = job.jobCreatedBy;
            audition.status = req.body.status;
            audition.save((mongoErr) => {
                if (mongoErr) {
                    res.status(500).json(JSONRes.constructResponseJson(500, "ERROR", msg.RES_MSG.ERROR_IN_DATABASE_OPERATION));
                    return;
                }
                notification.save((mongoNoteErr) => {
                    res.status(200).json(JSONRes.constructResponseJson(200, "SUCCESS", msg.RES_MSG.UPDATE_JOB_STATUS_SUCCESS));
                });
            });
        });
    });
};
exports.deleteJob = (req, res) => {
    if (req.body.decoded.userRole != 'PRODUCER') {
        console.log("User type not Match = " + req.body.decoded.userRole);
        res.status(401).json(JSONRes.constructResponseJson(401, "FAIL", msg.RES_MSG.PERMISSION_DENIED));
        return;
    }
    Jobs_1.default.findById(req.body.jobId, function (mongoErr, job) {
        if (mongoErr) {
            res.status(500).json(JSONRes.constructResponseJson(500, "ERROR", msg.RES_MSG.ERROR_IN_DATABASE_OPERATION));
            return;
        }
        if (req.body.decoded.userId != job.jobCreatedBy) {
            console.log("userId not match");
            res.status(401).json(JSONRes.constructResponseJson(401, "FAIL", msg.RES_MSG.PERMISSION_DENIED));
            return;
        }
        job.isDelete = true;
        job.save((mongoErr) => {
            if (mongoErr) {
                res.status(500).json(JSONRes.constructResponseJson(500, "ERROR", msg.RES_MSG.ERROR_IN_DATABASE_OPERATION));
                return;
            }
            res.status(200).json(JSONRes.constructResponseJson(200, "SUCCESS", msg.RES_MSG.DELETE_JOB_SUCCESS));
        });
    });
};
exports.uploadFile = (req, res) => {
    upload(req, res, function (err) {
        console.log(req.body);
        console.log(req.file);
        if (err) {
            // An error occurred when uploading
            console.log("================================================================");
            console.log(JSON.stringify(err));
            res.status(400).json(JSONRes.constructResponseJson(400, "ERROR", JSON.stringify(err)));
            return;
        }
        res.status(200).json(JSONRes.constructResponseJson(200, "SUCCESS", "File uploaded successfully."));
        // Everything went fine 
    });
};
//# sourceMappingURL=jobs.js.map