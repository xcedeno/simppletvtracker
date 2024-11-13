import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const RechargeScreen = () => {
    return (
        <View style={styles.container}>
        <Text style={styles.text}>Recargar Cuenta</Text>
        </View>
    );
    };

    const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 20,
        fontWeight: 'bold',
    },
});

export default RechargeScreen;
