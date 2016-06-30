package org.droolsfiddle.it;


import org.jboss.shrinkwrap.api.Archive;
import org.jboss.shrinkwrap.api.ShrinkWrap;
import org.jboss.shrinkwrap.api.spec.WebArchive;
import org.jboss.shrinkwrap.resolver.api.maven.Maven;

import java.io.File;

/**
 * Created by gurfm on 30/06/16.
 */
public class TestUtils {

    public static Archive getArchive(){
        // Import Maven runtime dependencies
        File[] files = Maven.resolver().loadPomFromFile("pom.xml")
                .importRuntimeDependencies().resolve().withTransitivity().asFile();

        WebArchive war = ShrinkWrap
                .create(WebArchive.class, "drools-fiddle.war")
                .addPackages(true,"org.droolsfiddle.beans")
                .addPackages(true,"org.droolsfiddle.rest")
                .setWebXML(new File("src/main/webapp/WEB-INF/web.xml"))
                .addAsLibraries(files)
                .addAsResource("META-INF/applicationContext.xml");

        //Show the deploy structure
        System.out.println(war.toString(true));

        return war;
    }
}
