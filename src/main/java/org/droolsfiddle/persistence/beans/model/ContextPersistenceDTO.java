package org.droolsfiddle.persistence.beans.model;

/**
 * Created by gurfm on 27/07/16.
 */
public class ContextPersistenceDTO {

    private String contextId;

    private boolean result;

    private String error;

    private String drl;

    public String getContextId() {
        return contextId;
    }

    public void setContextId(String contextId) {
        this.contextId = contextId;
    }

    public boolean isResult() {
        return result;
    }

    public String getDrl() {
        return drl;
    }

    public void setDrl(String drl) {
        this.drl = drl;
    }

    public void setResult(boolean result) {
        this.result = result;
    }

    public String getError() {
        return error;
    }

    public void setError(String error) {
        this.error = error;
    }
}
