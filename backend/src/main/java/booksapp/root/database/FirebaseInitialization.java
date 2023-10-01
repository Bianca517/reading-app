package booksapp.root.database;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.firestore.Firestore;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.io.FileInputStream;
import java.io.InputStream;
import java.io.File;

@Service
public class FirebaseInitialization {
    @PostConstruct //because you want this to run as soon as the app is running
    private void initDB() {
        InputStream serviceAccount = null;

        try {
             //System.out.println(new File(".").getAbsolutePath());
             serviceAccount =
                    new FileInputStream("backend/src/main/resources/serviceAccountKey.json");

            FirebaseOptions options = new FirebaseOptions.Builder()
                    .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                    .build();

            if(FirebaseApp.getApps().isEmpty()) {
                FirebaseApp.initializeApp(options);
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public Firestore getFirebase() {
        return FirestoreClient.getFirestore();
    }
}
