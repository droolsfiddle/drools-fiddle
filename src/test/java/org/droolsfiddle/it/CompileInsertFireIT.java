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

import org.apache.http.HttpStatus;
import org.drools.compiler.compiler.DroolsParserException;
import org.droolsfiddle.rest.DrlParserService;
import org.droolsfiddle.rest.model.Request;
import org.jboss.arquillian.container.test.api.Deployment;
import org.jboss.arquillian.extension.rest.client.ArquillianResteasyResource;
import org.jboss.arquillian.junit.Arquillian;
import org.jboss.arquillian.junit.InSequence;
import org.jboss.resteasy.util.Base64;
import org.jboss.shrinkwrap.api.Archive;
import static org.junit.Assert.*;
import org.junit.Test;
import org.junit.experimental.categories.Category;
import org.junit.runner.RunWith;

import javax.ws.rs.client.*;
import javax.ws.rs.core.Cookie;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.NewCookie;
import javax.ws.rs.core.Response;
import java.io.IOException;
import java.nio.charset.Charset;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


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

    private final String sessionCookie = "";

    @Deployment(testable = false)
    public static Archive deploy(){
        return TestUtils.getArchive();
    }

    /**
     * Using arquillian resteasy plugin to test a REST endpoint. All the code to instantiate the REST client,
     * query the server and parse the response is supplied by the plugin.
     *
     * @param service
     * @throws DroolsParserException
     */
    @Test
    @InSequence(1)
    public void postDrlParserTest(@ArquillianResteasyResource DrlParserService service) throws DroolsParserException {

        // Given

        final Request request = new Request();
        request.setData(Base64.encodeBytes(DRL.getBytes(Charset.forName("UTF-8"))));

        // When

        final Request response = service.postDrlParser(request);

        // Then

        System.out.println(response.getJsonSchema());
    }


    /**
     * In this as well as all following tests we cannot use all the arquillian resteasy plugin magic because it
     * does not allow to register custom RequestFilter and ResponseFilter (which we need to handle session
     * cookies).
     * It may be cool to do a pull request into
     * https://github.com/arquillian/arquillian-extension-rest/tree/master/rest-client
     * in order to allow registering these via annotations for instance.
     *
     * We therefore inject a WebTarget and write more boilerplate code than before.
     * @param compilerService
     */
    @Test
    @InSequence(2)
    public void postDrlCompilerTest(@ArquillianResteasyResource("rest/drools/drlCompile") WebTarget compilerService) { // DrlCompilerService

        // Given

        final Request request = new Request();
        request.setData(Base64.encodeBytes(DRL.getBytes(Charset.forName("UTF-8"))));

        compilerService.register(new CookieRequestFilter());
        compilerService.register(new CookieResponseFilter());
        final Invocation.Builder ib1 = compilerService.request();
        final Invocation iv1 = ib1.buildPost(Entity.entity(request, MediaType.APPLICATION_JSON_TYPE));


        // When

        final Response response = iv1.invoke();

        // Then

        assertEquals(HttpStatus.SC_OK, response.getStatus());
        final Request respMsg = response.readEntity(Request.class);
        System.out.println(respMsg);
    }

    @Test
    @InSequence(3)
    public void postFactInserterTest(@ArquillianResteasyResource("rest/facts/insert/Person") WebTarget factService) { // FactInstanceService

        // Given

        final Request request = new Request();
        request.setData(Base64.encodeBytes(FACT.getBytes(Charset.forName("UTF-8"))));

        factService.register(new CookieRequestFilter());
        factService.register(new CookieResponseFilter());
        final Invocation.Builder ib2 = factService.request();
        final Invocation iv2 = ib2.buildPost(Entity.entity(request, MediaType.APPLICATION_JSON_TYPE));

        // When

        final Response response = iv2.invoke();

        // Then

        assertEquals(HttpStatus.SC_OK, response.getStatus());
        final Request respMsg = response.readEntity(Request.class);
        System.out.println(respMsg);
    }

    @Test
    @InSequence(4)
    public void postDrlFireTest(@ArquillianResteasyResource("rest/drools/drlFire") WebTarget fireService) { // DrlFireService

        // Given
        final Request request = new Request();

        fireService.register(new CookieRequestFilter());
        fireService.register(new CookieResponseFilter());
        final Invocation.Builder ib3 = fireService.request();
        final Invocation iv3 = ib3.buildPost(Entity.entity(request, MediaType.APPLICATION_JSON_TYPE));

        // When

        final Response response = iv3.invoke();

        // Then

        assertEquals(HttpStatus.SC_OK, response.getStatus());
        final Request respMsg = response.readEntity(Request.class);
        assertEquals("INFO: fired 1 rules.",respMsg.getLog());
        System.out.println(respMsg);
    }

    public class CookieRequestFilter implements ClientRequestFilter {

        public void filter(ClientRequestContext clientRequestContext) throws IOException {
            if (!cookies.isEmpty()) {
                List<Object> cookiesList = new ArrayList<Object>(cookies.values());
                clientRequestContext.getHeaders().put("Cookie",cookiesList);
            }
        }

    }

    public class CookieResponseFilter implements ClientResponseFilter {

        public void filter(ClientRequestContext clientRequestContext, ClientResponseContext clientResponseContext) throws IOException {
            //cookies.putAll(clientResponseContext.getCookies());
            for (Map.Entry<String,NewCookie> c : clientResponseContext.getCookies().entrySet()) {
                System.out.println("NEW COOKIE : " + c.getKey() + " -- "+ c.getValue().toString());
                NewCookie nc = c.getValue();
                cookies.put(c.getKey(),
                        new Cookie(nc.getName(),nc.getValue(),nc.getPath(),nc.getDomain(),nc.getVersion()));
            }
        }

    }

    private static Map<String,Cookie> cookies = new HashMap<String, Cookie>();


}