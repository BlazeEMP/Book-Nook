import { Schema, model, Document } from 'mongoose';

interface IBook extends Document {
    bookId: string;
    title: string;
    authors: string[];
    description: string;
    image: string;
    link: string;
}

const bookSchema = new Schema<IBook>(
    {
        bookId: {
            type: String,
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        authors: [
            {
                type: String,
            },
        ],
        description: {
            type: String,
            required: true,
        },
        image: {
            type: String,
        },
        link: {
            type: String,
        },
    },
    {
        timestamps: true,
        toJSON: { getters: true },
        toObject: { getters: true },
    }
);

const Book = model<IBook>('Book', bookSchema);

export default Book;