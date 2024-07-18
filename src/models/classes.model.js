import mongoose,{Schema} from "mongoose";
const classeSchema = new Schema({
    className:{
        type: String,
        required: true,
        unique: true
    },
    classTeacher:{
        type: Schema.Types.ObjectId,
        ref: "Teacher",
        required: true,
    },
    fees:{
        type: Number,
        required: true,
    },
    totalCapacity:{
        type: Number,
        required: true,
    },
    availableCapacity:{
        type: Number,
    },
    students:[
        {
            type: mongoose.Schema.Types.ObjectId,
             ref: "Student"
        }],


},{timestamps: true});
classeSchema.pre("save", async function(next){
    const grade=this;
    this.availableCapacity=this.totalCapacity-this.students.length;
    if(this.availableCapacity<0){
        next(new Error("No available capacity"));
    }
    next();
})
const Grade= mongoose.model("Grade",classeSchema);
export  {Grade};