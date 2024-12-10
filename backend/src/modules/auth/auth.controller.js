import bcrypt  from 'bcryptjs';
import parentModel from '../../../DB/model/parent.model.js';
import cloudinary from '../../services/cloudinary.js';
import jwt from 'jsonwebtoken';
import { sendEmail } from '../../services/email.js';
import { customAlphabet } from 'nanoid';
export const signUp=async(req,res,next)=>{
    const {username,email,password,address}=req.body;
    const user=await parentModel.findOne({email});
    if(user){
        return next(new Error("Email already exists",{cause:409}));
    } 
    const hashPassword=bcrypt.hashSync(password,parseInt(process.env.SALT_ROUND));
    let profilePic={};
    if(req.file?.path){
      const { secure_url, public_id } = await cloudinary.uploader.upload(
        req.file.path,
        {
          folder: `${process.env.APP_NAME}/user/${req.user._id}/profile`,
        }
      );
      profilePic={secure_url,public_id};
    }
 
    const token=jwt.sign({email},process.env.CONFIRMEMAILSECRET);
    await sendEmail(
      email,
      "confirm email",
      `<a href='${req.protocol}://${req.headers.host}/auth/confirmEmail/${token}'>verify</a>`
    );
    const createParent=await parentModel.create({
        username,
        email,
        password:hashPassword,
       profilePic,
       address
    });
    return res.status(201).json({message:"success",createParent});
} 


export const confirmEmail=async(req,res,next)=>{
  const token=req.params.token;
  const decoded=jwt.verify(token,process.env.CONFIRMEMAILSECRET);
  if(!decoded){
      return res.status(404).json({message:"invalid token"});
  }
  const user=await parentModel.findOneAndUpdate({
      email:decoded.email,confirmEmail:false
  },{confirmEmail:true});
  // if(!user){
  //     return res.redirect(process.env.LOGINFRONTEND);//the login form 
  // }
  }
  export const signIn=async(req,res,next)=>{
  const {email,password}=req.body;
  const user=await parentModel.findOne({email});
  if (!user) {
      return res.status(400).json({ message: "data invalid" });
    }
    if (!user.confirmEmail) {
      return res.status(400).json({ message: "Please confirm your email!" });
    }
  
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
    return next(new Error(`mismatch password`,{cause:401}));
    }
    const token = jwt.sign(
      { id: user._id ,name: user.username},
      process.env.LOGINSECRET
    ); 
    const refreshToken = jwt.sign(
      { id: user._id, name: user.username },
      process.env.LOGINSECRET,
      { expiresIn: 60 * 60 * 24 * 30 }
    );
    return res.status(200).json({ message: "success", token, refreshToken });
  }
  export const sendCode = async (req, res) => {
      const { email } = req.body;
      let code = customAlphabet("1234567890abcdzABCDZ", 4);
      code = code();
      const user = await parentModel.findOneAndUpdate(
        { email },
        { sendCode: code },
        { new: true }
      );
      const html = `<h2>code is :${code}</h2>`;
      await sendEmail(email, `reset password`, html);
      // return res.redirect(process.env.FORGETPASSWORDFORM); //redirecet to the  form  for making new password
      return res.status(200).json({ message: "success" }); 
    };
    export const forgetPasseword = async (req, res) => {
      const { email, password, code } = req.body;
      const user = await parentModel.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "not regrister account" });
      }
      if (user.sendCode != code) {
        return res.status(400).json({ message: "invalid code" });
      }
      let match = await bcrypt.compare(password, user.password);
      if (match) {
        return res.status(400).json({ message: "same passsword" });
      }
      user.password = await bcrypt.hash(password, parseInt(process.env.SALT_ROUND));
      user.sendCode = null;
      user.changePasswordTime = Date.now(); //to  log out from accounts that sign in with old password
      await user.save();
      return res.status(200).json({ message: "success" });
    };
    export const deleteInvalidConfirm = async (req, res) => {
      const users = await parentModel.deleteMany({ confirmEmail: false });
      return res.status(200).json({ message: "success" });
    };