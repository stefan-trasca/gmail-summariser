// Generate 80+ realistic email samples
export const generateEmails = () => {
  const senders = [
    { email: "billing@company.com", subjects: [
      "Invoice #2024-{num} for Project Services",
      "Payment Receipt - Project Phase {num}",
      "Billing Statement - February 2024",
      "Updated Payment Terms for Project {num}"
    ]},
    { email: "newsletter@company.com", subjects: [
      "Your Monthly Newsletter - February Tech Updates",
      "Weekly Digest: Industry Insights #{num}",
      "Breaking News: Tech Industry Updates",
      "Monthly Roundup: Top Stories #{num}"
    ]},
    { email: "support@service.com", subjects: [
      "Support Ticket #{num} - Status Update",
      "Case Resolution: Ticket #{num}",
      "Your Support Request Update",
      "Important: Support Case #{num} Follow-up"
    ]},
    { email: "updates@platform.com", subjects: [
      "Platform Update {num}: New Features Released",
      "Maintenance Schedule - Weekend Update",
      "Security Patch {num} Deployment Notice",
      "System Upgrade: Version {num} Release Notes"
    ]},
    { email: "team@project.com", subjects: [
      "Team Meeting Notes - Sprint {num}",
      "Project Milestone {num} Achieved",
      "Team Collaboration Update #{num}",
      "Weekly Team Sync - Progress Report"
    ]},
    { email: "notifications@app.com", subjects: [
      "Action Required: Security Update {num}",
      "Account Alert: Important Notice",
      "System Notification #{num}",
      "Your Account: Security Review {num}"
    ]},
    { email: "marketing@business.com", subjects: [
      "Special Offer: Premium Features",
      "Exclusive Deal #{num} - Limited Time",
      "New Product Launch: Preview {num}",
      "Partnership Opportunity #{num}"
    ]}
  ];

  let emails = [];
  let id = 1;
  
  // Generate multiple emails for each sender
  senders.forEach(sender => {
    const emailCount = 10 + Math.floor(Math.random() * 5); // 10-14 emails per sender
    
    for (let i = 0; i < emailCount; i++) {
      const subjectTemplate = sender.subjects[i % sender.subjects.length];
      const subject = subjectTemplate.replace(/\{num\}/g, String(1000 + i));
      
      emails.push({
        id: id++,
        subject,
        sender: sender.email,
        date: new Date(2024, 1, 1 + Math.floor(Math.random() * 28)),
        read: Math.random() > 0.3,
        tags: getTagsForSubject(subject),
      });
    }
  });

  // Sort by date descending
  return emails.sort((a, b) => b.date.getTime() - a.date.getTime());
};

function getTagsForSubject(subject: string): string[] {
  const tags = [];
  
  if (subject.includes("Invoice") || subject.includes("Payment") || subject.includes("Billing")) {
    tags.push("Invoice", "Payment");
  }
  if (subject.includes("Newsletter") || subject.includes("Digest")) {
    tags.push("Newsletter");
  }
  if (subject.includes("Support") || subject.includes("Case")) {
    tags.push("Support");
  }
  if (subject.includes("Update") || subject.includes("Release")) {
    tags.push("Updates");
  }
  if (subject.includes("Team") || subject.includes("Project")) {
    tags.push("Team");
  }
  if (subject.includes("Security")) {
    tags.push("Security");
  }
  if (subject.includes("Meeting")) {
    tags.push("Meeting");
  }
  if (subject.includes("Important") || subject.includes("Action Required")) {
    tags.push("Important");
  }

  return tags;
}