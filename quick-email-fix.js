#!/usr/bin/env node

console.log('🔧 Quick Email Fix for FixedfloatWallet API\n');

console.log('📧 Current Issue: Gmail authentication failing');
console.log('❌ Error: 535-5.7.8 Username and Password not accepted\n');

console.log('🚀 QUICK FIX STEPS:\n');

console.log('1️⃣  Go to: https://myaccount.google.com/security');
console.log('2️⃣  Click "2-Step Verification" (enable if not enabled)');
console.log('3️⃣  Scroll down to "App passwords"');
console.log('4️⃣  Click "App passwords"');
console.log('5️⃣  Select "Mail" → "Other (Custom name)"');
console.log('6️⃣  Enter: "FixedfloatWallet API"');
console.log('7️⃣  Click "Generate"');
console.log('8️⃣  Copy the 16-character password (like: abcd efgh ijkl mnop)\n');

console.log('9️⃣  Update your .env file:');
console.log('   EMAIL_USER=your-gmail@gmail.com');
console.log('   EMAIL_PASS=abcd efgh ijkl mnop  ← Use App Password here\n');

console.log('🔟  Test with: node test-email.js\n');

console.log('💡 ALTERNATIVE: Use a different email provider');
console.log('   - Outlook: smtp-mail.outlook.com');
console.log('   - Yahoo: smtp.mail.yahoo.com');
console.log('   - SendGrid: smtp.sendgrid.net\n');

console.log('✅ After fixing, your API will send OTP emails successfully!');
console.log('📧 OTP will be sent to user email instead of console logs\n');

console.log('🆘 If still having issues, check EMAIL_SETUP_GUIDE.md for detailed help');