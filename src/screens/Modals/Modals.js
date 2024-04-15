import React from 'react';
import BookStatusModal from '~screens/Modals/Modals/BookStatusModal';
import FilteringModal from '~screens/Modals/Modals/FilteringModal';
import LanguageSettings from '~screens/Modals/Modals/LanguageSettings';
import CustomBookCategoryModal from '~screens/Modals/Modals/CustomBookCategoryModal';
import CustomBookStatusModal from '~screens/Modals/Modals/BookStatusModal/CustomBookStatusModal';
import EditGoalModal from '~screens/Modals/Modals/EditGoalModal';

const Modals = () => {
  return (
    <>
      <BookStatusModal />
      <FilteringModal />
      <LanguageSettings />
      <CustomBookCategoryModal />
      <CustomBookStatusModal />
      <EditGoalModal />
    </>
  );
};

Modals.propTypes = {};

export default Modals;
