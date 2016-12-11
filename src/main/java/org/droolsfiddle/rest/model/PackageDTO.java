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

package org.droolsfiddle.rest.model;

import java.util.List;

/**
 * Created by jvipret on 08/06/2016.
 */
public class PackageDTO {

  private int id;
  private String name;
  private List<FactDTO> factDTOs;

  public int getId() {
    return id;
  }

  public void setId(int id) {
    this.id = id;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public List<FactDTO> getFacts() {
    return factDTOs;
  }

  public void setFacts(List<FactDTO> factDTOs) {
    this.factDTOs = factDTOs;
  }

  @Override
  public String toString() {
    return "PackageDTO{" +
            "id=" + id +
            ", name='" + name + '\'' +
            ", factDTOs=" + factDTOs +
            '}';
  }
}
