const catchAsync = require("./utils/catchAsync");
const appError = require("./utils/appError");
const EmailService = require("./emailService");

exports.sendEmail = catchAsync(async (req, res, next) => {
  const { toName, toEmail, token, func, containerName } = req.body;
  if (!toName || !toEmail || !func || !token || !containerName) {
    return next(new appError("Please provide all required fields", 400));
  }

  const es = new EmailService(toName, toEmail, token, req, containerName);
  if (func === "confirmEmail") await es.sendConfirmationEmail();

  res.status(200).json({ message: "Email sent successfully" });
  console.log(`Confirmation email sent to ${toEmail}`);
});
