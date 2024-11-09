// TimeRemainingChart.js
import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

const TimeRemainingChart = ({ remainingDays }) => {
    // Set up the color based on remaining days
    const barColor =
        remainingDays > 3 ? `rgba(34, 197, 94, 1)` : // Green if more than 3 days
        remainingDays > 1 ? `rgba(234, 179, 8, 1)` : // Yellow if 1 to 3 days
        `rgba(220, 38, 38, 1)`; // Red if 1 day or less

    // Chart data configuration
    const data = {
        labels: ['Tiempo Restante'],
        datasets: [
            {
                data: [remainingDays],
            },
        ],
    };

    return (
        <View style={{ paddingHorizontal: 20 }}>
            <Text style={{ textAlign: 'center', fontSize: 16, marginBottom: 10 }}>
                Días Restantes: {remainingDays}
            </Text>
            <BarChart
                data={data}
                width={screenWidth - 150} // Adjusts to the screen width
                height={220}
                fromZero
                yAxisSuffix=" días"
                yAxisInterval={1}
                chartConfig={{
                    backgroundColor: '#1cc910',
                    backgroundGradientFrom: '#eff3ff',
                    backgroundGradientTo: '#efefef',
                    decimalPlaces: 0,
                    color: () => barColor, // Use calculated color based on remaining days
                    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    propsForBackgroundLines: {
                        strokeDasharray: "", // Removes dashed lines
                    },
                }}
                style={{
                    marginVertical: 8,
                    borderRadius: 16,
                }}
                verticalLabelRotation={0}
                yAxisLabel=""
                // Display labels at intervals for better readability
                withInnerLines={true}
                 // Start from zero for clarity
            />
        </View>
    );
};

export default TimeRemainingChart;
