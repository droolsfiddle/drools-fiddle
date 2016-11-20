package org.droolsfiddle.beans;

import org.drools.compiler.compiler.DrlParser;
import org.drools.compiler.compiler.DroolsError;
import org.drools.compiler.compiler.DroolsParserException;
import org.drools.compiler.lang.descr.AbstractClassTypeDeclarationDescr;
import org.drools.compiler.lang.descr.PackageDescr;
import org.droolsfiddle.rest.*;
import org.droolsfiddle.rest.model.AttributeDTO;
import org.droolsfiddle.rest.model.FactDTO;
import org.droolsfiddle.rest.model.Request;
import org.jboss.resteasy.logging.Logger;
import org.jboss.resteasy.util.Base64;

import javax.inject.Inject;
import javax.inject.Named;
import java.io.IOException;
import java.lang.*;
import java.nio.charset.Charset;
import java.util.ArrayList;
import java.util.List;

@Named
public class DrlParserServiceImpl implements DrlParserService {

    private Logger logger = Logger.getLogger(DrlParserServiceImpl.class);

    @Inject
    DrlContext drlContext;

    public Request postDrlParser(Request iRequest) throws DroolsParserException {
        logger.debug("Init validation drl: DrlParser");

        String drl;
        try {
            drl = new String(Base64.decode(iRequest.getData()),
                    Charset.forName("UTF-8"));
        } catch (IOException e) {
            iRequest.setLog("error while decoding input drl: "+e.getMessage());
            return iRequest;
        }

        iRequest.setData("");

        StringBuilder aLog = new StringBuilder();

        DrlParser parser = new DrlParser();
        PackageDescr descr = parser.parse(true, drl);
        logger.debug(parser.getErrors().toString());

        if (parser.hasErrors()) {
            for (DroolsError error : parser.getErrors()) {
                logger.debug("ERROR:\n" + error.getMessage());
                aLog.append(error.getMessage() + "\n");
            }
        } else {
            logger.debug("List factDTOs");
            List<FactDTO> factDTOs = new ArrayList<FactDTO>();
            for (AbstractClassTypeDeclarationDescr declare : descr.getClassAndEnumDeclarationDescrs()) {
                FactDTO aFactDTO = new FactDTO();
                aFactDTO.setId(declare.getLine());
                List<AttributeDTO> attributeDTOs = new ArrayList<AttributeDTO>();
                aFactDTO.setName(declare.getTypeName());
                for (String field : declare.getFields().keySet()) {
                    AttributeDTO attr = new AttributeDTO();
                    attr.setId(declare.getFields().get(field).getLine());
                    attr.setName(field);
                    attr.setType(declare.getFields().get(field).getPattern().getObjectType());
                    attributeDTOs.add(attr);
                }
                aFactDTO.setAttributes(attributeDTOs);
                factDTOs.add(aFactDTO);
            }
            //List<org.droolsfiddle.rest.Package> packs = new ArrayList<org.droolsfiddle.rest.Package>();
            //org.droolsfiddle.rest.Package pack = new org.droolsfiddle.rest.Package();
            //pack.setName("default");
            //pack.setFacts(facts);
            //packs.add(pack);
            //iMessage.setPackages(packs);
            aLog.append(descr.getName());
        }
        iRequest.setLog(aLog.toString());
        logger.debug(iRequest.toString());

        return iRequest;
    }

}