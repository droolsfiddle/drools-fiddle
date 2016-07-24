package org.droolsfiddle.rest;

import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

@Path("/message")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public interface DrlVerifierService {

    @POST
    @Path("/droolsverifier")
    Message postDroolsVerifier(Message iMessage);


}