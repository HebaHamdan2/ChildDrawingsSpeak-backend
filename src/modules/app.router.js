import connectDB from "../../DB/connection.js";
import { globalErrorHandler } from "../services/errorHandling.js";
import cors from "cors"
import authRouter from "../modules/auth/auth.router.js"
import parentRouter from "../modules/parent/parent.router.js"
import childRouter from "../modules/child/child.router.js"
import drawingRouter from "../modules/drawing/drawing.router.js"
const initApp=async(app,express)=>{
    app.use(cors());
    connectDB();
    app.use(express.json());
    app.get("/",(req,res)=>{
        return res.status(200).json({message:"welcome"})
    })
    app.use("/auth",authRouter);
    app.use("/parent",parentRouter);
    app.use("/child",childRouter);
    app.use("/drawing",drawingRouter);
    app.get("*",(req,res)=>{
        return res.status(500).json({message:"page not found"})
    });
    app.use(globalErrorHandler)
  
}
export default initApp;