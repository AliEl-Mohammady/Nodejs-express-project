
module.exports = (...roles) => {
    return (req, res, next) => {
        console.log(roles);
        console.log(req.currentUser);
        if (!roles.includes(req.currentUser.role)) {
            return res.status(403).json({ msg: 'Not allowed to access from this User' })
        }
        next()
    }
}