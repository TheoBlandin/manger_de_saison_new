import { Colors } from "@/constants/Colors";
import {
  Pressable,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { BLargeText } from "./texts/body/BLargeText";
import { IconButton } from "./IconButton";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BBodyText } from "./texts/body/BBodyText";
import { useEffect, useState } from "react";

import Animated, { useSharedValue, withSpring } from "react-native-reanimated";

export function FiltersModal({
  onClose,
  currentFilterType,
  currentPreferenceType,
  onChangeType,
  onChangePreference
}: {
  onClose: () => void;
  currentFilterType: number;
  currentPreferenceType: number;
  onChangeType: (type: number) => void;
  onChangePreference: (preference: number) => void;
}) {
  const insets = useSafeAreaInsets();

  const typeSegments = ["Tous", "Fruits", "Légumes"];
  const preferenceSegments = ["Tous", "J'aime", "Je n'aime pas"];

  const [containerWidth, setContainerWidth] = useState(0);
  const translateXType = useSharedValue(0);
  const translateXPreference = useSharedValue(0);

  useEffect(() => {
    const segmentWidth = containerWidth / 3;
    translateXType.value = withSpring(currentFilterType * segmentWidth, {
      damping: 120,
      stiffness: 1100,
    });
  }, [currentFilterType, containerWidth]);

  useEffect(() => {
    const segmentWidth = containerWidth / 3;
    translateXPreference.value = withSpring(currentPreferenceType * segmentWidth, {
      damping: 120,
      stiffness: 1100,
    });
  }, [currentPreferenceType, containerWidth]);

  return (
    <TouchableWithoutFeedback onPress={onClose}>
      <View style={styles.overlay}>
        <TouchableWithoutFeedback>
          <View style={[styles.modalView, { paddingBottom: insets.bottom }]}>
            {/* Header */}
            <View style={styles.modalHeader}>
              <BLargeText>Filtres</BLargeText>
              <IconButton
                iconName="x"
                label="Fermer la fenêtre"
                onPress={onClose}
              />
            </View>

            {/* Type */}
            <View style={styles.filterSection}>
              <BBodyText>Type</BBodyText>
              <View
                style={styles.filterContainer}
                onLayout={(e) =>
                  setContainerWidth(e.nativeEvent.layout.width - 5)
                }
              >
                <Animated.View
                  style={[
                    styles.sliderType,
                    {
                      width: containerWidth / 3 || 0,
                      transform: [{ translateX: translateXType }],
                    },
                  ]}
                />

                {typeSegments.map((label, index) => (
                  <>
                    <Pressable
                      key={label}
                      style={styles.radioElement}
                      onPress={() => onChangeType(index)}
                      role='radio'
                      aria-checked={index == currentFilterType}
                    >
                      <BBodyText>{label}</BBodyText>
                    </Pressable>
                    <View
                      key={index}
                      style={[
                        styles.separatorContainer,
                        {
                          opacity:
                            index === 0 && currentFilterType === 2
                              ? 1
                              : index === 1 && currentFilterType === 0
                              ? 1
                              : 0,
                        },
                      ]}
                    >
                      <View style={styles.separator}></View>
                    </View>
                  </>
                ))}
              </View>
            </View>

            {/* Preference */}
            <View style={styles.filterSection}>
              <BBodyText>Preference</BBodyText>
              <View
                style={styles.filterContainer}
                onLayout={(e) =>
                  setContainerWidth(e.nativeEvent.layout.width - 5)
                }
              >
                <Animated.View
                  style={[
                    styles.sliderPreference,
                    {
                      width: containerWidth / 3 || 0,
                      transform: [{ translateX: translateXPreference }],
                    },
                  ]}
                />

                {preferenceSegments.map((label, index) => (
                  <>
                    <Pressable
                      key={label}
                      style={styles.radioElement}
                      onPress={() => onChangePreference(index)}
                      role='radio'
                      aria-checked={index == currentPreferenceType}
                    >
                      <BBodyText>{label}</BBodyText>
                    </Pressable>
                    <View
                      key={index}
                      style={[
                        styles.separatorContainer,
                        {
                          opacity:
                            index === 0 && currentPreferenceType === 2
                              ? 1
                              : index === 1 && currentPreferenceType === 0
                              ? 1
                              : 0,
                        },
                      ]}
                    >
                      <View style={styles.separator}></View>
                    </View>
                  </>
                ))}
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
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: Colors.overlay,
    zIndex: 9999,
  },
  modalView: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 12,
    gap: 12,
    width: "100%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    alignSelf: "stretch",
  },
  filterSection: {
    width: "100%",
    flexDirection: "column",
    gap: 4,
  },
  filterContainer: {
    borderColor: Colors.grey,
    borderWidth: 0.5,
    borderRadius: 8,
    padding: 2,
    flexDirection: "row",
  },
  radioElement: {
    paddingInline: 8,
    paddingBlock: 8,
    borderRadius: 6,
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
  },
  sliderType: {
    position: "absolute",
    top: 2,
    bottom: 2,
    left: 2,
    borderRadius: 6,
    backgroundColor: Colors.primary,
  },
  sliderPreference: {
    position: "absolute",
    top: 2,
    bottom: 2,
    left: 2,
    borderRadius: 6,
    backgroundColor: Colors.primary,
  },
  separatorContainer: {
    paddingBlock: 4,
  },
  separator: {
    backgroundColor: Colors.grey,
    width: 1,
    flex: 1,
  },
});
