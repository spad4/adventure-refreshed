const THREE_MINUTES = 180 * 20

ItemEvents.foodEaten("minersdelight:plate_of_glazed_arachnid_limbs", event => {
    event.player.potionEffects.add("dungeonsdelight:pouncing", THREE_MINUTES, 0, false, false)
})
