import React, { useState, useEffect, ReactNode } from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity, Dimensions, SafeAreaView } from 'react-native';
import Globals from '../../_globals/Globals';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import { get_book_paragraph_comments } from '../../../services/paragraph-comments-service'
import { ResponseType } from '../../../types';

const windowWidth = Dimensions.get('window').width;

type props = {
    bookID: string;
    chapterNumber: number;
    paragraphNumber: number;
}

type comment = {
    author: string;
    content: string;
}

interface Comment {
    author: string;
    content: string;
}

export default function CommentsView({ bookID, chapterNumber, paragraphNumber } : props) {
    const [paragraphComments, setParagraphComments] = useState<comment[]>([]);

    async function handleComments(comments: Object[]) {
        let commentsOK: Comment[] = [];

        comments.forEach(comment => {
            const author: string = Object.keys(comment)[0];
            const content: string = comment[author];
            const oneComment: Comment = {
                author: author,
                content: content,
            }
            commentsOK.push(oneComment);
        });

        comments.forEach(comment => {
            const author: string = Object.keys(comment)[0];
            const content: string = comment[author];
            const oneComment: Comment = {
                author: author,
                content: content,
            }
            commentsOK.push(oneComment);
        });

        setParagraphComments(commentsOK.map(comment => ({
            author: comment.author,
            content: comment.content,
        })));
    }

    async function loadParagraphComments() {
        //TODO: pls change
        const fetchedResponse: ResponseType = await get_book_paragraph_comments("GRav9LLWPj6ISCOGxfVZ", 0, 0);

        if(fetchedResponse.success) {
            const paragraphCommentsReceived = JSON.parse(fetchedResponse.message);
            console.log(paragraphCommentsReceived);
            handleComments(paragraphCommentsReceived);
        }
    }

    useEffect(() => {
        loadParagraphComments();
    }, []);

    return(
        <SafeAreaView style={styles.fullscreen_view}>
            <View style={styles.header}>
                <FontAwesome name="commenting" size={80} color="white" style={styles.commentImage}/>
                <Text style={styles.totalCommentsText}> {paragraphComments.length} comments </Text>
            </View>

            <View style={styles.whiteline}></View>

            <View style={styles.body}>
                {
                    paragraphComments.map(commentObject => (
                        <View key={commentObject.author} style={styles.oneCommentView}>
                            <Text style={styles.commentContent}>{commentObject.content}</Text>
                            <Text style={styles.commentAuthorText}>{commentObject.author}</Text>
                        </View>
                    ))
                }
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    fullscreen_view: {
            flex: 1,
            backgroundColor: Globals.COLORS.BACKGROUND_GRAY,
            flexDirection: 'column',
    },
    header: {
            flex: 2,
            //backgroundColor: 'green',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center'
    },
    whiteline: {
        backgroundColor: 'white',
        width: '90%',
        height: 2,
        marginHorizontal: 20,
        marginTop: 10,
        marginBottom: 20,
    },
    body: {
        flex: 8,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        //backgroundColor: 'red',
        paddingTop: 5,
        paddingLeft: 40,
    },
    commentImage: {

    },
    totalCommentsText: {
        fontSize: 18,
        fontStyle: 'italic',
        color: 'white',
    },
    commentAuthorText: {
        fontStyle: 'italic',
        color: 'white',
        marginBottom: 5,
    },
    commentContent: {
        fontSize: 18,
        marginBottom: 5,
        color: 'white',
        fontStyle: 'italic',
        fontWeight: '600'
    },
    oneCommentView: {
        borderBottomColor: 'white',
        borderBottomWidth: 2,
        width: windowWidth * 0.7,
        marginBottom: 10,
    }
})