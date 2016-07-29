package org.droolsfiddle.beans;

import org.droolsfiddle.persistence.beans.KieBaseWrapper;
import org.kie.api.KieBase;
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

    public boolean hasKieBase() {
        return kieBase != null;
    }

    public KieBaseWrapper getKieBase() {
        return kieBase;
    }

    public void setKieBase(KieBaseWrapper kieContainer) {
        this.kieBase = kieContainer;
    }

    public Session getWebSocketSession() { return webSocketSession; }

    public void setWebSocketSession(Session webSocketSession) { this.webSocketSession = webSocketSession; }


    private KieBaseWrapper kieBase;

    private Session webSocketSession;



}
