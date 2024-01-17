/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable quotes */
import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  Alert,
} from 'react-native';
import CustomButton from '../utils/CustomButton';
import SQLite from 'react-native-sqlite-storage';

const db: any = SQLite.openDatabase(
  {
    name: 'MainDB',
    location: 'default',
  },
  () => { },
  (error: any) => { console.log(error); }
);

export default function Login({ navigation }: any) {

  const [name, setName] = useState('');
  const [age, setAge] = useState('');

  useEffect(() => {
    createTable();
    getData();
  }, []);

  const createTable = () => {
    db.transaction((tx: any) => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS `
        + `Users `
        + `(ID INTEGER PRIMARY KEY AUTOINCREMENT, Name TEXT, Age INTEGER);`
      );
    });
  };

  const getData = () => {
    try {
      db.transaction((tx: any) => {
        tx.executeSql(
          `SELECT Name, Age FROM Users`,
          [],
          (tx: any, results: any) => {
            const len = results.rows.length;
            if (len > 0) {
              navigation.navigate('Home');
            }
          }
        );
      });
    } catch (error) {
      console.log(error);
    }
  };

  const setData = async () => {
    if (name.length === 0 || age.length === 0) {
      Alert.alert('Warning!', 'Please write your data.');
    } else {
      try {
        await db.transaction(async (tx: any) => {
          await db.executeSql(
            `INSERT INTO Users (Name, Age) VALUES (?,?)`,
            [name, age]
          );
        });
        navigation.navigate('Home');
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <View style={styles.body}>
      <Text style={styles.text}>&nbsp;</Text>
      <TextInput
        style={styles.input}
        placeholder={'Enter your name'}
        onChangeText={(value) => setName(value)}
      />
      <TextInput
        style={styles.input}
        placeholder={'Enter your age'}
        onChangeText={(value) => setAge(value)}
      />
      <CustomButton
        title={'Login'}
        color={'#1eb900'}
        onPressFunction={setData}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#0080ff',
  },
  text: {
    fontSize: 30,
    color: '#ffffff',
    marginBottom: 130,
  },
  input: {
    width: 300,
    borderWidth: 1,
    borderColor: '#555555',
    borderRadius: 10,
    backgroundColor: '#ffffff',
    textAlign: 'center',
    fontSize: 20,
    marginBottom: 10,
  },
});
