let $BlockPlaceContext = Java.loadClass("net.minecraft.world.item.context.BlockPlaceContext");
let $BlockHitResult = Java.loadClass("net.minecraft.world.phys.BlockHitResult");

NetworkEvents.dataReceived("assisted_building_toggle", (event) => {
    const { entity, data } = event;
    entity.persistentData.putBoolean(
        "kubejs:assisted_building",
        !entity.persistentData.getBoolean("kubejs:assisted_building"),
    );
});

const DIRECTION_TO_PROPERTY = new Map();
DIRECTION_TO_PROPERTY.set(Direction.UP, BlockProperties.UP);
DIRECTION_TO_PROPERTY.set(Direction.DOWN, BlockProperties.DOWN);
DIRECTION_TO_PROPERTY.set(Direction.NORTH, BlockProperties.NORTH);
DIRECTION_TO_PROPERTY.set(Direction.EAST, BlockProperties.EAST);
DIRECTION_TO_PROPERTY.set(Direction.SOUTH, BlockProperties.SOUTH);
DIRECTION_TO_PROPERTY.set(Direction.WEST, BlockProperties.WEST);

PlayerEvents.loggedIn((event) => {
    event.entity.persistentData.putBoolean("kubejs:assisted_building", false);
});

BlockEvents.rightClicked((event) => {
    const { entity, facing, block, item, hand } = event;

    if (!entity.persistentData.getBoolean("kubejs:assisted_building")) return;
    if (entity.crouching) return;

    const itemBlock = item.block;
    if (!itemBlock) return;

    if (hand == "off_hand" && entity.mainHandItem) {
        event.cancel();
        return;
    }

    const [target, previous, face, hit] = global.assistedBuildingNextBlock(entity, itemBlock);
    if (!previous) return;

    const finalState = global.assistedBuildingCollectProperties(itemBlock, previous, entity, new $BlockHitResult(hit, face, target.pos, false));

    // const rayTrace = entity.rayTrace()
    // const finalState = itemBlock.getStateForPlacement(new $BlockPlaceContext(entity, hand, item, rayTrace))

    event.level[playSound](null, target.pos, "block.note_block.basedrum", "blocks", 1, 0.6 + Math.random() * 0.25);
    target.set(itemBlock);
    target.setBlockState(finalState, 3);
    if (!entity.creative) {
        item.count--;
    }

    entity.swing();
    event.cancel();
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

// // const SHAPE_GROUPS = [
// //     [
// //         "planks",
// //         "stairs",
// //         "slab",
// //         "wall"
// //     ],
// //     [
// //         "door",
// //         "trapdoor",
// //         "shutter",
// //     ],
// //     [
// //         "fence_gate",
// //         "fence",
// //         "pickets",
// //     ],
// //     [
// //         "hanging_sign",
// //         "sign",
// //     ],
// //     [
// //         "pressure_plate",
// //         "button",
// //     ],
// //     [
// //         "tall_stool",
// //         "stool",
// //     ],
// //     [
// //         "chair",
// //         "bench",
// //     ],
// //     [
// //         "trimmed",
// //         "chiseled",
// //         "corner_trim",
// //         "pillar_trim",
// //     ],
// //     [
// //         "",
// //     ],
// //     [
// //         "",
// //     ],
// //     [
// //         "",
// //     ],
// //     [
// //         "",
// //     ],
// //     [
// //         "",
// //     ],
// //     [
// //         "",
// //     ],
// //     [
// //         "",
// //     ],
// //     [
// //         "",
// //     ],
// //     [
// //         "",
// //     ],
// //     [
// //         "",
// //     ],
// //     [
// //         "",
// //     ],
// //     [
// //         "",
// //     ],
// //     [
// //         "",
// //     ],
// //     [
// //         "",
// //     ],
// //     [
// //         "",
// //     ],
// //     [
// //         "",
// //     ],
// // ]

BlockEvents.broken((event) => {
    const { entity, block } = event;
    if (!entity.persistentData.getBoolean("kubejs:assisted_building")) return;
    if (entity.crouching) return;
    const item = entity.offHandItem;
    if (!item.block) return;

    if (!entity.creative) {
        let result = entity.rayTrace();
        block.getDrops(entity, entity.mainHandItem).forEach((drop) => {
            block.popItemFromFace(drop, result.facing);
        });
    }

    // const [ namespace, material ] = extractNamespaceAndMaterial(block.id)
    // console.log(namespace + " " + material)
    block.set(item.block);
    if (!entity.creative) item.count--;
    event.cancel();
});
