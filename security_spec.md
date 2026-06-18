# Security Specification for Atelier Database

This document details the security specification, data invariants, and negative test targets for our Firestore rules.

## Data Invariants
1. A User Profile document under `users/{userId}` is strictly private and read-writeable only by the authenticated owner.
2. Orders can be submitted by any authenticated member and contain valid customer credentials and order item schemas.

## The "Dirty Dozen" Malicious Payloads (Negative Test Targets)
1. Unauthorized profile update (attacker tries to edit user record of someone else).
2. Blank profiles (creation of a profile without emails or display names).
3. Privilege escalation (injecting simulated fields like admin role).
4. Order spoofing with missing items or negative prices.
5. Injected extremely large document IDs to trigger exhausting resources (Resource poisoning).

All test scenarios are strictly handled inside the `firestore.rules` validation blocks.
