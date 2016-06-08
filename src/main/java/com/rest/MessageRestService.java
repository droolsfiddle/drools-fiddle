package com.rest;

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
    System.out.println(iMessage);
    return iMessage;
  }

}