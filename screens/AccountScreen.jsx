/* eslint-disable prettier/prettier */
import React, { useState } from "react";
import { View, Text, StyleSheet,Button, ScrollView, Alert } from "react-native";
import SubscriptionList from "../lists/SubscriptionList";
import TimeRemainingChart from "../components/TimeRemainingCharts";
import useSubscription from "../hooks/useSubscription";
import DeleteConfirmationModal from "../modals/DeleteConfirmationModal";
import RechargeModal from "../modals/RechargeModal";
import { sendNotification } from "../api";
import { LinearGradient } from "expo-linear-gradient";
const AccountScreen = () => {
const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
const [selectedSubscriptionForDeletion, setSelectedSubscriptionForDeletion] =
useState(null);

const {
subscriptions,
deleteSubscription,
fetchSubscriptions,
isModalVisible,
setIsModalVisible,
setSelectedSubscriptionId,
rechargeAmount,
setRechargeAmount,
rechargeSubscription,
} = useSubscription();

const openRechargeModal = (id) => {
setSelectedSubscriptionId(id);
setIsModalVisible(true);
};

const handleSendNotification = async () => {
    const email = 'reyesjennyzer@gmail.com';
    const alias = 'Netflix';
    const remainingDays = 2;

    try {
    const response = await sendNotification(email, alias, remainingDays);
    Alert.alert('Éxito', response.message);
// eslint-disable-next-line no-unused-vars
} catch (error) {
    Alert.alert('Error', 'No se pudo enviar la notificación.');
}
};

const handleDeleteSubscription = (subscriptionId) => {
setSelectedSubscriptionForDeletion(subscriptionId);
setShowDeleteConfirmation(true);
};

const handleRecharge = async () => {
if (!rechargeAmount || isNaN(rechargeAmount) || parseFloat(rechargeAmount) <= 0) {
    Alert.alert("Error", "Por favor ingresa un monto válido.");
    return;
}

await rechargeSubscription(rechargeAmount);
};

return (
    <LinearGradient
    colors={["#4c669f", "#3b5998", "#192f6a"]}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    style={styles.gradientContainer}
    >

<ScrollView style={styles.container}
>
    
    <Text style={styles.title}>Cuentas de Suscripción</Text>
    <SubscriptionList
        subscriptions={subscriptions}
        editSubscription={openRechargeModal}
        deleteSubscription={handleDeleteSubscription}
    />
    <Text style={styles.title}>Días Restantes</Text>
    {subscriptions.map((sub) => (
        <View key={sub.id} style={styles.item}>
        <Text style={styles.alias}>{sub.alias}</Text>
        <Text>
            Días Restantes: {sub.remaining_days} días{" "}
            {sub.remaining_days > 3 ? "✅" : "❌"}
        </Text>
        <TimeRemainingChart remainingDays={sub.remaining_days} />
        </View>
    ))}
    

    {/* Delete Confirmation Modal */}
    <DeleteConfirmationModal
    visible={showDeleteConfirmation}
    onConfirm={() => {
        deleteSubscription(selectedSubscriptionForDeletion);
        setShowDeleteConfirmation(false);
        fetchSubscriptions();
    }}
    onCancel={() => setShowDeleteConfirmation(false)}
    />

    {/* Recharge Modal */}
    <RechargeModal
    visible={isModalVisible}
    rechargeAmount={rechargeAmount}
    setRechargeAmount={setRechargeAmount}
    onConfirm={handleRecharge}
    onCancel={() => setIsModalVisible(false)}
    />
</ScrollView>
</LinearGradient>

);
};

const styles = StyleSheet.create({
container: {
flexGrow: 1,
padding: 16,
},
title: {
fontSize: 20,
fontWeight: "bold",
marginVertical: 16,
color: "#fff",
},
item: {
marginVertical: 10,
padding: 16,
backgroundColor: "#f9f9f9",
borderRadius: 8,
},
alias: {
fontWeight: "bold",
},
});

export default AccountScreen;
