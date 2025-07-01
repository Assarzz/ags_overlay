import app from "ags/gtk4/app"
import { Astal, Gtk, Gdk } from "ags/gtk4"
import { createPoll } from "ags/time"
import { Accessor, createBinding, createState } from "ags"

import AstalBattery from "gi://AstalBattery"
import AstalPowerProfiles from "gi://AstalPowerProfiles"
import GL from "gi://GL?version=1.0"

import visible from "../visible"


function Battery() {
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



    /*     let p = 1
        let red = Math.floor(255 * (1 - p) * 0.8);
        let green = Math.floor(255 * p * 0.8);
        let blue = 0;
        setInterval(() => {
            app.apply_css(`.Levelbar trough block {
                            background-color: rgb(${red}, ${green}, ${blue});
                            }`)
            console.log(p)
            p -= 0.01
            red = Math.floor(255 * (1 - p) * 0.8);
            green = Math.floor(255 * p * 0.8);
        }, 100) */

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
        <box>
            <levelbar
                class="Levelbar"
                value={percent_decimal}
                valign={Gtk.Align.CENTER}
            >
                <label label={percent} />

            </levelbar>

        </box>
    )
}

export default function Overlay(gdkmonitor: Gdk.Monitor) {
    const time = createPoll("", 1000, "date")
    const [visibility, setVisibility] = createState(true)

    visible.connect("toggle_visibility", () => {
        // make the revealer change it value to what it currently isn't.
        setVisibility(!visibility.get())
    })

    return (
        <window
            keymode={Astal.Keymode.ON_DEMAND}
            visible
            name="Overlay"
            class="Overlay"
            gdkmonitor={gdkmonitor}
            exclusivity={Astal.Exclusivity.IGNORE}
            //   anchor={TOP | LEFT | RIGHT}
            application={app}
        >
            <revealer
                transitionType={Gtk.RevealerTransitionType.CROSSFADE}

                revealChild={
                    // change this value upon recieving the above signal
                    visibility
                }
                onNotifyChildRevealed={() => {
                    print("animation finished")
                    app.toggle_window("Overlay")
                }}
            >
                <Gtk.Grid>

                    <Battery />
                    <label label={time} />
                    <Gtk.Calendar />
                </Gtk.Grid>
            </revealer>
        </window>
    )
}

