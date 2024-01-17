/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable quotes */
import React, { useCallback, useEffect, useState } from 'react';
import {
  FlatList,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
} from 'react-native';
import ItemList from './ItemList';
import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase(
  {
    name: 'MainBankDB',
    location: 'default',
  },
  () => { },
  (error: any) => { console.log(error); }
);

export default function GetDataList({banks}: any) {
  const [banksList, setBanksList] = useState<any>('');

  useEffect(() => {
    if (banks.length > 0) {
      fetchBanks();
    } else {
      fetchData();
    }
  }, []);

  const fetchBanks = () => {
    try {
      db.transaction((tx: any) => {
        tx.executeSql(
          `SELECT Age, BankName, Description, Url FROM Banks`,
          [],
          (tx: any, results: any) => {
            const len = results.rows.length;
            if (len > 0) {
              setBanksList(results.rows.raw());
            }
          }
        );
      });
    } catch (error) {
      console.log(error);
    }
  };

  const fetchData = useCallback(async () => {
    const data = await fetch('https://dev.obtenmas.com/catom/api/challenge/banks');
    const resp = await data.json();
    setBanksList(resp);
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      {banksList.length > 0 ? (
        <ScrollView style={styles.scrollView} horizontal={true}>
          <FlatList
            data={banksList}
            renderItem={({item}) => (
              <ItemList
                bankName={item.bankName || item.BankName}
                description={item.description || item.Description}
                url={item.url || item.Url}
                age={item.age || item.Age}
              />
            )}
            keyExtractor={item => item.age || item.Age}
          />
        </ScrollView>
      ) : (
        <Text style={styles.notLoad}>
          Sorry, no information to display.
        </Text>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  safeArea: {
    height: 260,
    marginVertical: 50,
  },
  scrollView: {
    marginHorizontal: 20,
  },
  notLoad: {
    fontSize: 30,
    color: '#ff5733',
  },
});
