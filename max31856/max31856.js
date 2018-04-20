module.exports = function (RED) {
    "use strict";
    const max31856 = require("max31856");

    function max31856Node(n) {
        RED.nodes.createNode(this, n);

        const node = this;

        this.bus = n.bus || 0;
        this.device = n.device || 0;
        this.tcType = n.tcType || 0;

        const MAX31856 = new max31856.MAX31856(0, 0, max31856.T_TYPE);

        node.on("input", function (msg) {

            const faults = MAX31856.faults();
            if (faults.length) {
                readTemp();
            } else {
                node.status({fill: "red", shape: "dot", text: faults.toString()});
            }
        });

        node.on("close", function () {
            //   NOOP
        });

        function readTemp() {
            node.status({fill: "green", shape: "dot", text: "Read"});
            node.send({
                payload: MAX31856.tempC().precision(2)
            });
        }
    }
    RED.nodes.registerType("max31856", max31856Node());

};
