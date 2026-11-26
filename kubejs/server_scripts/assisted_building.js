let $BlockPlaceContext = Java.loadClass("net.minecraft.world.item.context.BlockPlaceContext");
let $BlockHitResult = Java.loadClass("net.minecraft.world.phys.BlockHitResult");
let $InteractionHand = Java.loadClass("net.minecraft.world.InteractionHand");

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
    if (!previous) {
        event.cancel();
        return;
    };

    const finalState = global.assistedBuildingCollectProperties(
        itemBlock,
        previous,
        entity,
        new $BlockHitResult(hit, face, target.pos, false),
    );


    event.level[playSound](null, target.pos, "block.note_block.basedrum", "blocks", 1, 0.6 + Math.random() * 0.25);
    target.setBlockState(finalState, 3);
    if (!entity.creative) {
        item.count--;
    }

    entity.swing();
    event.cancel();
});

const SHAPE_GROUPS = [
    "stairs",
    "slab",
    "wall",

    "log",
    "wood",

    "door",
    "trapdoor",
    "shutter",

    "fence_gate",
    "fence",
    "pickets",
    "trellis",

    "hanging_sign",
    "way_sign",
    "sign",

    "pressure_plate",
    "button",

    "tall_stool",
    "stool",

    "chair",
    "bench",

    "trimmed",
    "chiseled",
    "corner_trim",
    "pillar_trim",

    "bars",
    "gate",
    "railing",

    "carpet",

    "banner",
    "flag",

    "drawer",
    "cabinet",

    "plate",
    "bowl",
    "cup",
    "crockery_combo",
];

BlockEvents.broken((event) => {
    const { entity, block } = event;
    if (!entity.persistentData.getBoolean("kubejs:assisted_building")) return;
    if (entity.crouching) return;
    const item = entity.offHandItem;
    let itemBlock = item.block;
    if (!itemBlock) return;

    let result = entity.rayTrace();
    if (!entity.creative) {
        block.getDrops(entity, entity.mainHandItem).forEach((drop) => {
            block.popItemFromFace(drop, result.facing);
        });
    }
    
    let blockHitResult = new $BlockHitResult(result.hit, result.facing, block.pos, false);
    let copiedState = itemBlock.getStateForPlacement(
        new $BlockPlaceContext(entity, $InteractionHand.MAIN_HAND, item, blockHitResult),
    );
    
    const tryReplaceShape = () => {
        // check if itemblock has a shapemap
        let itemShapes = $ShapeMap.getShapes(item.item);
        if (itemShapes.length < 1) return;
        // find a word from SHAPE_GROUPS which matches a block in the shapemap
        // if so, store the word that matched
        let matchedWord = null;
        SHAPE_GROUPS.some((shape) => {
            return itemShapes.some((itemShape) => {
                if (itemShape.id.includes(shape)) {
                    matchedWord = shape;
                    return true;
                }
                return false;
            });
            return false;
        });
        
        if (!matchedWord) {
            // let blockHitResult = new $BlockHitResult(result.hit, result.facing, block.pos, false);
            // let copiedState = itemBlock.getStateForPlacement(
            //     new $BlockPlaceContext(entity, $InteractionHand.MAIN_HAND, item, blockHitResult),
            // );
            return;
        }
        
        // get block's shapemap
        let blockShapes = $ShapeMap.getShapes(block.item);
        if (blockShapes.length < 1) return;
        // check if any block matches any words from the list -> they have the same shapemap
        let mapsMatch = blockShapes.some((shape) => {
            if (shape.id.includes(matchedWord)) {
                return true;
            }
            return false;
        });
        if (!mapsMatch) return;
        
        // now look for the index of the block being replaced
        let shapeIndex = blockShapes.indexOf(block.item.item);
        if (shapeIndex > itemShapes.length) return;
        
        // check if itemBlock's shapemap has that index
        // if so, replace with that shape and apply the replaced block's properties
        itemBlock = itemShapes[shapeIndex].block;
        let state = block.blockState;
        copiedState = itemBlock.defaultBlockState();
        state.properties.forEach((property) => {
            if (copiedState.hasProperty(property)) {
                copiedState = copiedState.setValue(property, state.getValue(property));
            }
        });
    };

    tryReplaceShape();
    
    block.setBlockState(copiedState);
    if (!entity.creative) item.count--;
    event.cancel();
});
