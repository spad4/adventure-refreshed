const playSound = "playSound(net.minecraft.world.entity.Entity,net.minecraft.core.BlockPos,net.minecraft.sounds.SoundEvent,net.minecraft.sounds.SoundSource,float,float)";

KeyBindEvents.pressed("assisted_building_mode", event => {
    if (Client.currentScreen) return;
    if (Client.isKeyDown("KEY_F3") || Client.isAltDown() || Client.isCtrlDown()) return;
    const player = Client.player;
    let state = !player.persistentData.getBoolean("kubejs:assisted_building")
    player.persistentData.putBoolean("kubejs:assisted_building", state)
    player.sendData("assisted_building_toggle");
    player.level[playSound](player, player.pos, "block.note_block.iron_xylophone", "master", 0.25, state ? 1 : 0.75);
})

BlockEvents.rightClicked(event => {
    const { entity, item } = event;
    if (!entity.persistentData.getBoolean("kubejs:assisted_building")) return;
    if (!item.block) return;
    if (entity.crouching) return;
    entity.swing()
    event.cancel()
});