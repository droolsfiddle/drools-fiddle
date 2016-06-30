package org.droolsfiddle.beans;

import org.drools.verifier.Verifier;
import org.drools.verifier.VerifierError;
import org.drools.verifier.builder.VerifierBuilder;
import org.drools.verifier.builder.VerifierBuilderFactory;
import org.drools.verifier.data.VerifierReport;
import org.drools.verifier.report.components.Severity;
import org.drools.verifier.report.components.VerifierMessageBase;
import org.droolsfiddle.rest.DrlVerifierService;
import org.droolsfiddle.rest.Message;
import org.jboss.resteasy.logging.Logger;
import org.kie.api.io.ResourceType;
import org.kie.internal.io.ResourceFactory;
import org.springframework.stereotype.Service;

import javax.inject.Inject;
import javax.inject.Named;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;

@Named
public class DrlVerifierServiceImpl implements DrlVerifierService {

    private Logger logger = Logger.getLogger(DrlVerifierServiceImpl.class);

    @Inject
    DrlContext drlContext;

    public Message postDroolsVerifier(Message iMessage) {
        logger.debug("Init validation drl: DroolsVerifier");
        StringBuilder aLog = new StringBuilder();

        VerifierBuilder vBuilder = VerifierBuilderFactory.newVerifierBuilder();

        Verifier verifier = vBuilder.newVerifier();

        verifier.addResourcesToVerify(ResourceFactory.newByteArrayResource(iMessage.getData().getBytes()), ResourceType.DRL);

        if (verifier.hasErrors()) {
            for (VerifierError error : verifier.getErrors()) {
                logger.debug(error.getMessage());
                aLog.append(error.getMessage() + "\n");
            }
        } else {

            verifier.fireAnalysis();

            VerifierReport result = verifier.getResult();
            for (VerifierMessageBase base : result.getBySeverity(Severity.WARNING)) {
                logger.debug(base.toString());
                aLog.append(base + "\n");
            }
        }
        iMessage.setLog(aLog.toString());
        logger.debug(iMessage.toString());

        return iMessage;
    }


}