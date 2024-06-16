import AsyncStorage from "@react-native-async-storage/async-storage";
import GlobalUserData from "../_globals/GlobalUserData";

const NUMBER_OF_PERSISTENT_LOGINS:number = 10;

export async function storeUserToAsyncStorage(UID: string, username: string) {
    try {
        await AsyncStorage.setItem("UID", UID);
        await AsyncStorage.setItem("username", username);
        await AsyncStorage.setItem("userLoginNumbers", NUMBER_OF_PERSISTENT_LOGINS.toString());
    }
    catch (error) {
        console.log(error);
    }
}

export async function getUserFromStorage(): Promise<Boolean> {
    let canPerformLogin: boolean = false;

    try {
        const UID: string = await AsyncStorage.getItem('UID');
        if(UID !== null) {
            //it means i have a user stored persistent
            //try to see if any persistent logins are left
            const numberOfLoginsString: string = await AsyncStorage.getItem("userLoginNumbers");

            let numberOfLogins: number = 0;
            if(numberOfLoginsString != null) {
                numberOfLogins = parseInt(numberOfLoginsString);
            }
            console.log(numberOfLogins);

            const username = await AsyncStorage.getItem("username");

            if(username != null) {
                if(numberOfLogins > 0) {
                    GlobalUserData.LOGGED_IN_USER_DATA.uid = UID;
                    GlobalUserData.LOGGED_IN_USER_DATA.username = username;
                    decreaseNumberOfPersistentLogins();
                    canPerformLogin = true;
                }
                else {
                    //user shall log in 
                    //removeUserFromAsyncStorage();
                    canPerformLogin = false;
                }
            }
        }
    }
    catch (error) {
        console.log(error);
    }

    return canPerformLogin;
}


export function removeUserFromAsyncStorage() {
    let success: boolean = false;

    try {
        AsyncStorage.removeItem("UID");
        AsyncStorage.removeItem("username");
        AsyncStorage.removeItem("userLoginNumbers");
        success = true;
    }
    catch (error) {
        console.log("could not remove user from async storage");
    }

    return success;
}

async function decreaseNumberOfPersistentLogins() {
    try {
        await AsyncStorage.getItem("userLoginNumbers").then((value: string) => {
            const numberOfLogins: number = parseInt(value);
            if(numberOfLogins != null) {
                AsyncStorage.setItem("userLoginNumbers", (numberOfLogins - 1).toString());
            }
        })
    }
    catch (error) {
        console.log(error);
    }
}

export function showAllAsyncStorage() {
    AsyncStorage.getAllKeys((err, keys) => {
        AsyncStorage.multiGet(keys, (error, stores) => {
          stores.map((result, i, store) => {
            console.log({ [store[i][0]]: store[i][1] });
            return true;
          });
        });
      });
}
