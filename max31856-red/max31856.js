module.exports = function (RED) {
    "use strict";
    const max31856 = require("max31856");
    
    function max31856Node(n) {
        RED.nodes.createNode(this, n);

        var node = this;

        this.bus = Number(n.bus) || 0;
        this.device = Number(n.device) || 0;
        this.tcType = Number(n.tcType) || 0;

	
        const MAX31856 = new max31856.MAX31856(this.bus, this.device, this.tcType);

        node.on("input", function (msg) {

            var faults = MAX31856.faults();
            if (! faults.length) {
                var reading = MAX31856.tempC().toPrecision(2);
		node.status({fill: "green", shape: "dot", text: reading});
		msg.payload = reading;
		node.send(msg);
            } else {
                node.status({fill: "red", shape: "dot", text: faults.toString()});
            }
        });
        
        node.on("close", function () {
            //   NOOP
        });

        function readTemp(msg) {
	    var reading = MAX31856.tempC().toPrecision(2);
	    node.status({fill: "green", shape: "dot", text: reading});
	    msg.payload = reading;
            node.send(msg);
        }
    }
    
    RED.nodes.registerType("max31856", max31856Node);

};
