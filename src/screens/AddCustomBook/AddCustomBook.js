import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { func } from 'prop-types';
import Stepper from '~UI/Stepper';
import Step1 from './Step1';
import styles from './styles';

const AddCustomBook = ({ completeStep }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [availableStep, setAvailableStep] = useState(1);

  // const handleClear = () => {
  //   clearSearchText();
  //   clearSearchResults();
  // };

  const steps = [
    {
      step: 1,
      component: (
        <Step1
          setAvailableStep={setAvailableStep}
          onPressNext={() => {
            completeStep(1);
            setCurrentStep(2);
            setAvailableStep(2);
          }}
        />
      ),
    },
    {
      step: 2,
      component: <Text style={styles.title}>Добавить книгу 2</Text>,
    },
    {
      step: 3,
      component: (
        <Text
          style={styles.title}
          onPress={() => {
            setCurrentStep(4);
            setAvailableStep(4);
          }}
        >
          Добавить книгу 3
        </Text>
      ),
    },
    {
      step: 4,
      component: <Text style={styles.title}>Добавить книгу 4</Text>,
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Добавить книгу</Text>
      </View>
      <Stepper
        steps={steps}
        lastAvailableStep={availableStep}
        currentStep={currentStep}
        onStepPress={(value) => {
          completeStep(currentStep);
          setCurrentStep(value);
        }}
      />
    </View>
  );
};

AddCustomBook.propTypes = {
  completeStep: func.isRequired,
};

export default AddCustomBook;
