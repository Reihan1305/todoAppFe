import { View } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import React, { Component } from "react";
import { Link, router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export const login = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleLogin = async () => {
    try {
      const loginresponse = await axios.post(
        "http://192.168.18.201:3000/user/login",
        { email, password }
      );
      await AsyncStorage.setItem("token", loginresponse.data.access_token);
      router.replace("/todoIndex");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <View>
        <Text
          variant="headlineLarge"
          style={{ color: "#55AD9B", fontWeight: 900, textAlign: "left" }}
        >
          Login
        </Text>
        <TextInput
          label="Email"
          mode="outlined"
          value={email}
          onChangeText={setEmail}
          outlineColor="#55AD9B"
          activeOutlineColor="#ACE1AF"
          style={{ width: 250 }}
        />
        <TextInput
          label="Password"
          mode="outlined"
          value={password}
          onChangeText={setPassword}
          outlineColor="#55AD9B"
          activeOutlineColor="#ACE1AF"
          secureTextEntry
          style={{ width: 250 }}
        />
        <View style={{ alignItems: "flex-end", marginTop: 10, width: "auto" }}>
          <Button
            style={{
              backgroundColor: "#55AD9B",
              borderColor: "white",
              padding: 5,
            }}
            onPress={(e) => {
              handleLogin();
            }}
          >
            <Text
              variant="bodyLarge"
              style={{ color: "#fff", fontWeight: 900 }}
            >
              Login
            </Text>
          </Button>
        </View>
        <Text style={{ marginTop: 10 }}>
          Dont have Account yet ? {""}
          <Link
            href={"/register"}
            style={{ color: "#55AD9B", fontWeight: 700 }}
          >
            Register
          </Link>
        </Text>
      </View>
    </View>
  );
};

export default login;
