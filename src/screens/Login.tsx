/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable quotes */
import React, { useCallback, useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  Alert,
} from 'react-native';
import CustomButton from '../utils/CustomButton';

import {
  connectToDatabase,
  createTable,
  getTableUser,
  setTableUser,
} from '../db/dbUser';

export default function Login({ navigation }: any) {

  const [name, setName] = useState('');
  const [age, setAge] = useState('');

  const getData = useCallback(async () => {
    const db = await connectToDatabase();
    try {
      createTable(db);
      getTableUser(db);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const setData = async () => {
    const db = await connectToDatabase();
    if (name.length === 0 || age.length === 0) {
      Alert.alert('Warning!', 'Please write your data.');
    } else {
      try {
        setTableUser(db, {name: name, age: age});
        navigation.navigate('Home');
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    getData();
  }, []);

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
