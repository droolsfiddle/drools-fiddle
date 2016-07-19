package org.droolsfiddle.beans;

import org.droolsfiddle.rest.DrlFireService;
import org.droolsfiddle.rest.Message;
import org.jboss.resteasy.logging.Logger;
import org.kie.api.KieBase;
import org.kie.api.runtime.KieContainer;
import org.kie.api.runtime.KieSession;

import javax.inject.Inject;
import javax.inject.Named;
import java.util.concurrent.*;

@Named
public class DrlFireServiceImpl implements DrlFireService {

    private Logger logger = Logger.getLogger(DrlFireServiceImpl.class);

    @Inject
    DrlContext drlContext;

    public Message postDrlFire(Message iMessage) {

        iMessage.setData("");

        if (!drlContext.hasKieContainer()) {
            iMessage.setLog("ERROR: No Container defined.");
            return iMessage;
        }


        KieContainer kContainer = drlContext.getKieContainer();

        KieBase kBase = kContainer.getKieBase();

        if (kBase == null) {
            iMessage.setLog("ERROR: No KieBase defined.");
            return iMessage;
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

        int numberOfFiredRules;

        try{
            numberOfFiredRules = futureResult.get(10, TimeUnit.SECONDS);
            iMessage.setLog("INFO: fired " + numberOfFiredRules + " rules.");
        } catch(TimeoutException e){
            logger.warn("No response after 10 seconds",e);
            iMessage.setLog("ERROR: rule evaluation timed out.");
            futureResult.cancel(true);
        } catch (Exception e2) {
            logger.warn("Other error during rule evaluation",e2);
            iMessage.setLog("ERROR: rule evaluation error " + e2.getMessage());
        }

        service.shutdown();

        return iMessage;
    }
}