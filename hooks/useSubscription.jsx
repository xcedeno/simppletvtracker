/* eslint-disable prettier/prettier */
import { Platform, AppState } from "react-native";
import { useState, useEffect } from "react";
import { supabase } from "../db/SupabaseClient";
import moment from "moment";
import * as Notifications from "expo-notifications";

const DAILY_COST = 0.98;

const useSubscription = () => {
const [subscriptions, setSubscriptions] = useState([]);
const [isModalVisible, setIsModalVisible] = useState(false);
const [selectedSubscriptionId, setSelectedSubscriptionId] = useState(null);
const [rechargeAmount, setRechargeAmount] = useState("");
const appState = useState(AppState.currentState);

useEffect(() => {
fetchSubscriptions();

// Listener para AppState
const subscription = AppState.addEventListener(
    "change",
    handleAppStateChange,
);

return () => subscription.remove();
// eslint-disable-next-line react-hooks/exhaustive-deps
}, []);

const handleAppStateChange = (nextAppState) => {
if (appState !== "active" && nextAppState === "active") {
    fetchSubscriptions();
}
};

const fetchSubscriptions = async () => {
try {
    const { data, error } = await supabase
    .from("suscriptions")
    .select("*");;
    
    if (error) throw error;
    

    const updatedData = await Promise.all(data.map(processSubscription));
    setSubscriptions(updatedData);
} catch (error) {
    console.log("Error fetching subscriptions:", error);
}
};

const processSubscription = async (sub) => {
const currentBalance = parseFloat(sub.balance);
const lastRechargeDate = moment(sub.recharge_date);
const lastDeductionDate = sub.last_deduction_date
    ? moment(sub.last_deduction_date)
    : null;
const today = moment();

// Determina si es necesario deducir
const shouldDeduct =
    !lastDeductionDate || today.diff(lastDeductionDate, "hours") >= 24;

if (shouldDeduct) {
    const daysSinceLastDeduction = lastDeductionDate
    ? today.diff(lastDeductionDate, "days")
    : today.diff(lastRechargeDate, "days");

    const balanceAfterDeduction =
    currentBalance - daysSinceLastDeduction * DAILY_COST;
    const effectiveDays = Math.floor(balanceAfterDeduction / DAILY_COST);
    const daysLeft = Math.max(effectiveDays, 0);

    // Actualiza la base de datos
    await updateSubscriptionBalance(sub.id, balanceAfterDeduction);

    // Envía notificación si días restantes <= 3
    if (daysLeft <= 3) {
    sendNotification(sub.alias, daysLeft);
    }

    return {
    ...sub,
    balance: Math.max(balanceAfterDeduction, 0),
    remaining_days: daysLeft,
    };
} else {
    const effectiveDays = Math.floor(currentBalance / DAILY_COST);
    return { ...sub, remaining_days: effectiveDays };
}
};

const updateSubscriptionBalance = async (id, newBalance) => {
try {
    const { error } = await supabase
    .from("suscriptions")
    .update({
        balance: Math.max(newBalance, 0),
        last_deduction_date: new Date().toISOString(),
    })
    .eq("id", id);

    if (error) throw error;
} catch (error) {
    console.log("Error updating subscription balance:", error);
}
};

const sendNotification = async (alias, daysLeft) => {
if (Platform.OS === "ios" || Platform.OS === "android") {
    await Notifications.scheduleNotificationAsync({
    content: {
        title: "¡Suscripción Próxima a Vencer!",
        body: `La suscripción de ${alias} vence en ${daysLeft} días.`,
    },
    trigger: { seconds: 1 },
    });
} else {
    console.log(`Notification for ${alias}: ${daysLeft} days left.`);
}
};

const addSubscription = async (email, alias, balance, recharge_date) => {
try {
    const { error } = await supabase.from("suscriptions").insert([
    {
        email,
        alias,
        balance: parseFloat(balance),
        recharge_date: recharge_date || new Date().toISOString(),
    },
    ]);

    if (error) throw error;

    fetchSubscriptions();
} catch (error) {
    console.log("Error adding subscription:", error);
}
};

const deleteSubscription = async (id) => {
try {
    const { error } = await supabase
    .from("suscriptions")
    .delete()
    .eq("id", id);
    if (error) throw error;

    fetchSubscriptions();
} catch (error) {
    console.log("Error deleting subscription:", error);
}
};

const rechargeSubscription = async () => {
if (!selectedSubscriptionId || !rechargeAmount) {
    console.log("No subscription ID or recharge amount provided");
    return;
}

try {
    const { data, error } = await supabase
    .from("suscriptions")
    .select("balance")
    .eq("id", selectedSubscriptionId)
    .single();

    if (error) throw error;

    const updatedBalance =
    parseFloat(data.balance) + parseFloat(rechargeAmount);

    const { updateError } = await supabase
    .from("suscriptions")
    .update({
        balance: updatedBalance,
        recharge_date: new Date().toISOString(),
    })
    .eq("id", selectedSubscriptionId);

    if (updateError) throw updateError;

    fetchSubscriptions();
    setIsModalVisible(false);
    setRechargeAmount("");
} catch (error) {
    console.log("Error recharging subscription:", error);
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
