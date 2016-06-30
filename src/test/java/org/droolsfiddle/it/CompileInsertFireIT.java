package org.droolsfiddle.it;

import org.drools.compiler.compiler.DroolsParserException;
import org.droolsfiddle.rest.*;
import org.jboss.arquillian.container.test.api.Deployment;
import org.jboss.arquillian.extension.rest.client.ArquillianResteasyResource;
import org.jboss.arquillian.junit.Arquillian;
import org.jboss.arquillian.junit.InSequence;
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
public class CompileInsertFireIT {

    private static final String DRL = "import java.util.Date\n" +
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
            "end";

    private static final String FACT = "{\"name\":\"Bob\"}";

    @Deployment(testable = false)
    public static Archive deploy(){
        return TestUtils.getArchive();
    }

    @Test
    @InSequence(1)
    public void postDrlParserTest(@ArquillianResteasyResource DrlParserService service) throws DroolsParserException {

        // Given

        final Message request = new Message();

        request.setData(DRL);

        // When

        final Message response = service.postDrlParser(request);

        // Then

        System.out.println(response.getPackages());
    }

    @Test
    @InSequence(2)
    public void postDrlCompilerTest(@ArquillianResteasyResource DrlCompilerService compilerService,
                                    @ArquillianResteasyResource FactInstanceService factService,
                                    @ArquillianResteasyResource DrlFireService fireService) {

        // Given

        final Message request = new Message();

        request.setData(DRL);

        final String fact = FACT;

        final String type = "Person";

        final Message request2 = new Message();


        // When

        final Message response1 = compilerService.postDrlCompile(request);

        final Message response2 = factService.postInsertFact(type, fact);

        final Message response3 = fireService.postDrlFire(request2);

        // Then

        System.out.println(response1);

        System.out.println(response2);

        System.out.println(response3);
    }

}