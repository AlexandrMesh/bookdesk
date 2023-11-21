import { connect } from 'react-redux';
import { getActiveModal, deriveCategories, deriveCategorySearchQuery, deriveCategoriesSearchResult } from '~redux/selectors/books';
import { hideModal, searchCategory, clearSearchQueryForCategory } from '~redux/actions/booksActions';
import { toggleExpandedCategory } from '~redux/actions/customBookActions';
import { ALL } from '~constants/boardType';
import { CATEGORY_CHOOSER } from '~constants/modalTypes';
import CategoryChooserModal from './CategoryChooserModal';

const mapStateToProps = (state) => ({
  isVisible: getActiveModal(state) === CATEGORY_CHOOSER,
  categories: deriveCategories(ALL)(state),
  searchQuery: deriveCategorySearchQuery(ALL)(state),
  categoriesSearchResult: deriveCategoriesSearchResult(ALL)(state),
});

const mapDispatchToProps = (dispatch) => ({
  toggleExpandedCategory: (path) => dispatch(toggleExpandedCategory(path)),
  onClose: () => {
    dispatch(hideModal);
  },
  searchCategory: (query) => dispatch(searchCategory(ALL, query)),
  clearSearchQueryForCategory: () => dispatch(clearSearchQueryForCategory(ALL)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CategoryChooserModal);
