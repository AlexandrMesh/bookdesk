import { connect } from 'react-redux';
import {
  getShouldAddCover,
  deriveIsValidStep2,
  getNewCustomBookName,
  getSuggestedCoversLoadingDataStatus,
  getSuggestedCoversData,
  getSelectedCover,
} from '~redux/selectors/customBook';
import { setShouldAddCover, loadSuggestedCovers, selectCover, setCurrentStep, setAvailableStep } from '~redux/actions/customBookActions';
import Step2 from './Step2';

const mapStateToProps = (state) => ({
  shouldAddCover: getShouldAddCover(state),
  allowsNextActionInTheStep2: deriveIsValidStep2(state),
  bookName: getNewCustomBookName(state),
  loadingDataStatus: getSuggestedCoversLoadingDataStatus(state),
  suggestedCoversData: getSuggestedCoversData(state),
  selectedCover: getSelectedCover(state),
});

const mapDispatchToProps = (dispatch) => ({
  onPressNext: () => {
    dispatch(setCurrentStep(3));
    dispatch(setAvailableStep(3));
  },
  onPressBack: () => dispatch(setCurrentStep(1)),
  setAvailableStep: (step) => dispatch(setAvailableStep(step)),
  setShouldAddCover: (add) => dispatch(setShouldAddCover(add)),
  loadSuggestedCovers: () => dispatch(loadSuggestedCovers()),
  selectCover: (cover) => dispatch(selectCover(cover)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Step2);
