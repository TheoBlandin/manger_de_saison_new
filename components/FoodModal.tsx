import { Colors } from "@/constants/Colors";
import {
  Pressable,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { IconButton } from "./IconButton";
import { BLargeText } from "./texts/body/BLargeText";

import DefaultFood from "./../assets/food/abricot.svg";
import { foodImages } from "./../assets/foodImages";
import { SeasonCheckbox } from "./SeasonCheckbox";

import Like from "./../assets/icons/like.svg";
import Dislike from "./../assets/icons/dislike.svg";

import { BBodyText } from "./texts/body/BBodyText";

export function FoodModal({
  name,
  type,
  img,
  season,
  onClose,
  onPreference,
  isLiked,
  isDisliked
}: {
  name: string;
  type: string;
  img: string;
  season: number[];
  onClose: () => void;
  onPreference: (key: string, name: string) => void;
  isLiked: boolean;
  isDisliked: boolean
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

  const FoodImage = foodImages[img as keyof typeof foodImages] ?? DefaultFood;

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
              <FoodImage width={128} height={128} />
              <BLargeText>{name}</BLargeText>
            </View>

            {/* Season */}
            <View style={styles.seasonGrid}>
              <View style={{ flexDirection: "row", gap: 16 }}>
                {months.slice(0, 6).map((item, i) => {
                  return (
                    <SeasonCheckbox
                      key={item}
                      isChecked={season.includes(i + 1)}
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
                      isChecked={season.includes(i + 7)}
                      month={item}
                    />
                  );
                })}
              </View>
            </View>

            {/* Preference */}
            <View style={{ flexDirection: "row", gap: 12, alignSelf: "stretch" }}>
              <Pressable onPress={() => onPreference('like', name)} style={styles.preferenceButton}>
                <Like width={48} height={48} color={ isLiked ? Colors.like : Colors.grey} />
                <BBodyText>J'aime</BBodyText>
              </Pressable>
              <Pressable onPress={() => onPreference('dislike', name)} style={styles.preferenceButton}>
                <Dislike width={48} height={48} color={ isDisliked ? Colors.dislike : Colors.grey} />
                <BBodyText>Je n'aime pas</BBodyText>
              </Pressable>
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
  preferenceButton: {
    flexDirection: "column",
    alignItems: "center",
    flex: 1,
  }
});
