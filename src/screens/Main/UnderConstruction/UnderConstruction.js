import React from 'react';
import { string } from 'prop-types';
import { ScrollView, Text } from 'react-native';
import styles from './styles';

const UnderConstruction = ({ underConstruction }) => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>{underConstruction}</Text>
    </ScrollView>
  );
};

UnderConstruction.propTypes = {
  underConstruction: string,
};

export default UnderConstruction;
