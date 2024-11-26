/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  Alert,
  TouchableOpacity,
  FlatList,
  Modal,
} from "react-native";
import { supabase } from "../db/SupabaseClient";
import GradientBackground from "../components/GradientBackground";



const RechargeScreen = () => {
  const [loading, setLoading] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(""); // Cuenta seleccionada
  const [subscriptions, setSubscriptions] = useState([]);
  const [balance, setBalance] = useState(null); // Saldo actual
  const [rechargeAmount, setRechargeAmount] = useState(""); // Monto de recarga
  const [isModalVisible, setIsModalVisible] = useState(false); // Estado del Modal
  
  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        setLoading(true); // Start loading
        const { data, error } = await supabase.from("suscriptions").select("id, alias, balance");
  
        if (error) throw error;
  
        setSubscriptions(data || []);  // Update subscriptions
      } catch (error) {
        console.error("Error fetching subscriptions:", error);
      } finally {
        setLoading(false);  // End loading
      }
    };
  
    fetchSubscriptions();
  }, []);
  // Función para consultar saldo
  const handleCheckBalance = () => {
    if (selectedAccount) {
      const selectedSubscription = subscriptions.find(
        (sub) => sub.alias === selectedAccount
      );
      if (selectedSubscription) {
        setBalance(selectedSubscription.balance);
      } else {
        Alert.alert("Error", "No se encontró la cuenta seleccionada");
      }
    } else {
      Alert.alert("Por favor selecciona una cuenta");
    }
  };

  // Función para recargar saldo
  const handleRecharge = async () => {
    if (selectedAccount && rechargeAmount) {
      try {
        const selectedSubscription = subscriptions.find(
          (sub) => sub.alias === selectedAccount
        );

        if (selectedSubscription) {
          const newBalance =
            parseFloat(selectedSubscription.balance) + parseFloat(rechargeAmount);

            const { error } = await supabase
            .from("suscriptions")
            .update({ balance: newBalance })
            .eq("id", selectedSubscription.id);

          if (error) throw error;

          Alert.alert(
            "Recarga exitosa",
            `Has recargado $${rechargeAmount} a ${selectedAccount}`
          );
          setRechargeAmount(""); // Limpiar el monto después de la recarga
          setSubscriptions(); // Refrescar la lista de suscripciones
        } else {
          Alert.alert("Error", "No se encontró la cuenta seleccionada");
        }
      } catch (error) {
        console.error("Error recharging subscription:", error);
        Alert.alert("Error", "No se pudo realizar la recarga");
      }
    } else {
      Alert.alert("Error", "Selecciona una cuenta y/o ingresa un monto válido");
    }
  };

  // Función para seleccionar cuenta desde el Modal
  const selectAccount = (account) => {
    setSelectedAccount(account);
    setIsModalVisible(false);
  };

  return (
  
    <GradientBackground>
    <View style={styles.container}>
      <Text style={styles.title}>Recargar Cuenta</Text>

      {/* Selector de cuentas */}
      <TouchableOpacity
        style={styles.selector}
        onPress={() => setIsModalVisible(true)}
      >
        <Text style={styles.selectorText}>
          {selectedAccount || "Selecciona una cuenta"}
        </Text>
      </TouchableOpacity>

      {/* Modal para mostrar cuentas */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
          {loading ? (
  <Text>Cargando...</Text>
) : (
  <FlatList
    data={subscriptions}
    keyExtractor={(item) => item.id.toString()}
    renderItem={({ item }) => (
      <TouchableOpacity
        style={styles.modalItem}
        onPress={() => selectAccount(item.alias)}
      >
        <Text style={styles.modalText}>{item.alias}</Text>
      </TouchableOpacity>
    )}
  />
)}

            <Button
              title="Cerrar"
              onPress={() => setIsModalVisible(false)}
              color="#d9534f"
            />
          </View>
        </View>
      </Modal>

      {/* Botón para consultar saldo */}
      <Button title="Consultar Saldo" onPress={handleCheckBalance} />
      {balance !== null && (
        <Text style={styles.balance}>Saldo actual: ${balance.toFixed(2)}</Text>
      )}

      {/* Entrada de monto de recarga */}
      <TextInput
        style={styles.input}
        placeholder="Ingresa el monto a recargar"
        keyboardType="numeric"
        value={rechargeAmount}
        onChangeText={setRechargeAmount}
      />

      {/* Botón para recargar saldo */}
      <Button title="Recargar Saldo" onPress={handleRecharge} />
    </View>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
    
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "rgba(255,255,255,1)",
  },
  selector: {
    width: "100%",
    height: 50,
    justifyContent: "center",
    paddingHorizontal: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
    borderRadius: 5,
  },
  selectorText: {
    fontSize: 16,
    color: "#333",
  },
  balance: {
    marginTop: 10,
    fontSize: 16,
    color: "#333",
  },
  input: {
    width: "100%",
    height: 50,
    marginTop: 20,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
    borderRadius: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
  },
  modalItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  modalText: {
    fontSize: 16,
  },
});

export default RechargeScreen;