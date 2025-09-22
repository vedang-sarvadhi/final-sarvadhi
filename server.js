import jsonServer from "json-server";
import cors from "cors";
import path from "path";

const server = jsonServer.create();
const router = jsonServer.router(path.join(process.cwd(), "public/db.json"));
const middlewares = jsonServer.defaults();

server.use(cors()); // Enable CORS
server.use(middlewares);
server.use(router);

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`JSON Server running on port ${PORT}`);
});
