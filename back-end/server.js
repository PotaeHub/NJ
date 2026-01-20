import { PORT, app } from "./app.js";

app.listen(PORT, () => {
    console.log("Server Running....." + `http://localhost:${PORT}`)
})