package org.droolsfiddle.beans;

import org.drools.compiler.compiler.DrlParser;
import org.drools.compiler.compiler.DroolsError;
import org.drools.compiler.compiler.DroolsParserException;
import org.drools.compiler.lang.descr.AbstractClassTypeDeclarationDescr;
import org.drools.compiler.lang.descr.PackageDescr;
import org.droolsfiddle.rest.*;
import org.jboss.resteasy.logging.Logger;

import javax.inject.Inject;
import javax.inject.Named;
import java.lang.*;
import java.util.ArrayList;
import java.util.List;

@Named
public class DrlParserServiceImpl implements DrlParserService {

    private Logger logger = Logger.getLogger(DrlParserServiceImpl.class);

    @Inject
    DrlContext drlContext;

    public Message printMessage() {
        Message aMessage = new Message();
        aMessage.setId(1);
        aMessage.setData("Hello World!");
        return aMessage;
    }

    public Message postDrlParser(Message iMessage) throws DroolsParserException {
        logger.debug("Init validation drl: DrlParser");
        StringBuilder aLog = new StringBuilder();

        DrlParser parser = new DrlParser();
        PackageDescr descr = parser.parse(true, iMessage.getData());
        logger.debug(parser.getErrors().toString());

        if (parser.hasErrors()) {
            for (DroolsError error : parser.getErrors()) {
                logger.debug("ERROR:\n" + error.getMessage());
                aLog.append(error.getMessage() + "\n");
            }
        } else {
            logger.debug("List facts");
            List<Fact> facts = new ArrayList<Fact>();
            for (AbstractClassTypeDeclarationDescr declare : descr.getClassAndEnumDeclarationDescrs()) {
                Fact aFact = new Fact();
                aFact.setId(declare.getLine());
                List<Attribute> attributes = new ArrayList<Attribute>();
                aFact.setName(declare.getTypeName());
                for (String field : declare.getFields().keySet()) {
                    Attribute attr = new Attribute();
                    attr.setId(declare.getFields().get(field).getLine());
                    attr.setName(field);
                    attr.setType(declare.getFields().get(field).getPattern().getObjectType());
                    attributes.add(attr);
                }
                aFact.setAttributes(attributes);
                facts.add(aFact);
            }
            List<org.droolsfiddle.rest.Package> packs = new ArrayList<org.droolsfiddle.rest.Package>();
            org.droolsfiddle.rest.Package pack = new org.droolsfiddle.rest.Package();
            pack.setName("default");
            pack.setFacts(facts);
            packs.add(pack);
            iMessage.setPackages(packs);
            aLog.append(descr.getName());
        }
        iMessage.setLog(aLog.toString());
        logger.debug(iMessage.toString());

        return iMessage;
    }

}