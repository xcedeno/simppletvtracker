/* eslint-disable prettier/prettier */
import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    Modal,
    Button,
    ScrollView,
    TextInput,
    Alert,
    } from "react-native";
    import SubscriptionList from "../lists/SubscriptionList";
    import TimeRemainingChart from "../components/TimeRemainingCharts";
    import useSubscription from "../hooks/useSubscription";
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
        // Asegúrate de que el monto de recarga es válido
        if (
        !rechargeAmount ||
        isNaN(rechargeAmount) ||
        parseFloat(rechargeAmount) <= 0
        ) {
        Alert.alert("Error", "Por favor ingresa un monto válido.");
        return;
        }
    
        // Llamamos a la función de recarga pasando el monto
        await rechargeSubscription(rechargeAmount);
    };
    

    return (
        <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Cuentas de Suscripción</Text>
        <SubscriptionList
            subscriptions={subscriptions}
            editSubscription={openRechargeModal}
            deleteSubscription={handleDeleteSubscription}
        />

        <Modal
            visible={showDeleteConfirmation}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setShowDeleteConfirmation(false)}
        >
            <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>
                ¿Estás seguro de que deseas eliminar esta suscripción?
                </Text>
                <View style={styles.buttonContainer}>
                <Button
                    title="Sí"
                    onPress={() => {
                    deleteSubscription(selectedSubscriptionForDeletion); // Eliminar la suscripción
                    setShowDeleteConfirmation(false); // Cerrar el modal
                    fetchSubscriptions(); // Actualizar la lista
                    }}
                />
                <Button
                    title="No"
                    onPress={() => setShowDeleteConfirmation(false)} // Cerrar el modal sin eliminar
                />
                </View>
            </View>
            </View>
        </Modal>

        <Text style={styles.title}>Días Restantes</Text>
        {subscriptions.map((sub) => (
            <View key={sub.id} style={styles.item}>
            <Text style={styles.alias}>{sub.alias}</Text>
            <Text>
                Días Restantes: {sub.remaining_days} días{" "}
                {sub.remaining_days > 3 ? "✅" : "❌"}
            </Text>
            <View style={styles.chartContainer}>
                <TimeRemainingChart remainingDays={sub.remaining_days} />
            </View>
            </View>
        ))}
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
                <Button title="Confirmar" onPress={handleRecharge} />
                <Button
                title="Cancelar"
                onPress={() => setIsModalVisible(false)}
                />
            </View>
            </View>
        </View>
        </Modal>
        </ScrollView>
        </View>
    );
    };

    const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        paddingBottom: 50,
        height: "90vh",
        overflowY: "scroll",
    },
    scrollViewContent: {
        flexGrow: 1,
        padding: 20,
        paddingBottom: 50,
    },
    title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
    alias: { fontSize: 18, fontWeight: "600" },
    item: {
        padding: 15,
        backgroundColor: "#f9f9f9",
        marginBottom: 10,
        borderRadius: 5,
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.3)",
    },
    modalContent: {
        width: "80%",
        padding: 20,
        backgroundColor: "#fff",
        borderRadius: 10,
        alignItems: "center",
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
    },
    modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 15 },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "75%",
    },
    input: {
        width: "100%",
        height: 40,
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 15,
    },
    chartContainer: { marginTop: 10 },
});

export default AccountScreen;
