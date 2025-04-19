import mongoose, { Schema, Document, model, models } from "mongoose";

interface ICategory extends Document {
    name: string;
}

const categorySchema = new Schema<ICategory>({
    name: {
        type: String,
        required: true,
        unique: true,
    },
});

const Category = models.Category || model<ICategory>("Category", categorySchema);

export default Category;
