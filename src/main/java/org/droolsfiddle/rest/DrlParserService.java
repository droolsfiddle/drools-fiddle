package org.droolsfiddle.rest;

import org.drools.compiler.compiler.DroolsParserException;
import org.droolsfiddle.rest.model.Request;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;

/**
 * Created by gurfm on 29/06/16.
 */
@Path("/drools")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public interface DrlParserService {

    @POST
    @Path("/drlParser")
    Request postDrlParser(Request iRequest) throws DroolsParserException;

}
