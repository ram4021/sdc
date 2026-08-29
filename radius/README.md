# SDC RADIUS

FreeRADIUS + MariaDB + MikroTik PPPoE setup for SAHANI Digital Cable.

## Components
- FreeRADIUS 3.x
- MariaDB
- MikroTik RouterOS v6/v7
- SQL-based PPPoE authentication and accounting

## Recommended attributes
- `Cleartext-Password`
- `Mikrotik-Rate-Limit`
- `Session-Timeout`
- `Framed-Pool`

## Security
Do not commit real RADIUS shared secrets, database passwords, API tokens, or private keys. Store secrets in local configuration or environment variables.

## Installation
See `install.sh` for the base Ubuntu installation. After installation, configure the MikroTik NAS address and shared secret locally before enabling production authentication.
