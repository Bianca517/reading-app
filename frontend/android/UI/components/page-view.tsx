import React, { useState, useEffect, ReactNode, ReactElement } from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity, Dimensions } from 'react-native';
import Globals from '../_globals/Globals';
import { useNavigation } from '@react-navigation/native';
import GlobalBookData from '../_globals/GlobalBookData';
import { FontAwesome } from '@expo/vector-icons';

const windowWidth = Dimensions.get('window').width;

type textParagraph = {
    id: string;
    content: string;
}

type props = {
    bookID: string;
    chapterNumber: number;
    paragraphsInAPage: textParagraph[];
    selectedFont: string;
    fontSize: number;
    fontColor: string;
}

export default function PageView({ bookID, chapterNumber, paragraphsInAPage, selectedFont, fontSize, fontColor} : props) {
    const navigation = useNavigation();

    function mapTextAndButtons(): ReactNode[] {
        let arrayOfTextsInAPage = [];

        if(paragraphsInAPage.length > 0) {
            paragraphsInAPage.forEach( paragraphMap => {
                if(paragraphMap.content !== "End of chapter") {
                    arrayOfTextsInAPage.push(
                        <View style={[styles.paragraph_view]}>
                            <Text style={[styles.paragraph_text, {fontFamily: selectedFont, fontSize: fontSize, color: fontColor}]}> 
                                {paragraphMap.content}
                            </Text>
                            <TouchableOpacity  
                                style={styles.comments_button}
                                onPress={() => {
                                    navigation.navigate('Comments', {
                                        bookID: bookID,
                                        chapterNumber: chapterNumber,
                                        paragraphNumber: paragraphMap.id
                                    });
                                }}>
                                <FontAwesome name="commenting" size={24} color={fontColor} />
                            </TouchableOpacity>
                        </View>
                    )
                }
                else {
                    arrayOfTextsInAPage.push(
                        <View style={[styles.paragraph_view, {justifyContent: 'center', alignItems: 'center'}]}>
                            <Text style={[styles.paragraph_text, {fontFamily: selectedFont, fontSize: fontSize, color: fontColor}]}> 
                                {paragraphMap.content}
                            </Text>
                        </View>
                    )
                }
            })
        }
        return arrayOfTextsInAPage;
    }

    return(
        <View>
            {mapTextAndButtons()}
        </View>
    );
}

const styles = StyleSheet.create({
    paragraph_view: {
        //backgroundColor: 'pink',
        flexDirection: 'column',
        //justifyContent: 'center',
        //alignItems: 'center',
        //paddingTop: 10,
        //paddingBottom: 100,
        width: windowWidth,
        paddingHorizontal: 25,
    },
    paragraph_text: {
        color: 'white',
        fontWeight: 'normal',
        textAlign: 'justify',
        lineHeight: 20,
    },
    comments_button: {
        marginTop: -20,
        alignSelf: 'flex-end',
        justifyContent: 'space-around'
    }
})