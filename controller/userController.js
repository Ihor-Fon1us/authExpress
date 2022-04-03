const loginRequired = () => {
    return (req, res, next) => {
        if(req.user) {
            next();
        }
        else {
            return res.status(400).json({message: 'Unauthorized user!'});
        }
    }
}

module.exports.loginRequired = loginRequired;