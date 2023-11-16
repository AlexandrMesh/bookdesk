import { connect } from 'react-redux';
import { getNewCustomBookName } from '~redux/selectors/customBook';
import { completeStep } from '~redux/actions/customBookActions';
import AddCustomBook from './AddCustomBook';

const mapStateToProps = (state) => ({
  bookName: getNewCustomBookName(state),
});

const mapDispatchToProps = (dispatch) => ({
  completeStep: (step) => dispatch(completeStep(step)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AddCustomBook);
