/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable quotes */
import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Alert,
} from 'react-native';
import GetDataList from '../components/GetDataList';
import CustomButton from '../utils/CustomButton';

import {
  connectToDatabase,
  getTableUser,
  deleteTableUser,
} from '../db/dbUser';

import {
  connectToDatabaseBanks,
  createTableBanks,
  getTableBanks,
  setTableBanks,
  updateTableBanks,
  deleteTableBanks,
} from '../db/dbBanks';

export default function Home({ navigation, route }: any) {

  const [name, setName] = useState<string>('');
  const [age, setAge] = useState<number>(0);
  const [banks, setBanks] = useState<any>('');

  const getData = useCallback(async () => {
    const db = await connectToDatabase();
    const dbBanks = await connectToDatabaseBanks();
    try {
      createTableBanks(dbBanks);
      const user = await getTableUser(db);
      const banksList = await getTableBanks(dbBanks);
      setName(user.userName);
      setAge(user.userAge);
      if (Object.values(banksList)[0] === 0) {
        setBanks(banksList);
      } else {
        fetchBanks();
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  const fetchBanks = useCallback(async () => {
    const data = await fetch('https://dev.obtenmas.com/catom/api/challenge/banks');
    const resp = await data.json();
    setBanks(resp);
    await createDataList();
  }, []);

  const createDataList = async () => {
    const dbBanks = await connectToDatabaseBanks();
    if (banks !== '') {
      try {
        setTableBanks(dbBanks, banks);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const updateData = async () => {
    const dbBanks = await connectToDatabaseBanks();
    if (name.length === 0) {
      Alert.alert('Warning', 'Please write your data.');
    } else {
      try {
        updateTableBanks(dbBanks, banks);
        Alert.alert('Success', 'Your data bank has been saved.')
      } catch (error) {
        console.log(error);
      }
    }
  };

  const removeData = async () => {
    const db = await connectToDatabase();
    const dbBanks = await connectToDatabaseBanks();
    try {
      deleteTableUser(db);
      deleteTableBanks(dbBanks);
      Alert.alert('Success', 'Your data success removed');
      navigation.navigate('Login');
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <View style={styles.body}>
      <Text style={styles.text}>
        Welcome {name}
      </Text>
      <Text style={styles.text}>
        Your age is {age}
      </Text>
      {banks && (
        <GetDataList banks={banks} />
      )}
      <CustomButton
        title={'Save Data'}
        color={'#ff7f00'}
        onPressFunction={updateData}
      />
      <CustomButton
        title={'Remove Data'}
        color={'#f40100'}
        onPressFunction={removeData}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    alignItems: 'center',
  },
  text: {
    fontSize: 40,
    margin: 10,
  },
  input: {
    width: 300,
    borderWidth: 1,
    borderColor: '#555555',
    borderRadius: 10,
    backgroundColor: '#ffffff',
    textAlign: 'center',
    fontSize: 20,
    marginTop: 130,
    marginBottom: 10,
  },
});
