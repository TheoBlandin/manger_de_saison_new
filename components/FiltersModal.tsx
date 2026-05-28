import { Colors } from "@/constants/Colors";
import {
  Pressable,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { BLargeText } from "./texts/body/BLargeText";
import { IconButton } from "./IconButton";
import { BBodyText } from "./texts/body/BBodyText";
import { useEffect, useRef, useState } from "react";

import Animated, {
  runOnJS,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import React from "react";

export function FiltersModal({
  onClose,
  currentFilterType,
  currentPreferenceType,
  onChangeType,
  onChangePreference,
}: {
  onClose: () => void;
  currentFilterType: number;
  currentPreferenceType: number;
  onChangeType: (type: number) => void;
  onChangePreference: (preference: number) => void;
}) {
  const typeSegments = ["Tous", "Fruits", "Légumes"];
  const preferenceSegments = ["Tous", "J'aime", "Je n'aime pas"];

  const [containerWidth, setContainerWidth] = useState(0);
  const translateXType = useSharedValue(0);
  const translateXPreference = useSharedValue(0);
  const translateY = useSharedValue(300);

  const isFirstRender = useRef(true);

  useEffect(() => {
    translateY.value = withSpring(0, {
      damping: 120,
      stiffness: 1100,
    });
  }, []);

  const handleClose = () => {
    translateY.value = withTiming(
      300,
      {
        duration: 230,
      },
      (finished) => {
        if (finished) {
          runOnJS(onClose)();
        }
      }
    );
  };

  useEffect(() => {
    if (!containerWidth) return;

    const segmentWidth = containerWidth / 3;
    const target = currentFilterType * segmentWidth;

    if (isFirstRender.current) {
      translateXType.value = target;
    } else {
      translateXType.value = withSpring(target, {
        damping: 120,
        stiffness: 1100,
      });
    }
  }, [currentFilterType, containerWidth]);

  useEffect(() => {
    if (!containerWidth) return;

    const segmentWidth = containerWidth / 3;
    const target = currentPreferenceType * segmentWidth;

    if (isFirstRender.current) {
      translateXPreference.value = target;
      isFirstRender.current = false;
    } else {
      translateXPreference.value = withSpring(target, {
        damping: 120,
        stiffness: 1100,
      });
    }
  }, [currentPreferenceType, containerWidth]);

  return (
    <TouchableWithoutFeedback onPress={handleClose}>
      <View style={styles.overlay}>
        <TouchableWithoutFeedback>
          <Animated.View
            style={[
              styles.modalView,
              { paddingBottom: 24, transform: [{ translateY: translateY }] },
            ]}
          >
            {/* Header */}
            <View style={styles.modalHeader}>
              <BLargeText>Filtres</BLargeText>
              <IconButton
                iconName="x"
                label="Fermer la fenêtre"
                onPress={handleClose}
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
                  <React.Fragment key={label}>
                    <Pressable
                      style={styles.radioElement}
                      onPress={() => onChangeType(index)}
                      role="radio"
                      aria-checked={index == currentFilterType}
                    >
                      <BBodyText>{label}</BBodyText>
                    </Pressable>
                    <View
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
                  </React.Fragment>
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
                  <React.Fragment key={label}>
                    <Pressable
                      key={label}
                      style={styles.radioElement}
                      onPress={() => onChangePreference(index)}
                      role="radio"
                      aria-checked={index == currentPreferenceType}
                    >
                      <BBodyText>{label}</BBodyText>
                    </Pressable>
                    <View
                      key={label + index}
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
                  </React.Fragment>
                ))}
              </View>
            </View>
          </Animated.View>
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
