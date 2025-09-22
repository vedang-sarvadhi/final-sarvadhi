import { rest, setupWorker } from "msw";

export const worker = setupWorker(
	rest.get("/api/employees", (req, res, ctx) => {
		return res(ctx.json([{ id: 1, name: "John Doe" }]));
	}),
);
