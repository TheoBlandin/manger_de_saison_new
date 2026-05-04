import { Colors } from "@/constants/Colors";
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  FlatList,
  ListRenderItem,
} from "react-native";
import { BBodyText } from "./texts/body/BBodyText";
import { BLargeText } from "./texts/body/BLargeText";
import { IconButton } from "./IconButton";

import Abricot from "./../assets/food/abricot.svg";
import { SeasonCheckbox } from "./SeasonCheckbox";

export function FoodModal({
  name,
  type,
  img,
  season,
  onClose,
}: {
  name: string;
  type: string;
  img: string;
  season: number[];
  onClose: () => void;
}) {
  const months = [
    "jan",
    "fev",
    "mar",
    "avr",
    "mai",
    "jui",
    "jui",
    "aoû",
    "sep",
    "oct",
    "nov",
    "dec",
  ];

  return (
    <TouchableWithoutFeedback onPress={onClose}>
      <View style={styles.overlay}>
        <TouchableWithoutFeedback>
          <View style={styles.modalView}>
            {/* Header */}
            <View style={styles.modalHeader}>
              <BLargeText
                style={type == "Légume" ? styles.vegetable : styles.fruit}
              >
                {type}
              </BLargeText>
              <IconButton
                iconName="x"
                label="Fermer la fenêtre"
                onPress={onClose}
              />
            </View>

            {/* Illustration */}
            <View style={styles.modalBody}>
              <Abricot width={128} height={128} />
              <BLargeText>{name}</BLargeText>
            </View>

            {/* Season */}
            <View style={styles.seasonGrid}>
              <View style={{ flexDirection: "row", gap: 16 }}>
                {months.slice(0, 6).map((item, i) => {
                  return (
                    <SeasonCheckbox
                      key={item}
                      isChecked={season.includes(i)}
                      month={item}
                    />
                  );
                })}
              </View>
              <View style={{ flexDirection: "row", gap: 16 }}>
                {months.slice(6, 12).map((item, i) => {
                  return (
                    <SeasonCheckbox
                      key={item}
                      isChecked={season.includes(i + 6)}
                      month={item}
                    />
                  );
                })}
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.overlay,
    zIndex: 9999,
  },
  modalView: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderRadius: 8,
    padding: 12,
    gap: 12,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    alignSelf: "stretch",
  },
  vegetable: {
    color: Colors.vegetable,
  },
  fruit: {
    color: Colors.fruit,
  },
  modalBody: {
    gap: 4,
    flexDirection: "column",
    alignItems: "center",
  },
  seasonGrid: {
    paddingHorizontal: 16,
    flexDirection: "column",
    justifyContent: "center",
    gap: 16,
  },
});
