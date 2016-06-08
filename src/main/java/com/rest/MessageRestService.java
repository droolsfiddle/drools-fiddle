package com.rest;


import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

@Path("/message")
public class MessageRestService {

  @GET
  @Produces(MediaType.APPLICATION_JSON)
  public Message printMessage() {

    Message aMessage = new Message();
    aMessage.setId(1);
    aMessage.setData("Hello World!");
    return aMessage;

  }

}