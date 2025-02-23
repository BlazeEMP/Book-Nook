import { Container, Card, Button, Row, Col } from 'react-bootstrap';

import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';
import type { User } from '../models/User';

// graphql + apollo server implementation
import { GET_ME } from '../utils/queries';
import { REMOVE_BOOK } from '../utils/mutations';
import { useQuery, useMutation } from '@apollo/client';
import { ApolloCache } from '@apollo/client';

const SavedBooks = () => {
    const { loading, error, data } = useQuery(GET_ME);
    const userData: User = data?.me || {};

    const [removeBook] = useMutation(REMOVE_BOOK, {
        update(cache: ApolloCache<any>, { data }: { data?: { removeBook: any } }) {
            if (!data) {
                console.error('No data returned for removeBook mutation');
                return null;
            }

            try {
                cache.writeQuery({
                    query: GET_ME,
                    data: { me: data.removeBook },
                });
            } catch (error) {
                console.error("Catch error in useMutation(REMOVE_BOOK): ", error);
            }
        },
    });

    // take a book's bookId value and delete it from db, update bookId in local storage
    const handleDeleteBook = async (bookId: string) => {
        const token = Auth.loggedIn() ? Auth.getToken() : null;

        if (!token) return false;

        try {
            // take the data object from the removeBook mutation response to update the cache on the client
            const { data } = await removeBook({
                variables: { bookId },
            });

            if (!data) throw new Error('Something went wrong trying to remove your book!');

            removeBookId(bookId);
        } catch (error) {
            console.error("Error in handleDeleteBook: ", error);
        }
    };

    // if data isn't here yet, say so (checks apollo server provided loading object inside useQuery)
    if (loading) {
        return <h2>LOADING...</h2>;
    }

    // if there is an error in useMutation, provide context on screen
    if (error) {
        return <h2>ERROR: Try refreshing the page</h2>;
    }

    return (
        <>
            <div className='text-light bg-dark p-5'>
                <Container>
                    {userData.username ? (
                        <h1>Viewing {userData.username}'s saved books!</h1>
                    ) : (
                        <h1>Viewing saved books!</h1>
                    )}
                </Container>
            </div>
            <Container>
                <h2 className='pt-5'>
                    {userData.savedBooks.length
                        ? `Viewing ${userData.savedBooks.length} saved ${userData.savedBooks.length === 1 ? 'book' : 'books'
                        }:`
                        : 'You have no saved books!'}
                </h2>
                <Row>
                    {userData.savedBooks.map((book) => {
                        return (
                            <Col md='4'>
                                <Card key={book.bookId} border='dark'>
                                    {book.image ? (
                                        <Card.Img
                                            src={book.image}
                                            alt={`The cover for ${book.title}`}
                                            variant='top'
                                        />
                                    ) : null}
                                    <Card.Body>
                                        <Card.Title>{book.title}</Card.Title>
                                        <p className='small'>Authors: {book.authors}</p>
                                        <Card.Text>{book.description}</Card.Text>
                                        <Button
                                            className='btn-block btn-danger'
                                            onClick={() => handleDeleteBook(book.bookId)}
                                        >
                                            Delete this Book!
                                        </Button>
                                    </Card.Body>
                                </Card>
                            </Col>
                        );
                    })}
                </Row>
            </Container>
        </>
    );
};

export default SavedBooks;