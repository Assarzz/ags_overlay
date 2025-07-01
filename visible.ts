import { Astal, Gtk, Gdk } from "ags/gtk4"
import { createPoll } from "ags/time"
import { Accessor, createBinding, createState } from "ags"
import { register, property, Object, signal,  } from "ags/gobject"


@register({ GTypeName: "VisibleGType" })
class Visible extends Object {
  @signal(String)
  toggle_visibility(a: string) {
    print("toggling visibility!")
  }}

export default new Visible