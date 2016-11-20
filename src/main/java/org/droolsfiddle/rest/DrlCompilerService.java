package org.droolsfiddle.rest;

import com.fasterxml.jackson.core.JsonProcessingException;
import org.droolsfiddle.rest.model.Request;

import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

@Path("/drools")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public interface DrlCompilerService {

    @POST
    @Path("/drlCompile")
    Request postDrlCompile(Request iRequest) throws JsonProcessingException;

}