import { connect } from 'react-redux';
import { getSelectedCategoryLabel, getStatus, getPages, getAuthorsList, getAnnotation, deriveIsValidFullForm } from '~redux/selectors/customBook';
import { showModal } from '~redux/actions/booksActions';
import {
  setPages,
  addAuthor,
  removeAuthor,
  updateAuthor,
  setAnnotation,
  setCurrentStep,
  setAvailableStep,
  addCustomBook,
} from '~redux/actions/customBookActions';
import { CUSTOM_BOOK_CATEGORY, CUSTOM_BOOK_STATUS } from '~constants/modalTypes';
import Step3 from './Step3';

const mapStateToProps = (state) => ({
  selectedCategoryLabel: getSelectedCategoryLabel(state),
  status: getStatus(state),
  pages: getPages(state),
  authorsList: getAuthorsList(state),
  annotation: getAnnotation(state),
  isValidForm: deriveIsValidFullForm(state),
});

const mapDispatchToProps = (dispatch) => ({
  onPressBack: () => dispatch(setCurrentStep(2)),
  setAvailableStep: (step) => dispatch(setAvailableStep(step)),
  showCategoryChooser: () => dispatch(showModal(CUSTOM_BOOK_CATEGORY)),
  showCustomBookStatusChooser: () => dispatch(showModal(CUSTOM_BOOK_STATUS)),
  setPages: (pages, error) => dispatch(setPages(pages, error)),
  addAuthor: (id) => dispatch(addAuthor(id)),
  removeAuthor: (id) => dispatch(removeAuthor(id)),
  updateAuthor: (id, name, error) => dispatch(updateAuthor(id, name, error)),
  setAnnotation: (annotation, error) => dispatch(setAnnotation(annotation, error)),
  addCustomBook: () => dispatch(addCustomBook()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Step3);
