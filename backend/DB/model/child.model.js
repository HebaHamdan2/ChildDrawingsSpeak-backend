import mongoose , { Schema ,model} from "mongoose";

const childSchema = new Schema(
    {
      name: {
        type: String,
        required: true,
        min:4,
        max:20
      },
      dateOfBirth: {
        type: Date,
        required: true
      },
      profilePic:{
        type:String
    },
    },
    {
      toJSON: { virtuals: true },
      toObject: { virtuals: true }
    }
  );
  childSchema.virtual('drawings', {
    ref: 'Drawing',
    localField: '_id',
    foreignField: 'childId'
  });
  const childModel =
  mongoose.models.Child || model("Child", childSchema);
export default childModel;
