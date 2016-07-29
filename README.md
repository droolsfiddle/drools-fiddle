# Drools Fiddle project
## installation
    mvn clean install wildfly:run
## deployment (while the as is running)
    mvn wildfly:deploy
## integration tests
    mvn clean verify -Parq-wildfly-managed
## todo
- [X] figure out why cookie is not kept across subsequent arquillian service calls (hence session is lost)
- [X] static html files to be served by jboss 
- [ ] fix integration tests
- [ ] implement update (PUT) of kieBase in angular
- [ ] retrieve factTypes too upon kieBase GET 


