    function addFactInstance(data) {
        //var newId = (Math.random() * 1e7).toString(32);
        var newId = data.id;
        var dataJson = JSON.stringify(data.object, null, 2);
        nodes.add({id:newId, color : 'blue', title:dataJson, group : 2});
        edges.add({from: data.type, to: newId, dashes:true});
        if(data.from.length > 0) {
            edges.add({from: data.from[0], to: newId, arrows:'to'});
        } else {
            edges.add({from: 0, to: newId, arrows:'to'});
        }
    }

    function addFactType(data) {
        var newId = (Math.random() * 1e7).toString(32);
        //var newId = data.object.name;
        var dataJson = JSON.stringify(data.object.attributes, null, 2);
        nodes.add({id:data.object.name, label:data.object.name, color : 'red', shape : 'box', title:dataJson, group : 1});
    }

    function addRule(data) {
        var newId = (Math.random() * 1e7).toString(32);
        //var newId = data.object.name;
        var dataJson = JSON.stringify(data.object, null, 2);
        nodes.add({id:data.object.name, label:data.object.name, color : 'orange', shape : 'box', title:dataJson, group : 3});
    }

    function fire(data) {
        var node = nodes.get(data.object);
        node.color = {background:'orange', border:'red'};
        nodes.update(node);
        for (i = 0; i < data.from.length; i++) {
            edges.add({from: data.from[i], to: data.object, arrows:'to', color: 'purple'});
        }
    }

    var actionHandle = {
        "insert-fact": addFactInstance,
        "insert-fact-type": addFactType,
        "insert-rule": addRule,
        "update-fact": console.log,
        "delete-fact": console.log,
        "fire": fire
    }

    var nodes;
    var edges;
    var network;

    function resetGraph() {
        // create an array with nodes
        nodes = new vis.DataSet([
        {id:0, label : "User", color : 'pink', shape : 'icon', group : 'users', title : "42"}
        ]);

        // create an array with edges
        edges = new vis.DataSet([]);

        // create a network
        var container = document.getElementById('mynetwork');
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

    resetGraph();

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


