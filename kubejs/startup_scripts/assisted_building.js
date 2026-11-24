let $InteractionHand = Java.loadClass("net.minecraft.world.InteractionHand");
let $BlockPlaceContext = Java.loadClass("net.minecraft.world.item.context.BlockPlaceContext");

const $SlabType = Java.loadClass("net.minecraft.world.level.block.state.properties.SlabType");

const COPYABLE_PROPERTIES = [
    BlockProperties.HORIZONTAL_AXIS,
    BlockProperties.HORIZONTAL_FACING,
    BlockProperties.FACING,
    BlockProperties.FACING_HOPPER,
    BlockProperties.AXIS,
    BlockProperties.HALF,
    BlockProperties.SLAB_TYPE,
    BlockProperties.STAIRS_SHAPE,
    BlockProperties.ATTACH_FACE,
    // BlockProperties.UP,
    // BlockProperties.DOWN,
    // BlockProperties.NORTH,
    // BlockProperties.EAST,
    // BlockProperties.SOUTH,
    // BlockProperties.WEST,
];

const MISSING_STAIRS = ["nomansland:wooden_platform_stairs"];

global.assistedBuildingNextBlock = (player, itemBlock) => {
    const rayTrace = player.rayTrace();
    const block = rayTrace.block;
    if (!block) return [null, null, null, null];

    const facing = rayTrace.facing;
    const myDirection = player.horizontalFacing;

    // default vertical scaffold for side faces
    let offset = Direction.UP;
    let stairOffset;

    // stairs have special behavior
    if (itemBlock.hasTag("minecraft:stairs") && block.hasTag("minecraft:stairs")) {
        offset = myDirection;
        let stairDirection = block.properties.facing;

        if (stairDirection == myDirection) {
            stairOffset = Direction.UP;
        } else if (stairDirection == myDirection.opposite) {
            stairOffset = Direction.DOWN;
        }

        if (stairOffset && block.properties.half == "top") {
            stairOffset = stairOffset.opposite;
        }
    }
    // horizontal scaffold if top or bottom face
    else if (facing == "UP" || facing == "DOWN") {
        offset = myDirection;
    }

    let target = block.offset(offset);
    let previous = block;
    if (stairOffset) target = target.offset(stairOffset);
    while (!target.hasTag("minecraft:replaceable") || target.id == itemBlock.id) {
        if (player.distanceToBlock(target.pos) > player.reachDistance + 4) {
            return [block.offset(facing), null, facing, rayTrace.hit];
        }
        previous = target;
        target = target.offset(offset);
        if (stairOffset) target = target.offset(stairOffset);
    }

    return [target, previous, facing, rayTrace.hit];
};

global.assistedBuildingCollectProperties = (item, collectFrom, player, blockHitResult) => {
    // let toState = to.block.defaultBlockState();
    let toState = item.block.getStateForPlacement(new $BlockPlaceContext(player, $InteractionHand.MAIN_HAND, item, blockHitResult));
    let fromState = collectFrom?.getBlockState();
    let myDirection = player.horizontalFacing;
    let face = blockHitResult.direction;
    if (fromState) {
        COPYABLE_PROPERTIES.forEach((property) => {
            if (fromState?.hasProperty(property) && toState?.hasProperty(property)) {
                let value = fromState.getValue(property);
                toState = toState.setValue(property, fromState.getValue(property));
            }
        });
    }

    // placing a slab should put it on the top half if the top face was clicked
    // unless a bottom slab was extended from
    if (
        !fromState?.hasProperty(BlockProperties.SLAB_TYPE) &&
        toState?.hasProperty(BlockProperties.SLAB_TYPE) &&
        face == Direction.UP
    ) {
        toState = toState.setValue(BlockProperties.SLAB_TYPE, $SlabType.TOP);
    }
    return toState;
};
