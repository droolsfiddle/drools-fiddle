package org.droolsfiddle.persistence.rest;

import org.droolsfiddle.persistence.beans.ContextPersistenceDTO;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;

@Path("/context")
@Produces(MediaType.APPLICATION_JSON)
public interface DrlContextPersistenceService {

    @POST
    ContextPersistenceDTO post();


    @PUT
    @Path("/{cid}")
    ContextPersistenceDTO put(@PathParam("cid") String cid);


    @GET
    @Path("/{cid}")
    ContextPersistenceDTO get(@PathParam("cid") String cid);


}