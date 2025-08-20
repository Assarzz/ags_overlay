import app from "ags/gtk4/app"
import style from "./style.scss"
import Overlay from "./widget/Overlay"
import visible from "./visible"

app.start({
  css: style,
  requestHandler(request: string, res: (response: any) => void) {
    if (request == "toggle") {
      // somehow communicate with my  window, and have the window perform animated toggle action
      visible.emit("toggle_visibility", "some arg")
      res("toggling!")
    }
    res("unknown command")
  },
  main() {
    app.get_monitors().map(Overlay)
  },
})
