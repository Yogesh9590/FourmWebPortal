"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Users_1 = require("../models/Users");
const winston = require("winston");
const bunyan = require("bunyan");
const msg = require("../services/response-msg-service");
const JSONRes = require("../services/response-service");
const request = require("express-validator");
const log = bunyan.createLogger({ name: 'express-skeleton' });
exports.searchArtist = (req, res) => {
    console.log("Search Artist API Call @@@@@");
    log.info('This is Info'); // info
    log.warn('This is Warn'); // warn
    let searchQuery = { userType: "ARTIST" };
    if ((req.body.gender).toUpperCase() != 'ALL') {
        searchQuery.gender = req.body.gender;
    }
    let ageSearch = [];
    if (req.body.age && req.body.age.length > 0) {
        for (var i = 0; i < req.body.age.length; i++) {
            ageSearch.push({ 'age': req.body.age[i] });
        }
        searchQuery.$or = ageSearch;
    }
    searchQuery.language = { $all: req.body.language };
    searchQuery.characteristics = { $all: req.body.characteristics };
    searchQuery.jobCategory = { $all: req.body.jobCategory };
    console.log("Search #######");
    console.log(searchQuery);
    winston.log('info', 'Hello log files!');
    Users_1.default.find(searchQuery, 'firstName lastName email age voiceDemo recordingMethods jobCategory characteristics language updatedAt createdAt', (err, artist) => {
        artist = artist ? artist : [];
        res.status(200).json(JSONRes.constructResponseJson(200, "SUCCESS", artist));
    });
    // User.find({ language: { $all: req.body.language } }, (err, artist) => {
    //   res.status(200).json(JSONRes.constructResponseJson(200, "SUCCESS", artist));
    // });
};
let artistResList = [];
let artistReqList = [];
let artistIdsArr = [];
let artistCount = 0;
exports.manageArtist = (req, res) => {
    artistResList = [];
    if (req.body.artistList && req.body.artistList.length > 0) {
        artistReqList = req.body.artistList;
        artistCount = 0;
        checkArtist(req, res);
    }
};
function checkArtist(req, res) {
    let artistObj = {
        'email': artistReqList[artistCount],
        'status': false
    };
    Users_1.default.find({ 'email': artistReqList[artistCount], 'userType': 'ARTIST' }, (err, artist) => {
        artist = artist ? artist : [];
        if (artist.length > 0) {
            artistObj.status = true;
            artistIdsArr.push(artist[0]._id);
        }
        artistResList.push(artistObj);
        if (artistReqList.length > artistCount + 1) {
            artistCount = artistCount + 1;
            checkArtist(req, res);
        }
        else {
            let finalArr = [];
            Users_1.default.findOne({ '_id': req.body.decoded.userId }, (err, agent) => {
                agent.connectedArtist = artistIdsArr;
                finalArr = agent.connectedArtist;
                // Used to remove duplicates values
                for (var i = 0; i < finalArr.length; ++i) {
                    for (var j = i + 1; j < finalArr.length; ++j) {
                        if (finalArr[i].toString() == finalArr[j].toString()) {
                            finalArr.splice(j--, 1);
                        }
                    }
                }
                agent.connectedArtist = finalArr;
                agent.save(function (err, updatedUser) {
                    if (err) {
                        res.status(500).json(JSONRes.constructResponseJson(500, "ERROR", msg.RES_MSG.ERROR_IN_DATABASE_OPERATION));
                        return;
                    }
                    res.status(200).json(JSONRes.constructResponseJson(200, "SUCCESS", artistResList));
                });
            });
        }
    });
}
exports.getConnectedArtist = (req, res) => {
    Users_1.default.find({ '_id': req.body.decoded.userId }, 'connectedArtist').populate('connectedArtist', 'firstName lastName agentOrAgencyName email voiceDemo recordingMethods jobCategory characteristics language').exec(function (err, artist) {
        if (err) {
            res.status(500).json(JSONRes.constructResponseJson(500, "ERROR", msg.RES_MSG.ERROR_IN_DATABASE_OPERATION));
            return;
        }
        res.status(200).json(JSONRes.constructResponseJson(200, "SUCCESS", artist[0].connectedArtist));
    });
};
exports.removeArtist = (req, res) => {
    Users_1.default.findOne({ '_id': req.body.decoded.userId }, (err, agent) => {
        for (var i = 0; i < agent.connectedArtist.length; i++) {
            if (agent.connectedArtist[i] == req.body.artistId) {
                agent.connectedArtist.splice(i, 1);
                break;
            }
        }
        agent.save((mongoErr) => {
            if (mongoErr) {
                res.status(500).json(JSONRes.constructResponseJson(500, "ERROR", msg.RES_MSG.ERROR_IN_DATABASE_OPERATION));
                return;
            }
            res.status(200).json(JSONRes.constructResponseJson(200, "SUCCESS", msg.RES_MSG.REMOVE_ARTIST_SUCCESS));
        });
    });
};
//# sourceMappingURL=artist.js.map