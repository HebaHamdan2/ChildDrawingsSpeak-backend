import mongoose , { Schema ,model} from "mongoose";
const childSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      min: 4,
      max: 20,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    gender:{
      type:String,
      enum:["Male","Female"],
      required: true,
  },
    profilePic: {
      type: Object,
    },
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Parent", // Reference to Parent schema
      required: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);

// Virtual field for Child to Drawing relationship
childSchema.virtual("drawings", {
  ref: "Drawing",
  localField: "_id",
  foreignField: "childId",
});

  const childModel =
  mongoose.models.Child || model("Child", childSchema);
export default childModel;
