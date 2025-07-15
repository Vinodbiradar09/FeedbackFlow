import mongoose, { Schema, model } from "mongoose";


const feedbackSchema = new Schema(

    {
        fromManagerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        toEmployeeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Employee Id is required"],
        },
        strengths: {
            type: String,
            required: true,
            trim: true,
            maxlength: [1000, "Strengths can't exceed more than 1000 chars"],
        },
        areasToImprove: {
            type: String,
            trim: true,
            maxlength: [1000, "Areas To Improve can't exceed more than 1000 chars"],
        },
        sentiment: {
            type: String,
            required: true,
            enum: {
                values: ["positive", "neutral", "negative"],
                message: "Sentiment must be positive , neutral or negative",
            }
        },
        isAcknowledged: {
            type: Boolean,
            default: false,
        },
        acknowledgedAt: {
            type: Date,
            default: null
        },
        version : {
            type : Number,
            default : 1,
        },
        isDeleted : {
            type : Boolean,
            default : false,
        }
    },

    { timestamps: true }

)

feedbackSchema.pre('save' , function(next){
    if(this.isModified() && !this.isNew){
        this.version += 1; 
    }
    next();
});


const Feedback = model("Feedback" , feedbackSchema);
export{Feedback};