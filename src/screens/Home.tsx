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
import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase(
  {
    name: 'MainDB',
    location: 'default',
  },
  () => { },
  (error: any) => { console.log(error); }
);

const dbList = SQLite.openDatabase(
  {
    name: 'MainBankDB',
    location: 'default',
  },
  () => { },
  (error: any) => { console.log(error); }
);

export default function Home({ navigation, route }: any) {

  const [name, setName] = useState<string>('');
  const [age, setAge] = useState<string>('');
  const [banks, setBanks] = useState<any>('');

  useEffect(() => {
    createTableBank();
    getData();
  }, []);

  const createTableBank = () => {
    db.transaction((tx: any) => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS `
        + `Banks `
        + `(ID INTEGER PRIMARY KEY AUTOINCREMENT, Age INTEGER, BankName TEXT, Description TEXT, Url TEXT);`
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
            var len = results.rows.length;
            if (len > 0) {
              let userName = results.rows.item(0).Name;
              let userAge = results.rows.item(0).Age;
              setName(userName);
              setAge(userAge);
            }
          }
        );
      });
      dbList.transaction((tx: any) => {
        tx.executeSql(
          `SELECT Age, BankName, Description, Url FROM Banks`,
          [],
          (tx: any, results: any) => {
            const len = results.rows.length;
            if (len > 0) {
              setBanks(results.rows.raw());
            } else {
              fetchBanks();
            }
          }
        );
      });
    } catch (error) {
      console.log(error);
    }
  };

  const fetchBanks = useCallback(async () => {
    const data = await fetch('https://dev.obtenmas.com/catom/api/challenge/banks');
    const resp = await data.json();
    setBanks(resp);
    createDataList();
  }, []);

  const createDataList = async () => {
    if (banks !== '') {
      try {
        await dbList.transaction(async (tx: any) => {
          await dbList.executeSql(
            `INSERT OR REPLACE INTO Banks (Age, BankName, Description, Url) Values `
            + banks.map((i:any) => `(${i.age}, '${i.bankName}', '${i.description}', '${i.url}')`).join(','),
          );
        });
      } catch (error) {
        console.log(error);
      }
    }
  };

  const updateData = async () => {
    if (name.length === 0) {
      Alert.alert('Warning', 'Please write your data.');
    } else {
      try {
        await db.transaction((tx: any) => {
          tx.executeSql(
            `UPDATE Users SET Name=?`,
            [name],
            () => { },
            (error : any) => { console.log(error); }
          );
        });
        await dbList.transaction((tx: any) => {
          tx.executeSql(
            `UPDATE Banks SET Age=?, BankName=?, Description=?, Url=? `
            + banks.map((i:any) => `(${(i.age || i.Age)}, '${(i.bankName || i.BankName)}', '${(i.description || i.Description)}', '${(i.url || i.Url)}')`).join(','),
            () => { Alert.alert('Success', 'Your data bank has been saved.'); },
            (error: any) => { console.log(error); }
          );
        });
      } catch (error) {
        console.log(error);
      }
    }
  };

  const removeData = async () => {
    try {
      db.transaction((tx: any) => {
        tx.executeSql(
          `DELETE FROM Users`,
          [],
          () => { },
          (error: any) => { console.log(error); }
        );
      });
      dbList.transaction((tx: any) => {
        tx.executeSql(
          `DELETE FROM Banks`,
          [],
          () => { navigation.navigate('Login'); },
          (error: any) => { console.log(error); }
        );
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.body}>
      <Text style={styles.text}>
        Welcome {name}
      </Text>
      <Text style={styles.text}>
        Your age is {age}
      </Text>
      <GetDataList banks={banks} />
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
