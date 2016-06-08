package com.rest;

import java.util.HashSet;
import java.util.Set;

/**
 * Created by jvipret on 08/06/2016.
 */
public class RESTApplication extends javax.ws.rs.core.Application {

  private Set<Object> singletons = new HashSet<Object>();

  public RESTApplication() {
    singletons.add(new MessageRestService());
  }

  @Override
  public Set<Object> getSingletons() {
    return singletons;
  }
}
