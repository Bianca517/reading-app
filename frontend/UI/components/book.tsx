import React from 'react';
import { StyleSheet, View, Image, Text } from 'react-native';

export default function Book() {
    return (
        <View style={styles.book_container}>
            <Image style={styles.book_cover} source={require('../../book-covers-cloud/duplicity_annatodd2.png')}></Image>
            <Text style={styles.book_title}>Duplicity</Text>
            <Text style={styles.book_author}>annatodd2</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    book_container: {
        flex: 1,
        //backgroundColor: 'yellow',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 5,
        marginHorizontal: 10,
    },
    book_cover: {
        flex: 6.8,
        width: 110,
        height: '100%',
        borderRadius: 3
    },
    book_title: {
        flex: 0.6,
        fontSize: 11,
        fontWeight: "bold",
        fontStyle: 'italic',
    },
    book_author: {
        flex: 0.6,
        fontSize: 8,
        fontWeight: "400"
    }
})