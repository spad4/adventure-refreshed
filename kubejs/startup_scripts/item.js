const THIRTY_SECONDS = 600
const FORTYFIVE_SECONDS = 900
const SIXTY_SECONDS = 1200

StartupEvents.registry("item", event => {

    const createSliceItem = (id, name, nutrition, saturation) => {
        event.create(id).texture("kubejs:item/" + id).displayName(name)
            .food(food => food
                .nutrition(nutrition)
                .saturation(saturation)
                .fastToEat()
                .effect("minecraft:speed", THIRTY_SECONDS, 0, 1.0)
            )
    }

    const createCopperCupItem = (id, nutrition, saturation, effect, duration, probability = 1) => {
        event.create(id).texture("kubejs:item/" + id)
            .containerItem("minersdelight:copper_cup")
            .maxStackSize(16)
            .food(food => food
                .nutrition(nutrition)
                .saturation(saturation)
                .fastToEat()
                .effect(effect, duration, 0, probability)
            )
    }

    event.create("copper_nugget").texture("kubejs:item/copper_nugget");

    // backpack components are provided in recipe output
    // because game crashes if i provide them here :(
    event.create("canvas_backpack").texture("kubejs:item/canvas_backpack").maxStackSize(1);
    event.create("botanists_bundle").texture("kubejs:item/botanists_bundle").maxStackSize(1).displayName("Botanist's Bundle");

    createCopperCupItem("leek_stew_cup", 3, 1.2, "bountifulfares:enrichment", FORTYFIVE_SECONDS, 0);
    createCopperCupItem("fish_stew_cup", 5, 1.2, "bountifulfares:restoration", FORTYFIVE_SECONDS, 0);
    createCopperCupItem("apple_stew_cup", 5, 1, "bountifulfares:restoration", FORTYFIVE_SECONDS, 0);
    createCopperCupItem("coconut_stew_cup", 5, 1.2, "bountifulfares:restoration", FORTYFIVE_SECONDS, 0);
    createCopperCupItem("bountiful_stew_cup", 5, 1.2, "bountifulfares:enrichment", SIXTY_SECONDS, 0);
})