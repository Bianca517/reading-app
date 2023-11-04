import React, {useState} from 'react';
import { StyleSheet, Text, View, SafeAreaView, ScrollView} from 'react-native';

export default function HomePageUI() {
    return (
        <SafeAreaView style = {styles.fullscreen_container}>
            <View style = {styles.header_view_container}>
                <Text style={styles.debug_text}>Home page header</Text>
            </View>

            <View style = {styles.body_view_container}>
                <View style = {styles.body_last_readings_container}>
                    <View style = {styles.section_title_container}>
                        <View style = {styles.left_line_through}></View>

                        <View style = {styles.section_text}>
                            <Text style = {styles.section_text}>
                                Your last readings
                            </Text>
                        </View>

                        <View style = {[styles.right_line_through, {marginLeft: 1}]}></View>
                    </View>

                    <View style = {styles.books_container}>

                    </View>
                </View>

                <View style = {styles.body_for_you_container}>
                <View style = {styles.section_title_container}>
                        <View style = {styles.left_line_through}></View>

                        <View style = {styles.section_text}>
                            <Text style = {styles.section_text}>
                                For you
                            </Text>
                        </View>

                        <View style = {[styles.right_line_through, {marginLeft: -119}]}></View>
                    </View>

                    <View style = {styles.books_container}>

                    </View>
                </View>

                <View style = {styles.body_popular_container}>
                    <View style = {styles.section_title_container}>
                            <View style = {styles.left_line_through}></View>

                            <View style = {styles.section_text}>
                            <Text style = {styles.section_text}>
                                Popular right now
                            </Text>
                            </View>
                            
                            <View style = {[styles.right_line_through, {marginLeft: 0}]}></View>
                    </View>

                    <View style = {styles.books_container}>
                        <ScrollView horizontal={true}>
                            <Text style = {styles.debug_text}>lkjdlsdjf</Text>
                            <Text style = {styles.debug_text}>lkjdlsdjf</Text>
                            <Text style = {styles.debug_text}>lkjdlsdjf</Text>
                        </ScrollView>
                    </View>
                </View>
            </View>

            <View style = {styles.footer_view_container}>
            <Text style={styles.debug_text}>Home page footer</Text>
            </View>
            
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    debug_text: {
        color: "black",
    },
    fullscreen_container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'purple',
    },
    header_view_container: {
        flex: 1,
        backgroundColor: 'pink'
    },    
    body_view_container: {
        flex: 8,
        backgroundColor: 'blue',
        flexDirection: 'column',
        padding: 15
    },
    footer_view_container: {
        flex: 1,
        backgroundColor: 'yellow'
    },
    body_last_readings_container: {
        flex: 1,
        backgroundColor: 'magenta',
        flexDirection: 'column',
        paddingHorizontal: 7,
    },
    body_for_you_container: {
        flex: 1,
        backgroundColor: 'aquamarine',
        flexDirection: 'column',
        paddingHorizontal: 7,
    },
    body_popular_container: {
        flex: 1,
        backgroundColor: 'brown',
        flexDirection: 'column',
        paddingHorizontal: 7,
    },
    section_title_container: {
        flex: 1,
        backgroundColor: 'black',
        flexDirection: 'row',
    },
    right_line_through: {
        flex: 4,
        backgroundColor: 'white',
        height: 2.5,
        marginTop: 15,
        marginLeft: -5
    },
    left_line_through: {
        flex: 1,
        backgroundColor: 'white',
        height: 2.5,
        marginTop: 15,
        marginRight: 0
    },
    section_text: {
        flex: 3,
        marginTop: 3,
        color: 'white',
        fontWeight: 'bold',
        fontSize: 15,
        justifyContent: 'flex-start'
    },
    books_container: {
        flex: 5,
        backgroundColor: 'green',
        borderRadius: 15,
    }
})

