package org.droolsfiddle.rest;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by gurfm on 25/08/16.
 */
public class JsonSchemaNode {

    private String type;

    private String title;

    private Map<String,JsonSchemaNode> properties = new HashMap<>();

    //private boolean required;

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Map<String,JsonSchemaNode> getProperties() {
        return properties;
    }

    //public boolean isRequired() {
    //    return required;
    //}

    //public void setRequired(boolean required) {
    //    this.required = required;
    //}
}
