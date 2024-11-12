// components/Clock.js
import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import moment from 'moment';

const Clock = () => {
    const [currentTime, setCurrentTime] = useState(moment().format('DD-MM-YYYY HH:mm:ss'));

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(moment().format('DD-MM-YYYY HH:mm:ss'));
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <View style={styles.clockContainer}>
            <Text style={styles.clockText}>{currentTime}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    clockContainer: {
        padding: 10,
    },
    clockText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default Clock;
