import { connect } from 'react-redux';
import { getActiveModal } from '~redux/selectors/books';
import { clearDataForChangeLanguage, hideModal, triggerReloadBookList, loadCategories, clearSearchResults } from '~redux/actions/booksActions';
import { LANGUAGE_SETTINGS } from '~constants/modalTypes';
import { ALL, PLANNED, IN_PROGRESS, COMPLETED } from '~constants/boardType';
import LanguageSettings from './LanguageSettings';

const mapStateToProps = (state) => ({
  isVisible: getActiveModal(state) === LANGUAGE_SETTINGS,
});

const mapDispatchToProps = (dispatch) => ({
  hideModal: () => dispatch(hideModal),
  triggerReloadData: async () => {
    dispatch(clearDataForChangeLanguage);
    await dispatch(loadCategories(true));
    dispatch(triggerReloadBookList(ALL));
    dispatch(triggerReloadBookList(PLANNED));
    dispatch(triggerReloadBookList(IN_PROGRESS));
    dispatch(triggerReloadBookList(COMPLETED));
    dispatch(clearSearchResults);
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(LanguageSettings);
