const HEALING_EVENT = "net.neoforged.neoforge.event.entity.living.LivingHealEvent";
const RESTORATION_DURATION_REDUCTION = 60;

NativeEvents.onEvent(HEALING_EVENT, event => {
    const { entity, amount } = event;

    const restoration = event.entity.potionEffects.getActive("bountifulfares:restoration");
    if (!restoration) return;
    
    if (restoration.duration > RESTORATION_DURATION_REDUCTION) {
        restoration.duration -= amount * RESTORATION_DURATION_REDUCTION;
    }
    else {
        entity.removeEffect("bountifulfares:restoration")
    }
})