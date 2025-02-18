package ec.edu.espe.subasta.autos.exception;

public class UpdateException extends Exception {

    private String entityName;

    public UpdateException(String message, String entityName) {
        super(message);
        this.entityName = entityName;
    }
}
