const  $Axis  = Java.loadClass("com.mojang.math.Axis")
const  $LevelRenderer  = Java.loadClass("net.minecraft.client.renderer.LevelRenderer")
const  $ModelData  = Java.loadClass("net.neoforged.neoforge.client.model.data.ModelData")

StartupEvents.registry("block", event => {
    event.create("rjs:test_block")
        .blockEntity(info => {

        })
})


//You can choose to register a shell first
ClientEvents.blockEntityRendererRegistry(event => {
    event.register("rjs:test_block", RenderJSBlockEntityRenderer.create())
})