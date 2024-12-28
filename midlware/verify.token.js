const jwt=require('jsonwebtoken');

module.exports=(req,res,next)=>{
    const token=req.header('Authorization') || req.headers['authorization'];
    if(!token){
        return res.status(401).json({msg:'No token, authorization denied'})
    }
    try {
        const authorize = token.split(' ')[1];
        const currentUser = jwt.verify(authorize, process.env.JWT_SECRET_KEY);
        req.currentUser = currentUser;
        next();
    } catch (error) { 
        res.status(401).json({msg:'Token is not valid'})
    }
}