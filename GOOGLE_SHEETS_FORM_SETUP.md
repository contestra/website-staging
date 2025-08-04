# Google Sheets Form Setup Guide

This guide will help you connect your talk.html contact form to Google Sheets.

## Step 1: Create a Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it "Contestra Contact Form Submissions"
4. In Row 1, add these column headers:
   - A1: Timestamp
   - B1: First Name
   - C1: Last Name  
   - D1: Email
   - E1: Phone
   - F1: Company
   - G1: Website
   - H1: Country
   - I1: Job Title
   - J1: Message

## Step 2: Create Google Apps Script

1. In your Google Sheet, go to **Extensions > Apps Script**
2. Delete any existing code
3. Paste this code:

```javascript
function doPost(e) {
  try {
    // Parse the JSON data
    const data = JSON.parse(e.postData.contents);
    
    // Open the spreadsheet (replace with your sheet ID)
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Add timestamp
    const timestamp = new Date();
    
    // Append the data
    sheet.appendRow([
      timestamp,
      data.firstName || '',
      data.lastName || '',
      data.email || '',
      data.phone || '',
      data.company || '',
      data.website || '',
      data.country || '',
      data.message || ''
    ]);
    
    // Send email notification
    // CHANGE THIS EMAIL ADDRESS TO YOUR EMAIL
    const recipientEmail = 'your-email@example.com';
    
    // Create email body
    const emailBody = `
New contact form submission received:

Name: ${data.firstName} ${data.lastName}
Email: ${data.email}
Phone: ${data.phone || 'Not provided'}
Company: ${data.company}
Website: ${data.website || 'Not provided'}
Job Title: ${data.jobTitle || 'Not provided'}
Country: ${data.country}

Message:
${data.message || 'No message provided'}

---
Submitted on: ${timestamp}
    `;
    
    // Send the email
    MailApp.sendEmail({
      to: recipientEmail,
      subject: `New Contact Form: ${data.firstName} ${data.lastName} from ${data.company}`,
      body: emailBody,
      replyTo: data.email // This allows you to reply directly to the submitter
    });
    
    // Return success
    return ContentService
      .createTextOutput(JSON.stringify({status: 'success'}))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({status: 'error', message: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Test function
function doGet() {
  return ContentService
    .createTextOutput('Form endpoint is working!')
    .setMimeType(ContentService.MimeType.TEXT);
}
```

4. Save the project (name it "Contact Form Handler")

## Step 3: Deploy as Web App

1. Click **Deploy > New Deployment**
2. Choose type: **Web app**
3. Configure:
   - Description: "Contact Form Handler"
   - Execute as: **Me**
   - Who has access: **Anyone**
4. Click **Deploy**
5. Copy the Web App URL (it will look like: `https://script.google.com/macros/s/AKfycb.../exec`)

## Step 4: Update Your Website

1. Open `talk.html`
2. Find this line (around line 1471):
   ```javascript
   const GOOGLE_SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';
   ```
3. Replace with your actual URL:
   ```javascript
   const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/YOUR_ACTUAL_ID/exec';
   ```

## Step 5: Test

1. Fill out the form on your website
2. Submit it
3. Check your Google Sheet - a new row should appear!

## Troubleshooting

- **Form not submitting**: Check browser console for errors
- **No data in sheet**: Verify the Apps Script is deployed with "Anyone" access
- **Wrong data**: Check that form field names match the script

## Security Notes

- The Google Apps Script URL is public but only accepts POST requests
- Data is stored in your private Google Sheet
- Consider adding email validation and spam protection
- For production, you might want to add reCAPTCHA

## Alternative: Email Notifications

To also get email notifications, add this to your Apps Script before the `return` statement:

```javascript
// Send email notification
MailApp.sendEmail({
  to: 'l@contestra.com',
  subject: 'New Contact Form Submission',
  body: `New submission from ${data.firstName} ${data.lastName}\n\n` +
        `Email: ${data.email}\n` +
        `Company: ${data.company}\n` +
        `Message: ${data.message}`
});
```