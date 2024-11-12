// hooks/useSubscription.js
import {Platform} from 'react-native';
import { useState, useEffect } from 'react';
import { supabase } from '../db/SupabaseClient';
import moment from 'moment';
import * as Notifications from 'expo-notifications';

const useSubscription = () => {
    const [subscriptions, setSubscriptions] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedSubscriptionId, setSelectedSubscriptionId] = useState(null);
    const [rechargeAmount, setRechargeAmount] = useState('');

    useEffect(() => {
        fetchSubscriptions();
    }, []);

    const fetchSubscriptions = async () => {
        const { data, error } = await supabase.from('suscriptions').select('*');
        if (error) {
            console.log('Error fetching data:', error);
        } else {
            const updatedData = data.map(sub => {
                const dailyCost = 0.98;
                const rechargeAmount = parseFloat(sub.balance);
                const lastRechargeDate = moment(sub.recharge_date);
                const today = moment();
                const daysSinceRecharge = today.diff(lastRechargeDate, 'days');
                const effectiveDays = Math.floor(rechargeAmount / dailyCost) - daysSinceRecharge;
                const daysLeft = Math.max(effectiveDays, 0);
    
                console.log(`Subscription: ${sub.alias}`);
                console.log(`Last Recharge: ${lastRechargeDate.format()}`);
                console.log(`Days Since Recharge: ${daysSinceRecharge}`);
                console.log(`Effective Days: ${effectiveDays}`);
                console.log(`Remaining Days: ${daysLeft}`);
    
                if (daysLeft <= 3) {
                    sendNotification(sub.alias, daysLeft);
                }
                
                return { ...sub, remaining_days: daysLeft };
            });
    
            console.log('Updated Data:', updatedData);
            setSubscriptions(updatedData);
        }
    };
    

    const sendNotification = async (alias, daysLeft) => {
        if (Platform.OS === 'ios' || Platform.OS === 'android') {
            await Notifications.scheduleNotificationAsync({
                content: {
                    title: '¡Suscripción Próxima a Vencer!',
                    body: `La suscripción de ${alias} vence en ${daysLeft} días.`,
                },
                trigger: { seconds: 1 },
            });
        } else {
            console.log(`Notification for ${alias}: ${daysLeft} days left.`);
        }
    };
    const addSubscription = async (email, alias, balance, recharge_date) => {
        const { data, error } = await supabase.from('suscriptions').insert([
            {
                email,
                alias,
                balance: parseFloat(balance),
                //rate: parseFloat(rate),
                recharge_date: recharge_date ? recharge_date : new Date().toISOString(),
            },
        ]);
        if (error) {
            console.log('Error inserting subscription:', error);
        } else {
            fetchSubscriptions();
            console.log('Suscripción agregada exitosamente');
        }
    };

    const deleteSubscription = async (id) => {
        const { error } = await supabase.from('suscriptions').delete().eq('id', id);
        if (error) {
            console.log('Error deleting subscription:', error);
        } else {
            fetchSubscriptions();
        }
    };

    const rechargeSubscription = async (id, amount) => {
    
    
        // Obtiene el balance actual de la suscripción
        const { data, error } = await supabase
            .from('suscriptions')
            .select('balance')
            .eq('id', id)
            .single(); // 'single' asegura que solo obtienes un registro
    
        if (error) {
            console.log('Error fetching balance:', error);
            return; // Si ocurre un error, se termina la función
        }
    
        if (!data) {
            console.log('Subscription not found with ID:', id);
            return; // Si no se encuentra la suscripción, se termina la función
        }
    
        console.log('Current balance:', data.balance);
    
        // Calcula el nuevo balance
        const updatedBalance = parseFloat(data.balance) + parsedAmount;
        console.log('Updated balance:', updatedBalance);
    
        // Actualiza la suscripción con el nuevo balance y la fecha de recarga
        const { error: updateError } = await supabase
            .from('suscriptions')
            .update({
                balance: updatedBalance,
                recharge_date: new Date().toISOString(), // Fecha actual en formato ISO
            })
            .eq('id', id);
    
        if (updateError) {
            console.log('Error updating subscription:', updateError);
        } else {
            // Refresca la lista de suscripciones y restablece los valores del modal
            fetchSubscriptions();
            setIsModalVisible(false); // Oculta el modal de recarga
            setRechargeAmount(''); // Restablece el monto de recarga
        }
    };
    
    

    return {
        subscriptions,
        isModalVisible,
        setIsModalVisible,
        selectedSubscriptionId,
        setSelectedSubscriptionId,
        rechargeAmount,
        setRechargeAmount,
        addSubscription,
        deleteSubscription,
        rechargeSubscription,
        fetchSubscriptions,
    };
};

export default useSubscription;
