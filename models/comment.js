const mongoose = require("mongoose");
const { Schema } = mongoose;

const commentSchema = new Schema ({
    content: {
        type: String,
        required: true,
    },
    blogId:{
        type: Schema.Types.ObjectId,
        ref: "Blog",
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },

},
{ timestamps: true });

const Comment = mongoose.models.Comment || mongoose.models.comment || mongoose.model("Comment", commentSchema);
if (!mongoose.models.comment) {
    mongoose.model("comment", commentSchema);
}

module.exports = Comment;