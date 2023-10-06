import express, { Application,Response,Request } from "express";
import env from "dotenv";
import { mainApp } from "./mainApp";
import passport from "passport";
import "./google/google";
import session from "express-session";
import cors from "cors"

env.config();

const app: Application = express();

// const port: number = parseInt(process.env.PORT!);

const port:number =3633

mainApp(app);

passport.serializeUser((user, done) => {
    done(null, user);
  });
  passport.deserializeUser((user, done) => {
    done(null, user!);
  });
  
  
  app.use(
    session({
      secret: "keyboard cat",
      resave: false,
      saveUninitialized: true,
      cookie: { secure: false },
    })
  );
  
  app.use(passport.initialize());
  app.use(passport.session());
  
  app.use(cors());
  app.use(express.json());
  
  
  app.get("/google", (req: Request, res: Response) => {
    res.send(`<a href= "/veri/google">Authenicate with google</a>`);
  });
  
  app.get(
    "/veri/google",
    passport.authenticate("google", { scope: ["email", "profile"] })
  );
  app.get(
    "/google/callback",
    passport.authenticate("google", {
      successRedirect: "http://localhost:3000/Home/",
      failureRedirect: "/google/callback/failure",
    })
  );
  
  app.get("/google/callback/protect", (req: any, res: any) => {
    return res.send(`hello ${req?.user?.displayName}`);
  });
  app.get("/google/callback/failure", (req, res) => {
    return res.send("failed to authnticate");
  });
  
  app.get("/github", (req: Request, res: Response) => {
    res.send(`<a href= "/veri/github">Authenicate with github</a>`);
  });
  
const server = app.listen(port, () => {
  console.log("");
  console.log("server is listening on port", port);
});

process.on("unhandledRejection", (reason: any) => {
  console.log("server is having an unhandled rejection");
  console.log(reason);
});

process.on("uncaughtException", (error: any) => {
  console.log("server is not responding with an uncaught exception");
  console.log(error);

  server.close(() => {
    process.exit(1);
  });
});
