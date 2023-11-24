import React from 'react';
import BookStatusModal from '~screens/Modals/Modals/BookStatusModal';
import FilteringModal from '~screens/Modals/Modals/FilteringModal';
import LanguageSettings from '~screens/Modals/Modals/LanguageSettings';
import CustomBookCategoryModal from '~screens/Modals/Modals/CustomBookCategoryModal';
import CustomBookStatusModal from '~screens/Modals/Modals/BookStatusModal/CustomBookStatusModal';

const Modals = () => {
  return (
    <>
      <BookStatusModal />
      <FilteringModal />
      <LanguageSettings />
      <CustomBookCategoryModal />
      <CustomBookStatusModal />
    </>
  );
};

Modals.propTypes = {};

export default Modals;
