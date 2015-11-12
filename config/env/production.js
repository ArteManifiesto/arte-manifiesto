module.exports = {
    db: {
        name: process.env.DB_NAME,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        options: {
          host: process.env.DB_HOST,
          dialect: "mysql",
          port: 3306,
          timezone: '-05:00'
        }
    },
    app: {
        name: "Arte"
    },
    facebook: {
        clientID: "1473636902857068",
        clientSecret: "defdc485a2b8b1ba309c735d8e975c21",
        callbackURL: "http://artemanifiesto.com/auth/facebook/callback/"
    },
    recaptcha: {
        publicKey: '6LdnUQoTAAAAALPzF3glOaqzGcbhBrmT1yQwVYls',
        privateKey: '6LdnUQoTAAAAACVrGpYvAvGv3ylnBsnkIHXdPLX9'
    }
};
