import * as Location from "expo-location";
import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import {ImageBackground,View, Text, Dimensions, StyleSheet, ActivityIndicator, ScrollView } from "react-native";
import {Fontisto} from "@expo/vector-icons";
const { width: SCREEN_WIDTH } = Dimensions.get("window");

const API_KEY = "d45f59e7f95b22ce744965336746d122";

const icons = {
  Clouds : "cloudy",
  Clear : "day-sunny",
  Atmosphere : "",
  Snow : "snowflake",
  Rain : "rain",
  Drizzle: "cloud-drizzle",
  Thunderstorm : "thunderstorm-outline",
};
export default function App() {
  const [city, setCity] = useState("Loading...");
  const [days, setDays] = useState([]);
  const [ok, setOk] = useState(true);

  const ask = async () => {
    const { granted } = await Location.requestForegroundPermissionsAsync();
    if (!granted) {
      setOk(false);
    }
    const {
      coords: { latitude, longitude },
    } = await Location.getCurrentPositionAsync({ accuracy: 5 });
    const location = await Location.reverseGeocodeAsync(
      { latitude, longitude },
      { useGoogleMaps: false }
    );
    setCity(location[0].city);
    const response = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${35}&lon=${129}&exclude=alerts&appid=${API_KEY}&units=metric`); // 35 129
    const json = await response.json();
    setDays(json.daily);
  };
  useEffect(() => {
    ask();
  }, []);
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <ImageBackground source={require('./app/ksks.jpg')} style={styles.city}>
        <Text style={styles.cityName}>Busan</Text>
      </ImageBackground>
      <ScrollView
        pagingEnabled
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.weather}
      >
        {days.length === 0 ? <View style = {{...styles.day, alignItems: "center"}}>
          <ActivityIndicator color="white" style={{marginTop:10}} size="large"></ActivityIndicator>
          </View> : (
          days.map((day, index) => 
          <View key={index} style = {styles.day}>
            <View style={{
              flexDirection:"row", 
              alignItems: "center", 
              width: "100%",
              justifyContent: "space-between",
              }}>
              <Text style={styles.temp}>
                {parseFloat(day.temp.day).toFixed(1)}
              </Text>
              <Text style={styles.date}>
              {new Date(day.dt * 1000).toString().substring(0, 10)}
              </Text>
              <Fontisto name={icons[day.weather[0].main]} size={70} color="white" />
            </View>

            <Text style={styles.description}>{day.weather[0].main}</Text>
            <Text style={styles.tinyText}>{day.weather[0].description}</Text>
            <Text style={styles.tinyText}>2016548045박준호</Text>
          </View>)
          )}
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "teal",
  },
  city: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    color : "white",
  },
  cityName: {
    fontSize: 70,
    fontWeight: "500",
    color : "black",
  },
  weather: {},
  day: {
    width: SCREEN_WIDTH,
    alignItems: "flex-start",
    paddingHorizontal:20,
  },
  temp: {
    marginTop: 50,
    fontWeight: "600",
    fontSize: 100,
    color : "white",
  },
  description: {
    marginTop: -10,
    fontSize: 30,
    color : "white",
    fontWeight:"500",
  },
  tinyText: {
    fontSize:25,
    marginTop: -5,
    color : "white",
    fontWeight:"500",
  },
  date:{
    fontSize : 20,
    color : "white",
    fontWeight:"500",
  },
});