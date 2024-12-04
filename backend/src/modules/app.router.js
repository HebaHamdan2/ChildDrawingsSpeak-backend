import connectDB from "../../DB/connection.js";

const initApp=async(app,express)=>{
    app.use(cors());
    connectDB();
    app.use(express.json());
    app.get("/",(req,res)=>{
        return res.status(200).json({message:"welcome"})
    })
    app.get("*",(req,res)=>{
        return res.status(500).json({message:"page not found"})
    });
  
}
export default initApp;