/* eslint-disable prettier/prettier */
import React, { useState } from "react";
import { Text, StyleSheet, ScrollView, Alert } from "react-native";
import SubscriptionList from "../lists/SubscriptionList";
import TimeRemainingChart from "../components/TimeRemainingCharts";
import useSubscription from "../hooks/useSubscription";
import DeleteConfirmationModal from "../modals/DeleteConfirmationModal";
import RechargeModal from "../modals/RechargeModal";
import ExpandableItem from "../components/ExpandableItem";
import GradientBackground from "../components/GradientBackground";
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
    <GradientBackground>

<ScrollView style={styles.container}
>
    
    <Text style={styles.title}>Cuentas de Suscripción</Text>
    <SubscriptionList
        subscriptions={subscriptions}
        editSubscription={openRechargeModal}
        deleteSubscription={handleDeleteSubscription}
    />
    <Text style={styles.title}>Grafico de Días Restantes</Text>
    {subscriptions.map((sub) => (
        <ExpandableItem key={sub.id} alias={sub.alias}>
        
        <Text>
            Días Restantes: {sub.remaining_days} días{" "}
            {sub.remaining_days > 3 ? "✅" : "❌"}
        </Text>
        <TimeRemainingChart remainingDays={sub.remaining_days} />
        </ExpandableItem>
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
</GradientBackground>

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
color: "rgba(255,255,255,1)",
},
item: {
marginVertical: 10,
padding: 16,
backgroundColor: "rgba(255,255,255,0.5)",
borderRadius: 8,
},
alias: {
fontWeight: "bold",
},
});

export default AccountScreen;
