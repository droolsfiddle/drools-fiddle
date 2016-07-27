package org.droolsfiddle.persistence.beans;

/**
 * Created by gurfm on 27/07/16.
 */
public class ContextPersistenceDTO {

    private String contextId;

    private boolean result;

    public String getContextId() {
        return contextId;
    }

    public void setContextId(String contextId) {
        this.contextId = contextId;
    }

    public boolean isResult() {
        return result;
    }

    public void setResult(boolean result) {
        this.result = result;
    }
}
