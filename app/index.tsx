// Components
import BackgroundCurve from "@/components/BackgroundCurve";
import { CustomHeader } from "@/components/CustomHeader";
import { FiltersModal } from "@/components/FiltersModal";
import { FoodCard } from "@/components/FoodCard";
import { FoodModal } from "@/components/FoodModal";

// Design
import { BSmallText } from "@/components/texts/body/BSmallText";
import { BBodyText } from "@/components/texts/body/BBodyText";
import { Colors } from "@/constants/Colors";

// React
import { useEffect, useMemo, useState } from "react";
import { FlatList, Linking, StyleSheet, Text, View } from "react-native";

// Packages
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as NavigationBar from "expo-navigation-bar";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { FlatGrid } from "react-native-super-grid";

// Data
import foodJson from "./../assets/food.json";

export interface FoodItem {
  path: string;
  type: "Fruit" | "Légume";
  season: number[];
}
export interface MonthData {
  [key: string]: string[];
}

type IndexedFoods = {
  [month: number]: {
    all: string[];
    Fruit: string[];
    Légume: string[];
  };
};

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
  useEffect(() => {
    NavigationBar.setVisibilityAsync("hidden");
    NavigationBar.setBehaviorAsync("inset-swipe");
  }, []);

  /* CALENDAR */
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1); // month id, 1 == Janvier

  function previousMonth() {
    setCurrentMonth(currentMonth === 1 ? 12 : currentMonth - 1);
  }

  function nextMonth() {
    setCurrentMonth(currentMonth === 12 ? 1 : currentMonth + 1);
  }

  /* MODALS */
  const [modalFood, setModalFood] = useState<string | undefined>(undefined);
  const [modalFilters, setModalFilters] = useState<boolean>(false);

  const swipeGesture = useMemo(
    () =>
      Gesture.Pan()
        .activeOffsetX([-20, 20])
        .failOffsetY([-15, 15])
        .onEnd((e) => {
          if (modalFood || modalFilters) return;
          if (e.translationX > 60) previousMonth();
          if (e.translationX < -60) nextMonth();
        }),
    [modalFood, modalFilters, currentMonth]
  );

  /* SEARCH & FILTERS */
  const [filterType, setFilterType] = useState<number>(0); // 0: Tous - 1: Fruits - 2: Légumes
  const [filterPreference, setFilterPreference] = useState<number>(0); // 0: Tous - 1: J'aime - 2: Je n'aime pas

  const [likedFood, setLikedFood] = useState<string[]>([]);
  const [dislikedFood, setDislikedFood] = useState<string[]>([]);
  const likedSet = useMemo(() => new Set(likedFood), [likedFood]);
  const dislikedSet = useMemo(() => new Set(dislikedFood), [dislikedFood]);

  const [searchValue, setSearchValue] = useState<string>("");

  /* DATA */
  const allData = foodJson as Record<string, FoodItem>;

  // Search database
  const foodSearchIndex = useMemo(() => {
    return Object.entries(allData).map(([name, data]) => {
      const tokens = name.toLowerCase().split(/[\s-]+/);

      return {
        name,
        type: data.type,
        season: data.season,
        tokens,
      };
    });
  }, [allData]);

  // All food element, indexed by month
  const indexedFoods = useMemo<IndexedFoods>(() => {
    const result: IndexedFoods = {};

    // Initialisation
    for (let month = 1; month <= 12; month++) {
      result[month] = {
        all: [],
        Fruit: [],
        Légume: [],
      };
    }

    // Remplissage
    Object.entries(allData).forEach(([name, data]) => {
      data.season.forEach((month) => {
        result[month].all.push(name);
        result[month][data.type].push(name);
      });
    });

    return result;
  }, []);

  const visibleFoods = useMemo(() => {
    // Food elements for current month, filtered by type
    const monthFoods =
      filterType === 1
        ? indexedFoods[currentMonth].Fruit
        : filterType === 2
        ? indexedFoods[currentMonth].Légume
        : indexedFoods[currentMonth].all;

    // Food elements for current month, filtered by type and preferences
    const withPrefs =
      filterPreference === 0
        ? monthFoods
        : monthFoods.filter((name) =>
            filterPreference === 1 ? likedSet.has(name) : dislikedSet.has(name)
          );

    const query = searchValue.trim().toLowerCase();
    if (query.length < 2) return withPrefs;

    return foodSearchIndex
      .filter((item) => item.tokens.some((t) => t.startsWith(query)))
      .map((item) => item.name);
  }, [
    currentMonth,
    filterType,
    filterPreference,
    likedSet,
    dislikedSet,
    searchValue,
    indexedFoods,
    foodSearchIndex,
  ]);

  /* BACKGROUND CURVE */
  const [headerHeight, setHeaderHeight] = useState(0);

  /* PREFERENCES */
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
    const isLiked = likedSet.has(id);
    const isDisliked = dislikedSet.has(id);

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
        }
      }
      setLikedFood(updatedLiked); // update temporary array
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
        }
      }
      setDislikedFood(updatedDisliked); // update temporary array
    }
  }

  useEffect(() => {
    const fetchFoodPreferences = async () => {
      const [liked, disliked] = await Promise.all([
        loadData("like"),
        loadData("dislike"),
      ]);
      setLikedFood(liked);
      setDislikedFood(disliked);
    };
    fetchFoodPreferences();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      saveData("like", likedFood);
      saveData("dislike", dislikedFood)
    }, 500);
  
    return () => clearTimeout(timeout);
  }, [likedFood]);

  // External link opening
  const openWebsite = async (url: string) => {
    const supported = await Linking.openURL(url);

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
            currentMonth={MONTHS[currentMonth - 1]}
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

          <View style={{ width: "100%", flex: 1 }}>
            <FlatList
              style={{ padding: 4 }}
              numColumns={3}
              data={visibleFoods}
              renderItem={({ item: name }) => (
                <FoodCard
                  name={name}
                  img={allData[name].path}
                  type={allData[name].type}
                  onPress={() => setModalFood(name)}
                  isLiked={likedSet.has(name)}
                  isDisliked={dislikedSet.has(name)}
                />
              )}
              ListEmptyComponent={
                <View
                  style={{
                    paddingBottom: 8,
                    display: "flex",
                    paddingInline: 12,
                  }}
                >
                  <BBodyText>
                    Aucun résultat ne correspond à votre recherche
                  </BBodyText>
                </View>
              }
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
                          "https://agirpourlatransition.ademe.fr/acteurs-education/enseigner/catalogue/calendrier-fruits-legumes-saison"
                        )
                      }
                    >
                      Ademe
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
        </View>
      </GestureDetector>
    </>
  );
}

const styles = StyleSheet.create({
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
