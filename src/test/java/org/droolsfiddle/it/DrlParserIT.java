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

package org.droolsfiddle.it;

import org.drools.compiler.compiler.DroolsParserException;
import org.droolsfiddle.rest.DrlParserService;
import org.droolsfiddle.rest.model.Request;
import org.jboss.arquillian.container.test.api.Deployment;
import org.jboss.arquillian.extension.rest.client.ArquillianResteasyResource;
import org.jboss.arquillian.junit.Arquillian;
import org.jboss.shrinkwrap.api.Archive;
import org.junit.Test;
import org.junit.experimental.categories.Category;
import org.junit.runner.RunWith;


/**
 * Created by gurfm on 25/06/16.
 */
@RunWith(Arquillian.class)
@Category(IntegrationTest.class)
//@SpringConfiguration("applicationContext.xml")
public class DrlParserIT {

    @Deployment(testable = false)
    public static Archive deploy(){
        return TestUtils.getArchive();
    }

    @Test
    public void postDrlParserTest(@ArquillianResteasyResource DrlParserService service) throws DroolsParserException {

        // Given

        Request request = new Request();

        request.setData("import java.util.Date\n" +
                "\n" +
                "declare Address\n" +
                "    name : String\n" +
                "end\n" +
                "\n" +
                "declare Person\n" +
                "    name : String\n" +
                "    dateOfBirth : Date\n" +
                "    address : Address\n" +
                "end\n" +
                "\n" +
                "rule \"Using a declared Type\"\n" +
                "when\n" +
                "    $p : Person( name == \"Bob\" )\n" +
                "then\n" +
                "    // Insert Mark, who is Bob's mate.\n" +
                "    Person mark = new Person();\n" +
                "    mark.setName(\"Mark\");\n" +
                "    insert( mark );\n" +
                "end");

        // When

        final Request response = service.postDrlParser(request);

        // Then

        System.out.println(response.isSuccess());
    }
}