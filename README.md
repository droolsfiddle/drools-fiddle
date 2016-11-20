# Drools Fiddle
### Overview
----------------
Drools Fiddle is the fiddle for Drools, a business rule engine maintained by Redhat: https://www.drools.org/
The goal of this web tool is to allow technical or non technical users to play around with Drools. First, it allows you to build your business configuration by defining both fact models and business rules. Secondly, you can simulate the evaluation of your rule package by dynamically instanciating facts in the Drools working memory and trigger the fireAllRules method. A set of features have been implemented in order to enhance the user experience: step by step debugging, contribution, graphical visualization.

# Table of contents
----------------
  - [Overview](#overview)
  - [Table of Contents](#table-of-contents)
  - Installation
    - [Prerequisites](#prerequisites)
    - [Building](#building)
    - [Run integration tests](#run-integration-test)
    - [Docker](#docker)
  - [Getting Started](#getting-started)
  - [Contributing](#contributing)
  - [Authors](#authors)
  - [License](#license)
## Installation
This project uses Jboss WildFly as Application Server
### Prerequisites
In order to build and deploy this project you will need to fullfill those prerequisites:
* All WildFly prerequisites: [https://docs.jboss.org/wildfly/plugins/maven/latest/dependencies.html](https://docs.jboss.org/wildfly/plugins/maven/latest/dependencies.html) 
    * Maven version > 3.1.1
    * Java 8
*  Docker daemon
### Building
    mvn clean install
### Run integration tests
    mvn clean verify -Parq-wildfly-managed
### Docker
#### Build & Deploy
    mvn clean install -Pdocker
#### Stop containers
    mvn docker:stop -Pdocker
## Getting Started
1. Connect to http://droolsfiddle.tk/. The DRL editor is already filled with an HelloWorld package:
```
declare Fact
    value : int
end

rule "Rule"
when
    f : Fact(value == 42)
then
    modify( f ) {setValue( 41 )}
end
```
2. Click on the **Build** in order to trigger the compilation and build of the rule package
3. Insert an instance of _Fact_ with 42 as a value and then **Submit**
4. Click on **Fire** in order to trigger the fireAllRules method and evaluate your ruleset.

## Contributing
1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request 
## Authors
### Core team
* Julien Vipret : julien.vipret [at] gmail [dot] com
* Matteo Casalino : matteo.casalino [at] gmail [dot] com
### Contributors
* Thomas Palandri
* Jaona Ramahaleo
## License
Drools Fiddle is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, version 3 of the License.
Drools Fiddle is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details.
You should have received a copy of the GNU General Public License along with Drools Fiddle.  If not, see <http://www.gnu.org/licenses/>.