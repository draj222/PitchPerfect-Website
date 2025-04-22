import mongoose from 'mongoose';

export interface IMessage extends mongoose.Document {
  sender: mongoose.Types.ObjectId;
  recipient: mongoose.Types.ObjectId;
  match: mongoose.Types.ObjectId;
  content: string;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new mongoose.Schema<IMessage>(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Message must have a sender'],
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Message must have a recipient'],
    },
    match: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Match',
      required: [true, 'Message must be associated with a match'],
    },
    content: {
      type: String,
      required: [true, 'Message content cannot be empty'],
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Create indexes for efficient querying
MessageSchema.index({ match: 1, createdAt: 1 });
MessageSchema.index({ sender: 1, recipient: 1 });
MessageSchema.index({ recipient: 1, read: 1 });

export default mongoose.model<IMessage>('Message', MessageSchema); 