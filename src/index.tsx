import React, { useState, useEffect } from "react";
import { Text, View } from "react-native";

import * as Font from "expo-font";
import AppLoading from "expo-app-loading";
import { setCustomText } from "react-native-global-props";

import Form from "./components/Form";

import styles from "./styles";

export default function App() {
  const [fontLoaded, setFontLoaded] = useState(false);

  const fetchFonts = async () => {
    await Font.loadAsync({
      "ubuntu-bold": require("../assets/fonts/Ubuntu-Bold.ttf"),
      "ubuntu-italic": require("../assets/fonts/Ubuntu-Italic.ttf"),
      "ubuntu-regular": require("../assets/fonts/Ubuntu-Regular.ttf"),
    });
    setFontLoaded(true);
    defaultFonts();
  };

  const defaultFonts = () => {
    const customTextProps = {
      style: {
        fontFamily: "ubuntu-regular",
      },
    };
    setCustomText(customTextProps);
  };

  useEffect(() => {
    fetchFonts();
  }, []);

  if (!fontLoaded) {
    return <AppLoading />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gerador de PDF Criative</Text>
      <Form />
    </View>
  );
}
