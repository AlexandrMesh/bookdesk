import { connect } from 'react-redux';
import { deriveBookVotes, deriveUpdatingVoteForBook, getBookValuesUpdatingStatus, getBookToUpdate } from '~redux/selectors/books';
import { updateBookVotes, setBookToUpdate, setBookValuesToUpdate, showModal } from '~redux/actions/booksActions';
import { DATE_UPDATER } from '~constants/modalTypes';
import BookItem from './BookItem';

const mapStateToProps = (state, ownProps) => ({
  bookWithVote: deriveBookVotes(ownProps.bookItem.bookId)(state),
  updatingVoteForBook: deriveUpdatingVoteForBook(ownProps.bookItem.bookId)(state),
  bookValuesUpdatingStatus: getBookValuesUpdatingStatus(state),
  bookIdToUpdateAddedDate: getBookToUpdate(state)?.bookId,
});

const mapDispatchToProps = (dispatch) => ({
  updateBookVotes: ({ bookId, shouldAdd, bookStatus }) => dispatch(updateBookVotes({ bookId, shouldAdd, bookStatus })),
  setBookToUpdate: (bookId, bookStatus) => dispatch(setBookToUpdate(bookId, bookStatus)),
  setBookValuesToUpdate: (added) => dispatch(setBookValuesToUpdate(added)),
  showDateUpdater: () => dispatch(showModal(DATE_UPDATER)),
});

export default connect(mapStateToProps, mapDispatchToProps)(BookItem);
