/* eslint-disable prettier/prettier */
import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
// Componente de Botón Reutilizable
const CustomButton = ({ title, onPress }) => (
<TouchableOpacity 
style={styles.button} // Fallback con StyleSheet
onPress={onPress}
activeOpacity={0.8} // Mejora la respuesta táctil
>
<Text style={styles.buttonText}>{title}</Text>
</TouchableOpacity>
);

// Componente de Contenedor de Logos
const LogoContainer = () => (
<View style={styles.logoContainer}>
<Image source={require("../assets/ikin.png")} style={styles.logo} />
<Image source={require("../assets/simpletv.png")} style={styles.logo} />
</View>
);

// Pantalla Principal
const MainScreen = ({ navigation }) => {
return (
    <LinearGradient
      // Colores del degradado
      colors={["rgba(0,0,255,1)", "rgba(0,255,255,1)"]} // De azul a cian
      start={{ x: 0, y: 0 }} // Punto de inicio (arriba izquierda)
      end={{ x: 1, y: 1 }} // Punto final (abajo derecha)
      style={styles.container} // Aplica el estilo del contenedor
    >
<View style={styles.container}>
    {/* Contenedor de logos */}
    <LogoContainer />

    {/* Título */}
    <Text style={styles.title}>Pantalla Principal</Text>

    {/* Contenedor de las tarjetas */}
    <View style={styles.cardContainer}>
    <CustomButton
        title="Ir al Dashboard"
        onPress={() => navigation.navigate("SubscriptionDashboard")}
    />
    <CustomButton
        title="Consultar Cuenta"
        onPress={() => navigation.navigate("AccountScreen")}
    />
    <CustomButton
        title="Recargar Cuenta"
        onPress={() => navigation.navigate("RechargeScreen")}
    />
    </View>
</View>
</LinearGradient>
);
};

const styles = StyleSheet.create({
container: {
flex: 1,
justifyContent: "center",
alignItems: "center",
padding: 20,

},
title: {
fontSize: 24,
fontWeight: "bold",
color: "white",
marginBottom: 20,
},
cardContainer: {
width: "100%",
alignItems: "center",
marginTop: 10,
},
button: {
backgroundColor: "rgba(50,100,200,0.9)",
paddingVertical: 15,
paddingHorizontal: 20,
borderRadius: 15,
width: "90%",
alignItems: "center",
marginVertical: 10,
elevation: 5, // Sombra para Android
shadowColor: "white", // Sombra para iOS
shadowOffset: { width: 0, height: 2 },
shadowOpacity: 0.25,
shadowRadius: 3.84,
},
buttonText: {
fontSize: 18,
color: "white",
fontWeight: "bold",
},
logoContainer: {
flexDirection: "row",
justifyContent: "center",
alignItems: "center",
width: "100%",
marginBottom: 20,
},
logo: {
width: 100,
height: 100,
resizeMode: "contain",
marginHorizontal: 10,
},
});

export default MainScreen;
