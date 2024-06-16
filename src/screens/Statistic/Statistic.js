import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { BarChart, LineChart, PieChart, PopulationPyramid, LineChartBicolor } from 'react-native-gifted-charts';

const Statistic = ({ loadStat }) => {
  const [stat, setStat] = useState([]);
  const [maxValue, setMaxValue] = useState(100);

  useEffect(() => {
    async function fetchData() {
      // You can await here
      const data = await loadStat();
      console.log(data, 'data');
      setStat(data?.data);
      setMaxValue(data?.maxValue);
      // ...
    }
    fetchData();
  }, []);

  const component = (item) => {
    return (
      <View style={{ backgroundColor: '#b1d4e0', paddingHorizontal: 3, paddingVertical: 1, borderRadius: 5 }}>
        <Text style={{ color: '#09172a', fontSize: 15, fontWeight: 600 }}>{item}</Text>
      </View>
    );
  };

  const ptData = [
    { value: 160, date: '1 Apr 2022' },
    { value: 180, date: '2 Apr 2022' },
    { value: 190, date: '3 Apr 2022' },
    { value: 180, date: '4 Apr 2022' },
    { value: 140, date: '5 Apr 2022' },
    { value: 145, date: '6 Apr 2022' },
    { value: 160, date: '7 Apr 2022' },
    { value: 200, date: '8 Apr 2022' },

    { value: 220, date: '9 Apr 2022' },
    {
      value: 240,
      date: '10 Apr 2022',
      label: '10 Apr',
      labelTextStyle: { color: 'lightgray', width: 60 },
    },
    { value: 280, date: '11 Apr 2022' },
    { value: 260, date: '12 Apr 2022' },
    { value: 340, date: '13 Apr 2022' },
    { value: 385, date: '14 Apr 2022' },
    { value: 280, date: '15 Apr 2022' },
    { value: 390, date: '16 Apr 2022' },

    { value: 370, date: '17 Apr 2022' },
    { value: 285, date: '18 Apr 2022' },
    { value: 295, date: '19 Apr 2022' },
    {
      value: 300,
      date: '20 Apr 2022',
      label: '20 Apr',
      labelTextStyle: { color: 'lightgray', width: 60 },
    },
    { value: 280, date: '21 Apr 2022' },
    { value: 295, date: '22 Apr 2022' },
    { value: 260, date: '23 Apr 2022' },
    { value: 255, date: '24 Apr 2022' },

    { value: 190, date: '25 Apr 2022' },
    { value: 220, date: '26 Apr 2022' },
    { value: 205, date: '27 Apr 2022' },
    { value: 230, date: '28 Apr 2022' },
    { value: 210, date: '29 Apr 2022' },
    {
      value: 200,
      date: '30 Apr 2022',
      label: '30 Apr',
      labelTextStyle: { color: 'lightgray', width: 60 },
    },
    { value: 240, date: '1 May 2022' },
    { value: 250, date: '2 May 2022' },
    { value: 280, date: '3 May 2022' },
    { value: 250, date: '4 May 2022' },
    { value: 210, date: '5 May 2022' },
    { value: 240, date: '1 May 2022' },
    { value: 250, date: '2 May 2022' },
    { value: 280, date: '3 May 2022' },
    { value: 250, date: '4 May 2022' },
    { value: 210, date: '5 May 2022' },
    { value: 240, date: '1 May 2022' },
    { value: 250, date: '2 May 2022' },
    { value: 280, date: '3 May 2022' },
    { value: 250, date: '4 May 2022' },
    { value: 210, date: '5 May 2022' },
    { value: 240, date: '1 May 2022' },
    { value: 250, date: '2 May 2022' },
    { value: 280, date: '3 May 2022' },
    { value: 250, date: '4 May 2022' },
    { value: 210, date: '5 May 2022' },
    { value: 240, date: '1 May 2022' },
    { value: 250, date: '2 May 2022' },
    { value: 280, date: '3 May 2022' },
    { value: 250, date: '4 May 2022' },
    { value: 210, date: '5 May 2022' },
    { value: 240, date: '1 May 2022' },
    { value: 250, date: '2 May 2022' },
    { value: 280, date: '3 May 2022' },
    { value: 250, date: '4 May 2022' },
    { value: 210, date: '5 May 2022' },
    { value: 240, date: '1 May 2022' },
    { value: 250, date: '2 May 2022' },
    { value: 280, date: '3 May 2022' },
    { value: 250, date: '4 May 2022' },
    { value: 210, date: '5 May 2022' },
    { value: 240, date: '1 May 2022' },
    { value: 250, date: '2 May 2022' },
    { value: 280, date: '3 May 2022' },
    { value: 250, date: '4 May 2022' },
    { value: 210, date: '5 May 2022' },
    { value: 240, date: '1 May 2022' },
    { value: 250, date: '2 May 2022' },
    { value: 280, date: '3 May 2022' },
    { value: 250, date: '4 May 2022' },
    { value: 210, date: '5 May 2022' },
    { value: 240, date: '1 May 2022' },
    { value: 250, date: '2 May 2022' },
    { value: 280, date: '3 May 2022' },
    { value: 250, date: '4 May 2022' },
    { value: 210, date: '5 May 2022' },
    { value: 240, date: '1 May 2022' },
    { value: 250, date: '2 May 2022' },
    { value: 280, date: '3 May 2022' },
    { value: 250, date: '4 May 2022' },
    { value: 210, date: '5 May 2022' },
    { value: 240, date: '1 May 2022' },
    { value: 250, date: '2 May 2022' },
    { value: 280, date: '3 May 2022' },
    { value: 250, date: '4 May 2022' },
    { value: 210, date: '5 May 2022' },
    { value: 240, date: '1 May 2022' },
    { value: 250, date: '2 May 2022' },
    { value: 280, date: '3 May 2022' },
    { value: 250, date: '4 May 2022' },
    { value: 210, date: '5 May 2022' },
    { value: 240, date: '1 May 2022' },
    {
      value: 200,
      date: '20 May 2024',
      label: '20 May',
      labelTextStyle: { color: 'lightgray', width: 60 },
    },
    { value: 250, date: '2 May 2022' },
    { value: 280, date: '3 May 2022' },
    { value: 250, date: '4 May 2022' },
    { value: 210, date: '5 May 2022' },
    { value: 240, date: '1 May 2022' },
    { value: 250, date: '2 May 2022' },
    { value: 280, date: '3 May 2022' },
    { value: 250, date: '4 May 2022' },
    { value: 210, date: '5 May 2022' },
    { value: 240, date: '1 May 2022' },
    { value: 250, date: '2 May 2022' },
    { value: 280, date: '3 May 2022' },
    { value: 250, date: '4 May 2022' },
    {
      value: 200,
      label: '2023',
    },
    {
      value: 210,
      label: 'Янв.',
      dataPointLabelComponent: () => component(210),
    },
    { value: 400, label: 'Фев.', dataPointLabelComponent: () => component(400) },
    { value: 0, label: 'Март', dataPointLabelComponent: () => component(0) },
    { value: 280, label: 'Апр.', dataPointLabelComponent: () => component(280) },
    { value: 250, label: 'Май' },
    { value: 0, label: 'Июнь' },
    { value: 240, label: 'Июль' },
    { value: 250, label: 'Авг.' },
    { value: 280, label: 'Сент.' },
    { value: 0, label: 'Окт.' },
    { value: 210, label: 'Нояб.' },
    { value: 210, label: 'Дек.' },
    {
      value: 200,
      date: '2024',
      label: '2024',
    },
  ];

  const barData1 = [
    { value: 250, label: 'Янв.' },
    { value: 500, label: 'Фев.', frontColor: '#1bb572' },
    { value: 745, label: 'W', frontColor: '#1bb572' },
    { value: 320, label: 'T' },
    { value: 600, label: 'Янв.', frontColor: '#1bb572', topLabelComponent: () => component(600) },
    { value: 256, label: 'Фев.' },
    { value: 300, label: 'Март' },
    { value: 600, label: 'Апр.', frontColor: '#1bb572' },
    { value: 256, label: 'Май' },
    { value: 300, label: 'Июнь' },
    { value: 600, label: 'Июль', frontColor: '#1bb572' },
    { value: 256, label: 'Авг.' },
    { value: 300, label: 'Сент.' },
    { value: 600, label: 'Окт.', frontColor: '#1bb572' },
    { value: 256, label: 'Нояб.' },
    { value: 300, label: 'Дек.' },
  ];

  return (
    <>
      <View
        style={{
          paddingVertical: 100,
          backgroundColor: '#09172a',
        }}
      >
        <LineChart
          areaChart
          data={stat}
          scrollToEnd
          color='#1bb572'
          textColor='#b1d4e0'
          textFontSize={15}
          thickness={2}
          startFillColor='#1bb572'
          endFillColor='#485567'
          startOpacity={0.9}
          textShiftY={-40}
          xAxisLabelTextStyle={{ color: '#b1d4e0', width: 60 }}
          dataPointsHeight={20}
          dataPointsWidth={30}
          endOpacity={0.2}
          // add 70 to max value from array
          maxValue={maxValue}
          noOfSections={3}
          dataPointsRadius={5}
          dataPointsColor='#1bb572'
          yAxisColor='#1bb572'
          yAxisThickness={0}
          showVerticalLines
          verticalLinesUptoDataPoint
          verticallinesThickness={2}
          yAxisTextStyle={{ color: '#b1d4e0' }}
          yAxisTextNumberOfLines={2}
          xAxisColor='#b1d4e0'
        />
      </View>
      <View style={{ paddingVertical: 30, backgroundColor: '#09172a' }}>
        <BarChart
          barWidth={42}
          noOfSections={3}
          scrollToEnd
          barBorderRadius={4}
          frontColor='#b1d4e0'
          color='#1bb572'
          yAxisTextStyle={{ color: '#b1d4e0' }}
          xAxisTextStyle={{ color: '#b1d4e0' }}
          xAxisColor='#b1d4e0'
          xAxisLabelTextStyle={{ color: '#b1d4e0' }}
          data={barData1}
          yAxisThickness={0}
          xAxisThickness={0}
          showVerticalLines
        />
      </View>
    </>
  );
};

export default Statistic;
