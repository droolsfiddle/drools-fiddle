    function addFactInstance(data) {
        event = {'action' : 'insert-fact', 'before' : {}, 'after' : data};
        queue.push(event);
        if ($("[name='checkbox-live']").bootstrapSwitch('state')) {
            nextFI({}, data);
            index++;
        }
    }

    function updateFactInstance(data) {
        var node = nodes.get(data.id);
        event = {'action' : 'update-fact', 'before' : node, 'after' : data};
        queue.push(event);
        if ($("[name='checkbox-live']").bootstrapSwitch('state')) {
            nextUFI(node, data);
            index++;
        }
    }

    function removeFactInstance(data) {
        var node = nodes.get(data.id);
        event = {'action' : 'delete-fact', 'before' : node, 'after' : data};
        queue.push(event);
        if ($("[name='checkbox-live']").bootstrapSwitch('state')) {
            nextRFI(node, data);
            index++;
        }
    }

    function addFactType(data) {
        var newId = (Math.random() * 1e7).toString(32);
        data.id = newId;
        event = {'action' : 'insert-fact-type', 'before' : {}, 'after' : data};
        queue.push(event);
        if ($("[name='checkbox-live']").bootstrapSwitch('state')) {
            nextFT({}, data);
            index++;
        }
    }

    function addRule(data) {
        event = {'action' : 'insert-rule', 'before' : {}, 'after' : data};
        queue.push(event);
        if ($("[name='checkbox-live']").bootstrapSwitch('state')) {
            nextR({}, data);
            index++;
        }
    }

    function fire(data) {
        event = {'action' : 'fire', 'before' : {}, 'after' : data};
        queue.push(event);
        if ($("[name='checkbox-live']").bootstrapSwitch('state')) {
            nextF({}, data);
            index++;
        }
    }

    function previousbegin() {
        while (index >= 0) {
            previousHandle[queue[index].action](queue[index]['before'], queue[index]['after'])
            index = index - 1;
            $("#counter").text((index + 1) + " / " + queue.length);
        }
    }

    function previous() {
        if (index >= 0) {
            previousHandle[queue[index].action](queue[index]['before'], queue[index]['after'])
            index = index - 1;
            $("#counter").text((index + 1) + " / " + queue.length);
        }
    }

    function next() {
        if (index < queue.length - 1) {
            index = index + 1;
            nextHandle[queue[index].action](queue[index]['before'], queue[index]['after'])
            $("#counter").text((index + 1) + " / " + queue.length);
        }
    }

    function nextend() {
        while (index < queue.length - 1) {
            index = index + 1;
            nextHandle[queue[index].action](queue[index]['before'], queue[index]['after'])
            $("#counter").text((index + 1) + " / " + queue.length);
        }
    }

    var actionHandle = {
        "insert-fact": addFactInstance,
        "insert-fact-type": addFactType,
        "insert-rule": addRule,
        "update-fact": updateFactInstance,
        "delete-fact": removeFactInstance,
        "fire": fire
    }

    var nextHandle = {
        "insert-fact": nextFI,
        "insert-fact-type": nextFT,
        "insert-rule": nextR,
        "update-fact": nextUFI,
        "delete-fact": nextRFI,
        "fire": nextF
    }

    var previousHandle = {
        "insert-fact": nextFIR,
        "insert-fact-type": nextFTR,
        "insert-rule": nextRR,
        "update-fact": nextUFIR,
        "delete-fact": nextRFIR,
        "fire": nextFR
    }

    function nextFI(dataP, dataA) {
        var newId = dataA.id;
        var dataJson = JSON.stringify(dataA.object, null, 2);
        nodes.add({id:newId, color : 'blue', title:dataJson, group : "factinstance"});
        var edgesId = dataA.type + "-" + newId;
        edges.add({id:edgesId, from: dataA.type, to: newId, dashes:true});
        if(dataA.from.length > 0) {
            edgesId = dataA.from[0] + "-" + newId;
            edges.add({id:edgesId, from: dataA.from[0], to: newId, arrows:'to'});
        } else {
            edgesId = "0-" + newId;
            edges.add({id:edgesId, from: 0, to: newId, arrows:'to'});
        }
    }

    function nextUFI(dataP, dataA) {
        var node = nodes.get(dataA.id);
        node.borderWidth = 3;
        node.color = {background:'blue', border:'red'};
        var dataJson = JSON.stringify(dataA.object, null, 2);
        node.title = dataJson;
        nodes.update(node);
        if(dataA.from.length > 0) {
            var edgesId = dataA.from[0] + "-" + dataA.id;
            edges.add({id:edgesId, from: dataA.from[0], to: dataA.id, arrows:'to'});
        }
    }

    function nextRFI(dataP, dataA) {
        var node = nodes.get(dataA.id);
        node.color = {background:'black', border:'black'};
        var dataJson = "The fact instance has been deleted";
        node.title = dataJson;
        nodes.update(node);
        if(dataA.from.length > 0) {
            var edgesId = dataA.from[0] + "-" + dataA.id;
            edges.add({id:edgesId, from: dataA.from[0], to: dataA.id, arrows:'to'});
        }
    }

    function nextFT(dataP, dataA) {
        var newId = dataA.id;
        //var newId = dataA.object.name;
        var dataJson = JSON.stringify(dataA.object.attributes, null, 2);
        nodes.add({id:dataA.object.name, label:dataA.object.name, color : 'red', shape : 'box', title:dataJson, group : "facttype"});
    }

    function nextR(dataP, dataA) {
        var dataJson = JSON.stringify(dataA.object, null, 2);
        nodes.add({id:dataA.object.name, label:dataA.object.name, color : 'orange', shape : 'box', title:dataJson, group : "rule"});
    }

    function nextF(dataP, dataA) {
        var node = nodes.get(dataA.object);
        node.borderWidth = 3;
        node.color = {background:'orange', border:'red'};
        nodes.update(node);
        var edgesId;
        for (i = 0; i < dataA.from.length; i++) {
            edgesId = dataA.from[i] + "-" + dataA.object;
            edges.add({id:edgesId, from: dataA.from[i], to: dataA.object, arrows:'to', color: 'purple'});
        }
    }

    function nextFIR(dataP, dataA) {
        edges.remove(dataA.type + "-" + dataA.id);
        if(dataA.from.length > 0) {
            edges.remove(dataA.from[0] + "-" + dataA.id);
        } else {
            edges.remove("0-" + dataA.id);
        }
        nodes.remove(dataA.id);
    }

    function nextFTR(dataP, dataA) {
        nodes.remove(dataA.object.name);
    }

    function nextRR(dataP, dataA) {
        nodes.remove(dataA.object.name);
    }

    function nextFR(dataP, dataA) {
        var node = nodes.get(dataA.object);
        node.borderWidth = 1;
        node.color = {background:'orange', border:'orange'};
        nodes.update(node);
        var edgesId;
        for (i = 0; i < dataA.from.length; i++) {
            edgesId = dataA.from[i] + "-" + dataA.object;
            edges.remove(edgesId);
        }
    }

    function nextUFIR(dataP, dataA) {
        nodes.update(dataP);
        if(dataA.from.length > 0) {
            edges.remove(dataA.from[0] + "-" + dataA.id);
        }
    }

    function nextRFIR(dataP, dataA) {
        nodes.update(dataP);
        if(dataA.from.length > 0) {
            edges.remove(dataA.from[0] + "-" + dataA.id);
        }
    }

    var nodes;
    var edges;
    var network;
    var queue = [];

    function reset() {

        queue = [];
        index = queue.length - 1;
        $("#counter").text((index + 1) + " / " + queue.length);

        // create a network
        var container = document.getElementById('mynetwork');

        var x = - container.clientWidth / 2 + 10;
        var y = - container.clientHeight / 2 + 10;
        var step = 70;
//        nodes.push({id: 1, x: x, y: y, label: 'Rule', group: 'rule', value: 1, fixed: true, physics:false});
//        nodes.push({id: 2, x: x, y: y + step, label: 'Fact Type', group: 'facttype', value: 1, fixed: true,  physics:false});
//        nodes.push({id: 3, x: x, y: y + 2 * step, label: 'Fact Instance', group: 'factinstance', value: 1, fixed: true,  physics:false});
//        nodes.push({id: 1003, x: x, y: y + 3 * step, label: 'Computer', group: 'desktop', value: 1, fixed: true,  physics:false});
//        nodes.push({id: 1004, x: x, y: y + 4 * step, label: 'Smartphone', group: 'mobile', value: 1, fixed: true,  physics:false});

        // create an array with nodes
        nodes = new vis.DataSet([
        {id:0, label : "User", color : 'pink', shape : 'icon', group : 'users', title : "42"},
        {id: 1, x: x, y: y, label: 'Rule', group: 'rule', color : 'orange', shape : 'box', value: 1, fixed: true, physics:false},
        {id: 2, x: x, y: y + step, label: 'Fact Type', group: 'facttype', color : 'red', shape : 'box', value: 1, fixed: true,  physics:false},
        {id: 3, x: x, y: y + 2 * step, label: 'Fact Instance', group: 'factinstance', color : 'blue', shape : 'box', value: 1, fixed: true,  physics:false}
        ]);

        // create an array with edges
        edges = new vis.DataSet([]);

        var data = {
            nodes: nodes,
            edges: edges
        };

        var options = {
          interaction:{hover:true},
          height: '90%',
          groups: {
            users: {
              shape: 'icon',
              icon: {
                face: 'Ionicons',
                code: '\uf47e',
                size: 50,
                color: '#aa00ff'
              }
            }
          }
        };

        network = new vis.Network(container, data, options);
        network.on("click", function (params) {
            params.event = "[original event]";
            document.getElementById('eventSpan').innerHTML = '<h4>Node: ' + params.nodes + '</h4>' + nodes.get(params.nodes)[0].title;
        });
    }

    $(function() {

        $("[name='checkbox-live']").bootstrapSwitch();
        var index;
        $("[name='checkbox-live']").on('switchChange.bootstrapSwitch', function(event, state) {
            if (state) {
                    $('.stepbystep').addClass("disabled");
                    nextend();
            } else {
                    $('.stepbystep').removeClass("disabled");
                    index = queue.length - 1;
            }
        });

        $("#previousbegin").click(previousbegin);

        $("#previous").click(previous);

        $("#next").click(next);

        $("#nextend").click(nextend);

        reset();
    });


/*
network.on("doubleClick", function (params) {
    params.event = "[original event]";
    document.getElementById('eventSpan').innerHTML = '<h2>doubleClick event:</h2>' + JSON.stringify(params, null, 4);
});
network.on("oncontext", function (params) {
    params.event = "[original event]";
    document.getElementById('eventSpan').innerHTML = '<h2>oncontext (right click) event:</h2>' + JSON.stringify(params, null, 4);
});
network.on("dragStart", function (params) {
    params.event = "[original event]";
    document.getElementById('eventSpan').innerHTML = '<h2>dragStart event:</h2>' + JSON.stringify(params, null, 4);
});
network.on("dragging", function (params) {
    params.event = "[original event]";
    document.getElementById('eventSpan').innerHTML = '<h2>dragging event:</h2>' + JSON.stringify(params, null, 4);
});
network.on("dragEnd", function (params) {
    params.event = "[original event]";
    document.getElementById('eventSpan').innerHTML = '<h2>dragEnd event:</h2>' + JSON.stringify(params, null, 4);
});
network.on("zoom", function (params) {
    document.getElementById('eventSpan').innerHTML = '<h2>zoom event:</h2>' + JSON.stringify(params, null, 4);
});
network.on("showPopup", function (params) {
    document.getElementById('eventSpan').innerHTML = '<h2>showPopup event: </h2>' + JSON.stringify(params, null, 4);
});
network.on("hidePopup", function () {
    console.log('hidePopup Event');
});
network.on("select", function (params) {
    console.log('select Event:', params);
});
network.on("selectNode", function (params) {
    console.log('selectNode Event:', params);
});
network.on("selectEdge", function (params) {
    console.log('selectEdge Event:', params);
});
network.on("deselectNode", function (params) {
    console.log('deselectNode Event:', params);
});
network.on("deselectEdge", function (params) {
    console.log('deselectEdge Event:', params);
});
network.on("hoverNode", function (params) {
    console.log('hoverNode Event:', params);
});
network.on("hoverEdge", function (params) {
    console.log('hoverEdge Event:', params);
});
network.on("blurNode", function (params) {
    console.log('blurNode Event:', params);
});
network.on("blurEdge", function (params) {
    console.log('blurEdge Event:', params);
});*/


