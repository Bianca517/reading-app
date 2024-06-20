import { Playback } from "expo-av/build/AV";
import Globals from "../_globals/Globals";
import { AVPlaybackStatus, Audio } from 'expo-av';

export function createUriForSong(bookId: string, chapterNumber: string): string {
    let url: string = Globals.SONG_URI_TEMPLATE;
    let customString: string = bookId + '_' + chapterNumber;
    url = url.replace(Globals.SONG_URI_STRING_TO_REPLACE, customString);  
    console.log(url);
    return url; 
}

export async function loadSound(bookId: string, chapterNumber: number): Promise<Playback>  {
    console.log('Loading Sound');
    try {
        const { sound } = await Audio.Sound.createAsync( { uri: createUriForSong(bookId, chapterNumber.toString()) });
        return sound;
        //setIsLoaded(true);
    }
    catch {
        //setIsLoaded(false);
        return null;
    }
} 

export async function playSound(sound: Playback) {
    console.log('Playing Sound');
    if(sound) {
        await sound.playAsync();
    }
}

export async function stopSound(sound: Playback) {
    console.log("Pausing Sound");
    if(sound) {
        await sound.pauseAsync();
    }
}

