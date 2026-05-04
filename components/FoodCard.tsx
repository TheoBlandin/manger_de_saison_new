import { Colors } from "@/constants/Colors";
import { View, StyleSheet, Pressable } from "react-native";
import { BBodyText } from "./texts/body/BBodyText";
import { DBodyText } from "./texts/display/DBodyText";

import Abricot from "./../assets/food/abricot.svg"

export function FoodCard({ name, type, onPress }: { name: string; type: string, onPress: () => void }) {
  return (
    <Pressable onPress={onPress}>
      <View style={styles.card}>
        <View style={styles.foodInfo}>
          <DBodyText style={ type == 'Légume' ? styles.vegetable : styles.fruit }>{type.charAt(0).toUpperCase()}</DBodyText>
        </View>
        <Abricot width={64} height={64} />
        <View style={styles.nameContainer}>
          <BBodyText style={styles.name}>{name}</BBodyText>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "column",
    alignItems: "center",
    gap: 4,
    backgroundColor: Colors.surface,
    padding: 4,
    borderRadius: 8,
    shadowColor: Colors.textDefault,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  foodInfo: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'flex-start'
  },
  vegetable: {
    color: Colors.vegetable
  },
  fruit: {
    color: Colors.fruit
  },
  nameContainer: {
    height: 45,
    justifyContent: "center",
    alignItems: "center",
  },
  name: {
    textAlign: "center",
  },
});
