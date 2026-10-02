export const welcomeEmailTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome Email</title>
</head>
<body>
    <h1>Welcome to Our Service!</h1>
    <p>Thank you for signing up for our service. We're excited to have you on board!</p>
    <p>Best regards,<br>The Team</p>
</body>
</html>
`;

export const verificationEmailTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Email</title>
</head>
<body>
    <h1>Verify Your Email</h1>
    <p>Please click the link below to verify your email address:</p>
    <p><a href="{verificationLink}">Verify your email</a></p>
</body>
</html>
`;
