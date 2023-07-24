const { Schema, model } = require("mongoose");

const auditLogSchema = new Schema({
    action: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    timestamp: { type: Date, default: Date.now },
    details: { type: Schema.Types.Mixed },
});

module.exports = model("AuditLog", auditLogSchema);
