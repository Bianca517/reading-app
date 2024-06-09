package booksapp.root.models.GlobalConstants;

public enum BookCollectionFields {
    ID(0, "id"),
    NAME(1, "name"),
    AUTHOR_USERNAME(2, "authorUsername"),
    CHAPTERS_TITLES(3, "chaptersTitles"),
    BOOK_CONTENT(4, "bookContent"),
    NUMBER_OF_CHAPTERS(5, "numberOfChapters"),
    COVER(6, "cover"),
    READERS(7, "readers"),
    GENRE(8, "genre"),
    DESCRIPTION(9, "description"),
    PARAGRAPHS(10, "paragraphs"),
    CHAPTERS_CONTENT(11, "chaptersContent");

    private final int index;
    private final String fieldName;

    BookCollectionFields(int index, String fieldName) {
        this.index = index;
        this.fieldName = fieldName;
    }

    public int getIndex() {
        return index;
    }

    public String getFieldName() {
        return fieldName;
    }
}
