module.exports = function (RED) {
    function GateKeeperNode(config) {
        RED.nodes.createNode(this, config);
        const node = this;

        node.name = config.name;
        node.property = config.property || "payload";
        node.propertyType = config.propertyType || "msg";

        node.on('input', function (msg, send, done) {
            try {
                let value;

                switch (node.propertyType) {
                    case "msg":
                        value = RED.util.getMessageProperty(msg, node.property);
                        break;
                    case "flow":
                        value = node.context().flow.get(node.property);
                        break;
                    case "global":
                        value = node.context().global.get(node.property);
                        break;
                    case "env":
                        value = process.env[node.property];
                        break;
                    case "jsonata": {
                        const expr = RED.util.prepareJSONataExpression(node.property, node);
                        value = RED.util.evaluateJSONataExpression(expr, msg);
                        break;
                    }
                    default:
                        value = undefined;
                }

                if (value === true || value === "true") {
                    node.status({ fill: "red", shape: "dot", text: "closed" });
                    // stop: do not forward
                } else {
                    node.status({ fill: "green", shape: "dot", text: "open" });
                    send(msg);
                }

                if (done) done();
            } catch (err) {
                node.status({ fill: "red", shape: "ring", text: "error" });
                node.error(err, msg);
                if (done) done(err);
            }
        });
    }
    RED.nodes.registerType("gatekeeper", GateKeeperNode);
};
