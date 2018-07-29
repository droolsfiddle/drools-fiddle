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

package org.droolsfiddle.listener;

import org.jboss.resteasy.logging.Logger;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import java.net.URL;

/**
 * Created by gurfm on 20/11/16.
 */
public class StartupListener implements ServletContextListener {

    private Logger logger = Logger.getLogger(ServletContextListener.class);

    @Override
    public void contextInitialized(ServletContextEvent servletContextEvent) {
        URL res = getClass().getClassLoader().getResource("/META-INF/rules.policy");
        logger.info("rules.policy resource: "+res);
        System.setProperty("kie.security.policy",res.getFile());
    }

    @Override
    public void contextDestroyed(ServletContextEvent servletContextEvent) {

    }
}
