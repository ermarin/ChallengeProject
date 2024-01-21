/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable quotes */
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
} from 'react-native';
import ItemList from './ItemList';

export default function GetDataList({banks}: any) {
  const [banksList, setBanksList] = useState<any>('');

  useEffect(() => {
    if(banks?.length > 0) {
      setBanksList(banks);
    }
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
