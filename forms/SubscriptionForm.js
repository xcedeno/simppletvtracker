// SubscriptionForm.js
import React from 'react';
import { TextInput, Button, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
const SubscriptionForm = ({ email, setEmail, alias, setAlias, balance, setBalance, rate, setRate, rechargeDate, setRechargeDate, addSubscription }) => {
    return (
        <React.Fragment>
            <TextInput
                style={styles.input}
                placeholder="Correo"
                value={email}
                onChangeText={setEmail}
            />
            <TextInput
                style={styles.input}
                placeholder="Alias"
                value={alias}
                onChangeText={setAlias}
            />
            <TextInput
                style={styles.input}
                placeholder="Saldo"
                keyboardType="numeric"
                value={balance}
                onChangeText={setBalance}
            />
            
            <TextInput
                style={styles.input}
                placeholder="Fecha de Recarga (YYYY-MM-DD)"
                value={rechargeDate}
                onChangeText={setRechargeDate}
            />
            <Button title="Agregar Suscripción" onPress={addSubscription} />
        </React.Fragment>
    );
};

const styles = StyleSheet.create({
    input: { height: 40, borderColor: '#ccc', borderWidth: 1, marginBottom: 10, paddingLeft: 8 },
});

export default SubscriptionForm;
