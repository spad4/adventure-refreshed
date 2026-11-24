// rhino wtf man
const playSound = "playSound(net.minecraft.world.entity.Entity,net.minecraft.core.BlockPos,net.minecraft.sounds.SoundEvent,net.minecraft.sounds.SoundSource,float,float)";

const THIRTY_SECONDS = 600

function playerMainhandEmpty(player) {
    return player.inventory.getStackInSlot(player.selectedSlot).is("minecraft:air")
}

function addSlicingTo(block_id, slice_id, max_slices) {

    BlockEvents.rightClicked(block_id, event => {
        const { block, item, player } = event;
        if (!item.hasTag("c:tools/knife")) return;

        const level = block.level;
        const x = block.centerX;
        const y = block.centerY;
        const z = block.centerZ;

        const facing = block.properties["facing"];
        const bites = parseInt(block.properties["bites"]) + 1;

        if (bites == max_slices) {
            block.set("minecraft:air");
        }
        else {
            block.set(block_id, { facing: facing, bites: bites.toString() });
        }

        block.popItemFromFace(slice_id, Direction.UP)

        level.spawnParticles(`minecraft:block{block_state:"${block_id}"}`, true, x, y, z, 0, 0, 0, 3, 0);
        level[playSound](null, block.pos, "minecraft:block.wool.place", "blocks", 1, 0.8);
        player.swing();

        event.cancel()
    })
}

addSlicingTo("bountifulfares:passion_fruit_tart", "delightful_fares:passion_fruit_tart_slice", 4)
addSlicingTo("bountifulfares:elderberry_tart", "delightful_fares:elderberry_tart_slice", 4)
addSlicingTo("bountifulfares:glow_berry_tart", "delightful_fares:glow_berry_tart_slice", 4)
addSlicingTo("bountifulfares:sweet_berry_tart", "delightful_fares:sweet_berry_tart_slice", 4)
addSlicingTo("bountifulfares:lapisberry_tart", "delightful_fares:lapis_berry_tart_slice", 4)
addSlicingTo("bountifulfares:cocoa_cake", "delightful_fares:cocoa_cake_slice", 7)
addSlicingTo("bountifulfares:coconut_cake", "delightful_fares:coconut_cake_slice", 7)
addSlicingTo("bountifulfares:sponge_cake", "delightful_fares:sponge_cake_slice", 7)
addSlicingTo("bountifulfares:melon_pie", "delightful_fares:melon_pie_slice", 4)
addSlicingTo("bountifulfares:orange_pie", "delightful_fares:orange_pie_slice", 4)
addSlicingTo("bountifulfares:lemon_pie", "delightful_fares:lemon_pie_slice", 4)
addSlicingTo("bountifulfares:plum_pie", "delightful_fares:plum_pie_slice", 4)
addSlicingTo("bountifulfares:hoary_pie", "delightful_fares:hoary_pie_slice", 4)
