# node-red-contrib-gatekeeper
A tiny Node-RED node that **opens or closes the gate** for passing messages forward.   You choose a property (from `msg`, `flow`, `global`, `env`, or a `jsonata` expression).   If that value is `true` (or the string `"true"`), the gate **closes** (message dropped).   Otherwise, the gate **opens** and the message continues.
