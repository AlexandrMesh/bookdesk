import { connect } from 'react-redux';
import { deriveBookVotes, deriveUpdatingVoteForBook } from '~redux/selectors/books';
import { updateBookVotes } from '~redux/actions/booksActions';
import BookItem from './BookItem';

const mapStateToProps = (state, ownProps) => ({
  bookWithVote: deriveBookVotes(ownProps.bookItem.bookId)(state),
  updatingVoteForBook: deriveUpdatingVoteForBook(ownProps.bookItem.bookId)(state),
});

const mapDispatchToProps = (dispatch) => ({
  updateBookVotes: ({ bookId, shouldAdd, bookStatus }) => dispatch(updateBookVotes({ bookId, shouldAdd, bookStatus })),
});

export default connect(mapStateToProps, mapDispatchToProps)(BookItem);
