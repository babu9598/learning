import mongoose, { Document, Schema } from 'mongoose';

export interface ISurgeRule extends Document {
  zoneName: string;
  multiplier: number;
  reason: 'DEMAND' | 'WEATHER' | 'PEAK_HOURS' | 'FESTIVAL' | 'CUSTOM';
  startTime?: Date;
  endTime?: Date;
  isActive: boolean;
  affectedCategories: string[];
  createdAt: Date;
  updatedAt: Date;
}

const SurgeRuleSchema = new Schema<ISurgeRule>(
  {
    zoneName: { type: String, required: true, trim: true },
    multiplier: { type: Number, required: true, default: 1.25, min: 1.0, max: 3.5 },
    reason: {
      type: String,
      enum: ['DEMAND', 'WEATHER', 'PEAK_HOURS', 'FESTIVAL', 'CUSTOM'],
      default: 'DEMAND',
    },
    startTime: { type: Date },
    endTime: { type: Date },
    isActive: { type: Boolean, default: true, index: true },
    affectedCategories: [{ type: String }],
  },
  { timestamps: true }
);

export const SurgeRule = mongoose.model<ISurgeRule>('SurgeRule', SurgeRuleSchema);
