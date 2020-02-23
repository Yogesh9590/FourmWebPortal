const env = process.env.NODE_ENV;
process.env.PORT = 4000;
process.env.SESSION_SECRET = "ashdfjhasdlkjfhalksdjhflak";
process.env.JWT_SECRET = "PrAcHi@ThE@BeAuTy@QuEeN";
const dev = {
    mongoURI: 'mongodb://localhost:27017/NuvoDB',
    loglevel: "debug",
};
const qa = {
    mongoURI: 'mongodb://localhost:27017/NuvoDB',
    loglevel: "debug",
};
const prod = {
    mongoURI: 'mongodb://13.59.81.45:27017/NuvoDB',
    loglevel: "info",
};
const config = { dev, qa, prod };
module.exports = config[env];
//# sourceMappingURL=config.js.map