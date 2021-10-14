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
  Platform,
} from "react-native";
import { Fontisto, Entypo } from "@expo/vector-icons";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { theme } from "./colors";

const STORAGE_KEY = "@toDos";

export default function App() {
  const [working, setWorking] = useState(true);
  const [text, setText] = useState("");
  const [subText, setSubText] = useState("");
  const [toDos, setToDos] = useState({});
  const [finished, setFinished] = useState(false);
  const [editor, setEditor] = useState(false);
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
  const onSubChangeText = (payload) => setSubText(payload);
  const saveToDos = async (toSave) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  };
  const loadToDos = async () => {
    const s = await AsyncStorage.getItem(STORAGE_KEY);
    if (s) {
      setToDos(JSON.parse(s));
    }
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
    const newToDos = {
      ...toDos,
      [Date.now()]: { text, working, finished, editor },
    };
    setToDos(newToDos);
    saveToDos(newToDos);
    setText("");
  };
  const deleteToDo = (key) => {
    if (Platform.OS === "web") {
      const ok = confirm("Do you want to delete this To Do?");
      if (ok) {
        const newToDos = { ...toDos };
        delete newToDos[key];
        setToDos(newToDos);
        saveToDos(newToDos);
      }
    } else {
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
    }
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
  const editToDo = (key) => {
    const newToDos = { ...toDos };
    newToDos[key].text = subText;
    setToDos(newToDos);
    saveToDos(newToDos);
    setSubText("");
    editText(key);
  };
  const editText = (key) => {
    const newToDos = { ...toDos };
    if (newToDos[key].editor) {
      newToDos[key].editor = false;
    } else {
      newToDos[key].editor = true;
    }
    setToDos(newToDos);
    saveToDos(newToDos);
    console.log(newToDos[key].editor);
  };
  const textEdit = (key) => {
    if (toDos[key].editor) {
      return (
        <TextInput
          onSubmitEditing={() => editToDo(key)}
          onChangeText={onSubChangeText}
          returnKeyType="done"
          value={subText}
          placeholder={working ? "edit your todo" : "edit your place"}
          style={styles.subInput}
        />
      );
    } else {
      return paintText(key);
    }
  };
  const paintText = (key) => {
    return (
      <Text
        style={{
          ...styles.toDoText,
          textDecorationLine: toDos[key].finished ? "line-through" : "none",
        }}
      >
        {toDos[key].text}
      </Text>
    );
  };
  const showList = (key) => {
    return (
      <View style={styles.toDo} key={key}>
        {textEdit(key)}
        <View style={styles.buttons}>
          <TouchableOpacity onPress={() => editText(key)} style={styles.button}>
            <Entypo name="pencil" size={22} color={theme.toDoBg} />
          </TouchableOpacity>
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
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <TouchableOpacity onPress={work}>
          <Text
            style={{
              fontSize: 38,
              fontWeight: "600",
              color: working ? "white" : theme.gray,
            }}
          >
            Work
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={travel}>
          <Text
            style={{
              fontSize: 38,
              fontWeight: "600",
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
          toDos[key].working === working ? showList(key) : null
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

  input: {
    backgroundColor: "white",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginVertical: 20,
    fontSize: 18,
  },
  subInput: {
    backgroundColor: "white",
    width: "70%",
    borderRadius: 30,
    paddingHorizontal: 20,
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
