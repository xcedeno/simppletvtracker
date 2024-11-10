import React, { useEffect, useState } from 'react';
import { FlatList, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';

const SubscriptionList = ({ subscriptions, editSubscription, deleteSubscription }) => {
    const [rate, setRate] = useState(null);
    const [expandedItems, setExpandedItems] = useState({});

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
            renderItem={({ item }) => (
                <View style={styles.item}>
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
                </View>
            )}
        />
    );
};

const styles = StyleSheet.create({
    item: { padding: 15, backgroundColor: '#f9f9f9', marginBottom: 10, borderRadius: 5 },
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
