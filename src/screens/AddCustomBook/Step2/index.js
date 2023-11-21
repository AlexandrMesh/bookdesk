import { connect } from 'react-redux';
import {
  getShouldAddCover,
  deriveAllowsNextActionInTheStep2,
  getNewCustomBookName,
  getSuggestedCoversLoadingDataStatus,
  getSuggestedCoversData,
  getSelectedCover,
} from '~redux/selectors/customBook';
import { setShouldAddCover, loadSuggestedCovers, selectCover } from '~redux/actions/customBookActions';
import Step2 from './Step2';

const mapStateToProps = (state) => ({
  shouldAddCover: getShouldAddCover(state),
  allowsNextActionInTheStep2: deriveAllowsNextActionInTheStep2(state),
  bookName: getNewCustomBookName(state),
  loadingDataStatus: getSuggestedCoversLoadingDataStatus(state),
  suggestedCoversData: getSuggestedCoversData(state),
  selectedCover: getSelectedCover(state),
});

const mapDispatchToProps = (dispatch) => ({
  setShouldAddCover: (add) => dispatch(setShouldAddCover(add)),
  loadSuggestedCovers: () => dispatch(loadSuggestedCovers()),
  selectCover: (cover) => dispatch(selectCover(cover)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Step2);
