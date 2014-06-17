/**
 * IMPORTANT * IMPORTANT * IMPORTANT * IMPORTANT * IMPORTANT * IMPORTANT *
 *
 * You should never commit this file to a public repository on GitHub!
 * All public code on GitHub can be searched, that means anyone can see your
 * uploaded secrets.js file.
 *
 * I did it for your convenience using "throw away" credentials so that
 * all features could work out of the box.
 *
 * Untrack secrets.js before pushing your code to public GitHub repository:
 *
 * git rm --cached config/secrets.js
 *
 * If you have already commited this file to GitHub with your keys, then
 * refer to https://help.github.com/articles/remove-sensitive-data
*/

module.exports = {

//  db: process.env.MONGODB|| 'mongodb://pedromarce:pedromarce@lennon.mongohq.com:10095/app26259970',
  db: process.env.MONGODB|| 'mongodb://localhost:27017/test',

  sessionSecret: process.env.SESSION_SECRET || 'Your Session Secret goes here',

  sendgrid: {
    user: process.env.SENDGRID_USER || 'hslogin',
    password: process.env.SENDGRID_PASSWORD || 'hspassword00'
  },

  facebook: {
    clientID: process.env.FACEBOOK_ID || '1463955187177253',
    clientSecret: process.env.FACEBOOK_SECRET || '713055c4674ff179a312c387d385a52c',
    callbackURL: '/auth/facebook/callback',
    passReqToCallback: true
  },

}
