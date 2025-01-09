import { Schema, model } from "mongoose";

import { TStdNote, TStdNoteImage } from "../StdNote/StdNote.interface";

const StdNoteSchema = new Schema<TStdNote>(
  {
    group: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const StdNoteImageSchema = new Schema<TStdNoteImage>(
  {
    StdNoteId: {
      type: Schema.Types.ObjectId,
      ref: "Trucchi",
      required: true,
    },

    imageUrl: {
      type: String,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

// model
export const TrucchiModel = model<TStdNote>("StdNote", StdNoteSchema);
export const TrucchiImageModel = model<TStdNoteImage>(
  "TrucchiImage",
  StdNoteImageSchema,
);
