package org.droolsfiddle.beans;

import org.droolsfiddle.persistence.beans.KieBaseWrapper;
import org.droolsfiddle.rest.*;
import org.droolsfiddle.rest.Package;
import org.jboss.resteasy.logging.Logger;
import org.kie.api.KieServices;
import org.kie.api.builder.KieBuilder;
import org.kie.api.builder.KieFileSystem;
import org.kie.api.builder.KieRepository;
import org.kie.api.definition.KiePackage;
import org.kie.api.definition.type.FactField;
import org.kie.api.definition.type.FactType;
import org.kie.api.runtime.KieContainer;

import javax.inject.Inject;
import javax.inject.Named;
import java.util.ArrayList;
import java.util.List;

@Named
public class DrlCompilerServiceImpl implements DrlCompilerService {

    private Logger logger = Logger.getLogger(DrlCompilerServiceImpl.class);

    @Inject
    DrlContext drlContext;

    public Message postDrlCompile(Message iMessage) {
        logger.debug("Init validation drl: DrlParser");
        StringBuilder aLog = new StringBuilder();

        KieServices ks = KieServices.Factory.get();
        KieRepository kr = ks.getRepository();
        KieFileSystem kfs = ks.newKieFileSystem();

        kfs.write("src/main/resources/temp.drl", iMessage.getData());

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

            drlContext.setKieBase(new KieBaseWrapper(iMessage.getData(),kContainer.getKieBase()));

            // packages parsing
            List<Package> packs = new ArrayList<Package>();
            for (KiePackage pack : kContainer.getKieBase().getKiePackages()) {
                Package aPack = new Package();
                aPack.setName(pack.getName());
                List<Fact> facts = new ArrayList<Fact>();
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