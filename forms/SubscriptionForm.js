import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';


const SubscriptionForm = ({
    email, setEmail,
    alias, setAlias,
    balance, setBalance,
    rechargeDate, setRechargeDate,
    addSubscription,
}) => {
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const handleAddSubscription = () => {
        if (!email) {
            console.log('Error', 'El campo de correo electrónico está vacío.');
            return;
        }
        if (!alias) {
            console.log('Error', 'El campo de alias está vacío.');
            return;
        }
        if (!balance) {
            console.log('Error', 'El campo de saldo está vacío.');
            return;
        }
        if (!rechargeDate) {
        console.log('Error', 'El campo de fecha de recarga está vacío.');
            return;
        }

        // Call addSubscription with form data
        addSubscription(email, alias, balance, rechargeDate);
    };

    


    return (
        <View>
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

                <Button title="Agregar Suscripción" onPress={handleAddSubscription} />
            
            </View>
                    );
                };

const styles = StyleSheet.create({
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 10,
        paddingLeft: 8,
        borderRadius: 8,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: 300,
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 8,
        alignItems: 'center',
    },
    modalText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    modalButton: {
        backgroundColor: '#007bff',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    modalButtonText: {
        color: '#fff',
        fontSize: 16,
    },
});

export default SubscriptionForm;
