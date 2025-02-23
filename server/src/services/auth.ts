// TODO update function to wrk with graphql API
import jwt from 'jsonwebtoken';
import { GraphQLError } from 'graphql';

import dotenv from 'dotenv';
dotenv.config();

// for REST API authentication
// interface JwtPayload {
//     _id: unknown;
//     username: string;
//     email: string,
// }

// export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
//     const authHeader = req.headers.authorization;

//     if (authHeader) {
//         const token = authHeader.split(' ')[1];

//         const secretKey = process.env.JWT_SECRET_KEY || '';

//         jwt.verify(token, secretKey, (err, user) => {
//             if (err) {
//                 return res.sendStatus(403); // Forbidden
//             }

//             req.user = user as JwtPayload;
//             return next();
//         });
//     } else {
//         res.sendStatus(401); // Unauthorized
//     }
// };

// Authenticate token and AuthenticationError class taken from repo NU-VIRT-FSF-PT-09-2024-U-LOLC\18-MERN-and-Authentication\01-Activities\24-Stu_Authentication-with-GraphQL-server

// for graphql API authentication
export const authenticateToken = ({ req }: any) => {
    // Allows token to be sent via req.body, req.query, or headers
    let token = req.body.token || req.query.token || req.headers.authorization;

    // If the token is sent in the authorization header, extract the token from the header
    if (req.headers.authorization) {
        token = token.split(' ').pop().trim();
    }

    // If no token is provided, return the request object as is
    if (!token) {
        return req;
    }

    // Try to verify the token
    try {
        const { data }: any = jwt.verify(token, process.env.JWT_SECRET_KEY || '', { maxAge: '2hr' });
        // If the token is valid, attach the user data to the request object
        req.user = data;
    } catch (err) {
        // If the token is invalid, log an error message
        console.log('Invalid token');
    }

    // Return the request object
    return req;
};

export const signToken = (username: string, email: string, _id: unknown) => {
    const payload = { username, email, _id };
    const secretKey = process.env.JWT_SECRET_KEY || '';

    return jwt.sign(payload, secretKey, { expiresIn: '1h' });
};

export class AuthenticationError extends GraphQLError {
    constructor(message: string) {
        super(message, undefined, undefined, undefined, ['UNAUTHENTICATED']);
        Object.defineProperty(this, 'name', { value: 'AuthenticationError' });
    }
};