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

package org.droolsfiddle.persistence.beans;

import org.kie.api.KieBase;
import org.kie.api.runtime.KieSession;

import java.io.Serializable;

/**
 * Created by gurfm on 29/07/16.
 */
public class KieBaseWrapper implements Serializable {

    private static final long serialVersionUID = 7526471155622776147L;

    private transient KieBase kieBase;

    private String drl;
    
    private String json;

    public KieBaseWrapper(String drl, KieBase kieBase, String json) {
        this.drl = drl;
        this.kieBase = kieBase;
        this.json = json;
    }

    public KieBase getKieBase() {
        return kieBase;
    }

    public void setKieBase(KieBase kieBase) {
        this.kieBase = kieBase;
    }

    public String getDrl() {
        return drl;
    }

    public void setDrl(String drl) {
        this.drl = drl;
    }
    
    public String getJson() {
        return json;
    }

    public void setJson(String json) {
        this.json = json;
    }

    public void dispose() {
        if (kieBase != null) {
            for (KieSession ks : kieBase.getKieSessions()) {
                ks.halt();
                ks.dispose();
            }
        }
    }
}
