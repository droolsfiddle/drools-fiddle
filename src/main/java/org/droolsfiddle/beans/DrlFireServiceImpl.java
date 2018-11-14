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

package org.droolsfiddle.beans;

import org.droolsfiddle.rest.DrlFireService;
import org.droolsfiddle.rest.model.Request;
import org.droolsfiddle.utilities.WSLogger;
import org.droolsfiddle.websocket.WebSocketUtil;
import org.jboss.resteasy.logging.Logger;
import org.kie.api.KieBase;
import org.kie.api.runtime.KieSession;

import javax.inject.Inject;
import javax.inject.Named;
import javax.servlet.http.HttpServletRequest;
import javax.websocket.Session;
import javax.ws.rs.core.Context;
import java.util.concurrent.*;

@Named
public class DrlFireServiceImpl implements DrlFireService {

    private Logger logger = Logger.getLogger(DrlFireServiceImpl.class);

    @Context
    private HttpServletRequest request;

    @Inject
    private DrlContext drlContext;

    public Request postDrlFire(final Request iRequest) {
        logger.debug("Fire Rules service");
        Session wsSession = (Session) request.getSession().getAttribute(Session.class.getName());

        Request resp = new Request();
        resp.setSuccess(false);

        if (!drlContext.hasKieBase()) {
            resp.setLog("ERROR: No Container defined.");
            WebSocketUtil.sendToWebSocket(wsSession, "ERROR: No Container defined.");
            return resp;
        }

        KieBase kBase = drlContext.getKieBase().getKieBase();
        if (kBase == null) {
            resp.setLog("ERROR: No KieBase defined.");
            WebSocketUtil.sendToWebSocket(wsSession, "ERROR: No KieBase defined.");
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

        try{
            kieSession.setGlobal("LOGGER", new WSLogger(wsSession));
        }catch (Throwable t)
        {}

        ExecutorService service = Executors.newFixedThreadPool(1);

        Future<Integer> futureResult = service.submit(new Callable<Integer>() {
            public Integer call() throws Exception {
                return kieSession.fireAllRules();
            }
        });

        try{
            int numberOfFiredRules = futureResult.get(500, TimeUnit.MILLISECONDS);
            resp.setLog("INFO: fired " + numberOfFiredRules + " rules.");
            WebSocketUtil.sendToWebSocket(wsSession, "INFO: fired " + numberOfFiredRules + " rules.");
            resp.setSuccess(true);
        } catch(TimeoutException e){
            logger.warn("No response after 500 milliseconds",e);
            resp.setLog("ERROR: rule evaluation timed out.");
            kieSession.halt();
            WebSocketUtil.sendToWebSocket(wsSession, "ERROR: rule evaluation timed out.");
            futureResult.cancel(true);
            // TODO: should really dispose the session here, because after timeout the session may be unable to
            // fire any more rules (depending on the reason of the timeout). However, this has impacts on the viz, so
            // need to wait for the end of UI refactoring.
            // kieSession.dispose();
        } catch (Exception e2) {
            logger.warn("Other error during rule evaluation",e2);
            resp.setLog("ERROR: rule evaluation error " + e2.getMessage());
            WebSocketUtil.sendToWebSocket(wsSession, "ERROR: rule evaluation error " + e2.getMessage());

        } finally {
            service.shutdown();
        }

        logger.debug("End Fire Rules service: "+resp);
        return resp;
    }
}