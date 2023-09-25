import { connect } from 'react-redux';
import { getUpdatingBookStatus } from '~redux/selectors/books';
import { updateUserBook, removeBook } from '~redux/actions/booksActions';
import BooksList from './BooksList';

const mapStateToProps = (state) => ({
  updatingBookStatus: getUpdatingBookStatus(state),
});

const mapDispatchToProps = (dispatch) => ({
  updateUserBook: (params) => dispatch(updateUserBook(params)),
  removeBook: (id, boardType) => dispatch(removeBook(id, boardType)),
});

export default connect(mapStateToProps, mapDispatchToProps)(BooksList);
