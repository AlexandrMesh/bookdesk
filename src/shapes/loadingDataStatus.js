import { oneOf } from 'prop-types';
import { IDLE, PENDING, SUCCEEDED, FAILED } from '~constants/loadingStatuses';

export default oneOf([IDLE, PENDING, SUCCEEDED, FAILED]);
