import { View, StyleSheet } from "react-native";
import { BSmallText } from "./texts/body/BSmallText";
import { Colors } from "@/constants/Colors";

import { Check } from "lucide-react-native";

export function SeasonCheckbox({
  isChecked,
  month,
}: {
  isChecked: boolean;
  month: string;
}) {
  return (
    <View style={styles.checkboxContainer}>
      <View
        style={[styles.checkbox, isChecked ? styles.checked : styles.unchecked]}
      >
        {isChecked && <Check size={24} color={Colors.textSecondary} />}
      </View>
      <BSmallText>{month}</BSmallText>
    </View>
  );
}

const styles = StyleSheet.create({
  checkboxContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
  },
  unchecked: {
    borderColor: Colors.textSecondary,
    borderWidth: 1,
  },
  checked: {
    backgroundColor: Colors.primary,
  },
});
