/* eslint-disable prettier/prettier */
import React from "react";
import { Modal, View, Text, StyleSheet, Button } from "react-native";

const DeleteConfirmationModal = ({
visible,
onConfirm,
onCancel,
}) => {
return (
<Modal
    visible={visible}
    transparent={true}
    animationType="slide"
    onRequestClose={onCancel}
>
    <View style={styles.modalContainer}>
    <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>
        ¿Estás seguro de que deseas eliminar esta suscripción?
        </Text>
        <View style={styles.buttonContainer}>
        <Button title="Sí" onPress={onConfirm} />
        <Button title="No" onPress={onCancel} />
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
buttonContainer: {
flexDirection: "row",
justifyContent: "space-between",
marginTop: 10,
},
});

export default DeleteConfirmationModal;
