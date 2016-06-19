package com.rest.beans;

import org.kie.api.runtime.KieContainer;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Component;

/**
 * Created by gurfm on 15/06/16.
 */
@Component
@Scope(value="session", proxyMode= ScopedProxyMode.TARGET_CLASS)
public class DrlContext {

    public boolean hasKieContainer() {
        return kieContainer != null;
    }

    public KieContainer getKieContainer() {
        return kieContainer;
    }

    public void setKieContainer(KieContainer kieContainer) {
        this.kieContainer = kieContainer;
    }

    private KieContainer kieContainer;



}
