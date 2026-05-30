# Security Specification: GramSwaraj Firestore Security

## 1. Data Invariants
- **Users**: Users must not be able to change their own role or spoof another user's UID or phone.
- **Incidents**: Only residents or administrators registered in the system can file incidents. Only designated authorities (DM, Gram Pradhan) can append official updates or change incident resolution status. Custom tags/keys not defined in the schema are strictly rejected.
- **Marketplace**: Users can only create, update or delete marketplace items that they personally posted (matching their `postedBy` ID).
- **Group Messages**: Messages cannot be spoofed to be sent by someone else, and participants must stay within standard message length bounds.
- **Broadcasts**: Block standard Residents from writing broad immediate emergencies; only Gram Pradhan and DM roles are permitted to write records here.

## 2. The "Dirty Dozen" Payloads
1. **Role Escalation Attack**: A standard Resident user tries to register/update themselves with administrative permissions (`"role": "DM"` or `"role": "Admin"`).
2. **Deceptive Incident Ownership**: User B attempts to write a grievance on behalf of User A by spoofing `reporterId` parameter inside `/incidents/`.
3. **Invalid ID Poisoning**: Post with a massive custom document ID (e.g. 10KB string full of special characters) to exhaust DB resources or hijack schemas.
4. **Resolution State Bypass (Status Shortcutting)**: A standard Resident submits an incident update setting the status to `"Resolved"` without Pradhan/DM clearance.
5. **Ghost Field Injection (Shadow Update)**: Submitting an incident update payload with unregistered fields (`"ghostVerified": true`) to check for strict schema enforcement.
6. **Marketplace Deletion Hijack**: User A tries to delete a marketplace listing created by User B.
7. **Identity Spoofing in Choupal**: Appending group messages where `senderPhone` or `senderName` doesn't match the client's current profile or credential context.
8. **Malicious Empty State**: Writing an incident with an empty title or description violating length constraints.
9. **Fake Administrative Broadcast**: Resident user writing to `/broadcasts` claiming an emergency to cause panic.
10. **Timings Spoofing**: Writing a message with a spoofed historical timestamp (`"createdAt": "2020-01-01T00:00:00Z"`) to corrupt chronology.
11. **Negative Count Upvote**: Attempt to edit the incident upvote count directly to a negative value or inject invalid data types.
12. **Denial of Wallet Query Scraping**: Requesting blanket reads to list all profiles without filtering by current user ID.

## 3. Test Runner Definition Rules
We enforce permission validation on all match blocks representing `/users`, `/incidents`, `/marketplace`, `/groupMessages`, `/broadcasts`, `/notifications`, and `/villages`.
All "Dirty Dozen" scenarios must emit `PERMISSION_DENIED`.
