import { connect } from 'react-redux';
import {
  getActiveModal,
  deriveCategories,
  deriveEditableIndeterminatedCategories,
  getBoardType,
  deriveBookListEditableFilterParams,
} from '~redux/selectors/books';
import { triggerReloadBookList, toggleCollapsedCategory, manageFilters, clearFilters, populateFilters, hideModal } from '~redux/actions/booksActions';
import { ALL } from '~constants/boardType';
import Filtering from './Filtering';

const mapStateToProps = (state) => ({
  isVisible: getActiveModal(state) === 'filtering',
  boardType: getBoardType(state),
  categories: deriveCategories(ALL)(state),
  indeterminatedCategories: deriveEditableIndeterminatedCategories(ALL)(state),
  filterParams: deriveBookListEditableFilterParams(ALL)(state),
});

const mapDispatchToProps = (dispatch) => ({
  manageFilters: (path, boardType, categoryPaths) => dispatch(manageFilters(path, boardType, categoryPaths)),
  applyFilters: (boardType) => {
    dispatch(populateFilters(boardType));
    dispatch(triggerReloadBookList(boardType));
  },
  toggleCollapsedCategory: (path, boardType) => dispatch(toggleCollapsedCategory(path, boardType)),
  clearFilters: (boardType) => dispatch(clearFilters(boardType)),
  onClose: () => dispatch(hideModal),
});

export default connect(mapStateToProps, mapDispatchToProps)(Filtering);
