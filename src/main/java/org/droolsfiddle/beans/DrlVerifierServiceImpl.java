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

import org.drools.verifier.Verifier;
import org.drools.verifier.VerifierError;
import org.drools.verifier.builder.VerifierBuilder;
import org.drools.verifier.builder.VerifierBuilderFactory;
import org.drools.verifier.data.VerifierReport;
import org.drools.verifier.report.components.Severity;
import org.drools.verifier.report.components.VerifierMessageBase;
import org.droolsfiddle.rest.DrlVerifierService;
import org.droolsfiddle.rest.model.Request;
import org.jboss.resteasy.logging.Logger;
import org.kie.api.io.ResourceType;
import org.kie.internal.io.ResourceFactory;

import javax.inject.Inject;
import javax.inject.Named;

@Named
public class DrlVerifierServiceImpl implements DrlVerifierService {

    private Logger logger = Logger.getLogger(DrlVerifierServiceImpl.class);

    @Inject
    DrlContext drlContext;

    public Request postDroolsVerifier(Request iRequest) {
        logger.debug("Init validation drl: DroolsVerifier");
        StringBuilder aLog = new StringBuilder();

        VerifierBuilder vBuilder = VerifierBuilderFactory.newVerifierBuilder();

        Verifier verifier = vBuilder.newVerifier();

        verifier.addResourcesToVerify(ResourceFactory.newByteArrayResource(iRequest.getData().getBytes()), ResourceType.DRL);

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
        iRequest.setLog(aLog.toString());
        logger.debug(iRequest.toString());

        return iRequest;
    }


}