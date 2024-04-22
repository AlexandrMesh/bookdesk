import { connect } from 'react-redux';
import { getAvailableStep, getCurrentStep, getAddedCustomBook, getSavingCustomBookStatus, getStatus } from '~redux/selectors/customBook';
import { setCurrentStep, clearAddCustomBookState } from '~redux/actions/customBookActions';
import AddCustomBook from './AddCustomBook';

const mapStateToProps = (state) => ({
  availableStep: getAvailableStep(state),
  currentStep: getCurrentStep(state),
  addedCustomBook: getAddedCustomBook(state),
  savingCustomBookStatus: getSavingCustomBookStatus(state),
  customBookStatus: getStatus(state),
});

const mapDispatchToProps = (dispatch) => ({
  setCurrentStep: (step) => dispatch(setCurrentStep(step)),
  clearAddCustomBookState: () => dispatch(clearAddCustomBookState),
});

export default connect(mapStateToProps, mapDispatchToProps)(AddCustomBook);
