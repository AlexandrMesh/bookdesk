import React, { Fragment } from 'react';
import { View, Pressable, Text } from 'react-native';
import { arrayOf, shape, number, func, element } from 'prop-types';
import styles from './styles';

const Stepper = ({ steps, currentStep, lastAvailableStep, onStepPress }) => {
  return (
    <>
      <View style={styles.stepper}>
        {steps.map(({ step }, index) => (
          <Fragment key={step}>
            <Pressable
              style={[styles.step, currentStep === step && styles.currentStep, step <= lastAvailableStep && styles.availableStep]}
              onPress={() => {
                if (step <= lastAvailableStep) {
                  onStepPress(step);
                }
              }}
            >
              <Text style={[styles.label, currentStep === step && styles.currentLabel, step <= lastAvailableStep && styles.availableLabel]}>
                {step}
              </Text>
            </Pressable>
            {steps.length > index + 1 && <View style={[styles.line, step < lastAvailableStep && styles.activeLine]} />}
          </Fragment>
        ))}
      </View>
      <View style={styles.component}>{steps.find(({ step }) => step === currentStep)?.component}</View>
    </>
  );
};

Stepper.propTypes = {
  steps: arrayOf(
    shape({
      step: number.isRequired,
      component: element.isRequired,
    }),
  ),
  onStepPress: func.isRequired,
  lastAvailableStep: number.isRequired,
  currentStep: number.isRequired,
};

export default Stepper;
