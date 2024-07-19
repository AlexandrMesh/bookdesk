import { connect } from 'react-redux';
import { getBookValuesUpdatingStatus, getBookToUpdate } from '~redux/selectors/books';
import { setBookToUpdate, setBookValuesToUpdate, showModal, updateUserBookRating } from '~redux/actions/booksActions';
import { DATE_UPDATER } from '~constants/modalTypes';
import BookItem from './BookItem';

const mapStateToProps = (state, ownProps) => ({
  bookValuesUpdatingStatus: getBookValuesUpdatingStatus(state),
  bookIdToUpdateAddedDate: getBookToUpdate(state)?.bookId,
});

const mapDispatchToProps = (dispatch) => ({
  setBookToUpdate: (bookId, bookStatus) => dispatch(setBookToUpdate(bookId, bookStatus)),
  setBookValuesToUpdate: (added) => dispatch(setBookValuesToUpdate(added)),
  showDateUpdater: () => dispatch(showModal(DATE_UPDATER)),
  updateUserBookRating: (params) => dispatch(updateUserBookRating(params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(BookItem);
