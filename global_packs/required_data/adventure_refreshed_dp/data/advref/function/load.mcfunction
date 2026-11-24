scoreboard objectives add advref.init dummy
scoreboard players add init advref.init 0
execute if score init advref.init matches 0 run function advref:init

function advref:loop_1t