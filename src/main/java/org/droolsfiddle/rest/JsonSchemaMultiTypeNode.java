/*   Copyright 2016 Drools Fiddle

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/

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
