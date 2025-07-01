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
    
    const percent = createBinding(
        battery,
        "percentage",
    )

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
        const p = percent.get() // p is a value from 0.0 to 1.0

        // Calculate the red and green components
        const red = Math.floor(255 * (1 - p) * 0.8);
        const green = Math.floor(255 * p * 0.8);
        const blue = 0;

        app.apply_css(`.Levelbar trough block {
                                background-color: rgb(${red}, ${green}, ${blue});
                                }`)

    }
    update_color()
    percent.subscribe(update_color)
    return (
        <box>
            <levelbar
                class="Levelbar"
                value={percent}
                valign={Gtk.Align.CENTER}
            // The 'setup' prop is perfect for one-time initialization

            >
                <label label={`${Math.floor(percent.get() * 100)}%`} />

            </levelbar>

        </box>
    )
}

export default function Overlay(gdkmonitor: Gdk.Monitor) {
    const time = createPoll("", 1000, "date")
    const { TOP, LEFT, RIGHT } = Astal.WindowAnchor

    const [visibility, setVisibility] = createState(true)

    visible.connect("toggle_visibility", ()=>{ 
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

