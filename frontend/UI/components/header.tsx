import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function Header({ page_name }) {
    const navigation = useNavigation();
    return (
        <View style={styles.header_view_container}>
            <View style={[styles.navbar_container, { marginTop: 10 }]}>
                <Text style={styles.page_title}> {page_name} </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    header_view_container: {
        flex: 1,
        paddingHorizontal: 15
        //backgroundColor: 'pink'
    },
    navbar_container: {
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: '#3c3a3b',
        height: 35,
        borderRadius: 15,
        marginHorizontal: 25,
    },
    page_title: {
        color: '#eb00ff',
        fontStyle: 'normal',
        fontWeight: "500",
        fontSize: 30,
        marginLeft: 15,
        fontFamily: ''
    }
})