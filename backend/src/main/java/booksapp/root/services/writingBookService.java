package booksapp.root.services;

import booksapp.root.models.Book;
import booksapp.root.models.GlobalConstants;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.CollectionReference;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.Query;
import com.google.cloud.firestore.QueryDocumentSnapshot;
import com.google.cloud.firestore.QuerySnapshot;
import com.google.cloud.firestore.WriteResult;
import com.google.gson.Gson;
import com.google.cloud.firestore.Query.Direction;
import com.google.firebase.cloud.StorageClient;
import com.google.firebase.database.GenericTypeIndicator;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.origin.SystemEnvironmentOrigin;
import org.springframework.stereotype.Service;

import java.io.Console;
import java.lang.reflect.Array;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Dictionary;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;

@Service
public class writingBookService {
    private Firestore DB;
    private final CollectionReference booksCollectionDB;
    
    public writingBookService(Firestore firestore) {
        this.DB = firestore;
        this.booksCollectionDB = DB.collection(GlobalConstants.BOOKS_COLLECTION_NAME);
    }

    //add new chapter to book with BookID
    @SuppressWarnings("unchecked")
    public int addNewChapterToBook(String chapterTitle, String bookID) {
        // get the document refference from book with book ID
        DocumentReference book = null;
        HashMap<String, Object> updatedFields = new HashMap<String, Object>();
        Integer numberOfChapters = 0;
    
        try {
            book = booksCollectionDB.document(bookID);
            if(book != null) {
                //add the new title
                ArrayList<String> chaptersTitles = new ArrayList<String>();
                chaptersTitles = (ArrayList<String>)book.get().get().get(GlobalConstants.BOOK_COLLECTION_FIELDS[3]);
                System.out.println(chaptersTitles);
                chaptersTitles.add(chapterTitle);
                updatedFields.put(GlobalConstants.BOOK_COLLECTION_FIELDS[3], chaptersTitles);
                
                //increase number of chapters
                numberOfChapters = book.get().get().get(GlobalConstants.BOOK_COLLECTION_FIELDS[5], numberOfChapters.getClass());
                numberOfChapters++;
                updatedFields.put(GlobalConstants.BOOK_COLLECTION_FIELDS[5], numberOfChapters);

                //add new empty chapter content
                ArrayList<Object> chaptersContents = new ArrayList<Object>();
                chaptersContents = (ArrayList<Object>)book.get().get().get(GlobalConstants.BOOK_COLLECTION_FIELDS[4]);
                
                HashMap<String, ArrayList<HashMap<String, Object>>> newEmptyChapter = createNewChapterContent();
                chaptersContents.add(newEmptyChapter);
                updatedFields.put(GlobalConstants.BOOK_COLLECTION_FIELDS[4], chaptersContents);

                System.out.println(updatedFields);
                book.update(updatedFields);

                return GlobalConstants.STATUS_SUCCESSFUL;
            }
        } catch (Exception e) {
            e.printStackTrace();
        } 

        return GlobalConstants.STATUS_FAILED;
    }

    private HashMap<String, ArrayList<HashMap<String, Object>>> createNewChapterContent() {
        HashMap<String, Object> paragraph = new HashMap<String, Object>();
        paragraph.put(GlobalConstants.PARAGRAPH_FIELDS[1], "");
        paragraph.put(GlobalConstants.PARAGRAPH_FIELDS[0], new ArrayList<HashMap<String, String>>());
        

        //ArrayList<HashMap<String, String>> comments = new ArrayList<HashMap<String, String>>();
        //HashMap<String, String> comment = new HashMap<String, String>(); //has username & content fields
        //comments.add(comment);
        //HashMap<String, String> content = new HashMap<String, String>();

        ArrayList<HashMap<String, Object>> paragraphs = new ArrayList<HashMap<String, Object>>();
        paragraphs.add(paragraph);

        HashMap<String, ArrayList<HashMap<String, Object>>> chapter = new HashMap<String, ArrayList<HashMap<String, Object>>>();
        chapter.put(GlobalConstants.BOOK_COLLECTION_FIELDS[10], paragraphs);

        //ArrayList<HashMap<Integer, ArrayList<HashMap<String, Object>>>> chapters = new ArrayList<HashMap<Integer, ArrayList<HashMap<String, Object>>>>();
        //chapters.add(chapter);

        return chapter;
    }
    //add new paragraph to chapter with ID from book with ID

}
