import mongoose ,{ Schema,model } from "mongoose";

const drawingSchema = new Schema({
    imageUrl: {
      type: String,
      required: true
    },
    prediction: {
      type: Object,
      required: true
    },
    childId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Child',
      required: true
    },
  },
  {
    timestamps: true,
  });
  
const drawingModel =
mongoose.models.Drawing || model("Drawing", drawingSchema);
export default drawingModel;