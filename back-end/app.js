import express from "express"
import { readdirSync } from "fs"
import dotenv from "dotenv"
import path from "path"
import cors from "cors"
dotenv.config()
export const app = express();
export const PORT = process.env.PORT;


app.use(express.json());

app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
app.use(cors({
    origin: process.env.FRONT_END,
    credentials: true
}))
const routes = readdirSync('./routes')

const loadRoutes = async () => {
    for (const r of routes) {
        try {
            const routeModule = await import(`./routes/${r}`)
            if (routeModule.default) {
                app.use('/api', routeModule.default)
                console.log(`🛜 Loaded route: /api from ${r}`)
            }
        } catch (error) {
            console.error(`❌ Error loading route ${r}:`, error)
        }
    }
}

await loadRoutes()