package org.droolsfiddle.rest;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by gurfm on 25/08/16.
 */
public class JsonSchemaNode extends JsonSchemaLeafNode {

    private Map<String,JsonSchemaBaseNode> properties = new HashMap<>();

    public Map<String,JsonSchemaBaseNode> getProperties() {
        return properties;
    }

}
