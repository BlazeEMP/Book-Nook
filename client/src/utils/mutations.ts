import { gql } from '@apollo/client';

export const LOGIN_USER = gql`
mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
        token
        user { _id }
    }
}`;

export const ADD_USER = gql`
mutation addUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
        token
        user { _id }
    }
}`;

export const SAVE_BOOK = gql`
mutation saveBook($input: SaveBookInput!) {
    saveBook(input: $input) {
        _id
        username
        email
        savedBooks {
            bookId
            authors
            description
            title
            image
            link
        }
        bookCount
    }
}`;

export const REMOVE_BOOK = gql`
mutation removeBook($bookId: ID!) {
    removeBook(bookId: $bookId) {
        _id
        username
        email
        savedBooks {
            bookId
            authors
            description
            title
            image
            link
        }
        bookCount
    }
}`;