import mongoose , {Schema , model} from "mongoose";


const feedbackHistorySchema = new Schema(
    {
       feedbackId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Feedback",
        index : true
       }, 
        previousData : {
            type : mongoose.Schema.Types.Mixed,
        },
        editedByManagerId : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User",
        },
        editReason : {
            type : String,
            trim : true,
            maxlength : [500 , "Edit reason can't exceed more than 500 chars"],
        },
        editedAt : {
            type : Date,
            default : Date.now,
        }
    } , 
    {timestamps : true}
);

const FeedbackHistory = model("FeedbackHistory" , feedbackHistorySchema);
export {FeedbackHistory};

