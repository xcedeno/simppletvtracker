/* eslint-disable prettier/prettier */
import React from "react";
import { Modal, View, Text, StyleSheet, TextInput, Button } from "react-native";

const RechargeModal = ({
visible,
rechargeAmount,
setRechargeAmount,
onConfirm,
onCancel,
}) => {
return (
<Modal visible={visible} transparent={true} animationType="slide">
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
        <Button title="Confirmar" onPress={onConfirm} />
        <Button title="Cancelar" onPress={onCancel} />
        </View>
    </View>
    </View>
</Modal>
);
};

const styles = StyleSheet.create({
modalContainer: {
flex: 1,
justifyContent: "center",
alignItems: "center",
backgroundColor: "rgba(0, 0, 0, 0.5)",
},
modalContent: {
width: "80%",
padding: 20,
backgroundColor: "white",
borderRadius: 10,
alignItems: "center",
},
modalTitle: {
fontSize: 18,
fontWeight: "bold",
marginBottom: 10,
},
input: {
width: "100%",
padding: 10,
marginVertical: 10,
borderWidth: 1,
borderColor: "#ccc",
borderRadius: 8,
},
buttonContainer: {
flexDirection: "row",
justifyContent: "space-between",
marginTop: 10,
},
});

export default RechargeModal;
