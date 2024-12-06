import mongoose, { Schema, model } from "mongoose";

const parentSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      min: 4,
      max: 20,
    },
    profilePic: {
      type: Object,
      default: null,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    confirmEmail: {
      type: Boolean,
      default: false,
    },
    children: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Child", // Reference to Child schema
      },
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
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);

// Virtual field for Parent to Child relationship
parentSchema.virtual("childrenDetails", {
  ref: "Child",
  localField: "_id",
  foreignField: "parentId",
});

const parentModel = mongoose.model.Parent ||model('Parent', parentSchema);
export default parentModel;