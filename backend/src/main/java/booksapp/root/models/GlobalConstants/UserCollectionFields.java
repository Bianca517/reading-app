package booksapp.root.models.GlobalConstants;

public enum UserCollectionFields {
    USERNAME(0, "userName"),
    PASSWORD(1, "password"),
    SALT(2, "salt"),
    EMAIL(3, "emailAddress"),
    INTERESTS(4, "interests"),
    CURRENT_READINGS(5, "currentReadings"),
    FINALIZED_READINGS(6, "finalizedReadings"),
    PLANNED_BOOKS(7, "plannedBooks");

    private final int index;
    private final String fieldName;

    UserCollectionFields(int index, String fieldName) {
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
