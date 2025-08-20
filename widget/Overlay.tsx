import app from "ags/gtk4/app"
import { Astal, Gtk, Gdk } from "ags/gtk4"
import { createPoll } from "ags/time"
import { Accessor, createBinding, createState } from "ags"

import visible from "../visible"
import Battery from "./Battery"
import Wattage from "./Wattage"


export default function Overlay(gdkmonitor: Gdk.Monitor) {
    const time = createPoll("", 1000, "date")
    const [visibility, setVisibility] = createState(true)
    visible.connect("toggle_visibility", () => {
        // make the revealer change it value to what it currently isn't.
        if (visibility.get() == false) {
            // we want to activate
            app.toggle_window("Overlay")
            // now we assume that revealer is deactivated but window is visible and we trigger the animation
            setVisibility(true)
        }
        else {
            // we want to deactivate
            // so we run the animation, and then we react to the notify reveal signal when the animation is done to toggle the window.
            // its albert einstein!!
            setVisibility(false)
        }

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
                transitionType={Gtk.RevealerTransitionType.SWING_UP}

                revealChild={
                    // change this value upon recieving the above signal
                    visibility
                }
                onNotifyChildRevealed={() => {
                    if (visibility.get() == false) {
                        // we want to deactivate
                        // run deactivate animation
                        app.toggle_window("Overlay")

                    }
                }}
            >
                <Gtk.Grid>

                    <Battery />
                    <Wattage />
                    <label label={time} />
                    <Gtk.Calendar />
                </Gtk.Grid>
            </revealer>

        </window>
    )
}

