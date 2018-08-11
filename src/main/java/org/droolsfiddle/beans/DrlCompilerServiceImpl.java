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

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.droolsfiddle.persistence.beans.KieBaseWrapper;
import org.droolsfiddle.rest.*;
import org.droolsfiddle.rest.model.*;
import org.droolsfiddle.websocket.CustomDroolsEvent;
import org.droolsfiddle.websocket.WebSocketUtil;
import org.jboss.resteasy.logging.Logger;
import org.jboss.resteasy.util.Base64;
import org.kie.api.KieBase;
import org.kie.api.KieServices;
import org.kie.api.builder.KieBuilder;
import org.kie.api.builder.KieFileSystem;
import org.kie.api.builder.KieRepository;
import org.kie.api.definition.KiePackage;
import org.kie.api.definition.rule.Rule;
import org.kie.api.definition.type.FactField;
import org.kie.api.definition.type.FactType;
import org.kie.api.runtime.KieContainer;

import javax.inject.Inject;
import javax.inject.Named;
import javax.servlet.http.HttpServletRequest;
import javax.websocket.Session;
import javax.ws.rs.core.Context;
import java.io.IOException;
import java.nio.charset.Charset;
import java.util.*;

@Named
public class DrlCompilerServiceImpl implements DrlCompilerService {

    

	private Logger logger = Logger.getLogger(DrlCompilerServiceImpl.class);

    @Context
    private HttpServletRequest request;

    @Inject
    DrlContext drlContext;

    private ObjectMapper mapper = new ObjectMapper();

	private int nestingCount;
	private int nestingLimit;

	private boolean hasLoop;

	private Set<FactType> usedFactType;


    public Request postDrlCompile(final Request iRequest) throws JsonProcessingException {

        
    	logger.debug("Init validation drl: DrlParser");
        Session wsSession = (Session) request.getSession().getAttribute(Session.class.getName()); 

        Request resp = new Request();
        resp.setSuccess(false);
        hasLoop = false;
        
        String drl;
        try {
            drl = new String(Base64.decode(iRequest.getData()),
                    Charset.forName("UTF-8"));
        } catch (IOException e) {
            WebSocketUtil.sendToWebSocket(wsSession, "error while decoding input drl: "+e.getMessage());
            resp.setLog("error while decoding input drl: "+e.getMessage());
            return resp;
        }
        
        
        String json; 
        try {
            json = new String(Base64.decode(iRequest.getJson()),
                    Charset.forName("UTF-8"));
        } catch (IOException e) {
            WebSocketUtil.sendToWebSocket(wsSession, "error while decoding input JSON: "+e.getMessage());
            resp.setLog("error while decoding input JSON: "+e.getMessage());
            return resp;
        }
        
        nestingLimit = iRequest.getNestingLimit(); 
        resp.setNestingLimit(nestingLimit);
        


        StringBuilder aLog = new StringBuilder();

        KieServices ks = KieServices.Factory.get();
        KieRepository kr = ks.getRepository();
        KieFileSystem kfs = ks.newKieFileSystem();

        kfs.write("src/main/resources/temp.drl", drl);

        KieBuilder kb = ks.newKieBuilder(kfs);
        KieContainer kContainer;
        kb.buildAll(); // kieModule is automatically deployed to KieRepository if successfully built.
        if (kb.getResults().hasMessages(org.kie.api.builder.Message.Level.ERROR)) {
            for (org.kie.api.builder.Message info : kb.getResults().getMessages()) {
                logger.debug(info.toString());
                aLog.append(info.toString() + "\n");
                WebSocketUtil.sendToWebSocket(wsSession, mapper.writeValueAsString(info.toString()));
            }


            resp.setHasLoop(hasLoop);
            resp.setLog(aLog.toString());
            return resp;
        }

        kContainer = ks.newKieContainer(kr.getDefaultReleaseId());
        aLog.append(kContainer.getClassLoader());

        KieBase kbs = kContainer.getKieBase();
        drlContext.setKieBase(new KieBaseWrapper(drl , kbs , json));

        // packages parsing
        Set<FactType> rootTypes = new HashSet<FactType>();
        for (KiePackage pack : kbs.getKiePackages()) {
            rootTypes.addAll(pack.getFactTypes());
        }

        JsonSchemaNode root = new JsonSchemaNode();
        root.setType("object");
        root.setTitle("Facts");
        for (FactType type : rootTypes) {
        	nestingCount = 0;
            if (type.getFactClass().isEnum()) // skip enums
                continue;

            usedFactType = new HashSet<>();
            root.getProperties().put(type.getName(),
                    factType2JsonSchemaNode(type.getSimpleName(),type,kbs));

        }
        resp.setJsonSchema(root);

        List<PackageDTO> packs = new ArrayList<PackageDTO>();
        for (KiePackage pack : kbs.getKiePackages()) {
            for (Rule rule : pack.getRules()) {
                RuleDTO aRuleDTO = new RuleDTO();
                aRuleDTO.setName(rule.getName());
                CustomDroolsEvent aEvent = new CustomDroolsEvent("insert-rule").map(aRuleDTO);
                WebSocketUtil.sendToWebSocket(wsSession, mapper.writeValueAsString(aEvent));

            }

            for (FactType declare : pack.getFactTypes()) {
                FactDTO aFactDTO = new FactDTO();
                List<AttributeDTO> attributes = new ArrayList<AttributeDTO>();
                aFactDTO.setName(declare.getName().replaceAll(pack.getName() + ".", ""));

                for (FactField field : declare.getFields()) {
                    AttributeDTO attr = new AttributeDTO();
                    attr.setId(field.getIndex());
                    attr.setName(field.getName());
                    attr.setType(field.getType().getCanonicalName());
                    if (field.getType().isEnum()) {
                        attr.setEnumValues(field.getType().getEnumConstants());
                    }
                    attributes.add(attr);
                }
                aFactDTO.setAttributes(attributes);
                CustomDroolsEvent aEvent = new CustomDroolsEvent("insert-fact-type").map(aFactDTO);
                WebSocketUtil.sendToWebSocket(wsSession, mapper.writeValueAsString(aEvent));

            }
        }

        resp.setHasLoop(hasLoop);
        resp.setLog(aLog.toString());
        resp.setSuccess(true);

        logger.debug("End DRL compile service: "+resp.toString());
			
        return resp; 
    }

    private JsonSchemaNode factType2JsonSchemaNode(String name, FactType type, KieBase kbs) {
    	if (usedFactType.contains(type)) {
    		hasLoop = true;
    	} else {
    		usedFactType.add(type);
    	}
        logger.debug("factType2JsonSchemaNode("+name+", "+type+")");
        JsonSchemaNode node = new JsonSchemaNode();

        node.setTitle(name);
        node.setType("object");

        nestingCount++;
        if (!hasLoop || (nestingCount < nestingLimit)) {
        	for (FactField field : type.getFields()) {
        		node.getProperties().put(field.getName(),
        				javaType2JsonSchemaNode(field.getName(), field.getType(), kbs));
        	}
        	
        }

        nestingCount--;
        if (usedFactType.contains(type)) {
        	usedFactType.remove(type);
    	} 
        return node;
    }

    private JsonSchemaBaseNode javaType2JsonSchemaNode(String name, Class<?> type, KieBase kbs) {


        if (type.isArray()) {
            JsonSchemaArrayNode node = new JsonSchemaArrayNode();
            node.setTitle(name);
            node.setFormat("table");
            node.setType("array");
            node.setItems(javaType2JsonSchemaNode(name,type.getComponentType(),kbs));
            return node;
        }

        FactType factType = null;
        if (!type.isPrimitive()) {
            factType = kbs.getFactType(type.getPackage().getName(), type.getSimpleName());
        }

        if (factType != null && !type.isEnum()) {
            return factType2JsonSchemaNode(name, factType, kbs);
        }

        return javaType2JsonSchemaLeafNode(name, type);
    }

    private JsonSchemaLeafNode javaType2JsonSchemaLeafNode(String name, Class<?> type) {

    	if (Collection.class.isAssignableFrom(type)) {
    		JsonSchemaArrayNode node = new JsonSchemaArrayNode();
    		node.setTitle(name);
    		node.setType("array");
    		JsonSchemaMultiTypeNode typeNode = new JsonSchemaMultiTypeNode();
    		typeNode.getType().add("string");
    		typeNode.getType().add("boolean");
    		typeNode.getType().add("integer");
    		typeNode.getType().add("number");
    		node.setItems(typeNode);
    		return node;
    	}
        JsonSchemaLeafNode node = new JsonSchemaNode();

        if (type.equals(Integer.class) || type.equals(Long.class) || type.equals(Short.class)
                || type.equals(int.class) || type.equals(long.class) || type.equals(short.class)) {
            node.setType("integer");
        } else if (type.equals(Float.class) || type.equals(Double.class)
                || type.equals(float.class) || type.equals(double.class)) {
            node.setType("number");
        } else if (type.equals(Boolean.class) || type.equals(boolean.class)) {
            node.setType("boolean");
        }  else if (type.equals(Date.class)) {
            JsonSchemaFormattedNode fnode = new JsonSchemaFormattedNode();
            fnode.setType("string");
            fnode.setFormat("date");
            node = fnode;
        } else if (type.equals(String.class)) {
            node.setType("string");
        } else if (type.isEnum()) {
            JsonSchemaEnumNode enode = new JsonSchemaEnumNode();
            enode.setType("string");
            enode.setFormat("select");
            for (Object ec : type.getEnumConstants()) {
                enode.getEnum().add(ec.toString());
            }
            node = enode;
        }

        node.setTitle(name);

        return node;
    }

}