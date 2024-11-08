import React, { useEffect, useState } from 'react';
import { View, Text,StyleSheet } from 'react-native';
import moment from 'moment';
import { supabase } from './db/SupabaseClient';
import * as Notifications from 'expo-notifications';
import SubscriptionForm from './forms/SubscriptionForm';
import SubscriptionList from './lists/SubscriptionList';
const SubscriptionDashboard = () => {
    const [subscriptions, setSubscriptions] = useState([]);
    const [email, setEmail] = useState('');
    const [alias, setAlias] = useState('');
    const [balance, setBalance] = useState('');
    const [rate, setRate] = useState('');
    const [rechargeDate, setRechargeDate] = useState('');

    useEffect(() => {
        fetchSubscriptions();
        checkDatabaseConnection(); // Verificar la conexión al cargar el componente
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

    const fetchSubscriptions = async () => {
        const { data, error } = await supabase.from('suscriptions').select('*');
        if (error) {
            console.log('Error fetching data:', error);
        } else {
            const updatedData = data.map(sub => {
                const daysLeft = moment(sub.recharge_date).add(30, 'days').diff(moment(), 'days');
                if (daysLeft <= 3) {
                    sendNotification(sub.alias, daysLeft);
                }
                return { ...sub, remaining_days: daysLeft };
            });
            setSubscriptions(updatedData);
        }
    };

    const sendNotification = async (alias, daysLeft) => {
        await Notifications.scheduleNotificationAsync({
            content: {
                title: '¡Suscripción Próxima a Vencer!',
                body: `La suscripción de ${alias} vence en ${daysLeft} días.`,
            },
            trigger: { seconds: 1 },
        });
    };

    const addSubscription = async () => {
        const { data, error } = await supabase
            .from('suscriptions')
            .insert([
                {
                    email,
                    alias,
                    balance: parseFloat(balance),
                    rate: parseFloat(rate),
                    recharge_date: rechargeDate,
                },
            ]);
        if (error) {
            console.log('Error inserting subscription:', error);
            Alert.alert('Error', 'Hubo un problema al agregar la suscripción.');
        } else {
            fetchSubscriptions(); // Refresh subscriptions list
            clearForm(); // Clear form fields after submission
            Alert.alert('Éxito', 'Los datos se agregaron a la base de datos exitosamente.');
        }
    };

    const clearForm = () => {
        setEmail('');
        setAlias('');
        setBalance('');
        setRate('');
        setRechargeDate('');
    };
    const deleteSubscription = async (id) => {
        const { data, error } = await supabase
            .from('suscriptions')
            .delete()
            .eq('id', id);

        if (error) {
            console.log('Error deleting subscription:', error);
        } else {
            fetchSubscriptions(); // Refresh subscriptions list after deletion
        }
    };

    const editSubscription = async (id) => {
        // Logica de edición: Aquí puedes modificar el estado y abrir un formulario de edición si deseas
        console.log('Edit suscription with id:', id);
        // Para propósitos de demostración, solo voy a hacer una simple actualización del balance:
        const { data, error } = await supabase
            .from('suscriptions')
            .update({ balance: 100 })
            .eq('id', id);

        if (error) {
            console.log('Error editing subscription:', error);
        } else {
            fetchSubscriptions(); // Refresh subscriptions list after editing
        }
    };
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Cuentas de Suscripción</Text>
            
            {/* Formulario para agregar nueva suscripción */}
            <SubscriptionForm 
                email={email} 
                setEmail={setEmail} 
                alias={alias} 
                setAlias={setAlias} 
                balance={balance} 
                setBalance={setBalance} 
                rate={rate} 
                setRate={setRate} 
                rechargeDate={rechargeDate} 
                setRechargeDate={setRechargeDate} 
                addSubscription={addSubscription} 
            />
            <SubscriptionList 
                subscriptions={subscriptions} 
                editSubscription={editSubscription} 
                deleteSubscription={deleteSubscription}
                
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
    input: { height: 40, borderColor: '#ccc', borderWidth: 1, marginBottom: 10, paddingLeft: 8 },
    item: { padding: 15, backgroundColor: '#f9f9f9', marginBottom: 10, borderRadius: 5 },
});

export default SubscriptionDashboard;
