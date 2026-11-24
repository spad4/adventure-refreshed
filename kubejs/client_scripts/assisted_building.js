let $BlockHitResult = Java.loadClass("net.minecraft.world.phys.BlockHitResult");

const playSound =
    "playSound(net.minecraft.world.entity.Entity,net.minecraft.core.BlockPos,net.minecraft.sounds.SoundEvent,net.minecraft.sounds.SoundSource,float,float)";
const $Stage = Java.loadClass("net.neoforged.neoforge.client.event.RenderLevelStageEvent$Stage");
const $PreviewRenderer = Java.loadClass("net.tricube.blocks_previewer.preview.PreviewRenderer");

KeyBindEvents.pressed("toggle_assisted_building", (event) => {
    if (Client.currentScreen) return;
    if (Client.isKeyDown("KEY_F3") || Client.isAltDown() || Client.isCtrlDown()) return;

    const player = Client.player;
    let state = !player.persistentData.getBoolean("kubejs:assisted_building");
    player.persistentData.putBoolean("kubejs:assisted_building", state);
    player.sendData("assisted_building_toggle");

    player.level[playSound](player, player.pos, "block.note_block.iron_xylophone", "master", 0.25, state ? 1 : 0.75);
    if (!state) {
        player.setStatusMessage("");
    }
});

BlockEvents.rightClicked((event) => {
    const { entity, item, hand } = event;
    if (!entity.persistentData.getBoolean("kubejs:assisted_building")) return;
    if (!item.block) return;
    if (entity.crouching) return;
    if (hand == "off_hand" && entity.mainHandItem) {
        event.cancel();
        return;
    }

    event.cancel();
});

NativeEvents.onEvent("net.neoforged.neoforge.client.event.RenderLevelStageEvent", (event) => {
    const player = Client.player;

    if (!player.persistentData.getBoolean("kubejs:assisted_building")) return;

    const text = player.crouching
        ? Text.gray("Assisted building is active.")
        : Text.white("Assisted building is active.");
    player.setStatusMessage(text);

    if (player.crouching) return;

    const item = player.mainHandItem ?? player.offHandItem;
    const itemBlock = item.block;
    if (!itemBlock) return;

    const [block, previous, face, hit] = global.assistedBuildingNextBlock(player, item);
    if (!block) return;

    if (event.getStage() == $Stage.AFTER_TRANSLUCENT_BLOCKS) {
        const poseStack = event.getPoseStack();
        const camera = Client.gameRenderer.getMainCamera().getPosition();
        const pos = block.pos;

        poseStack.pushPose();
        const [x, y, z] = [pos.x - camera.x(), pos.y - camera.y(), pos.z - camera.z];
        poseStack.translate(x, y, z);

        const finalState = global.assistedBuildingCollectProperties(
            itemBlock,
            previous,
            player,
            new $BlockHitResult(hit, face, block.pos, false),
        );

        $PreviewRenderer.renderTransparentBlock(
            poseStack, // postStack
            finalState, // blockState
            block.pos, // pos
            Client, // Minecraft instance
            false, // isObstructed
        );

        poseStack.popPose();
    }
});
