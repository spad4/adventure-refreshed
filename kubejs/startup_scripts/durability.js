
const DURABILITY = {
    WOODEN_TOOL: 64,
    COPPER_TOOL: 256,
    IRON_TOOL: 512,
    GOLDEN_TOOL: 64,
    DIAMOND_TOOL: 2048,
    NETHERITE_TOOL: 4096,
    MACE: 2048,
    TRIDENT: 2048,
    WAX_BRUSH: 2048,
}

ItemEvents.modification(event => {
    const setDurability = (id, amount) => {
        event.modify(id, item => { item.maxDamage = amount })
    }

    setDurability("minecraft:wooden_pickaxe", DURABILITY.WOODEN_TOOL)
    setDurability("minecraft:wooden_axe", DURABILITY.WOODEN_TOOL)
    setDurability("minecraft:wooden_shovel", DURABILITY.WOODEN_TOOL)
    setDurability("minecraft:wooden_sword", DURABILITY.WOODEN_TOOL)
    setDurability("minecraft:wooden_hoe", DURABILITY.WOODEN_TOOL)
    setDurability("farmersdelight:flint_knife", DURABILITY.WOODEN_TOOL)

    setDurability("simplest_copper_gear:copper_pickaxe", DURABILITY.COPPER_TOOL)
    setDurability("simplest_copper_gear:copper_axe", DURABILITY.COPPER_TOOL)
    setDurability("simplest_copper_gear:copper_shovel", DURABILITY.COPPER_TOOL)
    setDurability("simplest_copper_gear:copper_sword", DURABILITY.COPPER_TOOL)
    setDurability("simplest_copper_gear:copper_hoe", DURABILITY.COPPER_TOOL)

    setDurability("minecraft:iron_pickaxe", DURABILITY.IRON_TOOL)
    setDurability("minecraft:iron_axe", DURABILITY.IRON_TOOL)
    setDurability("minecraft:iron_shovel", DURABILITY.IRON_TOOL)
    setDurability("minecraft:iron_sword", DURABILITY.IRON_TOOL)
    setDurability("minecraft:iron_hoe", DURABILITY.IRON_TOOL)
    setDurability("farmersdelight:iron_knife", DURABILITY.IRON_TOOL)

    setDurability("minecraft:golden_pickaxe", DURABILITY.GOLDEN_TOOL)
    setDurability("minecraft:golden_axe", DURABILITY.GOLDEN_TOOL)
    setDurability("minecraft:golden_shovel", DURABILITY.GOLDEN_TOOL)
    setDurability("minecraft:golden_sword", DURABILITY.GOLDEN_TOOL)
    setDurability("minecraft:golden_hoe", DURABILITY.GOLDEN_TOOL)
    setDurability("farmersdelight:golden_knife", DURABILITY.GOLDEN_TOOL)

    setDurability("minecraft:diamond_pickaxe", DURABILITY.DIAMOND_TOOL)
    setDurability("minecraft:diamond_axe", DURABILITY.DIAMOND_TOOL)
    setDurability("minecraft:diamond_shovel", DURABILITY.DIAMOND_TOOL)
    setDurability("minecraft:diamond_sword", DURABILITY.DIAMOND_TOOL)
    setDurability("minecraft:diamond_hoe", DURABILITY.DIAMOND_TOOL)
    setDurability("farmersdelight:diamond_knife", DURABILITY.DIAMOND_TOOL)

    setDurability("minecraft:netherite_pickaxe", DURABILITY.NETHERITE_TOOL)
    setDurability("minecraft:netherite_axe", DURABILITY.NETHERITE_TOOL)
    setDurability("minecraft:netherite_shovel", DURABILITY.NETHERITE_TOOL)
    setDurability("minecraft:netherite_sword", DURABILITY.NETHERITE_TOOL)
    setDurability("minecraft:netherite_hoe", DURABILITY.NETHERITE_TOOL)
    setDurability("farmersdelight:netherite_knife", DURABILITY.NETHERITE_TOOL)

    setDurability("minecraft:trident", DURABILITY.TRIDENT)
    setDurability("minecraft:mace", DURABILITY.MACE)

    setDurability("brushstrokes:wax_brush", DURABILITY.WAX_BRUSH)
})