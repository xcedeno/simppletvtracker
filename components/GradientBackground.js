/* eslint-disable prettier/prettier */
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet,View} from "react-native";

const GradientBackground = ({children}) => {
return (
<View style={styles.container}>
      <LinearGradient
        colors={["#4c669f", "#3b5998", "#192f6a"]} // Colores de ejemplo
        style={StyleSheet.absoluteFillObject} // Asegura que el gradiente ocupe toda la pantalla
      />
      {children} {/* Renderiza los componentes hijos encima del gradiente */}
    </View>
);
};

const styles = StyleSheet.create({
container: {
flex: 1,
},
});

export default GradientBackground;
