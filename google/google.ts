import passport from "passport";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const GOOGLE_CLIENT_ID =
  "72356347044-uajp6t7kdjfbn8ptj7v7r7tafpmflvo9.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = "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";

const GoogleStrategy = require("passport-google-oauth2").Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3633/google/callback",
      // callbackURL: environemtVariable.CALLBACKURL,
      passReqToCallback: true,
    },

    async (
      request: any,
      accessToken: any,
      refreshToken: any,
      profile: any,
      done: any
    ) => {
      return done(null, profile);
    }
  )
);

passport.serializeUser((user, done) => {
  return done(null, user);
});

passport.deserializeUser((user, done) => {
  return done(null, user!);
});
