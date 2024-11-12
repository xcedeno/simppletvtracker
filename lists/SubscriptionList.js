import React, { useEffect, useState } from 'react';
import { FlatList, View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import axios from 'axios';
import moment from 'moment';

const SubscriptionList = ({ subscriptions, editSubscription, deleteSubscription }) => {
    const [rate, setRate] = useState(null);
    const [expandedItems, setExpandedItems] = useState({});
    const [animationValues, setAnimationValues] = useState({});

    useEffect(() => {
        const fetchRate = async () => {
            try {
                const response = await axios.get('https://pydolarve.org/api/v1/dollar?monitor=bcv');
                const price = response.data.price;
                
                if (price) {
                    setRate(price);
                } else {
                    setRate('No disponible');
                }
            } catch (error) {
                console.error("Error fetching BCV rate", error);
                setRate('Error al obtener tasa');
            }
        };

        fetchRate();
    }, []);

    useEffect(() => {
        // Crear animaciones para cada item
        const animations = subscriptions.reduce((acc, item) => {
            if (item.remaining_days <= 3) {
                const colorAnim = new Animated.Value(0);  // 0 -> color inicial, 1 -> color animado
                const opacityAnim = new Animated.Value(1); // 1 -> completamente opaco, 0 -> más opaco
    
                // Iniciar la animación para el cambio de color y opacidad
                Animated.loop(
                    Animated.sequence([
                        // Animación de cambio de color y opacidad
                        Animated.parallel([
                            Animated.timing(colorAnim, {
                                toValue: 1,  // Cambiar a un color de alerta (por ejemplo, rojo)
                                duration: 600,
                                useNativeDriver: false, // Para cambiar el color de fondo necesitamos false
                            }),
                            Animated.timing(opacityAnim, {
                                toValue: 0.8,  // Reduce ligeramente la opacidad
                                duration: 600,
                                useNativeDriver: true,
                            })
                        ]),
                        // Volver al estado original
                        Animated.parallel([
                            Animated.timing(colorAnim, {
                                toValue: 0, // Vuelve al color inicial
                                duration: 600,
                                useNativeDriver: false,
                            }),
                            Animated.timing(opacityAnim, {
                                toValue: 1,  // Vuelve a la opacidad normal
                                duration: 600,
                                useNativeDriver: true,
                            })
                        ])
                    ])
                ).start();
    
                // Guardar las animaciones para cada item
                acc[item.id] = { colorAnim, opacityAnim };
            }
            return acc;
        }, {});
    
        setAnimationValues(animations);
    }, [subscriptions]);
    
    const toggleExpand = (id) => {
        setExpandedItems(prevState => ({
            ...prevState,
            [id]: !prevState[id]
        }));
    };

    return (
        <FlatList
            data={subscriptions}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => {
                // Determine the background color based on the remaining days
                const backgroundColor = item.remaining_days <= 3 
                ? animationValues[item.id]?.colorAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['#f9f9f9', '#F44336'] // Color inicial y color de alerta (rojo)
                })
                : '#f9f9f9';

            const opacity = item.remaining_days <= 3 
                ? animationValues[item.id]?.opacityAnim
                : 1; // Mantener opacidad normal si no hay alerta
                return (
                    <Animated.View
                        style={[styles.item, { backgroundColor, transform: [{ scale: animationValues[item.id] || 1 }] }]}
                    >
                        <TouchableOpacity onPress={() => toggleExpand(item.id)}>
                            <Text style={styles.aliasText}>{item.alias}</Text>
                        </TouchableOpacity>

                        {expandedItems[item.id] && (
                            <View style={styles.expandedContent}>
                                <Text>Correo: {item.email}</Text>
                                <Text>Saldo: {item.balance} $</Text>
                                <Text>Tasa BCV: {rate ? `${rate} USD` : 'Cargando...'}</Text>
                                <Text>Días Restantes: {item.remaining_days} Dias</Text>

                                <View style={styles.buttonsContainer}>
                                    <TouchableOpacity
                                        style={styles.editButton}
                                        onPress={() => editSubscription(item.id)}
                                    >
                                        <Text style={styles.buttonText}>Editar</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={styles.deleteButton}
                                        onPress={() => deleteSubscription(item.id)}
                                    >
                                        <Text style={styles.buttonText}>Eliminar</Text>
                                    </TouchableOpacity>
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
    aliasText: { fontSize: 16, fontWeight: 'bold', color: '#333' },
    expandedContent: { marginTop: 10 },
    buttonsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
    editButton: {
        backgroundColor: '#4CAF50',
        padding: 10,
        borderRadius: 5,
    },
    deleteButton: {
        backgroundColor: '#F44336',
        padding: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default SubscriptionList;
