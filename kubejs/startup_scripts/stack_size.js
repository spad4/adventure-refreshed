const STACK_MAP = new Map();
STACK_MAP.set(16, [
    // "minecraft:potion",
    // "minecraft:splash_potion",
    // "minecraft:lingering_potion",
    "minecraft:pumpkin_pie",
    "farmersdelight:apple_pie",
    "farmersdelight:chocolate_pie",
    "farmersdelight:sweet_berry_cheesecake"
])

STACK_MAP.set(4, [
    "minecraft:potion",
    "minecraft:splash_potion",
    "minecraft:lingering_potion",
])

STACK_MAP.set(1, [
    "bountifulfares:coconut_cake",
    "bountifulfares:cocoa_cake",
    "bountifulfares:sponge_cake",
    "minersdelight:copper_pot"
])

ItemEvents.modification(event => {
    STACK_MAP.forEach((value, key) => {
        event.modify(value, item => { item.maxStackSize = key })
    })
})