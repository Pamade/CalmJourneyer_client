import React from 'react';
import { Link } from 'react-router';
import styles from './PrivacyPolicy.module.scss';

const PrivacyPolicy: React.FC = () => {
    return (
        <div className={styles.privacyPolicy}>
            <div className={styles.container}>
                <header className={styles.header}>
                    <h1>Privacy Policy</h1>
                    <p className={styles.lastUpdated}>Last Updated: November 17, 2025</p>
                </header>

                <div className={styles.content}>
                    <section className={styles.section}>
                        <h2>1. Introduction</h2>
                        <p>
                            Welcome to CalmJourneyer. We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our AI-powered meditation application and services.
                        </p>
                        <p>
                            By using CalmJourneyer, you agree to the collection and use of information in accordance with this policy. If you do not agree with our policies and practices, please do not use our services.
                        </p>
                    </section>

                    <section className={styles.section}>
                        <h2>2. Information We Collect</h2>

                        <h3>2.1 Personal Information</h3>
                        <p>We collect information that you provide directly to us, including:</p>
                        <ul>
                            <li><strong>Account Information:</strong> Name, email address, and profile preferences</li>
                            <li><strong>Payment Information:</strong> Billing details, payment card information (processed securely through third-party payment processors)</li>
                            <li><strong>Subscription Data:</strong> Subscription plan, payment history, and renewal information</li>
                            <li><strong>Profile Data:</strong> Meditation goals, preferences, and settings</li>
                        </ul>

                        <h3>2.2 Meditation Session Data</h3>
                        <p>To provide personalized AI-generated meditation sessions, we collect:</p>
                        <ul>
                            <li><strong>Session Preferences:</strong> Selected meditation type, duration, focus areas, and goals</li>
                            <li><strong>Usage Patterns:</strong> Session completion rates, time of day preferences, and frequency of use</li>
                            <li><strong>Feedback Data:</strong> Session ratings, emotional state before/after sessions, and user feedback</li>
                            <li><strong>AI Interaction Data:</strong> Your inputs and preferences that inform our AI's content generation</li>
                        </ul>

                        <h3>2.3 Automatically Collected Information</h3>
                        <p>When you access our services, we automatically collect:</p>
                        <ul>
                            <li><strong>Technical Data:</strong> Cookies, log data, and analytics information</li>
                        </ul>
                    </section>

                    <section className={styles.section}>
                        <h2>3. How We Use Your Information</h2>

                        <h3>3.1 AI-Generated Content Personalization</h3>
                        <p>
                            CalmJourneyer uses artificial intelligence to generate unique meditation sessions tailored to your needs. We use your meditation preferences, usage patterns, and feedback to:
                        </p>
                        <ul>
                            <li>Generate personalized meditation scripts and guidance</li>
                            <li>Adapt meditation content to your goals</li>
                            <li>Optimize session timing, pacing, and techniques based on your preferences</li>
                            <li>Improve the relevance and effectiveness of AI-generated content</li>
                            <li>Ensure each meditation session is uniquely tailored to your current state and needs</li>
                        </ul>

                        <h3>3.2 Service Provision and Improvement</h3>
                        <p>We use your information to:</p>
                        <ul>
                            <li>Provide, maintain, and improve our meditation services</li>
                            <li>Process and manage your subscription payments</li>
                            <li>Send you service-related notifications and updates</li>
                            <li>Respond to your inquiries and provide customer support</li>
                            <li>Analyze usage patterns to enhance user experience</li>
                            <li>Develop new features and meditation techniques</li>
                        </ul>
                    </section>

                    <section className={styles.section}>
                        <h2>4. AI Technology and Data Processing</h2>

                        <h3>4.1 How are we using AI</h3>
                        <p>
                            CalmJourneyer uses gemini 2.5 pro model to generate unique meditation content for each session
                        </p>
                        <ul>
                            <li>Analyzes your preferences and meditation history to create personalized content</li>
                            <li>Generates unique meditation scripts that are never exactly repeated</li>
                            <li>Adapts techniques and guidance based on your feedback and progress</li>
                            <li>Operates within strict ethical guidelines to ensure appropriate, beneficial content</li>
                        </ul>


                    </section>

                    <section className={styles.section}>
                        <h2>5. Data Sharing and Disclosure</h2>

                        <h3>5.1 We Do Not Sell Your Personal Information</h3>
                        <p>
                            We do not sell, rent, or trade your personal information to third parties for their marketing purposes.
                        </p>

                        <h3>5.2 Service Providers</h3>
                        <p>We share information with trusted service providers who assist us in:</p>
                        <ul>
                            <li><strong>Payment Processing:</strong> Secure payment processors (Stripe) to handle subscription payments</li>
                            <li><strong>Cloud Infrastructure:</strong> Hosting providers to store and process data securely</li>
                            <li><strong>Analytics:</strong> Tools to understand usage patterns and improve our service</li>
                            <li><strong>Email Services:</strong> Communication platforms for sending notifications and updates</li>
                        </ul>
                        <p>
                            All service providers are contractually obligated to protect your information and use it only for specified purposes.
                        </p>

                        <h3>5.3 Legal Requirements</h3>
                        <p>We may disclose your information if required to:</p>
                        <ul>
                            <li>Comply with legal obligations, court orders, or regulatory requirements</li>
                            <li>Protect the rights, property, or safety of CalmJourneyer, our users, or others</li>
                            <li>Investigate potential violations of our Terms of Service</li>
                            <li>Prevent fraud, security breaches, or technical issues</li>
                        </ul>
                    </section>

                    <section className={styles.section}>
                        <h2>6. Subscription and Payment Information</h2>

                        <h3>6.1 Payment Processing</h3>
                        <p>
                            We use third-party payment processors to handle subscription payments securely. We do not store your complete payment card information on our servers. Payment processors comply with PCI-DSS standards.
                        </p>

                        <h3>6.2 Subscription Management</h3>
                        <p>
                            We retain subscription information including:
                        </p>
                        <ul>
                            <li>Subscription plan type and pricing</li>
                            <li>Payment history and billing dates</li>
                            <li>Renewal and cancellation records</li>
                            <li>Promotional codes and discounts applied</li>
                        </ul>

                        <h3>6.3 Billing Information</h3>
                        <p>
                            You can view, update, or delete your payment information through your account settings. Upon subscription cancellation, we retain billing records as required for accounting and legal compliance.
                        </p>
                    </section>

                    <section className={styles.section}>
                        <h2>7. Data Security</h2>
                        <p>
                            We implement industry-standard security measures to protect your information:
                        </p>
                        <ul>
                            <li><strong>Encryption:</strong> Data transmission uses SSL/TLS encryption</li>
                            <li><strong>Secure Storage:</strong> Personal data is encrypted at rest</li>
                            <li><strong>Access Controls:</strong> Limited employee access to personal information</li>
                            <li><strong>Regular Audits:</strong> Security assessments and vulnerability testing</li>
                            <li><strong>Secure Infrastructure:</strong> Cloud services with enterprise-grade security</li>
                        </ul>
                        <p>
                            However, no method of transmission over the Internet is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.
                        </p>
                    </section>

                    <section className={styles.section}>
                        <h2>8. Your Privacy Rights</h2>

                        <h3>8.1 Access and Control</h3>
                        <p>You have the right to:</p>
                        <ul>
                            <li><strong>Access:</strong> Request a copy of your personal information</li>
                            <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                            <li><strong>Deletion:</strong> Request deletion of your personal data (subject to legal requirements)</li>
                            <li><strong>Portability:</strong> Receive your data in a structured, machine-readable format</li>
                            <li><strong>Opt-Out:</strong> Unsubscribe from marketing communications</li>
                        </ul>

                        <h3>8.2 California Privacy Rights (CCPA)</h3>
                        <p>California residents have additional rights including:</p>
                        <ul>
                            <li>Right to know what personal information is collected</li>
                            <li>Right to know if personal information is sold or disclosed</li>
                            <li>Right to opt-out of the sale of personal information</li>
                            <li>Right to non-discrimination for exercising privacy rights</li>
                        </ul>

                        <h3>8.3 European Privacy Rights (GDPR)</h3>
                        <p>EU residents have rights under GDPR including:</p>
                        <ul>
                            <li>Right to access and receive a copy of personal data</li>
                            <li>Right to rectification of inaccurate data</li>
                            <li>Right to erasure (right to be forgotten)</li>
                            <li>Right to restrict processing</li>
                            <li>Right to data portability</li>
                            <li>Right to object to processing</li>
                        </ul>

                        <h3>8.4 Exercising Your Rights</h3>
                        <p>
                            To exercise these rights, contact us at <a href="mailto:info@calmjourneyer.com">info@calmjourneyer.com</a>. We will respond within 30 days.
                        </p>
                    </section>

                    <section className={styles.section}>
                        <h2>9. Data Retention</h2>
                        <p>
                            We retain your information for as long as necessary to provide our services and comply with legal obligations:
                        </p>
                        <ul>
                            <li><strong>Account Information:</strong> Retained while your account is active</li>
                            <li><strong>Meditation Session Data:</strong> Retained to provide personalized AI experiences</li>
                            <li><strong>Subscription Records:</strong> Retained for 7 years for tax and accounting purposes</li>
                            <li><strong>Marketing Data:</strong> Retained until you opt-out or request deletion</li>
                        </ul>
                        <p>
                            After account deletion, we anonymize or delete personal information unless retention is required by law.
                        </p>
                    </section>

                    <section className={styles.section}>
                        <h2>10. Cookies and Tracking Technologies</h2>
                        <p>
                            We use cookies and similar technologies to:
                        </p>
                        <ul>
                            <li>Remember your preferences and settings</li>
                            <li>Maintain your session and keep you logged in</li>
                            <li>Analyze usage patterns and improve our service</li>
                            <li>Provide personalized content and recommendations</li>
                        </ul>
                        <p>
                            You can control cookies through your browser settings. Disabling cookies may limit functionality of our service.
                        </p>
                    </section>

                    <section className={styles.section}>
                        <h2>11. Children's Privacy</h2>
                        <p>

                            CalmJourneyer is suitable for users of all ages, including children. The app collects only the following information, when voluntarily provided: name and email address. This information is used solely for account-related purposes and is not shared with third parties except as required to operate basic app functions.

                            We do not knowingly collect this information from children without parental consent. If you are a parent or guardian and believe your child has provided us with their name or email address, you may contact us at info@calmjourneyer.com
                            , and we will promptly review and delete the information if requested.
                        </p>
                    </section>

                    <section className={styles.section}>
                        <h2>12. International Data Transfers</h2>
                        <p>
                            Your information may be transferred to and processed in countries other than your country of residence. These countries may have different data protection laws. We ensure appropriate safeguards are in place to protect your information in accordance with this Privacy Policy.
                        </p>
                    </section>

                    <section className={styles.section}>
                        <h2>13. Changes to This Privacy Policy</h2>

                        <ul>
                            <li>Posting the updated policy on our website</li>
                            <li>Sending email notification for material changes</li>
                        </ul>
                        <p>
                            Your continued use of CalmJourneyer after changes become effective constitutes acceptance of the updated policy.
                        </p>
                    </section>

                    <section className={styles.section}>
                        <h2>15. Contact Us</h2>
                        <p>
                            If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
                        </p>
                        <div className={styles.contactInfo}>
                            <p><strong>Email:</strong> <a href="mailto:info@calmjourneyer.com">info@calmjourneyer.com</a></p>

                        </div>
                    </section>

                    <section className={styles.section}>
                        <h2>16. Consent</h2>
                        <p>
                            By using CalmJourneyer, you acknowledge that you have read and understood this Privacy Policy and consent to the collection, use, and disclosure of your information as described herein.
                        </p>
                    </section>
                </div>

                <div className={styles.footer}>
                    <p>
                        <Link to="/">Return to Home</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
