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
    
        const intervalId = setInterval(fetchSubscriptions, 24 * 60 * 60 * 1000); // cada 24 horas
        
        return () => clearInterval(intervalId);
    }, []);

    const fetchSubscriptions = async () => {
        const { data, error } = await supabase.from('suscriptions').select('*');
        if (error) {
            console.log('Error fetching data:', error);
        } else {
            const updatedData = await Promise.all(
                data.map(async (sub) => {
                    const dailyCost = 0.98;
                    const currentBalance = parseFloat(sub.balance);
                    const lastRechargeDate = moment(sub.recharge_date);
                    const lastDeductionDate = sub.last_deduction_date 
                        ? moment(sub.last_deduction_date) 
                        : null;
                    const today = moment();
                    console.log(`Verificando deducción para ${sub.alias}`);
                    console.log(`Last Deduction Date: ${lastDeductionDate}, Today: ${today}`);
                    // Verificar si es necesario realizar una deducción diaria
                    if (!lastDeductionDate || today.diff(lastDeductionDate, 'hours') >= 24) {
                        // Calcular los días desde la última deducción (o recarga si no hay deducción)
                        console.log('Es necesario realizar la deducción diaria');
                        const hoursSinceLastDeduction = lastDeductionDate 
                            ? today.diff(lastDeductionDate, 'hours') 
                            : today.diff(lastRechargeDate, 'hours');
                            const daysSinceLastDeduction = Math.floor(hoursSinceLastDeduction / 24);
    
                        // Calcular el nuevo balance después de la deducción
                        const balanceAfterDailyDeduction = currentBalance - (daysSinceLastDeduction * dailyCost);
                        const effectiveDays = Math.floor(balanceAfterDailyDeduction / dailyCost);
                        const daysLeft = Math.max(effectiveDays, 0);

                        
    
                        console.log(`Subscription: ${sub.alias}`);
                        console.log(`Days Since Last Deduction: ${daysSinceLastDeduction}`);
                        console.log(`Balance After Deduction: ${balanceAfterDailyDeduction}`);
                        console.log(`Remaining Days: ${daysLeft}`);
    
                        // Actualizar balance y fecha de última deducción en la base de datos
                        const { error: updateError } = await supabase
                            .from('suscriptions')
                            .update({
                                balance: Math.max(balanceAfterDailyDeduction, 0),
                                last_deduction_date: today.toISOString(), // Actualizar a la fecha de hoy
                            })
                            .eq('id', sub.id);
    
                        if (updateError) {
                            console.log(`Error updating balance for ${sub.alias}:`, updateError);
                        }
    
                        // Enviar notificación si quedan pocos días
                        if (daysLeft <= 3) {
                            sendNotification(sub.alias, daysLeft);
                        }
    
                        return { ...sub, balance: Math.max(balanceAfterDailyDeduction, 0), remaining_days: daysLeft, formattedCutoffDate: cutoffDate };
                    } else {
                        console.log('No se requiere deducción hoy');
                        // Si no se aplica deducción, calcula los días restantes según el balance actual
                        const effectiveDays = Math.floor(currentBalance / dailyCost);
                        return { ...sub, remaining_days: effectiveDays };
                    }
                })
            );
    
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

    const rechargeSubscription = async () => {
        if (!selectedSubscriptionId) {
            console.log('No subscription ID selected');
            return;  // Asegúrate de que haya un ID seleccionado
        }
    
        const { data, error } = await supabase
            .from('suscriptions')
            .select('balance')
            .eq('id', selectedSubscriptionId)
            .single();
    
        if (error) {
            console.log('Error fetching balance:', error);
            return;
        }
    
        // Si el balance se recupera correctamente, actualizamos el balance
        const updatedBalance = parseFloat(data.balance) + parseFloat(rechargeAmount);
    
        const { updateError } = await supabase
            .from('suscriptions')
            .update({
                balance: updatedBalance,
                recharge_date: new Date().toISOString(),
            })
            .eq('id', selectedSubscriptionId);
    
        if (updateError) {
            console.log('Error updating subscription:', updateError);
        } else {
            // Actualiza las suscripciones y cierra el modal
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
