import React, { useState, useEffect } from "react";
import { FlatList, View, ScrollView, RefreshControl } from "react-native";
import {
  Text,
  Button,
  TextInput,
  Checkbox,
  IconButton,
} from "react-native-paper";
import { useLocalSearchParams } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { IList } from "@/lib/type";

const Category = () => {
  const { id } = useLocalSearchParams();
  const [openAdd, setOpenAdd] = useState(false);
  const [value, setValue] = useState("");
  const [categoryDetail, setCategoryDetail] = useState<any>({});
  const [openEdit, setOpenEdit] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const getCategoryDetail = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.get(
        `http://192.168.18.201:3000/category/detail/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCategoryDetail(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const addTodo = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.post(
        `http://192.168.18.201:3000/list`,
        { content: value, categoryId: parseInt(id) },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      getCategoryDetail();
      setOpenAdd(false);
      setValue("");
    } catch (error) {
      console.log(error);
    }
  };

  const editTodo = async (id: number, content: string) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.patch(
        `http://192.168.18.201:3000/list/${id}`,
        { content: content },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedCategoryDetail = { ...categoryDetail };
      updatedCategoryDetail.list = updatedCategoryDetail.list.map(
        (item: IList) => {
          if (item.id === id) {
            return { ...item, content };
          }
          return item;
        }
      );
      setCategoryDetail(updatedCategoryDetail);
      setOpenEdit(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCheck = async (id: number, status: boolean) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.patch(
        `http://192.168.18.201:3000/list/${id}`,
        { isDone: !status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedCategoryDetail = { ...categoryDetail };
      updatedCategoryDetail.list = updatedCategoryDetail.list.map(
        (item: IList) => {
          if (item.id === id) {
            return { ...item, isDone: !status };
          }
          return item;
        }
      );
      setCategoryDetail(updatedCategoryDetail);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const token = await AsyncStorage.getItem("token");
      await axios.delete(`http://192.168.18.201:3000/list/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const updatedList = categoryDetail.list.filter(
        (item: IList) => item.id !== id
      );
      setOpenEdit(false);
      onRefresh();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCategoryDetail();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await getCategoryDetail();
    } catch (error) {
      console.log(error);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <ScrollView>
      <View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 20,
            marginHorizontal: 20,
          }}
        >
          <Text
            variant="headlineLarge"
            style={{ fontWeight: 800, color: "#55AD9B" }}
          >
            {categoryDetail.Content}
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <IconButton
              icon="playlist-edit"
              iconColor="#55AD9B"
              onPress={() => {
                setOpenEdit(!openEdit);
              }}
            />
            <Button
              style={{ backgroundColor: "#55AD9B", marginLeft: 10 }}
              onPress={() => setOpenAdd(!openAdd)}
            >
              <Text style={{ color: "#fff" }}>Add Todo</Text>
            </Button>
          </View>
        </View>
        <FlatList
          data={categoryDetail.list || []}
          keyExtractor={(item: IList, index: number) => index.toString()}
          renderItem={({ item }: { item: IList }) => (
            <RenderItem
              item={item}
              handleCheck={handleCheck}
              handleDelete={handleDelete}
              openEdit={openEdit}
              handleEdit={editTodo}
            />
          )}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
        <View
          style={{
            padding: 20,
            marginHorizontal: 10,
            display: openAdd ? "flex" : "none",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <TextInput
            label="Add Todo"
            mode="outlined"
            style={{ marginBottom: 10, flex: 1 }}
            value={value}
            outlineColor="#55AD9B"
            activeOutlineColor="#ACE1AF"
            onChangeText={(text) => setValue(text)}
          />
          <Button
            onPress={addTodo}
            style={{ backgroundColor: "#55AD9B", marginLeft: 10 }}
          >
            <Text style={{ color: "#ACE1AF" }}>add</Text>
          </Button>
        </View>
      </View>
    </ScrollView>
  );
};

const RenderItem = ({
  item,
  handleCheck,
  handleDelete,
  openEdit,
  handleEdit,
}: {
  item: IList;
  handleCheck: (id: number, status: boolean) => void;
  handleDelete: (id: number) => void;
  openEdit: Boolean;
  handleEdit: (id: number, content: string) => void;
}) => {
  const [editedContent, setEditedContent] = useState(item.content);
  return (
    <>
      {openEdit ? (
        <View
          style={{
            padding: 10,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginHorizontal: 10,
            marginTop: 10,
            marginBottom: 5,
            borderRadius: 10,
            overflow: "hidden",
            backgroundColor: "#55AD9B",
            height: "auto",
          }}
        >
          <TextInput
            style={{ width: 200 }}
            label={"edit"}
            mode="outlined"
            onChangeText={setEditedContent}
            value={editedContent}
            textColor="#55AD9B"
            activeOutlineColor="#55AD9B"
            outlineColor="#E0FBE2"
          />
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <IconButton
              icon="playlist-edit"
              iconColor="#fff"
              onPress={() => {
                handleEdit(item.id, editedContent);
              }}
            />
            <IconButton
              icon="delete"
              iconColor="#fff"
              onPress={() => handleDelete(item.id)}
            />
          </View>
        </View>
      ) : (
        <View
          style={{
            padding: 10,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginHorizontal: 10,
            marginTop: 10,
            marginBottom: 5,
            borderRadius: 10,
            overflow: "hidden",
            backgroundColor: "#55AD9B",
            height: "auto",
          }}
        >
          <Text
            variant="headlineMedium"
            style={{
              color: "#fff",
              textDecorationLine: item.isDone ? "line-through" : "none",
            }}
          >
            {item.content}
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Checkbox
              color="#fff"
              status={item.isDone ? "checked" : "unchecked"}
              onPress={() => handleCheck(item.id, item.isDone)}
            />
          </View>
        </View>
      )}
    </>
  );
};

export default Category;
