package org.droolsfiddle.rest;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by gurfm on 25/08/16.
 */
public class JsonSchemaNode extends JsonSchemaLeafNode {

    private Map<String,JsonSchemaBaseNode> properties = new HashMap<>();

    //private boolean required;

    public Map<String,JsonSchemaBaseNode> getProperties() {
        return properties;
    }

    //public boolean isRequired() {
    //    return required;
    //}

    //public void setRequired(boolean required) {
    //    this.required = required;
    //}
}
