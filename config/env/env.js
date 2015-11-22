module.exports = {
    db: {
        name: process.env.DB_NAME,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        options: {
          host: process.env.DB_HOST,
          timezone: process.env.DB_TIMEZONE,
          dialect: 'mysql',
          port: process.env.DB_PORT
        }
    },
    facebook: {
      clientID: process.env.FB_CLIENT_ID,
      clientSecret: process.env.FB_CLIENT_SECRET,
      callbackURL: process.env.FB_CALLBACK_URL
    },
    recaptcha: {
      publicKey: process.env.RECAPTCHA_PUBLIC_KEY,
      privateKey: process.env.RECAPTCHA_PRIVATE_KEY
    }
};
