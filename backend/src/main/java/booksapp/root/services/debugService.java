package booksapp.root.services;

import java.util.List;
import java.util.concurrent.ExecutionException;

import org.springframework.stereotype.Service;

import com.google.cloud.firestore.CollectionReference;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.Firestore;
import com.google.gson.Gson;
import com.google.gson.JsonObject;

import booksapp.root.models.Book;
import booksapp.root.models.GlobalConstants.GlobalConstants;
import booksapp.root.models.bookcomponents.BookChapter;
import booksapp.root.models.bookcomponents.BookParagraph;

@Service
public class debugService {
    private Firestore DB;
    private final CollectionReference booksCollectionDB;

    public debugService(Firestore firestore) {
        this.DB = firestore;
        this.booksCollectionDB = DB.collection(GlobalConstants.BOOKS_COLLECTION_NAME);
    }

    public void addBookDEBUG() {
        Book book = new Book();

        book.setAuthorUsername("gabriela_garcia");
        book.setName("one direction comeback");
        List<String> titles = List.of("Harry", "Niall", "Louis");
        book.setChaptersTitles(titles);
        book.setNumberOfChapters(3);
        book.setDescription("A celestial book about the most wanted even of the year");
        book.setGenre("Fan-Fiction");
        book.setReaders(59);

        BookChapter chapter = new BookChapter();
        BookParagraph paragraph1 = new BookParagraph();
        paragraph1.setContent("In the crescendo of emotions and the delicate notes of love, Amelia and Sebastian\\'s journey takes them through the highs and lows of passion, testing the boundaries of their love. Vienna becomes the backdrop for a love story that transcends time, leaving a melody that echoes through the ages");
        paragraph1.addComment("mauricio", "un amore mio");

        BookParagraph paragraph2 = new BookParagraph();
        paragraph2.setContent("In the crescendo of emotions and the delicate notes of love, Amelia and Sebastian\\'s journey takes them through the highs and lows of passion, testing the boundaries of their love. Vienna becomes the backdrop for a love story that transcends time, leaving a melody that echoes through the ages");
        paragraph2.addComment("buongiorno52_italy", "la capresse bruschetti");
        chapter.addParagraph(paragraph1);
        chapter.addParagraph(paragraph2);
        chapter.addParagraph(paragraph2);

        book.addChapter(chapter);
        book.addChapter(chapter);
        book.addChapter(chapter);

        booksCollectionDB.add(book);
    }

    public void addBook1() {
        // Create a new book instance
        Book book = new Book();
    
        // Set the book's attributes
        book.setAuthorUsername("jane_austen_fan");
        book.setName("A Love Rekindled");
        List<String> titles = List.of("The Meeting", "The Separation", "The Reunion");
        book.setChaptersTitles(titles);
        book.setNumberOfChapters(3);
        book.setDescription("A romantic tale of lost love found anew, set against the picturesque backdrop of the English countryside.");
        book.setGenre("Romance");
        book.setReaders(150);
    
        // Create the first chapter
        BookChapter chapter1 = new BookChapter();
        
        BookParagraph chapter1Paragraph1 = new BookParagraph();
        chapter1Paragraph1.setContent("Emma's heart skipped a beat as she saw him across the room. It had been years, but the connection was instantaneous, as if no time had passed.");
        chapter1Paragraph1.addComment("reader1", "Such a heartfelt reunion!");
        
        BookParagraph chapter1Paragraph2 = new BookParagraph();
        chapter1Paragraph2.setContent("Their eyes locked, and memories of their shared past flooded back, overwhelming them both with a rush of emotions.");
        chapter1Paragraph2.addComment("love_story_fan", "Beautifully written!");
    
        BookParagraph chapter1Paragraph3 = new BookParagraph();
        chapter1Paragraph3.setContent("As they spoke, the room seemed to disappear, leaving just the two of them in a world where only their love existed.");
        chapter1Paragraph3.addComment("romantic_reader", "This made me tear up!");
    
        chapter1.addParagraph(chapter1Paragraph1);
        chapter1.addParagraph(chapter1Paragraph2);
        chapter1.addParagraph(chapter1Paragraph3);
    
        // Create the second chapter
        BookChapter chapter2 = new BookChapter();
    
        BookParagraph chapter2Paragraph1 = new BookParagraph();
        chapter2Paragraph1.setContent("Life had taken them on different paths, but the pain of their separation was a constant companion for both.");
        chapter2Paragraph1.addComment("sad_heart", "So relatable!");
    
        BookParagraph chapter2Paragraph2 = new BookParagraph();
        chapter2Paragraph2.setContent("Emma often wondered what could have been if they had fought harder to stay together.");
        chapter2Paragraph2.addComment("what_if_dreamer", "I wonder that too.");
    
        BookParagraph chapter2Paragraph3 = new BookParagraph();
        chapter2Paragraph3.setContent("Even in their solitude, their love had never truly faded, lingering in the corners of their hearts.");
        chapter2Paragraph3.addComment("love_forever", "True love never dies.");
    
        chapter2.addParagraph(chapter2Paragraph1);
        chapter2.addParagraph(chapter2Paragraph2);
        chapter2.addParagraph(chapter2Paragraph3);
    
        // Create the third chapter
        BookChapter chapter3 = new BookChapter();
    
        BookParagraph chapter3Paragraph1 = new BookParagraph();
        chapter3Paragraph1.setContent("The reunion was not just a chance meeting but a rekindling of the flame that had always burned between them.");
        chapter3Paragraph1.addComment("second_chance", "This is so inspiring!");
    
        BookParagraph chapter3Paragraph2 = new BookParagraph();
        chapter3Paragraph2.setContent("They decided to embrace this second chance, determined not to let love slip through their fingers again.");
        chapter3Paragraph2.addComment("hopeful_romantic", "Go for it!");
    
        BookParagraph chapter3Paragraph3 = new BookParagraph();
        chapter3Paragraph3.setContent("Hand in hand, they walked into a future where their love story would continue to unfold, stronger and more beautiful than ever before.");
        chapter3Paragraph3.addComment("happy_ending", "What a perfect ending!");
    
        chapter3.addParagraph(chapter3Paragraph1);
        chapter3.addParagraph(chapter3Paragraph2);
        chapter3.addParagraph(chapter3Paragraph3);
    
        // Add chapters to the book
        book.addChapter(chapter1);
        book.addChapter(chapter2);
        book.addChapter(chapter3);
    
        // Add the book to the Firebase collection
        booksCollectionDB.add(book);
    }

    public void addBook2() {
        // Create a new book instance
        Book book = new Book();
    
        // Set the book's attributes
        book.setAuthorUsername("casiopeia");
        book.setName("Whispers of the Heart");
        List<String> titles = List.of(
            "A Silent Symphony",
            "Echoes of Eternity",
            "Broken Melody",
            "Shattered Dreams",
            "Rising Crescendo"
        );
        book.setChaptersTitles(titles);
        book.setNumberOfChapters(3);
        book.setDescription("\"Whispers of the Heart\" is a captivating love story that unfolds in the enchanting town of Whispersville, where secrets lie hidden beneath the cobblestone streets and ancient oak trees. In this poignant drama, the author masterfully weaves a tale of love, loss, and the unyielding pursuit of one's true self. At the heart of the narrative is Emily Thompson, a spirited young woman with dreams as vast as the open sky. Her journey begins in a town shrouded in mystery, where the whispers of the past echo through time. As Emily delves into the forgotten pages of the town's history, she discovers not only the enigmatic tales that have haunted Whispersville but also the resilience of the human spirit.");
        book.setGenre("Drama");
        book.setReaders(320);
    
        // Create and populate chapters
        BookChapter chapter1 = new BookChapter();
        BookParagraph chapter1Paragraph1 = new BookParagraph();
        chapter1Paragraph1.setContent("In a small town with big secrets, Emily Thompson struggles against the societal norms that threaten to shatter her dreams. As she battles love, loss, and personal demons, Emily discovers the resilience of the human spirit. 'Whispers of the Heart' is a poignant drama that explores the depths of human relationships and the unyielding pursuit of one's true self.");
        chapter1Paragraph1.addComment("readerX", "Heart-wrenching emotions!");
    
        BookParagraph chapter1Paragraph2 = new BookParagraph();
        chapter1Paragraph2.setContent("Emily Thompson, a spirited young woman with dreams as vast as the open sky, found herself trapped in the suffocating embrace of a town with a mysterious past. The cobbled streets whispered ancient secrets, and the shadows of the past clung to the walls like ghosts refusing to be forgotten. Emily, however, was determined to break free from the invisible chains that bound her to the town. In the heart of Whispersville, a quaint village veiled in secrecy, Emily discovered a dusty, forgotten library. Its shelves were filled with dusty books that seemed to hold the answers to the enigmatic tales circulating through the town. Determined to unveil the truth, Emily delved into the pages of forgotten lore, each paragraph pulling her deeper into the mysteries that surrounded her.");
        chapter1Paragraph2.addComment("readerY", "Tears and triumphs!");
    
        chapter1.addParagraph(chapter1Paragraph1);
        chapter1.addParagraph(chapter1Paragraph2);
    
        BookChapter chapter2 = new BookChapter();
        BookParagraph chapter2Paragraph1 = new BookParagraph();
        chapter2Paragraph1.setContent("Amidst the backdrop of a changing world, Emily's journey intertwines with others seeking solace and redemption. Friendships are forged, and destinies collide, painting a canvas of life's struggles and victories. 'Whispers of the Heart' is a timeless tale that speaks to the universal human experience.");
        chapter2Paragraph1.addComment("niallhoran", "i want pickles");
    
        BookParagraph chapter2Paragraph2 = new BookParagraph();
        chapter2Paragraph2.setContent("As the pages turn, 'Whispers of the Heart' unfolds a tapestry of love, betrayal, and the indomitable spirit of those who refuse to be defined by societal norms. Join Emily on a journey of self-discovery, where every whisper of the heart echoes through the ages.");
        chapter2Paragraph2.addComment("readerZ", "Captivating storytelling!");
    
        chapter2.addParagraph(chapter2Paragraph1);
        chapter2.addParagraph(chapter2Paragraph2);
    
        // Add chapters to the book
        book.addChapter(chapter1);
        book.addChapter(chapter2);
    
        // Add the book to the Firebase collection
        booksCollectionDB.add(book);
    }
    
    public void deleteDebugStuffFromDB() {
        DocumentReference book = booksCollectionDB.document("w0sxgxf3CXm4lsOl7bVb");
        try {
            Book foundBook = book.get().get().toObject(Book.class);
            foundBook.setChaptersTitles(foundBook.getChaptersTitles().subList(0, 4));
            foundBook.getBookContent().getChapters();
            book.set(foundBook);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public String getdocasjson() {
        DocumentReference book = booksCollectionDB.document("w0sxgxf3CXm4lsOl7bVb");
        Gson b = new Gson();
        try {
            return b.toJson(book.get().get().getData());
        } catch (Exception e) {
            e.printStackTrace();
        } 
        return "";
    }
}
