import { connect } from 'react-redux';
import {
  getNewCustomBookName,
  getSuggestedBooksData,
  getSuggestedBooksLoadingStatus,
  deriveAllowsNextActionInTheStep1,
  getBookExists,
  deriveIsStepCompleted,
} from '~redux/selectors/customBook';
import { setNewCustomBookName, loadSuggestedBooks, setBookExists, clearSuggestedBooks, removeCompletedStep } from '~redux/actions/customBookActions';
import Step1 from './Step1';

const mapStateToProps = (state) => ({
  bookName: getNewCustomBookName(state),
  suggestedBooks: getSuggestedBooksData(state),
  loadingDataStatus: getSuggestedBooksLoadingStatus(state),
  allowsNextAction: deriveAllowsNextActionInTheStep1(state),
  bookExists: getBookExists(state),
  isStepCompleted: deriveIsStepCompleted(1)(state),
});

const mapDispatchToProps = (dispatch) => ({
  setBookName: (name) => dispatch(setNewCustomBookName(name)),
  setBookExists: (value) => dispatch(setBookExists(value)),
  loadSuggestedBooks: () => dispatch(loadSuggestedBooks()),
  clearSuggestedBooks: () => dispatch(clearSuggestedBooks),
  removeCompletedStep: () => dispatch(removeCompletedStep(1)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Step1);
