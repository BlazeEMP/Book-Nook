// TODO verify functions still being used and remove the rest
import type { User } from '../models/User.js';

export const createUser = (userData: User) => {
    return fetch('/api/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    });
};

export const loginUser = (userData: User) => {
    return fetch('/api/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    });
};

// make a search to google books api
// https://www.googleapis.com/books/v1/volumes?q=harry+potter
export const searchGoogleBooks = (query: string) => {
    return fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}`);
};