import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, Modal, TextInput, Button, ScrollView } from 'react-native';
import moment from 'moment';
import { supabase } from './db/SupabaseClient';
import * as Notifications from 'expo-notifications';
import SubscriptionForm from './forms/SubscriptionForm';
import SubscriptionList from './lists/SubscriptionList';
import TimeRemainingChart from './components/TimeRemainingCharts';
import useSubscription from './hooks/useSubscription';


const SubscriptionDashboard = () => {
    const [subscriptions, setSubscriptions] = useState([]);
    const [email, setEmail] = useState('');
    const [alias, setAlias] = useState('');
    const [balance, setBalance] = useState('');
    const [rechargeDate, setRechargeDate] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [rechargeAmount, setRechargeAmount] = useState('');
    const [selectedSubscriptionId, setSelectedSubscriptionId] = useState(null);
    const { 
        addSubscription,
        fetchSubscriptions,
        deleteSubscription,
        editSubscription,
        rechargeSubscription,
        } = useSubscription();

    useEffect(() => {
        fetchSubscriptions();
        checkDatabaseConnection();
    }, []);

    const checkDatabaseConnection = async () => {
        const { error } = await supabase.from('suscriptions').select('*').limit(1);
        if (error) {
            console.log('Error de conexión a la base de datos:', error);
            Alert.alert('Error de Conexión', 'No se pudo conectar a la base de datos.');
        } else {
            console.log('Conexión exitosa a la base de datos');
        }
    };

    const openRechargeModal = (id) => {
        setSelectedSubscriptionId(id);
        setIsModalVisible(true);
    };

    const handleAddSubscription = async () => {
        await addSubscription(email, alias, balance, rechargeDate);
        fetchSubscriptions(); // Vuelve a cargar las suscripciones después de agregar una nueva
        clearForm(); // Limpia los campos del formulario después de agregar
    };

    


    
    
    

    const clearForm = () => {
        setEmail('');
        setAlias('');
        setBalance('');
        setRechargeDate('');
    };


    return (
        <div style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
            <Text style={styles.title}>Cuentas de Suscripción</Text>
            
            <SubscriptionForm
                email={email}
                setEmail={setEmail}
                alias={alias}
                setAlias={setAlias}
                balance={balance}
                setBalance={setBalance}
                rechargeDate={rechargeDate}
                setRechargeDate={setRechargeDate}
                addSubscription={handleAddSubscription}

/>
            <ScrollView style={styles.subscriptionsContainer}>
                <SubscriptionList
                    subscriptions={subscriptions}
                    editSubscription={openRechargeModal}
                    deleteSubscription={deleteSubscription}
                />

                {subscriptions.map((sub) => (
                    <View key={sub.id} style={styles.item}>
                        <Text style={styles.alias}>{sub.alias}</Text>
                        <Text>Días Restantes: {sub.remaining_days} días {sub.remaining_days > 3 ? '✅' : '❌'}</Text>
                        <TimeRemainingChart remainingDays={sub.remaining_days} />
                    </View>
                ))}
            </ScrollView>

            <Modal
                visible={isModalVisible}
                transparent={true}
                animationType="slide"
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Agregar Saldo</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Monto de recarga"
                        keyboardType="numeric"
                        value={rechargeAmount}
                        onChangeText={setRechargeAmount}
                    />
                    <View style={styles.buttonContainer}>
                        <Button title="Confirmar" onPress={rechargeSubscription} />
                        <Button title="Cancelar" onPress={() => setIsModalVisible(false)} />
                    </View>
                </View>
                </View>
            </Modal>
        </ScrollView>
        </div>
    );
};

const styles = StyleSheet.create({
    container: { 
        flexGrow: 1,
    padding: 20,
    paddingBottom: 50,
    height: '90vh',
    overflowY: 'scroll',
    },
    scrollViewContent: { 
        flexGrow: 1,
        padding: 20,
        paddingBottom: 50,
    },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
    alias: { fontSize: 18, fontWeight: '600' },
    item: { padding: 15, backgroundColor: '#f9f9f9', marginBottom: 10, borderRadius: 5 },

    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    modalContent: {
        width: '80%', // Adjust based on preference
        maxWidth: 300, // Limit width for larger screens
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5, // Adds shadow effect on Android
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    input: {
        width: '100%',
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 15,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '75%',
    },
});

export default SubscriptionDashboard;
