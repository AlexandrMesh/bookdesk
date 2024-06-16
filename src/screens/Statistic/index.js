import { connect } from 'react-redux';
import { loadStat } from '~redux/actions/statisticActions';
import { IN_PROGRESS } from '~constants/boardType';
import Statistic from './Statistic';

const mapStateToProps = () => ({});

const mapDispatchToProps = (dispatch) => ({
  loadStat: () => dispatch(loadStat(IN_PROGRESS)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Statistic);
