import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import nodemailer from "nodemailer";
import dotenv from "dotenv";  
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;


app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));


app.set("views", path.join(__dirname, "views"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));



app.post("/send-email", async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ message: "All fields are required." });
    }

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,  
            pass: process.env.EMAIL_PASS   
        }
    });

    // **Email to Yourself**
    const adminMailOptions = {
        from: email,  
        to: process.env.EMAIL_USER,  
        subject: `New Contact Form Submission from ${name}`,
        text: `You received a new message:\n\nName: ${name}\nEmail: ${email}\nMessage: ${message}`
    };

    // **Email to Sender**
    const userMailOptions = {
        from: process.env.EMAIL_USER,  
        to: email,  
        subject: "Thank You for Contacting Me!",
        text: `Hi ${name},\n\nThank you for reaching out! Received your message and will get back to you soon.\n\nBest regards,\nNisha Kumari`
    };

    try {
        await transporter.sendMail(adminMailOptions);
        await transporter.sendMail(userMailOptions); 
        res.json({ message: "Your message has been sent successfully!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error sending email. Please try again later." });
    }
});



app.get("/", (req, res) => {
    res.render("home", { pageClass: "home-page" });
});

app.get("/about", (req, res) => {
    res.render("about",  { pageClass: "about-page" });
});

app.get("/projects", (req, res) => {
    res.render("projects", { pageClass: "projects-page" });
});

app.get("/contact", (req, res) => {
    res.render("contact", { pageClass: "contact-page" });
});

if (process.env.NODE_ENV !== "production") {
    app.listen(port, () => {
        console.log(`Listening on port ${port}`);
    });
}



export default app;