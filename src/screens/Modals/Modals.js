import React from 'react';
import BookStatusModal from '~screens/Modals/Modals/BookStatusModal';
import FilteringModal from '~screens/Modals/Modals/FilteringModal';

const Modals = () => {
  return (
    <>
      <BookStatusModal />
      <FilteringModal />
    </>
  );
};

Modals.propTypes = {};

export default Modals;
