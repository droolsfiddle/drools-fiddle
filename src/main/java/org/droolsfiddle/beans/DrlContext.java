package org.droolsfiddle.beans;

import org.kie.api.runtime.KieContainer;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Component;

import javax.websocket.Session;

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

    public Session getWebSocketSession() { return webSocketSession; }

    public void setWebSocketSession(Session webSocketSession) { this.webSocketSession = webSocketSession; }

    private KieContainer kieContainer;

    private Session webSocketSession;



}
