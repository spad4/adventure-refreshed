const $IntegerProperty = Java.loadClass("net.minecraft.world.level.block.state.properties.IntegerProperty")

StartupEvents.registry("block", event => {
    event.create("kubejs:darkslate")
        .copyPropertiesFrom("minecraft:deepslate")
        .hardness(3.5)
        .resistance(7)
        .property(BlockProperties.AXIS)
        .placementState(event => event.set(BlockProperties.AXIS, event.clickedFace.axis))
        .property($IntegerProperty.create("heat_level", 0, 4))
        .tagBlock([
            "deepslate_ore_replaceables",
            "sculk_replaceable",
            "moss_replaceable",
            "c:stones",
            "mineable/pickaxe",
            "dungeonsdelight:rotbulb_crop_grows_faster",
            "dungeonsdelight:rotbulb_growable_on",
            "overworld_carver_replaceables",
            "ancient_city_replaceable",
        ]);
})