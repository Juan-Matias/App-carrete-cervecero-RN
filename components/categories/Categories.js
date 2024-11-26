import React from "react";
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { useNavigation } from "@react-navigation/native";
import { urlFor } from "../../sanity.js";

const { width } = Dimensions.get("window");

const CategoryItem = ({ category, isActive, onPress }) => {
  const primaryColor = "#FFDF8A";
  const secondaryColor = "#E2E2E2";
  const imageWidth = wp(14);
  const imageHeight = hp(6);

  // Estilos animados específicos de cada categoría
  const animatedButtonStyle = useAnimatedStyle(() => ({
    backgroundColor: withTiming(isActive ? primaryColor : secondaryColor, {
      duration: 100,
    }),
  }));

  const animatedImageStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: withTiming(isActive ? 1.12 : 1.15, { duration: 200 }) },
    ],
    opacity: withTiming(isActive ? 1 : 0.6, { duration: 200 }),
  }));

  return (
    <View className="items-center mr-5">
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        <Animated.View
          className="p-2 rounded-2xl shadow"
          style={animatedButtonStyle}
        >
          <Animated.Image
            style={[
              {
                width: imageWidth,
                height: imageHeight,
                borderRadius: 10,
                resizeMode: "cover",
              },
              animatedImageStyle,
            ]}
            source={{ uri: urlFor(category.image).url() }}
          />
        </Animated.View>
      </TouchableOpacity>
      <Text
        className={`text-sm mt-2 ${isActive ? "font-semibold text-gray-900" : "text-zinc-700"}`}
      >
        {category.name}
      </Text>
    </View>
  );
};

const Categories = ({ categories, activeCategory, setActiveCategory }) => {
  const navigation = useNavigation();

  const handlePress = (categoryName) => {
    setActiveCategory(categoryName);
    navigation.navigate("Products", { categoryName });
  };

  return (
    <View className="px-4">
      <View className="mb-6">
        <Text className="text-2xl font-bold text-zinc-700">Categorías</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 5 }}
      >
        {(categories || []).map((category) => (
          <CategoryItem
            key={category._id}
            category={category}
            isActive={category._id === activeCategory}
            onPress={() => handlePress(category.name)}
          />
        ))}
      </ScrollView>
    </View>
  );
};

export default Categories;
