package booksapp.root.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import booksapp.root.services.debugService;
import booksapp.root.services.userGoogleAuthService;
import booksapp.root.services.userRegisterService;

@RestController
@RequestMapping
public class debugController {
    private final debugService debugService;
    @Autowired // Inject the userService dependency
    public debugController(debugService service) {
        this.debugService = service;
    }

     @GetMapping(value = "/addbooks")
    public String ADD_BOOK_DEBUG() {
        /* 
        String jsonString = "[{\"paragraphs\":[{\"comments\":[{\"readerX\":\"Nerve-wracking suspense!\"}],\"content\":\"In the shadows of a city plagued by corruption, journalist Olivia Harper uncovers a trail of dark secrets that lead to the highest echelons of power. As she races against time to expose the truth, Olivia becomes entangled in a web of danger, deception, and a conspiracy that could shake the foundations of society.\"}]},{\"paragraphs\":[{\"comments\":[{\"readerY\":\"Edge-of-your-seat thrills!\"}],\"content\":\"With every revelation, Olivia's life hangs in the balance, and the line between ally and enemy blurs. 'Shattered Reality' is a relentless thriller that will keep you guessing until the final page, where the shocking truth emerges from the depths of a sinister labyrinth.\"}]},{\"paragraphs\":[{\"comments\":[{\"readerZ\":\"A rollercoaster of twists!\"}],\"content\":\"As the cityscape becomes a playground for power-hungry puppeteers, Olivia must navigate the treacherous terrain of truth and deception. In 'Shattered Reality,' the clock is ticking, and every decision could be her last as she races towards an explosive climax that will redefine justice and expose the shadows that lurk in plain sight.\"}]}]";

        List<Map<String, Object>> chaptersContents = convertChaptersContents(jsonString);
        List<String> chaptersTitles = List.of("Web of Deceit", "City of Shadows", "Dangerous Pursuit", "Final Revelation", "Shattered Reality");

        Book thrillerBook2 = new Book("thriller_author_78", chaptersContents, chaptersTitles,
                "Embark on a thrilling journey...", "Thriller", "Shattered Reality", 5, 0);

        this.booksService.addBooks(thrillerBook2);
        return "added thriller book 2";
        */
        this.debugService.addBook2();
        return "added";
    }
}
