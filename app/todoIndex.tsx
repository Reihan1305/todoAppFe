import React, { useEffect, useState } from "react";
import { FlatList, View, RefreshControl, ScrollView } from "react-native";
import {
  Text,
  Button,
  TextInput,
  IconButton,
  Portal,
  Modal,
} from "react-native-paper";
import { Link, router, useFocusEffect } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CircularProgress from "react-native-circular-progress-indicator";
import { ICategory, IUser } from "@/lib/type";

const HomeScreen = ({ navigation }: any) => {
  const [openEdit, setOpenEdit] = useState(false);
  const [openInput, setOpenInput] = useState(false);
  const [user, setUser] = useState<IUser>({} as IUser);
  const [content, setContent] = useState("");
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [logoutModal, setLogoutModal] = useState(false);

  const showModal = () => setLogoutModal(true);
  const hideModal = () => setLogoutModal(false);

  const AddCategory = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        console.log("Token not found in AsyncStorage");
        return;
      }

      if (content === "") {
        alert("Please input content");
        setOpenInput(false);
        setContent("");
        return;
      }

      const response = await axios.post(
        "http://192.168.18.201:3000/category",
        { content },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setCategories((prevCategories) => [...prevCategories, response.data]);
      setOpenInput(false);
      setContent("");
    } catch (error) {
      console.log(error);
    }
  };

  const getProfile = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        console.log("Token not found in AsyncStorage");
        return;
      }

      const response = await axios.get(
        "http://192.168.18.201:3000/user/profile",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setUser(response.data);
      setCategories(response.data.categories);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteCategory = async (categoryId: number) => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        console.log("Token not found in AsyncStorage");
        return;
      }

      await axios.delete(`http://192.168.18.201:3000/category/${categoryId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setOpenEdit(false);
      onRefresh();
      setCategories((prevCategories) => {
        return prevCategories.filter((category) => category.id !== categoryId);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await getProfile();
    } catch (error) {
      console.log(error);
    } finally {
      setRefreshing(false);
    }
  };

  const editCategory = async (categoryId: number, content: string) => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        console.log("Token not found in AsyncStorage");
        return;
      }

      const response = await axios.patch(
        `http://192.168.18.201:3000/category/${categoryId}`,
        { Content: content },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setCategories((prevCategories) =>
        prevCategories.map((category) =>
          category.id === categoryId
            ? { ...category, Content: content }
            : category
        )
      );

      setOpenEdit(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.clear();
      router.replace("/");
    } catch (error) {
      console.log(error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      const refreshScreen = async () => {
        await onRefresh();
      };
      refreshScreen();
    }, [])
  );

  useEffect(() => {
    getProfile();
  }, []);

  return (
    <View>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Portal>
            <Modal
              visible={logoutModal}
              style={{
                backgroundColor: "#55AD9B",
                width: 200,
                height: 200,
                justifyContent: "center",
                position: "absolute",
                left: 75,
                top: 200,
                borderRadius: 20,
              }}
            >
              <View>
                <Text
                  variant="bodyLarge"
                  style={{
                    color: "#95D2B3",
                    fontWeight: 800,
                    textAlign: "center",
                  }}
                >
                  Are You sure You want Logout
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    marginTop: 20,
                    gap: 10,
                  }}
                >
                  <Button
                    style={{ backgroundColor: "#B0EBB4" }}
                    onPress={hideModal}
                  >
                    <Text
                      variant="bodyLarge"
                      style={{
                        color: "#95D2B3",
                        fontWeight: 800,
                        textAlign: "center",
                      }}
                    >
                      Go Back
                    </Text>
                  </Button>
                  <Button
                    style={{ backgroundColor: "#95D2B3" }}
                    onPress={handleLogout}
                  >
                    <Text
                      variant="bodyLarge"
                      style={{
                        color: "#B0EBB4",
                        fontWeight: 800,
                        textAlign: "center",
                      }}
                    >
                      Log out
                    </Text>
                  </Button>
                </View>
              </View>
            </Modal>
          </Portal>
          <View>
            <Text
              variant="headlineLarge"
              style={{
                fontWeight: 800,
                color: "#55AD9B",
                marginTop: 20,
                marginHorizontal: 20,
              }}
            >
              Hallo !
            </Text>
            <Text
              variant="headlineLarge"
              style={{
                fontWeight: 800,
                color: "#B0EBB4",
                marginHorizontal: 20,
              }}
            >
              {user.Name}
            </Text>
          </View>
          <IconButton
            icon="logout"
            iconColor="#55AD9B"
            onPress={showModal}
            style={{ marginRight: 20 }}
          />
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 5,
            marginHorizontal: 20,
          }}
        >
          <Text
            variant="headlineLarge"
            style={{ color: "#55AD9B", fontWeight: 800 }}
          >
            Your Activity
          </Text>
          <Button
            style={{ backgroundColor: "#55AD9B" }}
            onPress={() => setOpenInput(!openInput)}
          >
            <Text style={{ color: "#fff" }}>Add</Text>
          </Button>
          <IconButton
            icon="playlist-edit"
            iconColor="#55AD9B"
            onPress={() => setOpenEdit(!openEdit)}
          />
        </View>
        <FlatList
          data={categories}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <RenderItem
              item={item}
              openEdit={openEdit}
              deleteCategory={deleteCategory}
              editCategory={editCategory}
              listTotal={item.list ? item.list.length : 0}
              listDone={item.onDone ? item.onDone : 0}
            />
          )}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginHorizontal: 10,
            display: openInput ? "flex" : "none",
            width: "auto",
          }}
        >
          <TextInput
            value={content}
            onChangeText={setContent}
            label="Add Activity"
            mode="outlined"
            outlineColor="#55AD9B"
            activeOutlineColor="#ACE1AF"
            style={{ flex: 1, marginRight: 10 }}
          />
          <Button
            onPress={AddCategory}
            style={{ backgroundColor: "#55AD9B", marginLeft: 10 }}
          >
            <Text style={{ color: "#ACE1AF" }}>add</Text>
          </Button>
        </View>
      </ScrollView>
    </View>
  );
};

const RenderItem = ({
  item,
  deleteCategory,
  openEdit,
  editCategory,
  listTotal,
  listDone,
}: {
  item: ICategory;
  deleteCategory: (categoryId: number) => void;
  openEdit: boolean;
  editCategory: (categoryId: number, content: string) => void;
  listTotal: number;
  listDone: number;
}) => {
  const [editedContent, setEditedContent] = useState(item.Content);
  const [totalListDone, setTotalListDone] = useState(0);

  useEffect(() => {
    const newBagi = listTotal !== 0 ? listDone / listTotal : 0;
    const newTotalListDone = listTotal === 0 ? 0 : newBagi * 100;

    setTotalListDone(isNaN(newTotalListDone) ? 0 : newTotalListDone);
  }, [listTotal, listDone]);

  return (
    <>
      {openEdit ? (
        <View
          style={{
            padding: 10,
            width: "auto",
            flexDirection: "row",
            justifyContent: "space-between",
            marginHorizontal: 10,
            marginTop: 10,
            marginBottom: 5,
            borderRadius: 10,
            overflow: "scroll",
            backgroundColor: "#95D2B3",
            height: "auto",
            alignItems: "center",
          }}
        >
          <View style={{ width: 200 }}>
            <TextInput
              label={"edit"}
              mode="outlined"
              onChangeText={setEditedContent}
              value={editedContent}
              textColor="#55AD9B"
              activeOutlineColor="#55AD9B"
              outlineColor="#E0FBE2"
            />
          </View>
          <View style={{ flexDirection: "row" }}>
            <IconButton
              icon="playlist-edit"
              iconColor="#55AD9B"
              onPress={() => editCategory(item.id, editedContent)}
            />
            <IconButton
              icon="delete"
              iconColor="#55AD9B"
              onPress={() => deleteCategory(item.id)}
            />
          </View>
        </View>
      ) : (
        <View
          style={{
            padding: 10,
            width: "auto",
            height: "auto",
            flexDirection: "row",
            justifyContent: "space-between",
            marginHorizontal: 10,
            marginTop: 10,
            marginBottom: 5,
            borderRadius: 10,
            overflow: "scroll",
            backgroundColor: "#95D2B3",
            alignItems: "center",
          }}
        >
          <View>
            <Link href={`category/${item.id}`}>
              <Text
                variant="headlineMedium"
                style={{ color: "#55AD9B", fontWeight: 900 }}
              >
                {item.Content}
              </Text>
            </Link>
          </View>
          <View>
            <CircularProgress
              value={totalListDone}
              progressValueColor={"#55AD9B"}
              activeStrokeColor={"#B0EBB4"}
              valueSuffix="%"
            />
          </View>
        </View>
      )}
    </>
  );
};

export default HomeScreen;
