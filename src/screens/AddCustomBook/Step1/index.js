import { connect } from 'react-redux';
import { getNewCustomBookName, deriveSuggestBooksData, getSuggestedBooksLoadingStatus, deriveIsValidStep1 } from '~redux/selectors/customBook';
import { setCurrentStep, setAvailableStep, setNewCustomBookName, loadSuggestedBooks, clearStep2, clearStep3 } from '~redux/actions/customBookActions';
import Step1 from './Step1';

const mapStateToProps = (state) => ({
  bookName: getNewCustomBookName(state),
  suggestedBooks: deriveSuggestBooksData(state),
  loadingDataStatus: getSuggestedBooksLoadingStatus(state),
  allowsNextAction: deriveIsValidStep1(state),
});

const mapDispatchToProps = (dispatch) => ({
  onPressNext: () => {
    dispatch(setCurrentStep(2));
    dispatch(setAvailableStep(2));
  },
  setAvailableStep: (step) => dispatch(setAvailableStep(step)),
  setBookName: (name, error) => dispatch(setNewCustomBookName(name, error)),
  loadSuggestedBooks: (bookName) => dispatch(loadSuggestedBooks(bookName)),
  clearSteps: () => {
    dispatch(clearStep2);
    dispatch(clearStep3);
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Step1);
