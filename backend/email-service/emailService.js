const fs = require("fs");
const path = require("path");
const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const loadTemplate = (templateName) => {
  const templatePath = path.join(__dirname, "./templates", templateName);
  return fs.readFileSync(templatePath, "utf8");
};

const emailTemplates = {
  confirmation: loadTemplate("confirmationEmail.html"),
};

class EmailService {
  constructor(name, email, token, req, containerName) {
    this.name = name;
    this.email = email;
    this.token = token;
    this.req = req;
    this.sender = process.env.EMAIL;
    this.containerName = containerName;
  }

  generateURL(endpoint) {
    return `${this.req.protocol}://${this.containerName}/api/auth/${endpoint}/${this.token}`;
  }

  async sendEmail(to, subject, text, html) {
    const msg = {
      to,
      from: this.sender,
      subject,
      text,
      html,
    };

    await sgMail.send(msg);
  }

  async sendConfirmationEmail() {
    const url = this.generateURL("confirmEmail");
    const text = `Welcome, ${this.name}! Please confirm your email by clicking this link: ${url}`;

    let html = emailTemplates.confirmation;
    html = html.replace(/{{name}}/g, this.name).replace(/{{url}}/g, url);

    try {
      await this.sendEmail(this.email, "Confirm Your Email", text, html);
      console.info(`Confirmation email sent to ${this.email}`);
    } catch (error) {
      console.error(`Error sending confirmation email: ${error}`);
    }
  }
}

module.exports = EmailService;
