// Complete Google Apps Script for Contact Form Handler with CORS support
// Replace the entire contents of your Apps Script with this code

function doPost(e) {
  // Handle CORS preflight
  if (e.parameter._method === 'OPTIONS') {
    return handleCors();
  }
  
  try {
    // Parse the JSON data from the request
    const data = JSON.parse(e.postData.contents);
    
    // Open the active spreadsheet
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Add timestamp
    const timestamp = new Date();
    
    // Append the data to the sheet (including job title in column I)
    sheet.appendRow([
      timestamp,
      data.firstName || '',
      data.lastName || '',
      data.email || '',
      data.phone || '',
      data.company || '',
      data.website || '',
      data.country || '',
      data.jobTitle || '',  // Job title goes in column I
      data.message || ''     // Message goes in column J
    ]);
    
    // Send email notification
    // CHANGE THIS EMAIL ADDRESS TO YOUR EMAIL
    const recipientEmail = 'l@contestra.com';
    
    // Create email body with all fields including job title
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
    
    // Return success response with proper CORS headers
    return createCorsResponse({
      status: 'success',
      message: 'Form submitted successfully'
    });
      
  } catch (error) {
    // Log the error for debugging
    console.error('Error processing form submission:', error);
    
    // Return error response with proper CORS headers
    return createCorsResponse({
      status: 'error',
      message: error.toString()
    });
  }
}

// Helper function to create response with CORS headers
function createCorsResponse(data) {
  const output = ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
  
  // These headers are set automatically by Google Apps Script when deployed as "Anyone"
  return output;
}

// Handle CORS preflight requests
function handleCors() {
  return ContentService
    .createTextOutput('')
    .setMimeType(ContentService.MimeType.TEXT);
}

// Handle preflight OPTIONS requests for CORS
function doOptions(e) {
  const output = ContentService
    .createTextOutput('')
    .setMimeType(ContentService.MimeType.TEXT);
  
  return output;
}

// Test function to verify the endpoint is working
function doGet() {
  const output = ContentService
    .createTextOutput('Form endpoint is working! Use POST method to submit data.')
    .setMimeType(ContentService.MimeType.TEXT);
  
  return output;
}

// Helper function to test email sending (run this manually to test)
function testEmail() {
  MailApp.sendEmail({
    to: 'l@contestra.com',
    subject: 'Test Email from Google Apps Script',
    body: 'This is a test email to verify email sending is working correctly.'
  });
  console.log('Test email sent');
}

// Helper function to test sheet writing (run this manually to test)
function testSheetWrite() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const timestamp = new Date();
  
  sheet.appendRow([
    timestamp,
    'Test',
    'User',
    'test@example.com',
    '+1234567890',
    'Test Company',
    'https://example.com',
    'United States',
    'Test Job Title',
    'This is a test message'
  ]);
  
  console.log('Test row added to sheet');
}