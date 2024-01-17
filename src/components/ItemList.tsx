/* eslint-disable prettier/prettier */
import React from 'react';
import {
    Image,
    StyleSheet,
    Text,
    View,
  } from 'react-native';

type ItemProps = {
  bankName: String,
  description: String,
  url: String,
  age: number,
};

export default function ItemList({ bankName, description, url, age }:ItemProps) {
  return (
    <View style={styles.item}>
      <Image source={{uri: `${url}`}} style={styles.logos} />
      <Text style={styles.title}>
        {bankName}
      </Text>
      <Text style={styles.desc}>
        {description}
      </Text>
      <Text style={styles.desc}>
        {age} años de trayectoria
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: '#555555',
    paddingHorizontal: 10,
    paddingVertical: 30,
    marginVertical: 8,
    marginHorizontal: 16,
    alignContent: 'center',
  },
  title: {
    color: '#ffffff',
    fontSize: 30,
  },
  desc: {
    color: '#eeeeee',
    fontSize: 20,
  },
  logos: {
    width: 50,
    height: 50,
  },
});
