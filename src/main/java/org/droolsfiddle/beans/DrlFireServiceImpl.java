package org.droolsfiddle.beans;

import org.droolsfiddle.rest.DrlFireService;
import org.droolsfiddle.rest.Message;
import org.jboss.resteasy.logging.Logger;
import org.kie.api.KieBase;
import org.kie.api.runtime.KieContainer;
import org.kie.api.runtime.KieSession;

import javax.inject.Inject;
import javax.inject.Named;
import javax.servlet.http.HttpServletRequest;
import javax.websocket.Session;
import javax.ws.rs.core.Context;
import java.io.IOException;
import java.util.concurrent.*;

@Named
public class DrlFireServiceImpl implements DrlFireService {

    private Logger logger = Logger.getLogger(DrlFireServiceImpl.class);

    @Context
    private HttpServletRequest request;

    @Inject
    private DrlContext drlContext;

    public Message postDrlFire(final Message iMessage) {
        logger.debug("Fire Rules service");
        Session wsSession = (Session) request.getSession().getAttribute(Session.class.getName());

        Message resp = new Message();
        resp.setSuccess(false);

        if (!drlContext.hasKieBase()) {
            resp.setLog("ERROR: No Container defined.");
            try {
                wsSession.getBasicRemote().sendText("ERROR: No Container defined.");
            } catch (IOException e) {
                logger.error("Websocket exception",e);
            }
            return resp;
        }

        KieBase kBase = drlContext.getKieBase().getKieBase();
        if (kBase == null) {
            resp.setLog("ERROR: No KieBase defined.");
            try {
                wsSession.getBasicRemote().sendText("ERROR: No KieBase defined.");
            } catch (IOException e) {
                logger.error("Websocket exception",e);
            }
            return resp;
        }

        final KieSession kieSession ;
        if (kBase.getKieSessions().size() > 0) { // there's a session
            logger.debug("Firing existing kieSession");
            kieSession = kBase.getKieSessions().iterator().next();
        } else {
            logger.debug("Firing new kieSession");
            kieSession = kBase.newKieSession();
        }

        ExecutorService service = Executors.newFixedThreadPool(1);

        Future<Integer> futureResult = service.submit(new Callable<Integer>() {
            public Integer call() throws Exception {
                return kieSession.fireAllRules();
            }
        });

        try{
            int numberOfFiredRules = futureResult.get(500, TimeUnit.MILLISECONDS);
            resp.setLog("INFO: fired " + numberOfFiredRules + " rules.");
            try {
                wsSession.getBasicRemote().sendText("INFO: fired " + numberOfFiredRules + " rules.");
            } catch (IOException e) {
                logger.error("Websocket exception",e);
            }
            resp.setSuccess(true);
        } catch(TimeoutException e){
            logger.warn("No response after 500 milliseconds",e);
            resp.setLog("ERROR: rule evaluation timed out.");
            try {
                wsSession.getBasicRemote().sendText("ERROR: rule evaluation timed out.");
            } catch (IOException e1) {
                logger.error("Websocket exception",e1);
            }
            kieSession.halt();
            futureResult.cancel(true);
            // TODO: should really dispose the session here, because after timeout the session may be unable to
            // fire any more rules (depending on the reason of the timeout). However, this has impacts on the viz, so
            // need to wait for the end of UI refactoring.
            // kieSession.dispose();
        } catch (Exception e2) {
            logger.warn("Other error during rule evaluation",e2);
            resp.setLog("ERROR: rule evaluation error " + e2.getMessage());
            try {
                wsSession.getBasicRemote().sendText("ERROR: rule evaluation error " + e2.getMessage());
            } catch (IOException e1) {
                logger.error("Websocket exception",e1);
            }
        } finally {
            service.shutdown();
        }

        logger.debug("End Fire Rules service: "+resp);
        return resp;
    }
}