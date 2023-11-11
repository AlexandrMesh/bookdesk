import React from 'react';
import BookStatusModal from '~screens/Modals/Modals/BookStatusModal';
import FilteringModal from '~screens/Modals/Modals/FilteringModal';
import LanguageSettings from '~screens/Modals/Modals/LanguageSettings';

const Modals = () => {
  return (
    <>
      <BookStatusModal />
      <FilteringModal />
      <LanguageSettings />
    </>
  );
};

Modals.propTypes = {};

export default Modals;
