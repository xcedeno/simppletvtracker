/* eslint-disable prettier/prettier */
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";

const MainScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
        {/* Contenedor de logos */}
        <View style={styles.logoContainer}>
            <Image
            source={require("../assets/ikin.png")} // Cambia la ruta a la ubicación de tu logo
            style={styles.logo}
            />
            <Image
            source={require("../assets/simpletv.png")} // Cambia la ruta a la ubicación de tu segundo logo
            style={styles.logo}
            />
        </View>

        {/* Título */}
        <Text style={styles.title}>Pantalla Principal</Text>

        {/* Contenedor de las tarjetas */}
        <View style={styles.cardContainer}>
            <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate("SubscriptionDashboard")}
            >
            <Text style={styles.cardTitle}>Ir al Dashboard</Text>
            </TouchableOpacity>

            <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate("AccountScreen")}
            >
            <Text style={styles.cardTitle}>Consultar Cuenta</Text>
            </TouchableOpacity>

            <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate("RechargeScreen")}
            >
            <Text style={styles.cardTitle}>Recargar Cuenta</Text>
            </TouchableOpacity>
        </View>
        </View>
    );
    };

    const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f4f4f4",
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 40,
    },
    cardContainer: {
        flexDirection: "column",
        width: "100%",
        alignItems: "center",
    },
    card: {
        width: "90%",
        padding: 20,
        marginVertical: 10,
        backgroundColor: "blue", // Color de fondo básico
        borderRadius: 10,
        elevation: 5,
        alignItems: "center",
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "white",
    },
    logoContainer: {
        flexDirection: "row", // Para alinear los logos en fila
        justifyContent: "center", // Para espaciar los logos
        width: "100%", // Asegura que los logos ocupen el ancho completo de la pantalla
        marginBottom: 20, // Espacio entre los logos y el texto
    },
    logo: {
        width: 150, // Ajusta el tamaño de los logos
        height: 150, // Ajusta el tamaño de los logos
        resizeMode: "contain", // Para que la imagen no se distorsione
        marginHorizontal: 10, // Espacio entre los logos
    },
    text: {
        fontSize: 20,
        fontWeight: "bold",
    },
});

export default MainScreen;
