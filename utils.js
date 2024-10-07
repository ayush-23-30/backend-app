import jwt from "jsonwebtoken";

function authenticateToken (req,res,next) {
 try {
   const authHeader  = req.headers["authorization"] || req.body.token; 
   const token = authHeader && authHeader.split(" ")[1];
 
   if(!token) {
     res.status(402).json({
       success : false, 
       message : "The token is not available"
     })
   }
   try {
    const decode = jwt.verify(token, process.env.JWT_SECRET_TOKEN);
    req.user = decode; // Attach decoded user to the request

    // Proceed to next middleware
    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: "Invalid token",
    });
  }
 } catch (error) {
  console.error("there is an error in Authentication token");
  return res.status(401).json({
    success : true, 
    message : "Authenticatoin Creation Token",
  })
 }
}

export default authenticateToken; 