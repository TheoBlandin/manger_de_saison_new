import { View, StyleSheet, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors } from "../constants/Colors";

import {
  SlidersVertical,
} from "lucide-react-native";
import { BLargeText } from "./texts/body/BLargeText";
import { IconButton } from "./IconButton";

export function CustomHeader({
  currentMonth,
  onPrevious,
  onNext,
  onFilters,
  onLayout
}: {
  currentMonth: string;
  onPrevious: () => void;
  onNext: () => void;
  onFilters: () => void;
  onLayout: (e: any) => void;
}) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]} onLayout={onLayout}>
      <View style={styles.content}>
        <Pressable onPress={onFilters} style={styles.button}>
          <SlidersVertical size={24} color={Colors.textDefault} />
        </Pressable>
        <View style={styles.monthPicker}>
          <IconButton
            iconName="chevronLeft"
            label="Mois précédent"
            onPress={onPrevious}
          />
          <BLargeText>{currentMonth}</BLargeText>
          <IconButton
            iconName="chevronRight"
            label="Mois suivant"
            onPress={onNext}
          />
        </View>
        <IconButton iconName="search" label="Rechercher" onPress={() => null} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.primary,
    zIndex: 1000,
    width: "100%",
  },
  content: {
    paddingBlock: 8,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  monthPicker: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flex: 1,
  },
  button: {
    padding: 8,
  },
});
