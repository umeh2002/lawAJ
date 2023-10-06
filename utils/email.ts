import { google } from "googleapis";
import nodemailer from "nodemailer";
import path from "path";
import ejs from "ejs";

const GOOGLE_ID =
  "8234988124-bsdkkpf67ga2ger27sab514fpf21psb8.apps.googleusercontent.com";
const GOOGLE_SECRET = "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";
const GOOGLE_REFRESH_TOKEN =
  "1//04mHwQohkG1_vCgYIARAAGAQSNwF-L9IrFdUdrogeOJnb3PaZpXUuXPx1YVL4TLtvPEEkUv8A6splKm4vxKmP0ARplmWZoJS6vL";
const GOOGLE_URL = "https://developers.google.com/oauthplayground";

const oAuth = new google.auth.OAuth2(GOOGLE_ID, GOOGLE_SECRET, GOOGLE_URL);
oAuth.setCredentials({ access_token: GOOGLE_REFRESH_TOKEN });

const url: string = "http://localhost:3745";

export const sendAccountOpeningMail = async (user: any, tokenID: string) => {
  try {
    const getAccess: any = (await oAuth.getAccessToken()).token;

    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: "ajegunlelaw@gmail.com",
        clientId: GOOGLE_ID,
        clientSecret: GOOGLE_SECRET,
        refreshToken: GOOGLE_REFRESH_TOKEN,
        accessToken: getAccess,
      },
    });

    const passedData = {
      userName: user.name,
      url: `${url}/${tokenID}/verify-account`,
    };

    const readData = path.join(__dirname, "../views/index.ejs");
    const data = await ejs.renderFile(readData, passedData);

    const mailer = {
      from: " <ajegunlelaw@gmail.com > ",
      to: user.email,
      subject:
        "Welcome to AJ LAW Constituency, Where Ajegunle's Laws are clarified and properly interpreted!",
      html: data,
    };

    transport.sendMail(mailer);
  } catch (error) {
    console.log(error);
  }
};

export const resetAccountPassword = async (user: any, tokenID: string) => {
  try {
    const getAccess: any = (await oAuth.getAccessToken()).token;

    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: "ajegunlelaw@gmail.com",
        clientId: GOOGLE_ID,
        clientSecret: GOOGLE_SECRET,
        refreshToken: GOOGLE_REFRESH_TOKEN,
        accessToken: getAccess,
      },
    });

    const passedData = {
      userName: user.name,
      url: `${url}/${tokenID}/reset-account-password`,
    };

    const readData = path.join(__dirname, "../views/resetPassword.ejs");
    const data = await ejs.renderFile(readData, passedData);

    const mailer = {
      from: " <ajegunlelaw@gmail.com > ",
      to: user.email,
      subject:
        "Welcome to AJ LAW Constituency, you can now reset your password",
      html: data,
    };

    transport.sendMail(mailer);
  } catch (error) {
    console.log(error);
  }
};
