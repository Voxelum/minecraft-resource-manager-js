# A Minecraft Resource Manager

A very simple Minecraft resource manager.

To build

```
npm run build
```

This module can be used in both browser and nodejs environment.

## Usage

```(javascript)
const { ResourceManager, ResourceSourceZip, ResourceLocation } = require('minecraft-resource-manager');

let zip; // jszip object
const manager = new ResourceManager();

manager.addResourceSource(new ResourceSourceZip(zip))
.then(() => manager.load(ResourceLocation.ofModelPath('block/stone')))
.then(jsonText => JSON.parse(jsonText))
.then((modelObject) => {
    // do other things...
});
```
