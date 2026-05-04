import { CustomHeader } from "@/components/CustomHeader";
import { FoodCard } from "@/components/FoodCard";
import { Colors } from "@/constants/Colors";
import { useEffect, useState } from "react";
import { View, StyleSheet, Modal } from "react-native";
import {
  useSafeAreaInsets,
  SafeAreaProvider,
} from "react-native-safe-area-context";

import { FlatGrid } from "react-native-super-grid";

import foodDataJson from "./../assets/food.json";
import { FoodModal } from "@/components/FoodModal";
import BackgroundCurve from "@/components/BackgroundCurve";

export interface FoodItem {
  name: string;
  type: "Fruit" | "Légume";
  season: number[];
}

export default function Index() {
  const insets = useSafeAreaInsets();

  // Months managment
  const months = [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ];

  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth()); // id in months array

  function previousMonth() {
    setCurrentMonth((currentMonth - 1 + 12) % 12);
  }

  function nextMonth() {
    setCurrentMonth((currentMonth + 1) % 12);
  }

  // Grid managment
  const foodData = foodDataJson as Record<string, FoodItem>;
  const [currentFood, setCurrentFood] = useState<
    Record<string, FoodItem> | undefined
  >(undefined);

  function filterFood(monthId: number) {
    const filtered = Object.fromEntries(
      Object.entries(foodData).filter(([name, data]) =>
        data.season.includes(monthId)
      )
    );
    return filtered;
  }

  useEffect(() => {
    if (currentMonth) setCurrentFood(filterFood(currentMonth));
  }, [currentMonth]);

  // Modal managment
  const [modalFood, setModalFood] = useState<FoodItem | undefined>(undefined);

  const [headerHeight, setHeaderHeight] = useState(0);

  return (
    <>
      {modalFood && (
        <FoodModal
          name={modalFood.name}
          type={modalFood.type}
          img="./../assets/food/abricot.svg"
          season={modalFood.season}
          onClose={() => setModalFood(undefined)}
        />
      )}

      <View
        style={{
          flex: 1,
          backgroundColor: Colors.background,
          paddingBottom: insets.bottom,
        }}
      >
        <CustomHeader
          currentMonth={months[currentMonth]}
          previous={() => previousMonth()}
          next={() => nextMonth()}
          onLayout={(e) => setHeaderHeight(e.nativeEvent.layout.height)}
        />

        <View
          style={{
            position: "absolute",
            top: headerHeight,
            left: 0,
            right: 0,
          }}
        >
          <BackgroundCurve />
        </View>

        {currentFood && (
          <View style={{ width: "100%", flex: 1 }}>
            <FlatGrid
              showsVerticalScrollIndicator={false}
              style={styles.gridView}
              itemDimension={115}
              spacing={8}
              data={Object.keys(currentFood)}
              renderItem={({ item: name }) => (
                <FoodCard
                  name={name}
                  type={currentFood[name].type}
                  onPress={() => setModalFood(currentFood[name])}
                />
              )}
            />
          </View>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  gridView: {
    width: "100%",
  },
  backgroundShapes: {
    position: "absolute",
    top: 100,
    width: "100%",
  },
  rect: {
    backgroundColor: Colors.primary,
    height: 64,
    width: "100%",
  },
  curve: {
    backgroundColor: Colors.primary,
    height: 20,
    borderRadius: 50,
    transform: [{ translateY: -10 }],
  },
});
