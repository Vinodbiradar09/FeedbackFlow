import mongoose, { Schema, model } from "mongoose";
import dotenv from "dotenv";
dotenv.config();


const teamsSchema = new Schema(

    {
        managerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index : true,
        },
        employeeIds: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                validate : {
                    validator : function (employeeIds){
                        return employeeIds.length > 0;
                    },
                    message : "Teams must have atleast one employee",
                }
            }
        ],

        teamName : {
            type : String,
            required : true,
            trim : true,
            maxlength : [100 , "Team name can't exceed 100 chars"],
        },
        isActiveTeam : {
            type : Boolean,
            default : true,
        }
    },

    { timestamps: true }

)

const Team = model("Team" , teamsSchema);

export {Team};