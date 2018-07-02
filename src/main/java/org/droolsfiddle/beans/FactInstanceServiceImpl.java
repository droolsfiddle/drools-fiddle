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

import com.fasterxml.jackson.databind.ObjectMapper;
import org.droolsfiddle.rest.FactInstanceService;
import org.droolsfiddle.rest.model.Request;
import org.droolsfiddle.websocket.WebSocketUtil;
import org.droolsfiddle.websocket.audit.CustomDebugAgendaEventListener;
import org.droolsfiddle.websocket.audit.CustomDebugRuleRuntimeEventListener;
import org.jboss.resteasy.logging.Logger;
import org.jboss.resteasy.util.Base64;
import org.kie.api.KieBase;
import org.kie.api.definition.type.FactType;
import org.kie.api.runtime.KieSession;
import org.kie.api.runtime.rule.FactHandle;

import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;
import javax.websocket.Session;
import javax.ws.rs.core.Context;
import java.nio.charset.Charset;
import javax.inject.Named;

/**
 * Created by gurfm on 16/06/16.
 */
@Named
public class FactInstanceServiceImpl implements FactInstanceService {

    private Logger logger = Logger.getLogger(FactInstanceServiceImpl.class);

    @Context
    private HttpServletRequest request;

    @Inject
    DrlContext drlContext;

    public Request postInsertFact(String iType, Request iRequest) {
        logger.debug("FactDTO insert service");
        Request resp = new Request();
        resp.setSuccess(false);

        Session wsSession = (Session) request.getSession().getAttribute(Session.class.getName());

        resp.setData("");

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

        if (kBase.getKiePackages().size() == 0) {
            resp.setLog("ERROR: No PackageDTO defined.");
            WebSocketUtil.sendToWebSocket(wsSession, "ERROR: No PackageDTO defined.");
            return resp;
        }

        FactType factType = kBase.getFactType(iType.substring(0,iType.lastIndexOf('.')),
                iType.substring(iType.lastIndexOf('.') + 1));

        if (factType == null) {
            resp.setLog("ERROR: fact type "+iType+" not found.");
            WebSocketUtil.sendToWebSocket(wsSession, "ERROR: fact type "+iType+" not found.");
            return resp;
        }

        ObjectMapper mapper = new ObjectMapper();

        Object fact;
        try {
            fact = mapper.readValue(new String(Base64.decode(iRequest.getData()),
                    Charset.forName("UTF-8")), factType.getFactClass());
        } catch (Exception e) {
            logger.error("Error while parsing fact",e);
            resp.setLog("ERROR: Error while parsing fact: " + e.getMessage());
            WebSocketUtil.sendToWebSocket(wsSession, "ERROR: Error while parsing fact: " + e.getMessage());
            return resp;
        }

        KieSession kieSession;
        if (kBase.getKieSessions().size() > 0) { // there's a session
            logger.debug("Using existing kieSession");
            kieSession = kBase.getKieSessions().iterator().next();
        } else {
            logger.debug("Creating a new kieSession");
            kieSession = kBase.newKieSession();
            kieSession.addEventListener(new CustomDebugAgendaEventListener(wsSession));
            kieSession.addEventListener(new CustomDebugRuleRuntimeEventListener(wsSession));
        }

        FactHandle handle = kieSession.insert(fact);
        resp.setData(handle.toString());
        resp.setLog("INFO: inserted fact handle: " + handle.toString());
        resp.setSuccess(true);

        logger.debug("End FactDTO Insert service: " + resp);

        return resp;

    }

}
