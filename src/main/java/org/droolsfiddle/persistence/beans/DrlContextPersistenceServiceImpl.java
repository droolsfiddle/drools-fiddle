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

import org.droolsfiddle.beans.DrlContext;
import org.droolsfiddle.persistence.beans.model.ContextPersistenceDTO;
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
        try {
            if (context.getKieBase() == null) {
                dto.setError("No context to be saved");
                dto.setResult(false);
            } else {
                dto.setContextId(repository.post(context.getKieBase()));
                dto.setResult(true);
            }
        } catch (Exception e) {
            logger.error("Caught exception in post context",e);
            dto.setResult(false);
            dto.setError(e.getMessage());
        }

        return dto;
    }

    @Override
    public ContextPersistenceDTO put(String cid) {
        ContextPersistenceDTO dto = new ContextPersistenceDTO();
        dto.setContextId(cid);
        try {
            if (!repository.has(cid)) {
                dto.setError("No context corresponding to id " + cid);
                dto.setResult(false);
            } else if (context.getKieBase() == null) {
                dto.setError("No context to be saved");
                dto.setResult(false);
            } else {
                repository.put(cid, context.getKieBase());
                dto.setResult(true);
            }
        } catch (Exception e) {
            dto.setResult(false);
            dto.setError(e.getMessage());
        }
        return dto;
    }

    @Override
    public ContextPersistenceDTO get(String cid) {
        ContextPersistenceDTO dto = new ContextPersistenceDTO();
        dto.setContextId(cid);
        try {
            if (!repository.has(cid)) {
                dto.setError("No context corresponding to id " + cid);
                dto.setResult(false);
            } else {
                context.setKieBase((repository.get(cid)));
                dto.setDrl(context.getKieBase().getDrl());
                dto.setJson(context.getKieBase().getJson());
                dto.setResult(true);
            }
        } catch (Exception e) {
            dto.setResult(false);
            dto.setError(e.getMessage());
        }
        return dto;
    }




}
