package ec.edu.espe.subasta.autos.exception;

public class InsertException extends Exception {

    private String entityName;

    public InsertException(String message, String entityName) {
        super(message);
        this.entityName = entityName;
    }
}
