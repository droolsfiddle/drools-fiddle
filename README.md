# Drools Fiddle project
## installation
    mvn clean install wildfly:run
## deployment (while the as is running)
    mvn wildfly:deploy
## integration tests
    mvn clean verify -Parq-wildfly-managed
## todo
- [ ] figure out why cookie is not kept across subsequent arquillian service calls (hence session is lost)
- [X] static html files to be served by jboss 



