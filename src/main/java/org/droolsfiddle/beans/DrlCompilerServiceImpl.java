package org.droolsfiddle.beans;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.deser.std.StringArrayDeserializer;
import org.droolsfiddle.persistence.beans.KieBaseWrapper;
import org.droolsfiddle.rest.*;
import org.droolsfiddle.rest.Package;
import org.droolsfiddle.websocket.CustomDroolsEvent;
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


    public Message postDrlCompile(Message iMessage) {
        logger.debug("Init validation drl: DrlParser");
        Session wsSession = (Session) request.getSession().getAttribute(Session.class.getName());

        String drl;
        try {
            drl = new String(Base64.decode(iMessage.getData()),
                    Charset.forName("UTF-8"));
        } catch (IOException e) {
            try {
                wsSession.getBasicRemote().sendText("error while decoding input drl: "+e.getMessage());
            } catch (IOException e2) {
                e2.printStackTrace();
            }
            iMessage.setLog("error while decoding input drl: "+e.getMessage());
            return iMessage;
        }

        iMessage.setData("");

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
            }
            try {
                wsSession.getBasicRemote().sendText(mapper.writeValueAsString(aLog));
            } catch (IOException e) {
                e.printStackTrace();
            }

        } else {
            kContainer = ks.newKieContainer(kr.getDefaultReleaseId());
            aLog.append(kContainer.getClassLoader());

            KieBase kbs = kContainer.getKieBase();
            drlContext.setKieBase(new KieBaseWrapper(drl,kbs));

            // packages parsing


            Set<FactType> rootTypes = new HashSet<FactType>();
            for (KiePackage pack : kbs.getKiePackages()) { // first assume all types are root types
                rootTypes.addAll(pack.getFactTypes());
            }
            /*
            for (KiePackage pack : kbs.getKiePackages()) {  // then filter out non-root types
                for (FactType type : pack.getFactTypes()) { // for each type
                    for (FactField field : type.getFields()) { // for each field inside
                        if (!field.getType().isPrimitive()) { // if not primitive
                            FactType fieldType = kbs.getFactType(field.getType().getPackage().getName(),
                                    field.getType().getSimpleName());
                            if (fieldType != null) { // field type is a declared type
                                if (rootTypes.contains(fieldType)) { // then it's not a root type
                                    rootTypes.remove(fieldType);
                                }
                            }
                        }
                    }
                }
            }
            */
            logger.debug("root types: "+rootTypes);
            JsonSchemaNode root = new JsonSchemaNode();
            root.setType("object");
            root.setTitle("Facts");
            Map<String,Object> emptyMap = new HashMap<>();
            for (FactType type : rootTypes) {
                if (type.getFactClass().isEnum()) // skip enums
                    continue;

                root.getProperties().put(type.getName(),
                        factType2JsonSchemaNode(type.getSimpleName(),type,kbs));
                iMessage.getJsonValue().put(type.getName(),emptyMap);

            }
            iMessage.setJsonSchema(root);


            List<Package> packs = new ArrayList<Package>();
            for (KiePackage pack : kbs.getKiePackages()) {
                Package aPack = new Package();
                aPack.setName(pack.getName());
                List<Fact> facts = new ArrayList<Fact>();
                for (Rule rule : pack.getRules()) {
                    org.droolsfiddle.rest.Rule aRule = new org.droolsfiddle.rest.Rule();
                    aRule.setName(rule.getName());
                    CustomDroolsEvent aEvent = new CustomDroolsEvent("insert-rule").map(aRule);
                    try {
                        wsSession.getBasicRemote().sendText(mapper.writeValueAsString(aEvent));
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                }

                for (FactType declare : pack.getFactTypes()) {
                    Fact aFact = new Fact();
                    List<Attribute> attributes = new ArrayList<Attribute>();
                    aFact.setName(declare.getName().replaceAll(pack.getName() + ".", ""));

                    for (FactField field : declare.getFields()) {
                        Attribute attr = new Attribute();
                        attr.setId(field.getIndex());
                        attr.setName(field.getName());
                        attr.setType(field.getType().getCanonicalName());
                        if (field.getType().isEnum()) {
                            Object[] aEnumValues = field.getType().getEnumConstants();
                            attr.setEnumValues(field.getType().getEnumConstants());
                        }
                        attributes.add(attr);
                    }
                    aFact.setAttributes(attributes);
                    if(!declare.getFactClass().isEnum()) {
                        facts.add(aFact);
                    }
                    CustomDroolsEvent aEvent = new CustomDroolsEvent("insert-fact-type").map(aFact);
                    try {
                        wsSession.getBasicRemote().sendText(mapper.writeValueAsString(aEvent));
                    } catch (IOException e) {
                        e.printStackTrace();
                    }

                }
                aPack.setFacts(facts);
                packs.add(aPack);
            }
            iMessage.setPackages(packs);
        }

        iMessage.setLog(aLog.toString());
        logger.debug(iMessage.toString());


        return iMessage;
    }

    private JsonSchemaNode factType2JsonSchemaNode(String name, FactType type, KieBase kbs) {
        logger.debug("factType2JsonSchemaNode("+name+", "+type+")");
        JsonSchemaNode node = new JsonSchemaNode();

        node.setTitle(name);
        node.setType("object");

        for (FactField field : type.getFields()) {
            Class<?> fieldType = field.getType();
            FactType fieldFactType = null;
            if (!fieldType.isPrimitive()) {
                fieldFactType = kbs.getFactType(fieldType.getPackage().getName(), fieldType.getSimpleName());
            }
            if (fieldFactType != null && !fieldType.isEnum()) {
                node.getProperties().put(field.getName(),
                        factType2JsonSchemaNode(field.getName(),fieldFactType,kbs));
            } else {
                node.getProperties().put(field.getName(),factType2JsonSchemaLeafNode(field));
            }

        }

        return node;
    }

    private JsonSchemaNode factType2JsonSchemaLeafNode(FactField field) {

        JsonSchemaNode node = new JsonSchemaNode();
        Class<?> type = field.getType();

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

        node.setTitle(field.getName());

        return node;
    }

}