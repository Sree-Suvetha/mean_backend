const jwt = require('jsonwebtoken');

module.exports = (req, res, next)=>{
    try
    {
        // Bearer token --> so split and take the token at index 1
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, process.env.secretKey);// gives the decoded token
        // adding additional fields to incoming requets
        req.userData = {email: decodedToken.email, userId: decodedToken.userId};
        next();
    }
    catch(err)
    {
        res.status(401).json({message:'Not an authenticated user'})
    }
}