#!/bin/bash

# Email configuration
TO_EMAIL="recipient@example.com"
FROM_EMAIL="sender@example.com"
SUBJECT="Log File Report"
BODY="Please find the attached log file."
ATTACHMENT_PATH="../logs/uniqueUsers.txt"

# Check if the file exists
if [ ! -f "$ATTACHMENT_PATH" ]; then
    echo "Error: File $ATTACHMENT_PATH does not exist!"
    exit 1
fi

# Method 1: Using mail command with uuencode (most common)
send_with_mail() {
    echo "$BODY" | uuencode "$ATTACHMENT_PATH" "thisFile.txt" | mail -s "$SUBJECT" "$TO_EMAIL"
}

# Method 2: Using mutt (if available)
send_with_mutt() {
    echo "$BODY" | mutt -s "$SUBJECT" -a "$ATTACHMENT_PATH" -- "$TO_EMAIL"
}

# Method 3: Using mailx with MIME encoding
send_with_mailx() {
    (
        echo "To: $TO_EMAIL"
        echo "Subject: $SUBJECT"
        echo "MIME-Version: 1.0"
        echo "Content-Type: multipart/mixed; boundary=\"BOUNDARY\""
        echo
        echo "--BOUNDARY"
        echo "Content-Type: text/plain"
        echo
        echo "$BODY"
        echo
        echo "--BOUNDARY"
        echo "Content-Type: text/plain; name=\"thisFile.txt\""
        echo "Content-Disposition: attachment; filename=\"thisFile.txt\""
        echo
        cat "$ATTACHMENT_PATH"
        echo
        echo "--BOUNDARY--"
    ) | sendmail "$TO_EMAIL"
}

# Method 4: Using mpack (if available)
send_with_mpack() {
    mpack -s "$SUBJECT" -d "$BODY" "$ATTACHMENT_PATH" "$TO_EMAIL"
}

# Try different methods based on available tools
if command -v mutt >/dev/null 2>&1; then
    echo "Sending email using mutt..."
    send_with_mutt
elif command -v mpack >/dev/null 2>&1; then
    echo "Sending email using mpack..."
    send_with_mpack
elif command -v uuencode >/dev/null 2>&1 && command -v mail >/dev/null 2>&1; then
    echo "Sending email using mail with uuencode..."
    send_with_mail
elif command -v sendmail >/dev/null 2>&1; then
    echo "Sending email using sendmail with MIME..."
    send_with_mailx
else
    echo "Error: No suitable email client found!"
    echo "Please install one of: mutt, mpack, mailutils, or sendmail"
    exit 1
fi

echo "Email sent successfully!"