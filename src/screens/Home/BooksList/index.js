import { connect } from 'react-redux';
import { removeBook, showModal, selectBook, triggerReloadBookList } from '~redux/actions/booksActions';
import BooksList from './BooksList';

const mapDispatchToProps = (dispatch) => ({
  removeBook: (id, boardType) => dispatch(removeBook(id, boardType)),
  showModal: (modal) => dispatch(showModal(modal)),
  selectBook: (book) => dispatch(selectBook(book)),
  triggerReloadBookList: (boardType, isPullRefresh) => dispatch(triggerReloadBookList(boardType, isPullRefresh)),
});

export default connect(null, mapDispatchToProps)(BooksList);
