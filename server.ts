import express, { Request, Response } from "express";
import cors from "cors";
const PORT = process.env.PORT || 5000;
class App {
  public application: express.Application;
  constructor() {
    this.application = express();
  }
}
const app = new App().application;
app.use(cors());
app.get("/", (req: Request, res: Response) => {
  res.send("server testing ok");
});
app.get("/data/1", (req: Request, res: Response) => {
  res.json({
    id: 1,
    name: "pepper",
    age: 26,
    job: "developer",
  });
});
app.get("/data/2", (req: Request, res: Response) => {
  res.json({
    id: 2,
    name: "kelly",
    age: 21,
    job: "student",
  });
});
app.listen(PORT, () => console.log("server running..."));
