import { connect } from 'react-redux';
import { getActiveModal, deriveCategories } from '~redux/selectors/books';
import { hideModal } from '~redux/actions/booksActions';
import { toggleExpandedCategory, setSearchQuery, selectCategory, clearCategory, submitCategory } from '~redux/actions/customBookActions';
import { deriveCategoriesSearchResult, getCategorySearchQuery, getEditableSelectedCategoryPath } from '~redux/selectors/customBook';
import { CUSTOM_BOOK_CATEGORY } from '~constants/modalTypes';
import { ALL } from '~constants/boardType';
import CustomBookCategoryModal from './CustomBookCategoryModal';

const mapStateToProps = (state) => ({
  isVisible: getActiveModal(state) === CUSTOM_BOOK_CATEGORY,
  categories: deriveCategories(ALL, true)(state),
  searchQuery: getCategorySearchQuery(state),
  categoriesSearchResult: deriveCategoriesSearchResult(state),
  selectedCategoryPath: getEditableSelectedCategoryPath(state),
});

const mapDispatchToProps = (dispatch) => ({
  toggleExpandedCategory: (path) => dispatch(toggleExpandedCategory(path)),
  onClose: () => {
    dispatch(hideModal);
    dispatch(clearCategory);
  },
  selectCategory: (category) => dispatch(selectCategory(category)),
  setSearchQuery: (query) => dispatch(setSearchQuery(query)),
  clearSearchQueryForCategory: () => dispatch(setSearchQuery('')),
  submitCategory: () => dispatch(submitCategory),
});

export default connect(mapStateToProps, mapDispatchToProps)(CustomBookCategoryModal);
