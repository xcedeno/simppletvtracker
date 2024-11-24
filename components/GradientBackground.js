/* eslint-disable prettier/prettier */
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet } from "react-native";

const GradientBackground = () => {
return (
<LinearGradient
    colors={["rgba(0,0,255,1)", "rgba(0,255,255,1)"]} // De azul a cian
    start={{ x: 0, y: 0 }} // Arriba izquierda
    end={{ x: 1, y: 1 }} // Abajo derecha
    style={styles.container}
>

</LinearGradient>
);
};

const styles = StyleSheet.create({
container: {
flex: 1,
},
});

export default GradientBackground;
