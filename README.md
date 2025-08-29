# node-red-contrib-gatekeeper

A tiny Node-RED node that **opens or closes the gate** for passing messages forward.  
You choose a property (from `msg`, `flow`, `global`, `env`, or a `jsonata` expression).  
If that value is `true` (or the string `"true"`), the gate **closes** (message dropped).  
Otherwise, the gate **opens** and the message continues.

![status](https://img.shields.io/badge/state-open%20or%20closed-blue) ![license](https://img.shields.io/badge/License-MIT-green)

---

## Features

- ✅ Simple allow/deny logic in one node  
- ✅ Supports `msg`, `flow`, `global`, `env`, or `jsonata`  
- ✅ Clear status: **open** (green) / **closed** (red)  
- ✅ No external deps

---

## Install

From your Node-RED user directory (`~/.node-red`):

```bash
npm install node-red-contrib-gatekeeper
````

Or via **Manage palette** → **Install** → search for `node-red-contrib-gatekeeper`.

---

## Usage

1. Drag **Gatekeeper** into your flow.
2. Set **Property** to check:

   * `msg`/`flow`/`global`/`env`: provide the property/key (e.g., `payload`, `allow`, `FEATURE_FLAG`)
   * `jsonata`: provide a JSONata expression (e.g., `payload.allow = true`)
3. If the evaluated value is **`true`** or the string **`"true"`** → **gate closed** (message **not** forwarded).
   Anything else → **gate open** (message forwarded).

### Status

* **green dot** — `open` (message passes)
* **red dot** — `closed` (message blocked)
* **red ring** — `error`

---

## Properties

| Field        | Type                        | Description                                                              |
| ------------ | --------------------------- | ------------------------------------------------------------------------ |
| **Name**     | string                      | Optional label shown under the node.                                     |
| **Property** | msg/flow/global/env/jsonata | The value to check. If it resolves to `true` (or `"true"`), gate closes. |

**Examples:**

* `msg` + `payload` → checks `msg.payload`
* `flow` + `allow` → checks `flow.get("allow")`
* `global` + `feature.enabled` → checks `global.get("feature.enabled")` (if you store an object)
* `env` + `FEATURE_FLAG` → checks `process.env.FEATURE_FLAG`
* `jsonata` + `payload.level > 10` → evaluates expression on the incoming `msg`

---

## Example flows

### 1) Simple boolean in `msg.payload`

```json
[
  { "id":"inject1","type":"inject","name":"allow=false","props":[{"p":"payload"}],"payload":"false","payloadType":"bool" },
  { "id":"gate1","type":"gatekeeper","name":"Gate","property":"payload","propertyType":"msg" },
  { "id":"debug1","type":"debug","name":"Passed","complete":"true" }
]
```

* `payload=false` → gate **open** → message passes
* Set `payload=true` → gate **closed** → message dropped

### 2) JSONata condition

```json
[
  { "id":"inject2","type":"inject","name":"payload={ level: 12 }","props":[{"p":"payload"}],"payload":"{\"level\":12}","payloadType":"json" },
  { "id":"gate2","type":"gatekeeper","name":"Level Gate","property":"payload.level > 10","propertyType":"jsonata" },
  { "id":"debug2","type":"debug","name":"Passed","complete":"true" }
]
```

* Expression resolves to `true` → gate **closed** (blocked)
* Change to `payload.level > 99` → resolves `false` → gate **open**

---

## Notes

* The node treats **boolean `true`** and **string `"true"`** as **closed**; everything else is **open**.
* With `jsonata`, the expression is evaluated against the current `msg`. Any exception is shown as **error** status.

---

## License

MIT © Aioub Sai
