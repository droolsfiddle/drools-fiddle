package com.rest;

import org.drools.verifier.Verifier;
import org.drools.verifier.VerifierError;
import org.drools.verifier.builder.VerifierBuilder;
import org.drools.verifier.builder.VerifierBuilderFactory;
import org.drools.verifier.data.VerifierReport;
import org.drools.verifier.report.components.Severity;
import org.drools.verifier.report.components.VerifierMessageBase;
import org.kie.api.io.ResourceType;
import org.kie.internal.io.ResourceFactory;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;

@Path("/message")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class MessageRestService {

  @GET
  public Message printMessage() {
    Message aMessage = new Message();
    aMessage.setId(1);
    aMessage.setData("Hello World!");
    return aMessage;
  }

  @POST
  @Path("/submitdrl")
  public Message postMessage(Message iMessage) {
    System.out.println("Init validation drl");
    String aLog = "";

    VerifierBuilder vBuilder = VerifierBuilderFactory.newVerifierBuilder();

    Verifier verifier = vBuilder.newVerifier();

    verifier.addResourcesToVerify( ResourceFactory.newByteArrayResource(iMessage.getData().getBytes()), ResourceType.DRL );

    if (verifier.hasErrors()) {
      for (VerifierError error : verifier.getErrors()) {
        System.out.println(error.getMessage());
        aLog += error.getMessage() + "\n";
      }
    } else {

      verifier.fireAnalysis();

      VerifierReport result = verifier.getResult();
      for (VerifierMessageBase base : result.getBySeverity(Severity.WARNING)) {
        System.out.println(base);
        aLog += base + "\n";
      }
    }
    iMessage.setLog(aLog);
    System.out.println(iMessage);

    return iMessage;
  }

}