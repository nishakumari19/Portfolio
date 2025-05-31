import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import axios from "axios";
import rateLimit from "express-rate-limit";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// ✅ Rate limiter
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // limit each IP to 5 requests per minute
  message: "Too many requests, please try again later.",
});
app.use("/send-email", limiter);

app.post("/send-email", async (req, res) => {
  const { name, email, message, token } = req.body;

  if (!name || !email || !message || !token) {
    return res.status(400).json({ message: "All fields including captcha token are required." });
  }

  // ✅ Verify reCAPTCHA
  try {
    const verifyResponse = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`
    );

    const isHuman = verifyResponse.data.success;
    if (!isHuman) {
      return res.status(403).json({ message: "Captcha verification failed. Please try again." });
    }
  } catch (err) {
    console.error("Captcha verification error:", err);
    return res.status(500).json({ message: "Captcha verification failed. Try again later." });
  }

  // ✅ Send Emails
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const adminMailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
    subject: `New Contact Form Submission from ${name}`,
    text: `You received a new message:\n\nName: ${name}\nEmail: ${email}\nMessage: ${message}`,
  };

  const userMailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Thank You for Contacting Me!",
    text: `Hi ${name},\n\nThank you for reaching out! Received your message and will get back to you soon.\n\nBest regards,\nNisha Kumari`,
  };

  try {
    await transporter.sendMail(adminMailOptions);
    await transporter.sendMail(userMailOptions);
    res.json({ message: "Your message has been sent successfully!" });
  } catch (error) {
    console.error("Email error:", error);
    res.status(500).json({ message: "Error sending email. Please try again later." });
  }
});

// EJS pages
app.get("/", (req, res) => res.render("home", { pageClass: "home-page" }));
app.get("/about", (req, res) => res.render("about", { pageClass: "about-page" }));
app.get("/projects", (req, res) => res.render("projects", { pageClass: "projects-page" }));
app.get("/contact", (req, res) => res.render("contact", { pageClass: "contact-page" }));

if (process.env.NODE_ENV !== "production") {
  app.listen(port, () => console.log(`Listening on port ${port}`));
}

export default app;
