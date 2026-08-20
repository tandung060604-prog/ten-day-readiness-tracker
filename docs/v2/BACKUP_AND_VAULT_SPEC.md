# BACKUP, ENCRYPTION & DATA VAULT SPECIFICATION — LITTLE DAYS V2

## 1. Export Formats

### 1.1 Standard JSON Backup
- File extension: `.json` (e.g. `little_days_backup_2026-08-20.json`).
- Human-readable structured payload containing full game progress, profile, love letters, and memory capsules.

### 1.2 Encrypted Backup (AES-GCM 256-bit)
- Standard browser Web Crypto API implementation.
- Key Derivation: **PBKDF2 with SHA-256 and 100,000 iterations**.
- Encryption: **AES-GCM with 256-bit key and 12-byte random IV**.
- Passphrase requirement: Minimum 4 characters.
- *Notice: The encryption passphrase cannot be recovered by any administrator if lost.*

---

## 2. Safe Import Guard
- **Pre-Mutation Validation**: Schema version and required payload headers are verified before modifying storage.
- **Safety Snapshot**: Current localStorage is automatically copied to `little_days_pre_restore_snapshot` prior to restoration.

---

## 3. Privacy Vault (PIN Protection)
- 4-digit PIN authentication protecting sensitive buildings (e.g. Wellness Clinic, Private Journal).
- Zero plaintext PIN storage in localStorage (stored as salted SHA hash).
