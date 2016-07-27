package org.droolsfiddle.persistence.redis;

import org.kie.api.KieBase;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.support.atomic.RedisAtomicLong;
import org.springframework.data.redis.support.collections.DefaultRedisMap;

import javax.inject.Inject;
import javax.inject.Named;

/**
 * Created by gurfm on 27/07/16.
 */
@Named
public class DrlRepository {

    private final RedisTemplate<String, KieBase> template;

    private final RedisAtomicLong contextIdCounter;
/*
    public static class KieContainerSerializer implements RedisSerializer<KieContainer>
    {
        @Override
        public byte[] serialize(KieContainer kieContainer) throws SerializationException {
            try {
                ByteArrayOutputStream bos = new ByteArrayOutputStream();
                ObjectOutputStream os = new ObjectOutputStream(bos);
                os.writeObject(kieContainer);
                os.close();
                return bos.toByteArray();
            } catch (Exception e) {
                throw new SerializationException("Serialization failed",e);
            }
        }

        @Override
        public KieContainer deserialize(byte[] bytes) throws SerializationException {
            return null;
        }
    }
*/
    @Inject
    DrlRepository(RedisTemplate<String, KieBase> template) {
        this.template = template;
        contextIdCounter = new RedisAtomicLong("global:cid", template.getConnectionFactory());
    }

    public String post(KieBase container) {

        String cid = String.valueOf(contextIdCounter.incrementAndGet());

        contexts().put(cid,container);

        return cid;
    }

    public void put(String cid, KieBase container) {
        contexts().put(cid,container);
    }


    public KieBase get(String cid) {
        return contexts().get(cid);
    }

    private DefaultRedisMap<String, KieBase> contexts() {
        return new DefaultRedisMap<String, KieBase>("contexts", template);
    }

}
