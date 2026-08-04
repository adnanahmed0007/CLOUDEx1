import { createClient } from "redis";

const client = createClient({
    url: "redis://127.0.0.1:6379",
});

client.on("error", (err) => {
    console.error("Redis Error:", err);
});

async function main() {
    await client.connect();

    console.log(await client.ping());

    await client.set("name", "Adnan");
    console.log(await client.get("name"));

    await client.quit();
}

main().catch(console.error);