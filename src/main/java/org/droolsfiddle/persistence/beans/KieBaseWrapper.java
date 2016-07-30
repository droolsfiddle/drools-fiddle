package org.droolsfiddle.persistence.beans;

import org.kie.api.KieBase;

import java.io.Serializable;

/**
 * Created by gurfm on 29/07/16.
 */
public class KieBaseWrapper implements Serializable {

    private static final long serialVersionUID = 7526471155622776147L;

    private KieBase kieBase;

    private String drl;

    public KieBaseWrapper(String drl, KieBase kieBase) {
        this.drl = drl;
        this.kieBase = kieBase;
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
}
