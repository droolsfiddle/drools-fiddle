package org.droolsfiddle.rest;

import java.util.HashSet;
import java.util.Set;

/**
 * Created by gurfm on 01/09/16.
 */
public class JsonSchemaMultiTypeNode extends JsonSchemaBaseNode {

    private Set<String> type = new HashSet<>();

    public Set<String> getType() {
        return type;
    }
}
