# Drools Fiddle

## Overview

Drools Fiddle is the fiddle for Drools, a business rule engine maintained by Redhat: https://www.drools.org/. The goal of this web tool is to allow technical or non technical users to play around with Drools. First, it allows you to build your business configuration by defining both fact models and business rules. Secondly, you can simulate the evaluation of your rule package by dynamically instanciating facts in the Drools working memory and trigger the fireAllRules method. A set of features have been implemented in order to enhance the user experience: step by step debugging, contribution, graphical visualization.

## Table of Contents

  - [Overview](#overview)
  - [Table of Contents](#table-of-contents)
  - [Install](#install)
    - [Prerequisites](#prerequisites)
    - [Build](#build)
    - [Run integration tests](#run-integration-test)
    - [Docker](#docker)
  - [Getting Started](#getting-started)
  - [Contributing](#contributing)
  - [Authors](#authors)
  - [License](#license)

## Install

This project uses [Jboss WildFly](https://wildfly.org) as Application Server.

### Prerequisites

In order to build and deploy this project you will need to fullfill those prerequisites:
* All WildFly prerequisites: [https://docs.jboss.org/wildfly/plugins/maven/latest/dependencies.html](https://docs.jboss.org/wildfly/plugins/maven/latest/dependencies.html)
    * Maven version > 3.1.1
    * Java 8
*  [Docker](https://www.docker.com) daemon
*  [NodeJS](https://nodejs.org/en/)
*  [Angular CLI](https://www.npmjs.com/package/@angular/cli#prerequisites)

### Build

    mvn clean install

### Run integration tests

    mvn clean verify -Parq-wildfly-managed

### Docker

#### Build & Deploy

    mvn clean install -Pdocker

Access drools-fiddle at [http://localhost/drools-fiddle]()

#### Stop containers

    mvn docker:stop -Pdocker
    
#### Start/stop containers without _maven_

When you have already built images then it is possible to start the drools-fiddle without _maven_. You can call either 
_docker_ directly or use _docker-compose_.

Start the stack:

    docker-compose up [--detach]
    
Stop the stack

    docker-compose down

## Getting Started

1. Connect to [http://droolsfiddle.tk/](). The DRL editor is already filled with an HelloWorld package:

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

2. Click on the **Build** in order to trigger the compilation and build of the rule package.
3. Insert an instance of _Fact_ with 42 as a value and then **Submit**.
4. Click on **Fire** in order to trigger the fireAllRules method and evaluate your ruleset.

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request.

## Authors

### Core team

* Julien Vipret : julien.vipret [at] gmail [dot] com
* Matteo Casalino : matteo.casalino [at] gmail [dot] com

### Contributors

* Alexis OLIVARI : olivari.alexis0 [at] gmail [dot] com
* Thomas Palandri
* Jaona Ramahaleo

## License

Copyright 2016 Drools Fiddle

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at [apache.org/licenses/LICENSE-2.0](http://www.apache.org/licenses/LICENSE-2.0)

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
