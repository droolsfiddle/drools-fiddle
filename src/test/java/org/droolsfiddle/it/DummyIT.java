package org.droolsfiddle.it;

import org.droolsfiddle.rest.DrlParserService;
import org.droolsfiddle.rest.Message;
import org.jboss.arquillian.container.test.api.Deployment;
import org.jboss.arquillian.extension.rest.client.ArquillianResteasyResource;
import org.jboss.arquillian.junit.Arquillian;
import org.jboss.shrinkwrap.api.Archive;
import org.jboss.shrinkwrap.api.ShrinkWrap;
import org.jboss.shrinkwrap.api.spec.WebArchive;
import org.jboss.shrinkwrap.resolver.api.maven.Maven;
import org.junit.Test;
import org.junit.experimental.categories.Category;
import org.junit.runner.RunWith;

import java.io.File;


/**
 * Created by gurfm on 25/06/16.
 */
@RunWith(Arquillian.class)
@Category(IntegrationTest.class)
//@SpringConfiguration("applicationContext.xml")
public class DummyIT {

    @Deployment(testable = false)
    public static Archive deploy(){
        return TestUtils.getArchive();
    }

    @Test
    public void printMessageTest(@ArquillianResteasyResource DrlParserService service)
    {
        // Given

        System.out.println("about to call service");

        // When
        final Message response = service.printMessage();

        System.out.println(response);
    }
}