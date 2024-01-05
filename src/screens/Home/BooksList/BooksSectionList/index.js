import { connect } from 'react-redux';
import { showModal, selectBook } from '~redux/actions/booksActions';
import BooksSectionList from './BooksSectionList';

const mapDispatchToProps = (dispatch) => ({
  showModal: (modal) => dispatch(showModal(modal)),
  selectBook: (book) => dispatch(selectBook(book)),
});

export default connect(null, mapDispatchToProps)(BooksSectionList);
