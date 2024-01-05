import { connect } from 'react-redux';
import { showModal, selectBook, triggerReloadBookList } from '~redux/actions/booksActions';
import BooksList from './BooksList';

const mapDispatchToProps = (dispatch) => ({
  showModal: (modal) => dispatch(showModal(modal)),
  selectBook: (book) => dispatch(selectBook(book)),
  triggerReloadBookList: (boardType, isPullRefresh) => dispatch(triggerReloadBookList(boardType, isPullRefresh)),
});

export default connect(null, mapDispatchToProps)(BooksList);
