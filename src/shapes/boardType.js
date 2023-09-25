import { oneOf } from 'prop-types';
import { ALL, PLANNED, IN_PROGRESS, COMPLETED } from '~constants/boardType';

export default oneOf([ALL, PLANNED, IN_PROGRESS, COMPLETED]);
