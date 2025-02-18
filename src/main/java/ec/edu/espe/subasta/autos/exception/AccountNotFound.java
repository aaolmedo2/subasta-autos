package ec.edu.espe.subasta.autos.exception;

public class AccountNotFound extends Exception {

    private String entityName;

    public AccountNotFound(String message) {
        super(message);
        this.entityName = entityName;
    }
}
