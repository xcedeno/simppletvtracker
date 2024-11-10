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

                if (daysLeft <= 3) {
                    sendNotification(sub.alias, daysLeft);
                }
                
                return { ...sub, remaining_days: daysLeft };
            });
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
        const { data, error } = await supabase.from('suscriptions').select('balance').eq('id', id).single();
        if (error) {
            console.log('Error fetching balance:', error);
            return;
        }

        const updatedBalance = parseFloat(data.balance) + parseFloat(amount);
        const { updateError } = await supabase.from('suscriptions').update({
            balance: updatedBalance,
            recharge_date: new Date().toISOString(),
        }).eq('id', id);

        if (updateError) {
            console.log('Error updating subscription:', updateError);
        } else {
            fetchSubscriptions();
            setIsModalVisible(false);
            setRechargeAmount('');
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
