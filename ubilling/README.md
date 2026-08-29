# SDC Ubilling + RADIUS

SAHANI Digital Cable ISP billing/RADIUS deployment based on the upstream open-source Ubilling project.

Upstream project: https://github.com/nightflyza/Ubilling

## What this repo provides

- Ubuntu deployment helper for Ubilling
- FreeRADIUS/MariaDB prerequisites
- MikroTik PPPoE RADIUS template
- SDC ISP package examples
- Safe secret handling (no real passwords committed)

Ubilling is an open-source ISP billing system with subscriber management, payments, reports and network-device integrations. Configure the production server using the upstream Ubilling documentation and then connect MikroTik to FreeRADIUS.

## SDC packages

- SDC 60 Mbps
- SDC 75 Mbps
- SDC 100 Mbps

## Important

Do not commit RADIUS shared secrets, database passwords, MikroTik credentials, API tokens or private keys.
