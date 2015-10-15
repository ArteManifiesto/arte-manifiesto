module.exports = {
    db: {
        name: "am",
        username: "root",
        password:"",
        options: {
            dialect: "mysql",
            timezone: '-05:00'
        }
    },
    app: {
        name: "Arte Manifiesto"
    },
    facebook: {
        clientID: "1473636902857068",
        clientSecret: "defdc485a2b8b1ba309c735d8e975c21",
        callbackURL: "http://localhost:3000/auth/facebook/callback/"
    },
    recaptcha: {
        publicKey: '6LdnUQoTAAAAALPzF3glOaqzGcbhBrmT1yQwVYls',
        privateKey: '6LdnUQoTAAAAACVrGpYvAvGv3ylnBsnkIHXdPLX9'
    }
};
