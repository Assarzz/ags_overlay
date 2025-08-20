import app from "ags/gtk4/app"
import { Astal, Gtk, Gdk } from "ags/gtk4"
import { Accessor, createBinding, createState } from "ags"

import AstalBattery from "gi://AstalBattery"
import AstalPowerProfiles from "gi://AstalPowerProfiles"


export default function () {
    const battery = AstalBattery.get_default()
    const powerprofiles = AstalPowerProfiles.get_default()

    const percent_decimal = createBinding(
        battery,
        "percentage",
    )

    // this is probably not the shortest way to make percent reactive but it works
    const toPercent = (decimal: number) => { return `${Math.floor(decimal * 100)}%` }
    const [percent, setPercent] = createState(toPercent(percent_decimal.get()))
    percent_decimal.subscribe(() => {
        setPercent(toPercent(percent_decimal.get()))
    })

    // This is the core logic. It runs whenever 'percent' changes.
    function update_color() {
        const p = percent_decimal.get()
        const red = Math.floor(255 * (1 - p) * 0.8);
        const green = Math.floor(255 * p * 0.8);
        const blue = 0;

        app.apply_css(`.Levelbar trough block {
                                background-color: rgb(${red}, ${green}, ${blue});
                                }`)
    }
    update_color()
    percent_decimal.subscribe(update_color)
    return (

        <Gtk.Frame
            class={"Battery"}
            widthRequest={120}
            heightRequest={45}>

            <levelbar
                class="Levelbar"
                widthRequest={100}
                heightRequest={35}
                value={percent_decimal}
                valign={Gtk.Align.CENTER}
            >
                <label label={percent} />

            </levelbar>

        </Gtk.Frame>

    )
}