// SubscriptionList.js
import React, { useEffect, useState } from 'react';
import { FlatList, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';
const SubscriptionList = ({ subscriptions, editSubscription, deleteSubscription }) => {
    const [rate, setRate] = useState(null);
    
    useEffect(() => {
        // Función para obtener la tasa del BCV
        const fetchRate = async () => {
            try {
                // Hacemos la solicitud a la API de Pydolarve
                const response = await axios.get('https://pydolarve.org/api/v1/dollar?monitor=bcv');
                console.log(response);
                // Accedemos al valor de 'price' dentro del objeto 'usd'
                const price = response.data.price;
                console.log(price);
                
                if (price) {
                    setRate(price); // Asignamos la tasa del precio al estado
                } else {
                    setRate('No disponible'); // En caso de que no encontremos la tasa
                }
            } catch (error) {
                console.error("Error fetching BCV rate", error);
                setRate('Error al obtener tasa');
            }
        };

        fetchRate(); // Llamamos a la función de obtención de datos
    }, []); // Solo se ejecuta una vez cuando el componente se monta
    
    return (
        <FlatList
            data={subscriptions}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
                <View style={styles.item}>
                    <Text>Correo: {item.email}</Text>
                    <Text>Alias: {item.alias}</Text>
                    <Text>Saldo: {item.balance}</Text>
                    <Text>Tasa BCV: {rate ? `${rate} USD` : 'Cargando...'}</Text>

                    <Text>Días Restantes: {item.remaining_days}</Text>

                    <View style={styles.buttonsContainer}>
                        <TouchableOpacity
                            style={styles.editButton}
                            onPress={() => editSubscription(item.id)}>
                            <Text style={styles.buttonText}>Editar</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.deleteButton}
                            onPress={() => deleteSubscription(item.id)}>
                            <Text style={styles.buttonText}>Eliminar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        />
    );
};

const styles = StyleSheet.create({
    item: { padding: 15, backgroundColor: '#f9f9f9', marginBottom: 10, borderRadius: 5 },
    buttonsContainer: { flexDirection: 'row', justifyContent: 'space-between' },
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
