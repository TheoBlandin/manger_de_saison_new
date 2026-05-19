// Components
import { CustomHeader } from "@/components/CustomHeader";
import { FoodCard } from "@/components/FoodCard";
import { FoodModal } from "@/components/FoodModal";
import BackgroundCurve from "@/components/BackgroundCurve";
import { FiltersModal } from "@/components/FiltersModal";

// Design
import { Colors } from "@/constants/Colors";
import { BSmallText } from "@/components/texts/body/BSmallText";

// React
import { useEffect, useState } from "react";
import { View, StyleSheet, Linking, Text, StatusBar } from "react-native";

// Packages
import { FlatGrid } from "react-native-super-grid";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

// Data
import foodDataJson from "./../assets/food.json";

export interface FoodItem {
  path: string;
  type: "Fruit" | "Légume";
  season: number[];
}

const MONTHS = [
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

export default function Index() {
  /* DATA */
  const allData = foodDataJson as Record<string, FoodItem>;
  const [filteredData, setFilteredData] =
    useState<Record<string, FoodItem>>(allData);
  const [monthlyData, setMonthlyData] = useState<
    Record<string, FoodItem> | undefined
  >(undefined);
  const [searchResult, setSearchResult] = useState<
    Record<string, FoodItem> | undefined
  >(undefined);
  const [displayData, setDisplayData] = useState<
    Record<string, FoodItem> | undefined
  >(undefined);

  /* CALENDAR */
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth()); // id in months array

  function previousMonth() {
    setCurrentMonth((currentMonth - 1 + 12) % 12);
  }

  function nextMonth() {
    setCurrentMonth((currentMonth + 1) % 12);
  }

  // Swipe management
  const swipeGesture = Gesture.Pan()
    .activeOffsetX([-20, 20])
    .failOffsetY([-15, 15]) // ignore vertical swipe
    .onEnd((e) => {
      if (modalFood || modalFilters) return;
      if (e.translationX > 60) {
        previousMonth();
      }
      if (e.translationX < -60) {
        nextMonth();
      }
    });

  function filterByMonth(monthID: number, data: Record<string, FoodItem>) {
    const filtered = Object.fromEntries(
      Object.entries(data).filter(([name, info]) =>
        info.season.includes(monthID)
      )
    );
    return filtered;
  }

  useEffect(() => {
    const filtered = filterByMonth(currentMonth, filteredData);
    setMonthlyData(filtered);
    setDisplayData(filtered);
  }, [currentMonth, filteredData]);

  /* MODALS */
  const [modalFood, setModalFood] = useState<string | undefined>(undefined);
  const [modalFilters, setModalFilters] = useState<boolean>(false);

  /* BACKGROUND CURVE */
  const [headerHeight, setHeaderHeight] = useState(0);

  /* PREFERENCES */
  const [likedFood, setLikedFood] = useState<string[]>([]);
  const [dislikedFood, setDislikedFood] = useState<string[]>([]);

  async function loadData<T>(key: string): Promise<string[]> {
    // key : like or dislike
    try {
      const value = await AsyncStorage.getItem(key);
      return value ? JSON.parse(value) : [];
    } catch (e) {
      console.error(e);
      return [];
    }
  }

  async function saveData(key: string, value: string[]) {
    // key : like or dislike
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error(e);
    }
  }

  async function togglePreferenceFood(preference: string, id: string) {
    const isLiked = likedFood.includes(id);
    const isDisliked = dislikedFood.includes(id);

    let updatedLiked = [...likedFood]; // copy array
    let updatedDisliked = [...dislikedFood];

    if (preference == "like") {
      if (isLiked) {
        // food already liked and user tapped on like button → remove food from liked
        updatedLiked = updatedLiked.filter((item) => item !== id);
      } else {
        // food is disliked or has no preference and user tapped on like button → add food to liked
        updatedLiked.push(id);
        if (isDisliked) {
          // food is disliked and user tapped on like button → remove food from disliked
          updatedDisliked = updatedDisliked.filter((item) => item !== id);
          setDislikedFood(updatedDisliked); // update temporary array
          await saveData("dislike", updatedDisliked); // update permanent local storage
        }
      }
      setLikedFood(updatedLiked); // update temporary array
      await saveData("like", updatedLiked); // update permanent local storage
    } else if (preference == "dislike") {
      if (isDisliked) {
        // food already disliked and user tapped on dislike button → remove food from disliked
        updatedDisliked = updatedDisliked.filter((item) => item !== id);
      } else {
        // food is liked or has no preference and user tapped on dislike button → add food to disliked
        updatedDisliked.push(id);
        if (isLiked) {
          // food is liked and user tapped on dislike button → remove food from liked
          updatedLiked = updatedLiked.filter((item) => item !== id);
          setLikedFood(updatedLiked); // update temporary array
          await saveData("like", updatedLiked); // update permanent local storage
        }
      }
      setDislikedFood(updatedDisliked); // update temporary array
      await saveData("dislike", updatedDisliked); // update permanent local storage
    }
  }

  useEffect(() => {
    const fetchFoodPreferences = async () => {
      const dataLiked: string[] = await loadData("like");
      setLikedFood(dataLiked);

      const dataDisliked: string[] = await loadData("dislike");
      setDislikedFood(dataDisliked);
    };
    fetchFoodPreferences();
  }, []);

  /* FILTERS */
  const [filterType, setFilterType] = useState<number>(0); // 0: Tous - 1: Fruits - 2: Légumes
  const [filterPreference, setFilterPreference] = useState<number>(0); // 0: Tous - 1: J'aime - 2: Je n'aime pas

  useEffect(() => {
    if (filterType == 0 && filterPreference == 0) {
      // no filters
      setFilteredData(allData);
    } else {
      const typeFilterValue =
        filterType === 1 ? "Fruit" : filterType === 2 ? "Légume" : null;

      const filtered = Object.fromEntries(
        Object.entries(allData).filter(
          ([name, data]) =>
            (typeFilterValue === null || data.type === typeFilterValue) &&
            (filterPreference === 1
              ? likedFood.includes(name)
              : filterPreference === 2
              ? dislikedFood.includes(name)
              : true)
        )
      );
      setFilteredData(filtered);
    }
  }, [filterType, filterPreference]);

  /* SEARCH */
  const [searchValue, setSearchValue] = useState<string>("");

  useEffect(() => {
    const normalizedQuery = searchValue.trim().toLowerCase();

    if (monthlyData) {
      if (normalizedQuery != "" && normalizedQuery.length >= 2) {
        const result = Object.fromEntries(
          Object.entries(allData).filter(([name]) => {
            const words = name.toLowerCase().split(/[\s-]+/);

            return words.some((word) => word.startsWith(normalizedQuery));
          })
        );
        setDisplayData(result);
      } else {
        setDisplayData(monthlyData);
      }
    }
  }, [searchValue]);

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
      <StatusBar hidden />
      {modalFood && (
        <FoodModal
          name={modalFood}
          type={allData[modalFood].type}
          img={allData[modalFood].path}
          season={allData[modalFood].season}
          onClose={() => setModalFood(undefined)}
          onPreference={(key: string, id: string) =>
            togglePreferenceFood(key, id)
          }
          isLiked={likedFood.includes(modalFood)}
          isDisliked={dislikedFood.includes(modalFood)}
        />
      )}

      {modalFilters && (
        <FiltersModal
          onClose={() => setModalFilters(false)}
          currentFilterType={filterType}
          currentPreferenceType={filterPreference}
          onChangeType={(type: number) => setFilterType(type)}
          onChangePreference={(preference: number) =>
            setFilterPreference(preference)
          }
        />
      )}

      <GestureDetector gesture={swipeGesture}>
        <View
          style={{
            flex: 1,
            backgroundColor: Colors.background,
          }}
        >
          <CustomHeader
            currentMonth={MONTHS[currentMonth]}
            onPrevious={() => previousMonth()}
            onNext={() => nextMonth()}
            onFilters={() => setModalFilters((prev) => !prev)}
            onSearch={setSearchValue}
            searchValue={searchValue}
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

          {displayData && (
            <View style={{ width: "100%", flex: 1 }}>
              <FlatGrid
                showsVerticalScrollIndicator={false}
                style={styles.gridView}
                itemDimension={115}
                spacing={8}
                data={Object.keys(displayData)}
                renderItem={({ item: name }) => (
                  <FoodCard
                    name={name}
                    img={displayData[name].path}
                    type={displayData[name].type}
                    onPress={() => setModalFood(name)}
                    isLiked={likedFood.includes(name)}
                    isDisliked={dislikedFood.includes(name)}
                  />
                )}
                ListFooterComponent={
                  <View
                    style={{
                      paddingBottom: 24,
                      display: "flex",
                      paddingInline: 12,
                    }}
                  >
                    <BSmallText
                      style={{
                        color: Colors.textSecondary,
                        alignSelf: "flex-start",
                      }}
                    >
                      Source :{" "}
                      <Text
                        style={{ textDecorationLine: "underline" }}
                        onPress={() =>
                          openWebsite(
                            "https://www.greenpeace.fr/guetteur/calendrier/"
                          )
                        }
                      >
                        Greenpeace
                      </Text>
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
