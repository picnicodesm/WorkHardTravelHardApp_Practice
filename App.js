import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import { Fontisto } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { theme } from "./colors";

const STORAGE_KEY = "@toDos";

export default function App() {
  const [working, setWorking] = useState(true);
  const [text, setText] = useState("");
  const [toDos, setToDos] = useState({});
  const [finished, setFinished] = useState(false);
  useEffect(() => {
    loadToDos();
    btnCheck();
  }, []);
  const travel = () => {
    setWorking(false);
    setBtn("false");
  };
  const work = () => {
    setWorking(true);
    setBtn("true");
  };
  const onChangeText = (payload) => setText(payload);
  const saveToDos = async (toSave) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  };
  const loadToDos = async () => {
    const s = await AsyncStorage.getItem(STORAGE_KEY);
    setToDos(JSON.parse(s));
  };
  const setBtn = async (trueOrFalse) => {
    await AsyncStorage.setItem("btn", trueOrFalse);
  };
  const btnCheck = async () => {
    const btnLocate = await AsyncStorage.getItem("btn");
    setWorking(JSON.parse(btnLocate));
  };

  const addToDo = () => {
    if (text === "") {
      return;
    }
    const newToDos = { ...toDos, [Date.now()]: { text, working, finished } };
    setToDos(newToDos);
    saveToDos(newToDos);
    setText("");
  };
  const deleteToDo = (key) => {
    Alert.alert("Delete To Do?", "Are you sure?", [
      { text: "Canel" },
      {
        text: "I'm sure",
        onPress: async () => {
          const newToDos = { ...toDos };
          delete newToDos[key];
          setToDos(newToDos);
          saveToDos(newToDos);
        },
      },
    ]);
  };
  const finishedToDo = (key) => {
    const newToDos = { ...toDos };
    if (newToDos[key].finished) {
      newToDos[key].finished = false;
    } else {
      newToDos[key].finished = true;
    }
    setToDos(newToDos);
    saveToDos(newToDos);
  };
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <TouchableOpacity onPress={work}>
          <Text
            style={{ ...styles.btnText, color: working ? "white" : theme.gray }}
          >
            Work
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={travel}>
          <Text
            style={{
              ...styles.btnText,
              color: !working ? "white" : theme.gray,
            }}
          >
            Travel
          </Text>
        </TouchableOpacity>
      </View>

      <TextInput
        onSubmitEditing={addToDo}
        onChangeText={onChangeText}
        returnKeyType="done"
        value={text}
        placeholder={working ? "Add To Do" : "Where do you want to go?"}
        style={styles.input}
      />
      <ScrollView>
        {Object.keys(toDos).map((key) =>
          toDos[key].working === working ? (
            <View style={styles.toDo} key={key}>
              <Text
                style={{
                  ...styles.toDoText,
                  textDecorationLine: toDos[key].finished
                    ? "line-through"
                    : "none",
                }}
              >
                {toDos[key].text}
              </Text>
              <View style={styles.buttons}>
                <TouchableOpacity
                  onPress={() => finishedToDo(key)}
                  style={styles.button}
                >
                  <Fontisto name="check" size={18} color={theme.toDoBg} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => deleteToDo(key)}
                  style={styles.button}
                >
                  <Fontisto name="trash" size={18} color={theme.toDoBg} />
                </TouchableOpacity>
              </View>
            </View>
          ) : null
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
    paddingHorizontal: 20,
  },
  header: {
    justifyContent: "space-between",
    flexDirection: "row",
    marginTop: 100,
  },
  btnText: {
    fontSize: 38,
    fontWeight: "600",
  },
  input: {
    backgroundColor: "white",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginVertical: 20,
    fontSize: 18,
  },
  toDo: {
    backgroundColor: theme.gray,
    marginBottom: 10,
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  toDoText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
  buttons: {
    flexDirection: "row",
  },
  button: {
    marginLeft: 15,
  },
});
