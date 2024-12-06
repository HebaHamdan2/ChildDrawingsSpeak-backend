import jwt from "jsonwebtoken";
import parentModel from "../../DB/model/parent.model.js";
export const auth=()=>{
    return async(req,res,next)=>{
        const {authorization}=req.headers;
        if(!authorization?.startsWith(process.env.BEARERKEY)){
            return res.status(400).json({message:"Invalid autherization!"})
        }
        const token=authorization.split(process.env.BEARERKEY)[1];
        const decoded=jwt.verify(token,process.env.LOGINSECRET);
        if(!decoded){
            return res.status(400).json({message:"Invalid Autherization!"})
        }
        const user=await parentModel.findById(decoded.id).select('username');
        if (!user) {
            return res.status(404).json({ message: 'Not Registerd User!' });
          }
    
    if(parseInt(user.changePassword?.getTime()/1000)>decoded.iat){
        return next(new Error(`Expired token ,please login`,{cause:400}));
    }
    req.user = user;
    next();
    }
}