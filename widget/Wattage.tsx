import app from "ags/gtk4/app"
import { Astal, Gtk, Gdk } from "ags/gtk4"
import { Accessor, createBinding, createState } from "ags"

import AstalBattery from "gi://AstalBattery"
import AstalPowerProfiles from "gi://AstalPowerProfiles"


function Wattage() {
    const battery = AstalBattery.get_default()
    const powerprofiles = AstalPowerProfiles.get_default()

    const wattage_num = createBinding(
        battery,
        "energy-rate",
    )
    const [wattage, setWattage] = createState(String(wattage_num.get()))
    wattage_num.subscribe(() => {
        setWattage(String(wattage_num.get()))
    })

    return (
        <label label={wattage}></label>
    )
}

export default Wattage