# Security Policy 🛡️

The security of the Game Dashboard application is a top priority. We take all security reports seriously and appreciate the community's efforts to help us keep the project safe.

## Supported Versions

Security updates are applied to the latest version of the code available on the `main` branch. Please ensure you are working with the most up-to-date version before reporting a vulnerability.

| Version | Supported          |
| ------- | ------------------ |
| latest  | :white_check_mark: |

---
## Reporting a Vulnerability

We encourage responsible disclosure of security vulnerabilities. Please act in good faith towards our users' privacy and data.

**Please do NOT report security vulnerabilities through public GitHub issues.**

Instead, please report any suspected vulnerability privately. To do so, please send an email to:

**`harshrajsinhraulji@users.noreply.github.com`**

### What to Include

When reporting a vulnerability, please include a detailed description with the following:

-   **A clear and descriptive title.**
-   **The vulnerability type** (e.g., Cross-Site Scripting, SQL Injection, etc.).
-   **Step-by-step instructions** to reproduce the issue.
-   **Proof-of-concept** code, screenshots, or screen recordings.
-   **The potential impact** of the vulnerability.

We kindly ask that you do not disclose the vulnerability publicly until we have had a chance to investigate and implement a fix.

---
## Disclosure Policy

When we receive a vulnerability report, our plan is to:

1.  Acknowledge receipt of your report within **48 hours**.
2.  Investigate and confirm the issue. We will let you know if we have accepted your report.
3.  Begin working on a patch to fix the vulnerability.
4.  Release the patch and notify you once the issue has been resolved. We will credit you for your discovery unless you prefer to remain anonymous.

We will do our best to handle the issue in a timely manner and will keep you informed of our progress.

## Scope

We are primarily concerned with vulnerabilities in the Game Dashboard application code, such as:

-   Cross-Site Scripting (XSS)
-   SQL Injection (SQLi)
-   Cross-Site Request Forgery (CSRF)
-   Broken Authentication / Session Management Flaws
-   Insecure Direct Object References

### Out of Scope

The following issues are considered out of scope for our security policy:

-   Vulnerabilities in third-party software (e.g., Apache, PHP, MySQL).
-   Issues related to the user's local server configuration (WAMP, XAMPP).
-   Social engineering or phishing attacks against users.
-   Denial of Service (DoS) attacks.
