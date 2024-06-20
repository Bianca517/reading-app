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
    
    public void addBook3() {
        // Create a new book instance
        Book book = new Book();
    
        // Set the book's attributes
        book.setAuthorUsername("lolaUnderTheSun");
        book.setName("Under the Moonlight");
        List<String> titles = List.of("A Chance Encounter", "Growing Closer", "Love Blooms");
        book.setChaptersTitles(titles);
        book.setNumberOfChapters(3);
        book.setDescription("An unexpected meeting under the moonlight sparks a love that transcends time.");
        book.setGenre("Romance");
        book.setReaders(230);
    
        // Create the first chapter
        BookChapter chapter1 = new BookChapter();
    
        BookParagraph chapter1Paragraph1 = new BookParagraph();
        chapter1Paragraph1.setContent("Lily's evening walks were her solace, but tonight felt different as she saw a mysterious figure by the lake.");
        chapter1Paragraph1.addComment("moonlight_dreamer", "Such an enchanting start!");
    
        BookParagraph chapter1Paragraph2 = new BookParagraph();
        chapter1Paragraph2.setContent("The moonlight cast a silver glow on the water, and their eyes met, creating an unspoken connection.");
        chapter1Paragraph2.addComment("romantic_gaze", "I love how this is described!");
    
        BookParagraph chapter1Paragraph3 = new BookParagraph();
        chapter1Paragraph3.setContent("They exchanged a few words, but it was the shared silence that spoke volumes.");
        chapter1Paragraph3.addComment("silent_whispers", "Beautifully put!");
    
        chapter1.addParagraph(chapter1Paragraph1);
        chapter1.addParagraph(chapter1Paragraph2);
        chapter1.addParagraph(chapter1Paragraph3);
    
        // Create the second chapter
        BookChapter chapter2 = new BookChapter();
    
        BookParagraph chapter2Paragraph1 = new BookParagraph();
        chapter2Paragraph1.setContent("Over the weeks, their chance encounters turned into planned meetings, each one deepening their bond.");
        chapter2Paragraph1.addComment("growing_closer", "This is so sweet!");
    
        BookParagraph chapter2Paragraph2 = new BookParagraph();
        chapter2Paragraph2.setContent("Lily felt a connection she hadn't experienced before, a pull towards a future she hadn't dared to dream.");
        chapter2Paragraph2.addComment("hopeful_heart", "I feel the same way sometimes.");
    
        BookParagraph chapter2Paragraph3 = new BookParagraph();
        chapter2Paragraph3.setContent("Their conversations flowed effortlessly, revealing shared dreams and secret desires.");
        chapter2Paragraph3.addComment("dreamers", "I love their chemistry!");
    
        chapter2.addParagraph(chapter2Paragraph1);
        chapter2.addParagraph(chapter2Paragraph2);
        chapter2.addParagraph(chapter2Paragraph3);
    
        // Create the third chapter
        BookChapter chapter3 = new BookChapter();
    
        BookParagraph chapter3Paragraph1 = new BookParagraph();
        chapter3Paragraph1.setContent("One night, under the full moon, they confessed their love, sealing it with a tender kiss.");
        chapter3Paragraph1.addComment("first_kiss", "So romantic!");
    
        BookParagraph chapter3Paragraph2 = new BookParagraph();
        chapter3Paragraph2.setContent("Their love story blossomed, proving that sometimes, love is found in the most unexpected places.");
        chapter3Paragraph2.addComment("unexpected_love", "Absolutely beautiful!");
    
        BookParagraph chapter3Paragraph3 = new BookParagraph();
        chapter3Paragraph3.setContent("Hand in hand, they walked towards a future illuminated by the moonlight and their love.");
        chapter3Paragraph3.addComment("eternal_love", "Perfect ending!");
    
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
    
    public void addBook4() {
        // Create a new book instance
        Book book = new Book();
    
        // Set the book's attributes
        book.setAuthorUsername("lolaUnderTheSun");
        book.setName("Hearts Entwined");
        List<String> titles = List.of("Fateful Meeting", "Challenges and Triumphs", "Eternal Bond");
        book.setChaptersTitles(titles);
        book.setNumberOfChapters(3);
        book.setDescription("A timeless love story of two hearts finding each other and overcoming obstacles.");
        book.setGenre("Romance");
        book.setReaders(175);
    
        // Create the first chapter
        BookChapter chapter1 = new BookChapter();
    
        BookParagraph chapter1Paragraph1 = new BookParagraph();
        chapter1Paragraph1.setContent("Sarah never imagined that a simple trip to the coffee shop would change her life forever.");
        chapter1Paragraph1.addComment("unexpected_love", "Love this beginning!");
    
        BookParagraph chapter1Paragraph2 = new BookParagraph();
        chapter1Paragraph2.setContent("She bumped into Jake, spilling coffee everywhere, but his warm smile melted her embarrassment.");
        chapter1Paragraph2.addComment("meet_cute", "Such a cute encounter!");
    
        BookParagraph chapter1Paragraph3 = new BookParagraph();
        chapter1Paragraph3.setContent("Their connection was instant, as if the universe had conspired to bring them together.");
        chapter1Paragraph3.addComment("fate", "Destiny at work!");
    
        chapter1.addParagraph(chapter1Paragraph1);
        chapter1.addParagraph(chapter1Paragraph2);
        chapter1.addParagraph(chapter1Paragraph3);
    
        // Create the second chapter
        BookChapter chapter2 = new BookChapter();
    
        BookParagraph chapter2Paragraph1 = new BookParagraph();
        chapter2Paragraph1.setContent("They faced many challenges, but their love grew stronger with each trial.");
        chapter2Paragraph1.addComment("stronger_together", "Love conquers all!");
    
        BookParagraph chapter2Paragraph2 = new BookParagraph();
        chapter2Paragraph2.setContent("Sarah and Jake supported each other, finding strength in their bond.");
        chapter2Paragraph2.addComment("support", "That's true love!");
    
        BookParagraph chapter2Paragraph3 = new BookParagraph();
        chapter2Paragraph3.setContent("Their shared dreams and aspirations fueled their determination to overcome every obstacle.");
        chapter2Paragraph3.addComment("dream_team", "Together, they can do anything!");
    
        chapter2.addParagraph(chapter2Paragraph1);
        chapter2.addParagraph(chapter2Paragraph2);
        chapter2.addParagraph(chapter2Paragraph3);
    
        // Create the third chapter
        BookChapter chapter3 = new BookChapter();
    
        BookParagraph chapter3Paragraph1 = new BookParagraph();
        chapter3Paragraph1.setContent("On a beautiful spring day, Jake proposed, and Sarah's heart overflowed with joy.");
        chapter3Paragraph1.addComment("proposal", "So touching!");
    
        BookParagraph chapter3Paragraph2 = new BookParagraph();
        chapter3Paragraph2.setContent("Their wedding was a celebration of love, filled with laughter and happy tears.");
        chapter3Paragraph2.addComment("wedding_bells", "Such a perfect day!");
    
        BookParagraph chapter3Paragraph3 = new BookParagraph();
        chapter3Paragraph3.setContent("They vowed to love each other forever, their hearts forever entwined.");
        chapter3Paragraph3.addComment("eternal_love", "A beautiful ending!");
    
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
    
    public void addBook5() {
        // Create a new book instance
        Book book = new Book();
    
        // Set the book's attributes
        book.setAuthorUsername("lolaUnderTheSun");
        book.setName("City Lights and Love");
        List<String> titles = List.of("Urban Encounter", "Love in Bloom", "Together Forever");
        book.setChaptersTitles(titles);
        book.setNumberOfChapters(3);
        book.setDescription("A modern love story set against the bustling backdrop of the city that never sleeps.");
        book.setGenre("Romance");
        book.setReaders(190);
    
        // Create the first chapter
        BookChapter chapter1 = new BookChapter();
    
        BookParagraph chapter1Paragraph1 = new BookParagraph();
        chapter1Paragraph1.setContent("In the city that never sleeps, Mia's chance encounter with Alex felt like fate.");
        chapter1Paragraph1.addComment("city_love", "New York magic!");
    
        BookParagraph chapter1Paragraph2 = new BookParagraph();
        chapter1Paragraph2.setContent("Their eyes met across a crowded subway, and a spark ignited between them.");
        chapter1Paragraph2.addComment("subway_meet", "So romantic!");
    
        BookParagraph chapter1Paragraph3 = new BookParagraph();
        chapter1Paragraph3.setContent("They shared a smile, and in that moment, the noisy city seemed to fade away.");
        chapter1Paragraph3.addComment("love_amidst_chaos", "Beautiful scene!");
    
        chapter1.addParagraph(chapter1Paragraph1);
        chapter1.addParagraph(chapter1Paragraph2);
        chapter1.addParagraph(chapter1Paragraph3);
    
        // Create the second chapter
        BookChapter chapter2 = new BookChapter();
    
        BookParagraph chapter2Paragraph1 = new BookParagraph();
        chapter2Paragraph1.setContent("Their dates were filled with laughter and deep conversations, each moment more special than the last.");
        chapter2Paragraph1.addComment("falling_in_love", "So heartwarming!");
    
        BookParagraph chapter2Paragraph2 = new BookParagraph();
        chapter2Paragraph2.setContent("Mia discovered new parts of the city with Alex, making every place they visited a part of their story.");
        chapter2Paragraph2.addComment("exploring_together", "Love this!");
    
        BookParagraph chapter2Paragraph3 = new BookParagraph();
        chapter2Paragraph3.setContent("Their love blossomed in the midst of the urban jungle, creating a beautiful contrast.");
        chapter2Paragraph3.addComment("urban_romance", "Love in the city!");
    
        chapter2.addParagraph(chapter2Paragraph1);
        chapter2.addParagraph(chapter2Paragraph2);
        chapter2.addParagraph(chapter2Paragraph3);
    
        // Create the third chapter
        BookChapter chapter3 = new BookChapter();
    
        BookParagraph chapter3Paragraph1 = new BookParagraph();
        chapter3Paragraph1.setContent("On a rooftop overlooking the city, Alex confessed his love, and Mia's heart soared.");
        chapter3Paragraph1.addComment("rooftop_confession", "So romantic!");
    
        BookParagraph chapter3Paragraph2 = new BookParagraph();
        chapter3Paragraph2.setContent("They promised to navigate life together, hand in hand, amidst the city lights.");
        chapter3Paragraph2.addComment("city_lights", "Beautiful imagery!");
    
        BookParagraph chapter3Paragraph3 = new BookParagraph();
        chapter3Paragraph3.setContent("Their future was bright, illuminated by the love they found in the city that never sleeps.");
        chapter3Paragraph3.addComment("bright_future", "Perfect ending!");
    
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
    
    public void addBook6() {
        // Create a new book instance
        Book book = new Book();
    
        // Set the book's attributes
        book.setAuthorUsername("lolaUnderTheSun");
        book.setName("Timeless Love");
        List<String> titles = List.of("A Distant Past", "Love's Trials", "Reunited");
        book.setChaptersTitles(titles);
        book.setNumberOfChapters(3);
        book.setDescription("A love story that spans decades, proving that true love is timeless.");
        book.setGenre("Romance");
        book.setReaders(210);
    
        // Create the first chapter
        BookChapter chapter1 = new BookChapter();
    
        BookParagraph chapter1Paragraph1 = new BookParagraph();
        chapter1Paragraph1.setContent("In the quaint village of Eversham, Eleanor found herself drawn to the mysterious new arrival, Thomas.");
        chapter1Paragraph1.addComment("new_arrival", "Intriguing start!");
    
        BookParagraph chapter1Paragraph2 = new BookParagraph();
        chapter1Paragraph2.setContent("Their conversations were filled with tales of old, and a bond quickly formed between them.");
        chapter1Paragraph2.addComment("bonding_over_stories", "So lovely!");
    
        BookParagraph chapter1Paragraph3 = new BookParagraph();
        chapter1Paragraph3.setContent("As they spent more time together, their connection deepened, hinting at a love from another time.");
        chapter1Paragraph3.addComment("timeless_connection", "Beautifully written!");
    
        chapter1.addParagraph(chapter1Paragraph1);
        chapter1.addParagraph(chapter1Paragraph2);
        chapter1.addParagraph(chapter1Paragraph3);
    
        // Create the second chapter
        BookChapter chapter2 = new BookChapter();
    
        BookParagraph chapter2Paragraph1 = new BookParagraph();
        chapter2Paragraph1.setContent("Eleanor and Thomas faced many challenges, but their love only grew stronger.");
        chapter2Paragraph1.addComment("love_grows", "Love this resilience!");
    
        BookParagraph chapter2Paragraph2 = new BookParagraph();
        chapter2Paragraph2.setContent("Their families were against their union, but they fought for their love with unwavering determination.");
        chapter2Paragraph2.addComment("family_opposition", "True love prevails!");
    
        BookParagraph chapter2Paragraph3 = new BookParagraph();
        chapter2Paragraph3.setContent("Each trial brought them closer, forging an unbreakable bond.");
        chapter2Paragraph3.addComment("strong_bond", "Such a strong connection!");
    
        chapter2.addParagraph(chapter2Paragraph1);
        chapter2.addParagraph(chapter2Paragraph2);
        chapter2.addParagraph(chapter2Paragraph3);
    
        // Create the third chapter
        BookChapter chapter3 = new BookChapter();
    
        BookParagraph chapter3Paragraph1 = new BookParagraph();
        chapter3Paragraph1.setContent("Years later, fate brought them back to the village where their love story began.");
        chapter3Paragraph1.addComment("full_circle", "Love this closure!");
    
        BookParagraph chapter3Paragraph2 = new BookParagraph();
        chapter3Paragraph2.setContent("Their reunion was filled with joy, as if no time had passed at all.");
        chapter3Paragraph2.addComment("joyful_reunion", "Heartwarming!");
    
        BookParagraph chapter3Paragraph3 = new BookParagraph();
        chapter3Paragraph3.setContent("They walked hand in hand, knowing their love was truly timeless.");
        chapter3Paragraph3.addComment("timeless_love", "Perfect ending!");
    
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
    
    public void addBook7() {
        // Create a new book instance
        Book book = new Book();
    
        // Set the book's attributes
        book.setAuthorUsername("beach_romance_writer");
        book.setName("Summer Love");
        List<String> titles = List.of("Beach Encounter", "Sunset Walks", "Endless Summer");
        book.setChaptersTitles(titles);
        book.setNumberOfChapters(3);
        book.setDescription("A summer romance that turns into a lifelong love story.");
        book.setGenre("Romance");
        book.setReaders(200);
    
        // Create the first chapter
        BookChapter chapter1 = new BookChapter();
    
        BookParagraph chapter1Paragraph1 = new BookParagraph();
        chapter1Paragraph1.setContent("Emily's summer at the beach house was supposed to be a break from her hectic life, but meeting Jack changed everything.");
        chapter1Paragraph1.addComment("summer_meeting", "Love the setting!");
    
        BookParagraph chapter1Paragraph2 = new BookParagraph();
        chapter1Paragraph2.setContent("They met during a beach volleyball game, and his playful nature caught her attention.");
        chapter1Paragraph2.addComment("volleyball_meet", "So much fun!");
    
        BookParagraph chapter1Paragraph3 = new BookParagraph();
        chapter1Paragraph3.setContent("Their laughter echoed over the waves, marking the beginning of a beautiful connection.");
        chapter1Paragraph3.addComment("laughs_by_the_sea", "Such a sweet start!");
    
        chapter1.addParagraph(chapter1Paragraph1);
        chapter1.addParagraph(chapter1Paragraph2);
        chapter1.addParagraph(chapter1Paragraph3);
    
        // Create the second chapter
        BookChapter chapter2 = new BookChapter();
    
        BookParagraph chapter2Paragraph1 = new BookParagraph();
        chapter2Paragraph1.setContent("Emily and Jack spent their days exploring the beach, each moment bringing them closer.");
        chapter2Paragraph1.addComment("beach_days", "So romantic!");
    
        BookParagraph chapter2Paragraph2 = new BookParagraph();
        chapter2Paragraph2.setContent("As the sun set, they walked hand in hand, sharing dreams and secrets.");
        chapter2Paragraph2.addComment("sunset_walks", "Beautiful imagery!");
    
        BookParagraph chapter2Paragraph3 = new BookParagraph();
        chapter2Paragraph3.setContent("Their bond deepened with each sunset, creating memories they would cherish forever.");
        chapter2Paragraph3.addComment("cherished_memories", "Love this development!");
    
        chapter2.addParagraph(chapter2Paragraph1);
        chapter2.addParagraph(chapter2Paragraph2);
        chapter2.addParagraph(chapter2Paragraph3);
    
        // Create the third chapter
        BookChapter chapter3 = new BookChapter();
    
        BookParagraph chapter3Paragraph1 = new BookParagraph();
        chapter3Paragraph1.setContent("As summer came to an end, they vowed to make their love last beyond the season.");
        chapter3Paragraph1.addComment("vows", "So heartfelt!");
    
        BookParagraph chapter3Paragraph2 = new BookParagraph();
        chapter3Paragraph2.setContent("Emily and Jack promised to return to the beach each year, keeping their love alive.");
        chapter3Paragraph2.addComment("annual_return", "Such a lovely tradition!");
    
        BookParagraph chapter3Paragraph3 = new BookParagraph();
        chapter3Paragraph3.setContent("Their love story became an endless summer, filled with joy and unwavering commitment.");
        chapter3Paragraph3.addComment("endless_summer", "Perfect ending!");
    
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
    
    public void addBook8() {
        // Create a new book instance
        Book book = new Book();
    
        // Set the book's attributes
        book.setAuthorUsername("heartful_fiction");
        book.setName("Mystery in the Shadows");
        List<String> titles = List.of("The Unknown Visitor", "Secrets Unveiled", "The Final Revelation");
        book.setChaptersTitles(titles);
        book.setNumberOfChapters(3);
        book.setDescription("A gripping tale of suspense and intrigue, where every shadow hides a secret.");
        book.setGenre("Fiction");
        book.setReaders(250);
    
        // Create the first chapter
        BookChapter chapter1 = new BookChapter();
    
        BookParagraph chapter1Paragraph1 = new BookParagraph();
        chapter1Paragraph1.setContent("On a foggy evening, detective Laura noticed a mysterious figure lurking near the old mansion.");
        chapter1Paragraph1.addComment("mystery_lover", "Intriguing start!");
    
        BookParagraph chapter1Paragraph2 = new BookParagraph();
        chapter1Paragraph2.setContent("The figure disappeared into the shadows, leaving behind a sense of foreboding.");
        chapter1Paragraph2.addComment("suspense_fan", "Can't wait to see what happens next!");
    
        BookParagraph chapter1Paragraph3 = new BookParagraph();
        chapter1Paragraph3.setContent("Laura decided to investigate, her instincts telling her that something wasn't right.");
        chapter1Paragraph3.addComment("detective_enthusiast", "Go Laura!");
    
        chapter1.addParagraph(chapter1Paragraph1);
        chapter1.addParagraph(chapter1Paragraph2);
        chapter1.addParagraph(chapter1Paragraph3);
    
        // Create the second chapter
        BookChapter chapter2 = new BookChapter();
    
        BookParagraph chapter2Paragraph1 = new BookParagraph();
        chapter2Paragraph1.setContent("As Laura delved deeper, she uncovered secrets that the mansion had hidden for decades.");
        chapter2Paragraph1.addComment("history_buff", "Love uncovering old secrets!");
    
        BookParagraph chapter2Paragraph2 = new BookParagraph();
        chapter2Paragraph2.setContent("She found old letters and diaries that hinted at a long-forgotten mystery.");
        chapter2Paragraph2.addComment("curious_reader", "What's in the letters?");
    
        BookParagraph chapter2Paragraph3 = new BookParagraph();
        chapter2Paragraph3.setContent("Each clue led to another, weaving a complex web of deception and intrigue.");
        chapter2Paragraph3.addComment("puzzle_fan", "Loving this puzzle!");
    
        chapter2.addParagraph(chapter2Paragraph1);
        chapter2.addParagraph(chapter2Paragraph2);
        chapter2.addParagraph(chapter2Paragraph3);
    
        // Create the third chapter
        BookChapter chapter3 = new BookChapter();
    
        BookParagraph chapter3Paragraph1 = new BookParagraph();
        chapter3Paragraph1.setContent("In a dramatic showdown, Laura confronted the figure, unraveling the final piece of the mystery.");
        chapter3Paragraph1.addComment("thriller_fan", "Edge-of-the-seat moment!");
    
        BookParagraph chapter3Paragraph2 = new BookParagraph();
        chapter3Paragraph2.setContent("The truth was revealed, shocking everyone with its unexpected twists and turns.");
        chapter3Paragraph2.addComment("plot_twist", "Didn't see that coming!");
    
        BookParagraph chapter3Paragraph3 = new BookParagraph();
        chapter3Paragraph3.setContent("Laura emerged victorious, having solved the mystery that had haunted the mansion for years.");
        chapter3Paragraph3.addComment("victory_celebration", "Bravo, Laura!");
    
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
