import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema(
  {
    action: {
      type: String,
      required: true,
      index: true
    },
    actor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true
    },
    target: {
      type: String,
      default: null
    },
    ipAddress: {
      type: String,
      default: '127.0.0.1'
    },
    userAgent: {
      type: String,
      default: 'Unknown'
    },
    correlationId: {
      type: String,
      default: null,
      index: true
    },
    result: {
      type: String,
      enum: ['SUCCESS', 'FAILURE', 'DENIED'],
      required: true
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true
    }
  },
  { timestamps: true }
);

const AuditLog = mongoose.model('AuditLog', auditLogSchema);

export default AuditLog;
