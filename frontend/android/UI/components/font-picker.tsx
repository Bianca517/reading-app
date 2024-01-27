import { StyleSheet, Text, View, Switch, Modal, ScrollView, TouchableHighlight } from 'react-native';
import Globals from '../_globals/Globals';

export const FontPicker = ({ visible, onSelect, onClose }: { visible: boolean; onSelect: (font: string) => void; onClose: () => void }) => {
    const fonts = ['normal', 'sans-serif', 'sans-serif-light', 'sans-serif-medium', 'sans-serif-condensed', 'serif', 'monospace'];

    return (
        <Modal transparent animationType="slide" visible={visible} onRequestClose={onClose}>
            <View style={styles.modalContainer}>
                <ScrollView style={styles.fontList}>
                    {fonts.map((font, index) => (
                        <TouchableHighlight
                            key={index}
                            style={styles.fontItem}
                            underlayColor={Globals.COLORS.BACKGROUND_GRAY}
                            onPress={() => {
                                onSelect(font);
                                onClose();
                            }}
                        >
                            <Text style={[styles.fontText, {fontFamily: font}]}>{font}</Text>
                        </TouchableHighlight>
                    ))}
                </ScrollView>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
     modalContainer: {
         flex: 1,
         justifyContent: 'flex-end',
         backgroundColor: 'rgba(0, 0, 0, 0.5)',
     },
     fontList: {
         backgroundColor: 'white',
         maxHeight: '50%',
         borderTopLeftRadius: 10,
         borderTopRightRadius: 10,
     },
     fontItem: {
         padding: 15,
         borderBottomWidth: 1,
         borderBottomColor: Globals.COLORS.BACKGROUND_GRAY,
     },
     fontText: {
         fontSize: 18,
         color: 'black',
     },
 })
 
 