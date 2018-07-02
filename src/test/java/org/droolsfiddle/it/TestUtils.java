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
                .addPackages(true,"org.droolsfiddle.websocket")
                // do not include org.droolsfiddle.persistence on purpose, as we miss redis
                .setWebXML(new File("src/main/webapp/WEB-INF/web.xml"))
                .addAsLibraries(files)
                .addAsResource("META-INF/applicationContext.xml");

        //Show the deploy structure
        System.out.println(war.toString(true));

        return war;
    }
}
