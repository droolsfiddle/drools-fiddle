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
