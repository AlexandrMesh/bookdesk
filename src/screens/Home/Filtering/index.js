import { connect } from 'react-redux';
import { triggerReloadBookList, toggleCollapsedCategory, manageFilters, clearFilters, populateFilters } from '~redux/actions/booksActions';
import { deriveCategories, deriveEditableIndeterminatedCategories } from '~redux/selectors/books';
import { ALL } from '~constants/boardType';
import Filtering from './Filtering';

const mapStateToProps = (state) => ({
  categories: deriveCategories(ALL)(state),
  indeterminatedCategories: deriveEditableIndeterminatedCategories(ALL)(state),
});

const mapDispatchToProps = (dispatch) => ({
  manageFilters: (path, boardType, categoryPaths) => dispatch(manageFilters(path, boardType, categoryPaths)),
  applyFilters: (boardType) => {
    dispatch(populateFilters(boardType));
    dispatch(triggerReloadBookList(boardType));
  },
  toggleCollapsedCategory: (path, boardType) => dispatch(toggleCollapsedCategory(path, boardType)),
  clearFilters: (boardType) => dispatch(clearFilters(boardType)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Filtering);
