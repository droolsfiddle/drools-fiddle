/*   Copyright 2016 Drools Fiddle

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/

package org.droolsfiddle.beans;

import org.droolsfiddle.persistence.beans.KieBaseWrapper;
import org.droolsfiddle.persistence.redis.DroolsFiddleSession;
import org.kie.api.KieBase;
import org.kie.api.runtime.KieContainer;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Component;

import javax.annotation.PreDestroy;
import javax.websocket.Session;
import java.io.IOException;

/**
 * Created by gurfm on 15/06/16.
 */
@Component
@Scope(value="session", proxyMode= ScopedProxyMode.TARGET_CLASS)
public class DrlContext {

    private KieBaseWrapper kieBase;
    
    private DroolsFiddleSession droolsFiddleSession;

    private Session webSocketSession;
    
    private String json;


    public boolean hasKieBase() {
        return kieBase != null;
    }

    public KieBaseWrapper getKieBase() {
        return kieBase;
    }

    public void setKieBase(KieBaseWrapper kieContainer) {
        this.kieBase = kieContainer;
    }
    
    public String getJson() {
        return json;
    }

    public void setJson(String json) {
        this.json = json;
    }

    public Session getWebSocketSession() { return webSocketSession; }

    public void setWebSocketSession(Session webSocketSession) { this.webSocketSession = webSocketSession; }

    @PreDestroy
    public void dispose() {
        kieBase.dispose();
        try {
            webSocketSession.close();
        } catch (IOException e) {}
    }



}
