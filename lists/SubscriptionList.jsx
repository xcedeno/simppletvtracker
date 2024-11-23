/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from "react";
import {
  FlatList,
  View,
  Text,
  StyleSheet,
  Animated,
  Pressable,
  Button,
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
  const [visibleSubscriptions, setVisibleSubscriptions] = useState([]);
  const [limit, setLimit] = useState(20); // Controla el número de registros visibles

  useEffect(() => {
    // Actualizar la lista visible cuando se cambia el límite
    setVisibleSubscriptions(subscriptions.slice(0, limit));
  }, [subscriptions, limit]);

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
    const newAnimations = {};
    subscriptions.forEach((item) => {
      if (!animationValues[item.id] && item.remaining_days <= 3) {
        const colorAnim = new Animated.Value(0);
        const opacityAnim = new Animated.Value(1);
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
                toValue: 0.8,
                duration: 600,
                useNativeDriver: false,
              }),
            ]),
          ])
        ).start();
        newAnimations[item.id] = { colorAnim, opacityAnim };
      }
    });
    setAnimationValues((prev) => ({ ...prev, ...newAnimations }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subscriptions]);

  const toggleExpand = (id) => {
    setExpandedItems((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const renderItem = ({ item }) => {
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
  };

  return (
    <View style={styles.container}>
      {/* Botones de selección */}
      <View style={styles.paginationContainer}>
        <Button
          title="Mostrar 10"
          onPress={() => setLimit(10)}
          color={limit === 10 ? "#6200EE" : "#ccc"}
        />
        
        <Button
          title="Mostrar todos"
          onPress={() => setLimit(subscriptions.length)}
          color={limit === subscriptions.length ? "#6200EE" : "#ccc"}
        />
      </View>
      <FlatList
        data={visibleSubscriptions}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text>No subscriptions available</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#f4f4f4",
  },
  paginationContainer: {
    
    justifyContent: "space-around",
    marginVertical: 10,
  },
  listContainer: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  item: {
    padding: 15,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  aliasText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  expandedContent: {
    marginTop: 10,
  },
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
  emptyState: {
    alignItems: "center",
    marginTop: 20,
  },
});

export default SubscriptionList;
