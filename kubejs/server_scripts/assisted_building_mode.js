// const SHAPE_GROUPS = [
//     [
//         "planks",
//         "stairs",
//         "slab",
//         "wall"
//     ],
//     [
//         "door",
//         "trapdoor",
//         "shutter",
//     ],
//     [
//         "fence_gate",
//         "fence",
//         "pickets",
//     ],
//     [
//         "hanging_sign",
//         "sign",
//     ],
//     [
//         "pressure_plate",
//         "button",
//     ],
//     [
//         "tall_stool",
//         "stool",
//     ],
//     [
//         "chair",
//         "bench",
//     ],
//     [
//         "trimmed",
//         "chiseled",
//         "corner_trim",
//         "pillar_trim",
//     ],
//     [
//         "",
//     ],
//     [
//         "",
//     ],
//     [
//         "",
//     ],
//     [
//         "",
//     ],
//     [
//         "",
//     ],
//     [
//         "",
//     ],
//     [
//         "",
//     ],
//     [
//         "",
//     ],
//     [
//         "",
//     ],
//     [
//         "",
//     ],
//     [
//         "",
//     ],
//     [
//         "",
//     ],
//     [
//         "",
//     ],
//     [
//         "",
//     ],
//     [
//         "",
//     ],
//     [
//         "",
//     ],
// ]

const BAD_DIRECTIONAL_BLOCK_TAGS = [
    "bountifulfares:pickets"
]

const IGNORE_DIRECTIONAL_BLOCK_TAGS = [
    "c:fences",
    "c:glass_panes",
    "minecraft:walls",
]

const COPYABLE_PROPERTIES = [
    "facing",
    "axis",
    "half"
]

NetworkEvents.dataReceived("assisted_building_toggle", event => {
    const { entity, data } = event;
    entity.persistentData.putBoolean("kubejs:assisted_building", !entity.persistentData.getBoolean("kubejs:assisted_building"))
    entity.setStatusMessage("");
});

PlayerEvents.loggedOut(event => {
    event.entity.persistentData.putBoolean("kubejs:assisted_building", false);
});

function vectorSum(a, b) {
    return {
        x: a.x + b.x,
        y: a.y + b.y,
        z: a.z + b.z
    }
}

PlayerEvents.tick(event => {
    const player = event.player
    if (!player.persistentData.getBoolean("kubejs:assisted_building")) return;

    const text = player.crouching ? Text.gray("Assisted building is active.") : Text.white("Assisted building is active.")
    player.setStatusMessage(text);

    // if (!player.mainHandItem.block) return;
    // const result = player.rayTrace();
    // const block = result.block;
    // if (!block) return;



    // const predictedPos = {
    //     x: pos.x + face.x,
    //     y: pos.y + face.y,
    //     z: pos.z + face.z,
    // }

    // player.sendData("assisted_building_preview", predictedPos)
});

function vectorAsString(vector) {
    return `${vector.x} ${vector.y} ${vector.z}`
}


BlockEvents.rightClicked(event => {
    const { entity, facing, block, item } = event;
    if (!entity.persistentData.getBoolean("kubejs:assisted_building")) return;
    if (entity.crouching) return;
    if (!item.block) return;
    if (entity.offHandItem === item && entity.mainHandItem) {
        event.cancel();
        return;
    }

    const myDirection = entity.horizontalFacing

    // default vertical scaffold for side faces
    let offset = Direction.UP;
    let stairOffset;
    // stairs have special behavior
    if (item.block.hasTag("minecraft:stairs") && block.hasTag("minecraft:stairs")) {

        offset = myDirection;
        let stairDirection = block.properties.facing;

        if (stairDirection == myDirection) {
            stairOffset = Direction.UP;
        }
        else if (stairDirection == myDirection.opposite) {
            stairOffset = Direction.DOWN;
        }

        if (stairOffset && block.properties.half == "top") {
            stairOffset = stairOffset.opposite
        }
    }
    // horizontal scaffold if top or bottom face
    else if (facing == "UP" || facing == "DOWN") {
        offset = myDirection;
    }

    let target = block.offset(offset)
    if (stairOffset) target = target.offset(stairOffset);
    while (!target.hasTag("minecraft:replaceable") || target.id == item.block.id) {
        if (entity.distanceToBlock(target.pos) > entity.reachDistance + 4) {
            return;
        };
        target = target.offset(offset)
        if (stairOffset) target = target.offset(stairOffset);
    }

    const properties = {}
    if (block.properties.facing) {
        properties.facing = block.properties.facing
    }
    if (block.properties.axis) {
        properties.axis = block.properties.axis
    }
    if (block.properties.half) {
        properties.half = block.properties.half
    }

    if (!IGNORE_DIRECTIONAL_BLOCK_TAGS.some(tag => item.block.hasTag(tag))) {
        let directionalFace = BAD_DIRECTIONAL_BLOCK_TAGS.some(tag => item.block.hasTag(tag)) ? myDirection.opposite : myDirection
        properties[directionalFace] = true
    }

    event.level[playSound](null, target.pos, "block.note_block.basedrum", "blocks", 1, 0.6 + Math.random() * 0.25);
    target.set(item.block, properties);
    if (!entity.creative) {
        item.count--;
    }

    entity.swing()
    event.cancel()
});

// function extractNamespaceAndMaterial(id) {
//     let split = id.split(":");
//     let namespace = split[0];
//     if (namespace == "everycomp") { // id is like "everycomp:af/bountifulfares/hoary_bench"
//         split = id.split("/")
//         namespace = split[1] // "bountifulfares" from "everycomp:af/bountifulfares/hoary_bench"
//         let material = split[2].split("_")[0] // "hoary" from "everycomp:af/bountifulfares/hoary_bench"
//         return [namespace, material]
//     }
//     else {
//         return [namespace, split[1].split("_")[0]]
//     }
// }

BlockEvents.broken(event => {
    const { entity, block } = event;
    if (!entity.persistentData.getBoolean("kubejs:assisted_building")) return;
    if (entity.crouching) return;
    const item = entity.offHandItem;
    if (!item.block) return;

    if (!entity.creative) {
        let result = entity.rayTrace();
        block.getDrops(entity, entity.mainHandItem).forEach(drop => {
            block.popItemFromFace(drop, result.facing);
        })
    }

    // const [ namespace, material ] = extractNamespaceAndMaterial(block.id)
    // console.log(namespace + " " + material)
    block.set(item.block);
    if (!entity.creative) item.count--;
    event.cancel()
})