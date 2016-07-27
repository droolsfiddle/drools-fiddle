package org.droolsfiddle.persistence.beans;

import org.droolsfiddle.beans.DrlContext;
import org.droolsfiddle.persistence.redis.DrlRepository;
import org.droolsfiddle.persistence.rest.DrlContextPersistenceService;
import org.jboss.resteasy.logging.Logger;

import javax.inject.Inject;
import javax.inject.Named;

/**
 * Created by gurfm on 27/07/16.
 */
@Named
public class DrlContextPersistenceServiceImpl implements DrlContextPersistenceService {

    private Logger logger = Logger.getLogger(DrlContextPersistenceServiceImpl.class);

    @Inject
    private DrlRepository repository;

    @Inject
    private DrlContext context;

    @Override
    public ContextPersistenceDTO post() {
        ContextPersistenceDTO dto = new ContextPersistenceDTO();

        dto.setContextId(repository.post(context.getKieBase()));
        dto.setResult(true);

        return dto;
    }

    @Override
    public ContextPersistenceDTO put(String cid) {
        ContextPersistenceDTO dto = new ContextPersistenceDTO();
        repository.put(cid,context.getKieBase());
        dto.setResult(true);
        return dto;
    }

    @Override
    public ContextPersistenceDTO get(String cid) {
        ContextPersistenceDTO dto = new ContextPersistenceDTO();
        context.setKieBase(repository.get(cid));
        dto.setResult(true);
        return dto;
    }




}
