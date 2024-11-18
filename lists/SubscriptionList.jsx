/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from "react";
import {
  FlatList,
  View,
  Text,
  StyleSheet,
  Animated,
  Pressable,
} from "react-native";
import axios from "axios";

const SubscriptionList = ({
  subscriptions,
  editSubscription,
  deleteSubscription,
}) => {
  const [rate, setRate] = useState(null);
  const [expandedItems, setExpandedItems] = useState({});
  const [animationValues, setAnimationValues] = useState({});

  useEffect(() => {
    const fetchRate = async () => {
      try {
        const response = await axios.get(
          "https://pydolarve.org/api/v1/dollar?monitor=bcv"
        );
        const price = response.data.price;

        if (price) {
          setRate(price);
        } else {
          setRate("No disponible");
        }
      } catch (error) {
        console.error("Error fetching BCV rate", error);
        setRate("Error al obtener tasa");
      }
    };

    fetchRate();
  }, []);

  useEffect(() => {
    const animations = {};
    subscriptions.forEach((item) => {
      if (item.remaining_days <= 3) {
        const colorAnim = new Animated.Value(0); // 0 -> color inicial, 1 -> color de alerta
        const opacityAnim = new Animated.Value(1); // Opacidad inicial

        Animated.loop(
          Animated.sequence([
            Animated.parallel([
              Animated.timing(colorAnim, {
                toValue: 1,
                duration: 600,
                useNativeDriver: false,
              }),
              Animated.timing(opacityAnim, {
                toValue: 0.8,
                duration: 600,
                useNativeDriver: false,
              }),
            ]),
            Animated.parallel([
              Animated.timing(colorAnim, {
                toValue: 0,
                duration: 600,
                useNativeDriver: false,
              }),
              Animated.timing(opacityAnim, {
                toValue: 1,
                duration: 600,
                useNativeDriver: true,
              }),
            ]),
          ])
        ).start();

        animations[item.id] = { colorAnim, opacityAnim };
      }
    });
    setAnimationValues(animations);
  }, [subscriptions]);

  const toggleExpand = (id) => {
    setExpandedItems((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  return (
    <FlatList
      data={subscriptions}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => {
        const animation = animationValues[item.id];
        const backgroundColor =
          animation?.colorAnim?.interpolate({
            inputRange: [0, 1],
            outputRange: ["#f9f9f9", "#F44336"],
          }) || "#f9f9f9";

        return (
          <Animated.View
            style={[
              styles.item,
              {
                backgroundColor,
                opacity: animation?.opacityAnim || 1,
              },
            ]}
          >
            <Pressable onPress={() => toggleExpand(item.id)}>
              <Text style={styles.aliasText}>{item.alias}</Text>
            </Pressable>
            {expandedItems[item.id] && (
              <View style={styles.expandedContent}>
                <Text>Correo: {item.email}</Text>
                <Text>Saldo: {item.balance} $</Text>
                <Text>Tasa BCV: {rate ? `${rate} USD` : "Cargando..."}</Text>
                <Text>Días Restantes: {item.remaining_days} Días</Text>

                <View style={styles.buttonsContainer}>
                  <Pressable
                    style={styles.editButton}
                    onPress={() => editSubscription(item.id)}
                  >
                    <Text style={styles.buttonText}>Editar</Text>
                  </Pressable>

                  <Pressable
                    style={styles.deleteButton}
                    onPress={() => deleteSubscription(item.id)}
                  >
                    <Text style={styles.buttonText}>Eliminar</Text>
                  </Pressable>
                </View>
              </View>
            )}
          </Animated.View>
        );
      }}
    />
  );
};

const styles = StyleSheet.create({
  item: { padding: 15, marginBottom: 10, borderRadius: 5 },
  aliasText: { fontSize: 16, fontWeight: "bold", color: "#333" },
  expandedContent: { marginTop: 10 },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  editButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
  },
  deleteButton: {
    backgroundColor: "#F44336",
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default SubscriptionList;
