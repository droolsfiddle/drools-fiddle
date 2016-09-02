package org.droolsfiddle.rest;

import java.util.HashSet;
import java.util.Set;

/**
 * Created by gurfm on 31/08/16.
 */
public class JsonSchemaEnumNode extends JsonSchemaFormattedNode {

    private Set<String> _enum = new HashSet<>();

    public Set<String> getEnum() {
        return _enum;
    }
}
