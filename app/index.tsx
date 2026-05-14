import { CustomHeader } from "@/components/CustomHeader";
import { FoodCard } from "@/components/FoodCard";
import { Colors } from "@/constants/Colors";
import { useEffect, useState } from "react";
import { View, StyleSheet, Linking, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { FlatGrid } from "react-native-super-grid";

import foodDataJson from "./../assets/food.json";
import { FoodModal } from "@/components/FoodModal";
import BackgroundCurve from "@/components/BackgroundCurve";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { BSmallText } from "@/components/texts/body/BSmallText";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
export interface FoodItem {
  name: string;
  path: string;
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

  // Background curve management
  const [headerHeight, setHeaderHeight] = useState(0);

  // Preferences management
  const [likedFood, setLikedFood] = useState<string[]>([]);
  const [dislikedFood, setDislikedFood] = useState<string[]>([]);

  async function loadData<T>(key: string): Promise<string[]> {
    try {
      const value = await AsyncStorage.getItem(key);

      return value ? JSON.parse(value) : [];
    } catch (e) {
      console.error(e);
      return [];
    }
  }

  async function saveData(key: string, value: string[]) {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error(e);
    }
  }

  async function toggleLikeFood(name: string) {
    const isLiked = likedFood.includes(name);
    const isDisliked = dislikedFood.includes(name);

    let updatedLikes = [...likedFood];
    let updatedDislikes = [...dislikedFood];

    if (isLiked) {
      // remove like
      updatedLikes = updatedLikes.filter((item) => item !== name);
    } else {
      // add like
      updatedLikes.push(name);

      // remove from dislikes if needed
      if (isDisliked) {
        updatedDislikes = updatedDislikes.filter((item) => item !== name);
        setDislikedFood(updatedDislikes);
        await saveData("dislike", updatedDislikes);
      }
    }

    setLikedFood(updatedLikes);
    await saveData("like", updatedLikes);
  }

  async function toggleDislikeFood(name: string) {
    const isDisliked = dislikedFood.includes(name);
    const isLiked = likedFood.includes(name);

    let updatedDislikes = [...dislikedFood];
    let updatedLikes = [...likedFood];

    if (isDisliked) {
      // remove dislike
      updatedDislikes = updatedDislikes.filter((item) => item !== name);
    } else {
      // add dislike
      updatedDislikes.push(name);

      // remove from likes if needed
      if (isLiked) {
        updatedLikes = updatedLikes.filter((item) => item !== name);
        setLikedFood(updatedLikes);
        await saveData("like", updatedLikes);
      }
    }

    setDislikedFood(updatedDislikes);
    await saveData("dislike", updatedDislikes);
  }

  useEffect(() => {
    const fetchFoodPreferences = async () => {
      const dataLiked: string[] = await loadData("like");
      setLikedFood(dataLiked);

      const dataDisliked: string[] = await loadData("dislike");
      setLikedFood(dataDisliked);
    };
    fetchFoodPreferences();
  }, []);

  // Swipe management
  const swipeGesture = Gesture.Pan()
    .activeOffsetX([-20, 20])
    .failOffsetY([-15, 15]) // ignore vertical swipe
    .onEnd((e) => {
      if (modalFood) return;

      if (e.translationX > 60) {
        previousMonth();
      }
      if (e.translationX < -60) {
        nextMonth();
      }
    });

  // External link opening
  const openWebsite = async (url: string) => {
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      await Linking.openURL(url);
    } else {
      console.log("Impossible d'ouvrir l'URL :", url);
    }
  };

  return (
    <>
      {modalFood && (
        <FoodModal
          name={modalFood.name}
          type={modalFood.type}
          img={modalFood.path}
          season={modalFood.season}
          onClose={() => setModalFood(undefined)}
          onLike={(name: string) => toggleLikeFood(name)}
          onDislike={(name: string) => toggleDislikeFood(name)}
          isLiked={likedFood.includes(modalFood.name)}
          isDisliked={dislikedFood.includes(modalFood.name)}
        />
      )}
      <GestureDetector gesture={swipeGesture}>
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
                    img={currentFood[name].path}
                    type={currentFood[name].type}
                    onPress={() => setModalFood(currentFood[name])}
                    isLiked={likedFood.includes(name)}
                    isDisliked={dislikedFood.includes(name)}
                  />
                )}
                ListFooterComponent={
                  <View
                    style={{
                      paddingBottom: 12,
                      display: "flex",
                      paddingInline: 12,
                    }}
                  >
                    <BSmallText
                      onPress={() =>
                        openWebsite(
                          "https://www.greenpeace.fr/guetteur/calendrier/"
                        )
                      }
                      style={{
                        color: Colors.textSecondary,
                        textDecorationLine: "underline",
                        alignSelf: "flex-start",
                      }}
                    >
                      Source : Greenpeace
                    </BSmallText>
                    <BSmallText
                      style={{
                        color: Colors.textSecondary,
                        alignSelf: "flex-start",
                      }}
                    >
                      Application développée par{" "}
                      <Text
                        style={{ textDecorationLine: "underline" }}
                        onPress={() => openWebsite("https://theoblandin.com/")}
                      >
                        Théo Blandin
                      </Text>
                    </BSmallText>
                  </View>
                }
              />
            </View>
          )}
        </View>
      </GestureDetector>
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
