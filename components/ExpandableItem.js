/* eslint-disable prettier/prettier */
import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";

const ExpandableItem = ({ alias, children }) => {
const [isExpanded, setIsExpanded] = useState(false);

const toggleExpand = () => {
setIsExpanded((prev) => !prev);
};

return (
<Pressable style={styles.item} onPress={toggleExpand}>
    <Text style={[styles.alias, isExpanded && styles.expandedAlias]}>
    {alias}
    </Text>
    {isExpanded && <View style={styles.details}>{children}</View>}
</Pressable>
);
};

const styles = StyleSheet.create({
item: {
    padding: 15,
    backgroundColor: "#fff",
    marginBottom: 10,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 1,
},
alias: {
fontSize: 16,
fontWeight: "bold",
color: "#333",
},
expandedAlias: {
color: "#6200EE", // Cambia de color si está expandido
},
details: {
marginTop: 10,
borderTopWidth: 1,
borderTopColor: "#ddd",
paddingTop: 10,
},
});

export default ExpandableItem;
