package org.droolsfiddle.rest;

/**
 * Created by gurfm on 01/09/16.
 */
public class JsonSchemaArrayNode extends JsonSchemaFormattedNode {

    private JsonSchemaBaseNode items;

    public JsonSchemaBaseNode getItems() {
        return items;
    }

    public void setItems(JsonSchemaBaseNode items) {
        this.items = items;
    }
}
