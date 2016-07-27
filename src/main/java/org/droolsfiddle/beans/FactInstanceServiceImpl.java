package org.droolsfiddle.beans;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.rest.audit.CustomDebugAgendaEventListener;
import com.rest.audit.CustomDebugRuleRuntimeEventListener;
import org.droolsfiddle.rest.FactInstanceService;
import org.droolsfiddle.rest.Message;
import org.jboss.resteasy.logging.Logger;
import org.kie.api.KieBase;
import org.kie.api.definition.KiePackage;
import org.kie.api.definition.type.FactType;
import org.kie.api.runtime.KieContainer;
import org.kie.api.runtime.KieSession;
import org.kie.api.runtime.rule.FactHandle;

import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;
import javax.websocket.Session;
import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import java.io.IOException;
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

    public Message postInsertFact(String iType, String iPayload) {

        Message resp = new Message();

        try {

        Session wsSession = (Session) request.getSession().getAttribute(Session.class.getName());

        resp.setData("");

        if (!drlContext.hasKieBase()) {
            resp.setLog("ERROR: No Container defined.");
            wsSession.getBasicRemote().sendText("ERROR: No Container defined.");

            return resp;
        }


        KieBase kBase = drlContext.getKieBase();

        if (kBase == null) {
            resp.setLog("ERROR: No KieBase defined.");
            wsSession.getBasicRemote().sendText("ERROR: No KieBase defined.");
            return resp;
        }

        if (kBase.getKiePackages().size() == 0) {
            resp.setLog("ERROR: No Package defined.");
            wsSession.getBasicRemote().sendText("ERROR: No Package defined.");
            return resp;
        }

        KiePackage kiePackage = kBase.getKiePackages().iterator().next();

        FactType factType = kBase.getFactType(kiePackage.getName(), iType);

        ObjectMapper mapper = new ObjectMapper();

        Object fact;
        try {
            fact = mapper.readValue(iPayload,factType.getFactClass());
        } catch (Exception e) {
            logger.error("Error while parsing fact",e);
            resp.setLog("ERROR: Error while parsing fact: " + e.getMessage());
            wsSession.getBasicRemote().sendText("ERROR: Error while parsing fact: " + e.getMessage());
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

        } catch (IOException e) {
            e.printStackTrace();
        }

        return resp;

    }

}
