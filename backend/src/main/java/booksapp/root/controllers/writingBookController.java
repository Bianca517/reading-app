package booksapp.root.controllers;


import booksapp.root.models.Book;
import booksapp.root.models.GlobalConstants;
import booksapp.root.services.booksService;
import booksapp.root.services.writingBookService;

import org.apache.http.protocol.HTTP;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.Gson;
import com.google.gson.JsonObject;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;


@CrossOrigin(origins = "http://localhost:8080")
@RestController
@RequestMapping
public class writingBookController {
    private final writingBookService bookService;

    @Autowired // Inject the service dependency
    public writingBookController(writingBookService bookService) {
        this.bookService = bookService;
    }

    //add new chapter to book with BookID
    @PostMapping(value = "/addnewchapter")
    public ResponseEntity<String> addNewChapterToBook(String chapterTitle, String bookID) {
        final int responseStatus = this.bookService.addNewChapterToBook(chapterTitle, bookID);

        JsonObject response = new JsonObject();

        switch(responseStatus) {
            case GlobalConstants.STATUS_SUCCESSFUL:
                response.addProperty("message", "Successfully added new chapter");
                return new ResponseEntity<String>(response.toString(), HttpStatus.OK);
            default:
                response.addProperty("message", "Failed to add new chapter");
                return new ResponseEntity<String>(response.toString(), HttpStatus.BAD_REQUEST);
        }
    }
    //add new paragraph to chapter with ID from book with ID

    //add new comment to paragraph, from chapter, from book

}
