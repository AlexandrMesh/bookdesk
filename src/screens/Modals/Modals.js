import React from 'react';
import FilteringModal from '~screens/Modals/Modals/FilteringModal';
import LanguageSettings from '~screens/Modals/Modals/LanguageSettings';
import CustomBookCategoryModal from '~screens/Modals/Modals/CustomBookCategoryModal';
import CustomBookStatusModal from '~screens/Modals/Modals/BookStatusModal/CustomBookStatusModal';
import EditGoalModal from '~screens/Modals/Modals/EditGoalModal';
import SupportAppModal from '~screens/Modals/Modals/SupportAppModal';

const Modals = () => {
  return (
    <>
      <FilteringModal />
      <LanguageSettings />
      <CustomBookCategoryModal />
      <CustomBookStatusModal />
      <EditGoalModal />
      <SupportAppModal />
    </>
  );
};

Modals.propTypes = {};

export default Modals;
