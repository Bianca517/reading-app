package booksapp.root.controllers;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.concurrent.ExecutionException;

import javax.print.attribute.standard.Media;

import org.checkerframework.checker.guieffect.qual.UI;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import org.springframework.http.HttpHeaders;
import com.google.cloud.storage.Blob;
import org.springframework.http.MediaType;
import com.google.gson.Gson;
import com.google.gson.JsonObject;

import booksapp.root.models.BookDTO;
import booksapp.root.models.GlobalConstants.GlobalConstants;
import booksapp.root.services.booksCommentsService;
import booksapp.root.services.userDataService;
import booksapp.root.services.userReadingService;

@CrossOrigin(origins = "http://localhost:8080")
@RestController
@RequestMapping
public class userReadingController {
    private final userReadingService userReadingService;
    private final userDataService userDataService;
    private final booksCommentsService bookCommentsService;
    private final List<String> monthsInYear = List.of("january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december");

    @Autowired // Inject the service dependency
    public userReadingController(userReadingService userReadingService, userDataService userDataService, booksCommentsService booksCommentsService) {
        this.userReadingService = userReadingService;
        this.userDataService = userDataService;
        this.bookCommentsService = booksCommentsService;
    }

    @GetMapping(value = "/getuserinterests")
    public String getUserBookInterests(@RequestParam String UID) throws ExecutionException, InterruptedException {
        ArrayList<String> userInterests = this.userReadingService.getUsersGeneresInterests(UID);
        return userInterests.toString();
    }

    @GetMapping(value = "/getusercurrentreadings")
    public ResponseEntity<ArrayList<BookDTO>> getUserCurrentReadings(@RequestParam String UID) {
        ArrayList<BookDTO> books = null;
        int status = GlobalConstants.STATUS_FAILED;

        if (UID != null) {
            books = this.userReadingService.getUserCurrentReadings(UID);
            if (books != null && !books.isEmpty()) {
                status = GlobalConstants.STATUS_SUCCESSFUL;
            }
        }
   
        if (status == GlobalConstants.STATUS_SUCCESSFUL) {
            return new ResponseEntity<>(books, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping(value = "/getusersfinalizedreadings")
    public ResponseEntity<ArrayList<BookDTO>> getUserFinalizedReadings(@RequestParam String UID) {
        ArrayList<BookDTO> books = null;
        int status = GlobalConstants.STATUS_FAILED;

        if (UID != null) {
            books = this.userReadingService.getUserFinalizedReadings(UID);
            if (books != null && !books.isEmpty()) {
                status = GlobalConstants.STATUS_SUCCESSFUL;
            }
        }
   
        if (status == GlobalConstants.STATUS_SUCCESSFUL) {
            return new ResponseEntity<>(books, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping(value = "/getusersplannedreadings")
    public ResponseEntity<ArrayList<BookDTO>> getUserPlannedReadings(@RequestParam String UID, String monthName) throws ExecutionException, InterruptedException {
        ArrayList<BookDTO> books = null;
        int status = GlobalConstants.STATUS_FAILED;

        if (UID != null) {
            books = this.userReadingService.getUserPlannedReadingsForMonth(UID, monthName);
            if (books != null && !books.isEmpty()) {
                status = GlobalConstants.STATUS_SUCCESSFUL;
            }
        }
   
        if (status == GlobalConstants.STATUS_SUCCESSFUL) {
            return new ResponseEntity<>(books, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping(value = "/planbookformonth")
    public ResponseEntity<String> planBookForMonth(@RequestParam String UID, String monthName, String bookID)                                       throws ExecutionException, InterruptedException {
        int returnedStatus = -1;
        
        if((null != UID) && (null != monthName) && (monthsInYear.contains(monthName.toLowerCase())) && (null != bookID)) {
            returnedStatus = this.userReadingService.addBookAsPlannedForMonth(UID, monthName, bookID); 
        }
        
        if(returnedStatus == 0) {
            return new ResponseEntity<String>("Successfully planned book with ID " + bookID + " for month " + monthName, HttpStatus.OK);
        }
        else {
            return new ResponseEntity<String>("Could not plan book for month " + monthName, HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping(value = "/removebookplannedformonth")
    public ResponseEntity<String> removePlannedBookForMonth(@RequestParam String UID, String monthName, String bookID) throws ExecutionException, InterruptedException {
        boolean success = this.userReadingService.removeBookAsPlannedForMonth(UID, monthName, bookID);
        if(success) {
            return new ResponseEntity<String>("Successfully removed book with ID " + bookID + " for month " + monthName, HttpStatus.OK);
        }
        else {
            return new ResponseEntity<String>("Could not remove book for month " + monthName, HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping(value = "/addbooktolibrary")
    public ResponseEntity<String> addBooktolibrary(@RequestParam String userID, String bookID) {
        int status = GlobalConstants.STATUS_FAILED;

        if(userID != null && bookID != null) {
            status = this.userReadingService.addBookToCurrentReadings(userID, bookID);
        }
      
        JsonObject response = new JsonObject();
        if(status == GlobalConstants.STATUS_SUCCESSFUL) {
            response.addProperty("status", Integer.toString(status));
            return new ResponseEntity<String>(response.toString(), HttpStatus.OK);
        }
        else {
            response.addProperty("status", Integer.toString(status));
            return new ResponseEntity<String>(response.toString(), HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping(value = "/addbooktofinalizedbooks")
    public String addBooktoFinalizedBooks(@RequestParam String userID, String bookID) throws ExecutionException, InterruptedException {
        int returnedStatus = this.userReadingService.addBookToFinalizedReadings(userID, bookID);
        HashMap<String, String> returnJson = new HashMap<String, String>();
        returnJson.put("status", returnedStatus == 0 ? "Successfully added book to current readings" : "Book could not be added to current readings");
        Gson gson = new Gson();
        String gsonData = gson.toJson(returnJson);
        return gsonData;
    }

    @PostMapping(value = "/addcommenttobook")
    public String addCommentToBook(@RequestParam String UID, String comment, Integer paragraphID, Integer chapterNumber, String bookID) throws ExecutionException, InterruptedException {
        String username = userDataService.getUsernameByUserId(UID);
        int returnedStatus = bookCommentsService.addNewComment(username, comment, paragraphID, chapterNumber, bookID);

        HashMap<String, Integer> returnJson = new HashMap<String, Integer>();
        returnJson.put("status", returnedStatus);
       
        Gson gson = new Gson();
        String gsonData = gson.toJson(returnJson);
        return gsonData;
    }

    @GetMapping("/getsong")
    public ResponseEntity<Blob> getMP3File(@RequestParam String bookID, @RequestParam String chapterNumber) throws IOException {
        // Retrieve MP3 file from Firebase Storage
        Blob stream = this.userReadingService.getsong(bookID, chapterNumber);

        // Set content type as audio/mpeg
        HttpHeaders headers = new HttpHeaders();
        //headers.setContentType(new MediaType("audio", "mpeg"));
        
        // Return the file as response
        return ResponseEntity.ok()
                .headers(headers)
                .body(stream);
    }

    @DeleteMapping(value = "/removebookfromcurrent")
    public ResponseEntity<String> deleteBookFromCurrentReadings(@RequestParam String UID, @RequestParam String bookID) {
        int status = GlobalConstants.STATUS_FAILED;
    
        if(bookID != null && UID != null) {
            status = this.userReadingService.deleteBookFromCurrentReadings(UID, bookID);
        }

        JsonObject response = new JsonObject();
        if(status == GlobalConstants.STATUS_SUCCESSFUL) {
            response.addProperty("status", Integer.toString(status));
            return new ResponseEntity<String>(response.toString(), HttpStatus.OK);
        }
        else {
            response.addProperty("status", Integer.toString(status));
            return new ResponseEntity<String>(response.toString(), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping(value = "/getuserpositioninbook")
    public ResponseEntity<String> getUserPositionInBook(@RequestParam String UID, @RequestParam String bookID) {
        int status = GlobalConstants.STATUS_FAILED;
        int chapterNumber = 0;

        if(bookID != null) {
            ArrayList<Integer> returnedStatus = this.userReadingService.getUserPositionInBook(UID, bookID);
            status = returnedStatus.get(0);
            chapterNumber = returnedStatus.get(1);
        }

        JsonObject response = new JsonObject();
        if(status == GlobalConstants.STATUS_SUCCESSFUL) {
            response.addProperty("status", Integer.toString(status));
            response.addProperty("chapterNumber", Integer.toString(chapterNumber));
            return new ResponseEntity<String>(response.toString(), HttpStatus.OK);
        }
        else {
            response.addProperty("status", Integer.toString(status));
            response.addProperty("chapterNumber", Integer.toString(chapterNumber));
            return new ResponseEntity<String>(response.toString(), HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping(value = "/updateuserpositioninbook")
    public ResponseEntity<String> updateUserPositionInBook(@RequestParam String UID, @RequestParam String bookID, @RequestParam String chapterNumber) {
        int status = GlobalConstants.STATUS_FAILED;

        if(bookID != null && UID != null && chapterNumber != null) {
            status = this.userReadingService.updateUserPositionInBook(UID, bookID, chapterNumber);
        }

        JsonObject response = new JsonObject();
        if(status == GlobalConstants.STATUS_SUCCESSFUL) {
            response.addProperty("status", Integer.toString(status));
            return new ResponseEntity<String>(response.toString(), HttpStatus.OK);
        }
        else {
            response.addProperty("status", Integer.toString(status));
            return new ResponseEntity<String>(response.toString(), HttpStatus.BAD_REQUEST);
        }
    }


    @GetMapping(value = "/getallbooksinlibrarywithpositions")
    public ResponseEntity<HashMap<String, String>> getAllBookInLibraryWithPosition(@RequestParam String UID) {
        HashMap<String, String> result = null;

        if(UID != null) {
            result = this.userReadingService.getAllBookInLibraryWithPosition(UID);
        }

        JsonObject response = new JsonObject();
        if(result == null) {
            return new ResponseEntity<>(result, HttpStatus.OK);
        }
        else {

            return new ResponseEntity<>(result, HttpStatus.BAD_REQUEST);
        }
    }
}
