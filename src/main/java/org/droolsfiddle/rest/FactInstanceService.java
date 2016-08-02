package org.droolsfiddle.rest;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;

/**
 * Created by gurfm on 16/06/16.
 */
@Path("/facts")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public interface FactInstanceService {

    @POST
    @Path("/insert/{type}")
    Message postInsertFact(@PathParam("type")String iType, Message iMessage);
}
