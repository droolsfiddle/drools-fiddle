package org.droolsfiddle.persistence.redis;

import org.hashids.Hashids;
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

    private static final short minHashLen = 8;

    private static final String salt =
            "WTHNi59UkQAMCTUXVjVz" +
            "mL8q82iVdJqcUKNbUXIT" +
            "uLRVS8iSKe7HJU533NcS" +
            "qBc9A1AaTFQrffBVwdMb" +
            "F8UlybL7U3dpVLb42Pj5" +
            "SCApnLsrnlhWkCKKWVfq" +
            "ERNHJtGMlxehK0igwyzW" +
            "q5uG0wHQ5xiREwMXJDvr" +
            "0MMOAmuQ7xn1sDQ0eGQZ" +
            "CCkFlf2IICVSYcyd1epS";

    private final Hashids hashids = new Hashids(salt, minHashLen);
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

        String cid = hashids.encode(contextIdCounter.incrementAndGet());

        contexts().put(cid,container);

        return cid;
    }

    public void put(String cid, KieBase container) {
        contexts().put(cid,container);
    }

    public boolean has(String cid) {
        return contexts().containsKey(cid);
    }


    public KieBase get(String cid) {
        return contexts().get(cid);
    }

    private DefaultRedisMap<String, KieBase> contexts() {
        return new DefaultRedisMap<String, KieBase>("contexts", template);
    }

}
