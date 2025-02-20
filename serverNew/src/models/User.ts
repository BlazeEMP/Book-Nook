import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcrypt';

interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    savedBooks: Schema.Types.ObjectId[];
    isCorrectPassword(password: string): Promise<boolean>;
    bookCount: number;
}

const userSchema = new Schema<IUser>(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            match: [/.+@.+\..+/, 'Must match an email address!'],
        },
        password: {
            type: String,
            required: true,
            minlength: 8,
        },
        savedBooks: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Book',
            },
        ],
        bookCount: {
            type: Number,
            default: 0,
        },
    }
    // TODO: uncomment for settings for schema if needed
    // ,
    // {
    //     timestamps: true,
    //     toJSON: { getters: true },
    //     toObject: { getters: true },
    // }
);

// pre hook to hash the password before saving a new user or updating password field on a user
userSchema.pre<IUser>('save', async function (next) {
    if (this.isNew || this.isModified('password')) {
        const saltRounds = 10;
        this.password = await bcrypt.hash(this.password, saltRounds);
    }

    next();
});

userSchema.methods.isCorrectPassword = async function (password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
};

const User = model<IUser>('User', userSchema);

export default User;