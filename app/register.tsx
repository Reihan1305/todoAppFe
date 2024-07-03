import { View } from "react-native";
import { Text, TextInput, Button } from "react-native-paper";
import { Link, router } from "expo-router";
import React, { Component } from "react";
import axios from "axios";

export function register() {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleRegister = async () => {
    try {
      const BeRegister = await axios.post(
        "http://192.168.18.201:3000/user/register",
        { name, email, password }
      );
      console.log(BeRegister.data);

      router.replace("/login");
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
          Register
        </Text>
        <TextInput
          label="Name"
          mode="outlined"
          value={name}
          onChangeText={setName}
          outlineColor="#55AD9B"
          activeOutlineColor="#ACE1AF"
          style={{ width: 250 }}
        />
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
        <View style={{ alignItems: "flex-end", marginTop: 10 }}>
          <Button
            style={{
              backgroundColor: "#55AD9B",
              borderColor: "white",
              padding: 5,
            }}
            onPress={(e) => handleRegister()}
          >
            <Text
              variant="bodyLarge"
              style={{ color: "#fff", fontWeight: 900 }}
            >
              Register
            </Text>
          </Button>
        </View>
        <Text style={{ marginTop: 10 }}>
          are you have Account {""}
          <Link href={"/login"} style={{ color: "#55AD9B", fontWeight: 700 }}>
            Login
          </Link>
        </Text>
      </View>
    </View>
  );
}

export default register;
