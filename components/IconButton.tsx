import { Colors } from "@/constants/Colors";
import { StyleSheet, Pressable } from "react-native";

import {
  SlidersVertical,
  Search,
  ChevronLeft,
  ChevronRight,
  X,
  ArrowLeft,
  Star,
} from "lucide-react-native";

export function IconButton({
  iconName,
  label,
  onPress,
}: {
  iconName: string;
  label: string;
  onPress: () => void;
}) {
  const iconsMap: Record<string, any> = {
    slidersVertical: SlidersVertical,
    search: Search,
    chevronRight: ChevronRight,
    chevronLeft: ChevronLeft,
    x: X,
    arrowLeft: ArrowLeft,
    star: Star
  };

  const IconComponent = iconsMap[iconName] || Star; // Star fallback

  return (
    <Pressable style={styles.button} onPress={onPress} accessibilityLabel={label}>
      <IconComponent size={24} color={Colors.textDefault} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 8,
  },
});
