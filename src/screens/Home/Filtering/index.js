import { connect } from 'react-redux';
import {
  getActiveModal,
  deriveCategories,
  deriveEditableIndeterminatedCategories,
  getBoardType,
  deriveBookListEditableFilterParams,
  deriveCategorySearchQuery,
  deriveCategoriesSearchResult,
} from '~redux/selectors/books';
import {
  triggerReloadBookList,
  toggleExpandedCategory,
  manageFilters,
  clearFilters,
  populateFilters,
  hideModal,
  resetCategories,
  searchCategory,
  clearSearchQueryForCategory,
} from '~redux/actions/booksActions';
import { ALL } from '~constants/boardType';
import Filtering from './Filtering';

const mapStateToProps = (state) => ({
  isVisible: getActiveModal(state) === 'filtering',
  boardType: getBoardType(state),
  categories: deriveCategories(ALL)(state),
  indeterminatedCategories: deriveEditableIndeterminatedCategories(ALL)(state),
  filterParams: deriveBookListEditableFilterParams(ALL)(state),
  searchQuery: deriveCategorySearchQuery(ALL)(state),
  categoriesSearchResult: deriveCategoriesSearchResult(ALL)(state),
});

const mapDispatchToProps = (dispatch) => ({
  manageFilters: (path, boardType, categoryPaths) => dispatch(manageFilters(path, boardType, categoryPaths)),
  applyFilters: (boardType) => {
    dispatch(populateFilters(boardType));
    dispatch(triggerReloadBookList(boardType));
  },
  toggleExpandedCategory: (path, boardType) => dispatch(toggleExpandedCategory(path, boardType)),
  clearFilters: (boardType) => dispatch(clearFilters(boardType)),
  onClose: () => {
    dispatch(hideModal);
    dispatch(resetCategories(ALL));
  },
  searchCategory: (query) => dispatch(searchCategory(ALL, query)),
  clearSearchQueryForCategory: () => dispatch(clearSearchQueryForCategory(ALL)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Filtering);
