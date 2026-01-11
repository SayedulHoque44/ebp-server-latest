import { Schema, model } from "mongoose";
import { TSubContent } from "./SubContent.interface";
import {
  EBP_Images_CDN_BaseUrl,
  getObjectKeyFromUrl,
} from "../../utils/globalUtilsFn";
import { deleteS3Object } from "../../utils/s3";

const SubContentSchema = new Schema<TSubContent>(
  {
    RefId: {
      type: Schema.Types.ObjectId,
      ref: "UniContent",
      required: true,
    },
    title: {
      type: String,
    },
    info: {
      type: String,
    },
    imageUrl: {
      type: String,
    },
    url: {
      type: String,
    },
    youtubeUrl: {
      type: String,
    },
    index: {
      type: Number,
    },
  },
  {
    timestamps: true,
  },
);

// model
export const SubContentModel = model<TSubContent>(
  "SubContent",
  SubContentSchema,
);

SubContentSchema.pre("deleteMany", async function (next) {
  try {
    // `this` refers to the query being executed
    const query = this.getFilter(); // Get the filter used for the deleteMany operation

    console.log(query);
    // Find the documents matching the query
    const docs = await SubContentModel.find(query);

    // Loop through the documents and delete their associated images
    for (const doc of docs) {
      if (doc.imageUrl) {
        console.log(doc.imageUrl);
        const objectKey = getObjectKeyFromUrl(
          EBP_Images_CDN_BaseUrl,
          doc.imageUrl,
        );
        await deleteS3Object(objectKey);
      }
    }
    next();
  } catch (error: any) {
    console.error("Error in pre-deleteMany middleware:", error);
    next(error);
  }
});
