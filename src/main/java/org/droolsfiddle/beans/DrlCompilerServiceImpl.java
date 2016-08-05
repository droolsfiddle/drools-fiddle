package org.droolsfiddle.beans;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.droolsfiddle.persistence.beans.KieBaseWrapper;
import org.droolsfiddle.rest.*;
import org.droolsfiddle.rest.Package;
import org.droolsfiddle.websocket.CustomDroolsEvent;
import org.jboss.resteasy.logging.Logger;
import org.jboss.resteasy.util.Base64;
import org.kie.api.KieServices;
import org.kie.api.builder.KieBuilder;
import org.kie.api.builder.KieFileSystem;
import org.kie.api.builder.KieRepository;
import org.kie.api.definition.KiePackage;
import org.kie.api.definition.rule.Rule;
import org.kie.api.definition.type.FactField;
import org.kie.api.definition.type.FactType;
import org.kie.api.runtime.KieContainer;

import javax.inject.Inject;
import javax.inject.Named;
import javax.servlet.http.HttpServletRequest;
import javax.websocket.Session;
import javax.ws.rs.core.Context;
import java.io.IOException;
import java.nio.charset.Charset;
import java.util.ArrayList;
import java.util.List;

@Named
public class DrlCompilerServiceImpl implements DrlCompilerService {

    private Logger logger = Logger.getLogger(DrlCompilerServiceImpl.class);

    @Context
    private HttpServletRequest request;

    @Inject
    DrlContext drlContext;

    private ObjectMapper mapper = new ObjectMapper();


    public Message postDrlCompile(Message iMessage) {
        logger.debug("Init validation drl: DrlParser");

        String drl;
        try {
            drl = new String(Base64.decode(iMessage.getData()),
                    Charset.forName("UTF-8"));
        } catch (IOException e) {
            iMessage.setLog("error while decoding input drl: "+e.getMessage());
            return iMessage;
        }

        iMessage.setData("");

        StringBuilder aLog = new StringBuilder();

        Session wsSession = (Session) request.getSession().getAttribute(Session.class.getName());

        KieServices ks = KieServices.Factory.get();
        KieRepository kr = ks.getRepository();
        KieFileSystem kfs = ks.newKieFileSystem();

        kfs.write("src/main/resources/temp.drl", drl);

        KieBuilder kb = ks.newKieBuilder(kfs);
        KieContainer kContainer;
        kb.buildAll(); // kieModule is automatically deployed to KieRepository if successfully built.
        if (kb.getResults().hasMessages(org.kie.api.builder.Message.Level.ERROR)) {
            for (org.kie.api.builder.Message info : kb.getResults().getMessages()) {
                logger.debug(info.toString());
                aLog.append(info.toString() + "\n");
            }
        } else {
            kContainer = ks.newKieContainer(kr.getDefaultReleaseId());
            aLog.append(kContainer.getClassLoader());

            drlContext.setKieBase(new KieBaseWrapper(drl,kContainer.getKieBase()));

            // packages parsing
            List<Package> packs = new ArrayList<Package>();
            for (KiePackage pack : kContainer.getKieBase().getKiePackages()) {
                Package aPack = new Package();
                aPack.setName(pack.getName());
                List<Fact> facts = new ArrayList<Fact>();
                for (Rule rule : pack.getRules()) {
                    org.droolsfiddle.rest.Rule aRule = new org.droolsfiddle.rest.Rule();
                    aRule.setName(rule.getName());
                    CustomDroolsEvent aEvent = new CustomDroolsEvent("insert-rule").map(aRule);
                    try {
                        wsSession.getBasicRemote().sendText(mapper.writeValueAsString(aEvent));
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                }
                for (FactType declare : pack.getFactTypes()) {
                    Fact aFact = new Fact();
                    List<Attribute> attributes = new ArrayList<Attribute>();
                    aFact.setName(declare.getName().replaceAll(pack.getName() + ".", ""));
                    for (FactField field : declare.getFields()) {
                        Attribute attr = new Attribute();
                        attr.setId(field.getIndex());
                        attr.setName(field.getName());
                        attr.setType(field.getType().getCanonicalName());
                        attributes.add(attr);
                    }
                    aFact.setAttributes(attributes);
                    facts.add(aFact);
                    CustomDroolsEvent aEvent = new CustomDroolsEvent("insert-fact-type").map(aFact);
                    try {
                        wsSession.getBasicRemote().sendText(mapper.writeValueAsString(aEvent));
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                }
                aPack.setFacts(facts);
                packs.add(aPack);
            }
            iMessage.setPackages(packs);
        }

        iMessage.setLog(aLog.toString());
        logger.debug(iMessage.toString());


        return iMessage;
    }

}