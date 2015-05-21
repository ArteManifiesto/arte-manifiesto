module.exports = {
    db: {
        name: "am",
        username: "root",
        password: process.env.DB_PASSWORD,
        dialect: "mysql"
    },
    app: {
        name: "Arte Manifiesto"
    },
    facebook: {
        clientID: "1473636902857068",
        clientSecret: "defdc485a2b8b1ba309c735d8e975c21",
        callbackURL: "http://localhost:3000/auth/facebook/callback"
    },
    recaptcha: {
        publicKey: '6LcbDwcTAAAAAIexPkpMRGp4fTveLvMzll_XPH3Q',
        privateKey: '6LcbDwcTAAAAANqfkOQEy1IneZnIz_jaHZvUeuCB'
    }
};
