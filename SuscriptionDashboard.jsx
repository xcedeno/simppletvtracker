/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from "react";
import {
View,
Text,
StyleSheet,
Alert,
Modal,
Button,
ScrollView,
} from "react-native";
import { supabase } from "./db/SupabaseClient";
import SubscriptionForm from "./forms/SubscriptionForm";
import useSubscription from "./hooks/useSubscription";
import Clock from "./components/Clock";

const SubscriptionDashboard = () => {
const [email, setEmail] = useState("");
const [alias, setAlias] = useState("");
const [balance, setBalance] = useState("");
const [rechargeDate, setRechargeDate] = useState("");
const [showSuccessModal, setShowSuccessModal] = useState(false);
    useState(null);

const {
    addSubscription,
    fetchSubscriptions,
} = useSubscription();
const [refresh, setRefresh] = useState(false);
useEffect(() => {
    fetchSubscriptions();
    checkDatabaseConnection();
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [refresh]);

const checkDatabaseConnection = async () => {
    const { error } = await supabase.from("suscriptions").select("*").limit(1);
    if (error) {
    console.log("Error de conexión a la base de datos:", error);
    Alert.alert(
        "Error de Conexión",
        "No se pudo conectar a la base de datos.",
    );
    } else {
    console.log("Conexión exitosa a la base de datos");
    }
};



const handleAddSubscription = async () => {
    await addSubscription(email, alias, balance, rechargeDate);
    fetchSubscriptions(); // Vuelve a cargar las suscripciones después de agregar una nueva
    clearForm(); // Limpia los campos del formulario después de agregar
    setShowSuccessModal(true);
};



const clearForm = () => {
    setEmail("");
    setAlias("");
    setBalance("");
    setRechargeDate("");
};
const closeSuccessModal = () => {
    setShowSuccessModal(false);
};


return (
    <View style={styles.container}>
    <Clock />
    <ScrollView contentContainerStyle={styles.scrollViewContent}
    showsVerticalScrollIndicator={false}>
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
        <Button classname="btn-primary"
            title="Actualizar Suscripciones"
            onPress={() => setRefresh(!refresh)}
        />
        <Modal
        visible={showSuccessModal}
        transparent={true}
        animationType="slide"
        onRequestClose={closeSuccessModal}
        >
        <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
                ¡Suscripción agregada con éxito!
            </Text>
            <Button title="Cerrar" onPress={closeSuccessModal} />
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
    width: "80%", // Adjust based on preference
    maxWidth: 300, // Limit width for larger screens
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    alignItems: "center",
    elevation: 5, // Adds shadow effect on Android
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
},
modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
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
buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "75%",
},
});

export default SubscriptionDashboard;
