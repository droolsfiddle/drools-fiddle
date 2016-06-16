package com.rest;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.rest.beans.DrlContext;
import org.jboss.resteasy.logging.Logger;
import org.kie.api.KieBase;
import org.kie.api.definition.KiePackage;
import org.kie.api.definition.type.FactType;
import org.kie.api.runtime.KieContainer;
import org.kie.api.runtime.KieSession;
import org.kie.api.runtime.rule.FactHandle;
import org.springframework.stereotype.Service;

import javax.inject.Inject;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.io.IOException;

/**
 * Created by gurfm on 16/06/16.
 */
@Path("/facts")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.TEXT_PLAIN)
@Service
public class FactInstanceService {

    private Logger logger = Logger.getLogger(FactInstanceService.class);

    @Inject
    DrlContext drlContext;

    @POST
    @Path("/insert/{type}")
    public Message postInsertFact(@PathParam("type")String iType, String iPayload) {

        Message resp = new Message();

        resp.setData("");

        if (!drlContext.hasKieContainer()) {
            resp.setLog("ERROR: No Container defined.");
            return resp;
        }


        KieContainer kContainer = drlContext.getKieContainer();

        KieBase kBase = kContainer.getKieBase();

        if (kBase == null) {
            resp.setLog("ERROR: No KieBase defined.");
            return resp;
        }

        if (kBase.getKiePackages().size() == 0) {
            resp.setLog("ERROR: No Package defined.");
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
            return resp;
        }

        KieSession kieSession;
        if (kBase.getKieSessions().size() > 0) { // there's a session
            logger.debug("Using existing kieSession");
            kieSession = kBase.getKieSessions().iterator().next();
        } else {
            logger.debug("Creating a new kieSession");
            kieSession = kBase.newKieSession();
        }

        FactHandle handle = kieSession.insert(fact);
        resp.setData(handle.toString());
        resp.setLog("INFO: inserted fact handle: " + handle.toString());
        return resp;
    }

}
