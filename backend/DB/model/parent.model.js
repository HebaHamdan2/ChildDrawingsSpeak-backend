import mongoose,{Schema,model} from "mongoose";
const parentSchema = new Schema({
    username: {
        type: String,
        required: true,
        min:4,
        max:20
    },
    profilePic:{
        type:String
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    confirmEmail: {
        type: Boolean,
        default: false,
      },
    children: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Child'
        }
    ],
    sendCode: {
      type: String,
      default: null,
    },
    changePasswordTime: {
      type: Date,
    },
    address: {
        type: String,
      }
},
{
    timestamps: true,
  }
);

const parentModel = mongoose.model.Parent ||('Parent', parentSchema);
export default parentModel;