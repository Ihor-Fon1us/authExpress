const conf = require('../bin/config/config');

const adminConfirm = () => {
    return (req, res, next) => {
        if( req.user.name === conf.admin[0] || req.user.name === conf.admin[1] ) {
          next();
        } else {
          res.redirect('/');
        }
    
    }
}

module.exports.adminConfirm = adminConfirm;