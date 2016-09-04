package org.droolsfiddle.beans;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.droolsfiddle.websocket.audit.CustomDebugAgendaEventListener;
import org.droolsfiddle.websocket.audit.CustomDebugRuleRuntimeEventListener;
import org.droolsfiddle.rest.FactInstanceService;
import org.droolsfiddle.rest.Message;
import org.jboss.resteasy.logging.Logger;
import org.jboss.resteasy.util.Base64;
import org.kie.api.KieBase;
import org.kie.api.definition.KiePackage;
import org.kie.api.definition.type.FactType;
import org.kie.api.runtime.KieSession;
import org.kie.api.runtime.rule.FactHandle;

import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;
import javax.websocket.Session;
import javax.ws.rs.core.Context;
import java.io.IOException;
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

    public Message postInsertFact(String iType, Message iMessage) {
        logger.debug("Fact insert service");
        Message resp = new Message();
        resp.setSuccess(false);

        Session wsSession = (Session) request.getSession().getAttribute(Session.class.getName());

        resp.setData("");

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

        if (kBase.getKiePackages().size() == 0) {
            resp.setLog("ERROR: No Package defined.");
            try {
                wsSession.getBasicRemote().sendText("ERROR: No Package defined.");
            } catch (IOException e) {
                logger.error("Websocket exception",e);
            }
            return resp;
        }

        FactType factType = kBase.getFactType(iType.substring(0,iType.lastIndexOf('.')),
                iType.substring(iType.lastIndexOf('.') + 1));

        if (factType == null) {
            resp.setLog("ERROR: fact type "+iType+" not found.");
            try {
                wsSession.getBasicRemote().sendText("ERROR: fact type "+iType+" not found.");
            } catch (IOException e) {
                logger.error("Websocket exception",e);
            }
            return resp;
        }

        ObjectMapper mapper = new ObjectMapper();

        Object fact;
        try {
            fact = mapper.readValue(new String(Base64.decode(iMessage.getData()),
                    Charset.forName("UTF-8")), factType.getFactClass());
        } catch (Exception e) {
            logger.error("Error while parsing fact",e);
            resp.setLog("ERROR: Error while parsing fact: " + e.getMessage());
            try {
                wsSession.getBasicRemote().sendText("ERROR: Error while parsing fact: " + e.getMessage());
            } catch (IOException e1) {
                logger.error("Websocket exception",e);
            }
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

        logger.debug("End Fact Insert service: " + resp);

        return resp;

    }

}
