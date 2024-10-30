import { boot } from "quasar/wrappers"
import { Notify } from "quasar"

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot((/* { app, router, ... } */) => {
  Notify.setDefaults({
    position: "bottom-right",
    actions: [{ icon: "close", color: "white" }],
    progress: true,
  })
  // something to do
})
